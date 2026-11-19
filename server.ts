import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Monnify OAuth Token & Bank Directory Cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

interface MonnifyBankRecord {
  name: string;
  code: string;
  ussdTemplate?: string;
  baseUssdCode?: string;
  transferUssdTemplate?: string;
  bankId?: string;
  nipBankCode?: string;
}

let cachedMonnifyBanks: MonnifyBankRecord[] = [];
let banksCacheExpiresAt = 0;

// Idempotency & In-Flight Transfer Guard
const inFlightTransfers = new Set<string>();
const processedIdempotencyKeys = new Map<
  string,
  {
    status: string;
    reference: string;
    responseBody: Record<string, unknown>;
    timestamp: number;
  }
>();

function getMonnifyConfig() {
  const apiKey = (process.env.MONNIFY_API_KEY || '').trim();
  const secretKey = (process.env.MONNIFY_SECRET_KEY || '').trim();
  const sourceAccountNumber = (process.env.MONNIFY_SOURCE_ACCOUNT_NUMBER || '').trim();
  const baseUrl = (process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com')
    .trim()
    .replace(/\/+$/, '');

  return {
    apiKey,
    secretKey,
    sourceAccountNumber,
    baseUrl,
    isConfigured: Boolean(apiKey && secretKey),
  };
}

function formatFriendlyMonnifyError(rawMessage?: string, fallback?: string): string {
  const msg = (rawMessage || '').trim();
  if (!msg) {
    return fallback || 'Unable to complete request with the destination bank. Please try again.';
  }
  const lower = msg.toLowerCase();
  if (lower.includes('deprecated')) {
    return 'The legacy validation route was rejected by Monnify. Retrying with the secure validation endpoint.';
  }
  if (lower.includes('invalid account') || lower.includes('could not resolve') || lower.includes('name enquiry failed')) {
    return 'Account verification failed. Please check the 10-digit account number and selected bank.';
  }
  if (lower.includes('insufficient')) {
    return 'Insufficient funds in source disbursement wallet to complete this transfer.';
  }
  if (lower.includes('ip') && (lower.includes('whitelist') || lower.includes('not allowed'))) {
    return 'Monnify rejected the request due to IP whitelisting restrictions on your merchant account.';
  }
  if (lower.includes('invalid') && lower.includes('bank')) {
    return 'The selected bank code is not supported or temporarily unavailable on NIBSS.';
  }
  return msg;
}

async function getMonnifyAccessToken(forceRefresh = false): Promise<string> {
  const { apiKey, secretKey, baseUrl, isConfigured } = getMonnifyConfig();
  if (!isConfigured) {
    throw new Error(
      'Monnify API credentials (MONNIFY_API_KEY and MONNIFY_SECRET_KEY) are not configured in the server environment.'
    );
  }

  if (!forceRefresh && cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as {
    requestSuccessful?: boolean;
    responseMessage?: string;
    responseBody?: {
      accessToken: string;
      expiresIn: number;
    };
  };

  if (!response.ok || !data.requestSuccessful || !data.responseBody?.accessToken) {
    throw new Error(
      formatFriendlyMonnifyError(
        data.responseMessage,
        `Monnify authentication failed (HTTP ${response.status}). Verify your MONNIFY_API_KEY and MONNIFY_SECRET_KEY.`
      )
    );
  }

  cachedToken = data.responseBody.accessToken;
  tokenExpiresAt = Date.now() + Math.max((data.responseBody.expiresIn - 60) * 1000, 60_000);
  return cachedToken;
}

async function fetchMonnifyBankDirectory(token: string, baseUrl: string): Promise<MonnifyBankRecord[]> {
  if (cachedMonnifyBanks.length > 0 && Date.now() < banksCacheExpiresAt) {
    return cachedMonnifyBanks;
  }

  const response = await fetch(`${baseUrl}/api/v1/banks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as {
    requestSuccessful?: boolean;
    responseMessage?: string;
    responseBody?: MonnifyBankRecord[];
  };

  if (response.ok && data.requestSuccessful && Array.isArray(data.responseBody)) {
    cachedMonnifyBanks = data.responseBody;
    banksCacheExpiresAt = Date.now() + 15 * 60 * 1000; // cache 15 minutes
    return cachedMonnifyBanks;
  }

  return cachedMonnifyBanks;
}

/**
 * Resolves the candidate Monnify bank codes to try for a given bankCode or bankName.
 * Specifically handles OPay (Paycom) which uses `305` / `999992` / `100004`, PalmPay (`999991` / `100033`), etc.
 */
async function resolveCandidateBankCodes(
  requestedBankCode: string,
  requestedBankName: string,
  token: string,
  baseUrl: string
): Promise<string[]> {
  const candidates: string[] = [];
  const addCandidate = (code?: string) => {
    const cleaned = (code || '').trim();
    if (cleaned && !candidates.includes(cleaned)) {
      candidates.push(cleaned);
    }
  };

  const upperName = (requestedBankName || '').toUpperCase();
  const isOpay =
    upperName.includes('OPAY') ||
    upperName.includes('PAYCOM') ||
    requestedBankCode === '999992' ||
    requestedBankCode === '305' ||
    requestedBankCode === '100004';

  const isPalmpay =
    upperName.includes('PALMPAY') ||
    requestedBankCode === '999991' ||
    requestedBankCode === '100033';

  // Consult live Monnify /api/v1/banks directory first so we use the exact code Monnify expects
  try {
    const directory = await fetchMonnifyBankDirectory(token, baseUrl);
    if (directory.length > 0) {
      for (const bank of directory) {
        const bName = (bank.name || '').toUpperCase();
        if (
          bank.code === requestedBankCode ||
          bank.nipBankCode === requestedBankCode ||
          (isOpay && (bName.includes('OPAY') || bName.includes('PAYCOM'))) ||
          (isPalmpay && bName.includes('PALMPAY')) ||
          (upperName && bName === upperName)
        ) {
          addCandidate(bank.code);
          addCandidate(bank.nipBankCode);
        }
      }
    }
  } catch {
    // Proceed with static candidates if directory lookup fails
  }

  addCandidate(requestedBankCode);

  if (isOpay) {
    addCandidate('305');
    addCandidate('999992');
    addCandidate('100004');
  }
  if (isPalmpay) {
    addCandidate('999991');
    addCandidate('100033');
  }

  return candidates;
}

// 1. Check Monnify Connection Status
app.get('/api/monnify/status', (_req: Request, res: Response) => {
  const { isConfigured, sourceAccountNumber, baseUrl } = getMonnifyConfig();
  res.json({
    configured: isConfigured,
    hasWalletSourceAccount: Boolean(sourceAccountNumber),
    environment: baseUrl.includes('sandbox') ? 'sandbox' : 'live',
  });
});

// 2. Fetch Supported Nigerian Banks from Monnify (GET /api/v1/banks)
app.get('/api/monnify/banks', async (_req: Request, res: Response) => {
  const { baseUrl, isConfigured } = getMonnifyConfig();
  if (!isConfigured) {
    res.status(200).json({
      live: false,
      banks: [],
      message: 'Monnify credentials not configured in environment variables.',
    });
    return;
  }

  try {
    const token = await getMonnifyAccessToken();
    const banks = await fetchMonnifyBankDirectory(token, baseUrl);

    if (!banks || banks.length === 0) {
      res.status(400).json({
        live: true,
        error: 'Unable to load supported banks from Monnify at this time.',
      });
      return;
    }

    res.json({
      live: true,
      banks: banks.map((bank) => ({
        id: bank.code,
        name: bank.name.toUpperCase(),
        code: bank.code,
        nipBankCode: bank.nipBankCode || bank.code,
        successRate: 99,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to connect to Monnify bank service.';
    res.status(500).json({ live: true, error: formatFriendlyMonnifyError(message) });
  }
});

// 3. Validate Bank Account Number / Name Enquiry
// Primary supported endpoint: GET /api/v1/disbursements/account/validate (with automatic fallback if needed)
app.get('/api/monnify/validate-account', async (req: Request, res: Response) => {
  const accountNumber = String(req.query.accountNumber || '').replace(/\D/g, '').trim();
  const bankCode = String(req.query.bankCode || '').trim();
  const bankName = String(req.query.bankName || '').trim();

  if (!/^\d{10}$/.test(accountNumber)) {
    res.status(400).json({
      error: 'Please enter a valid 10-digit NUBAN account number.',
    });
    return;
  }

  if (!bankCode) {
    res.status(400).json({
      error: 'Please select a recipient bank first.',
    });
    return;
  }

  const { baseUrl, isConfigured } = getMonnifyConfig();
  if (!isConfigured) {
    res.status(503).json({
      live: false,
      error:
        'Monnify API keys are not configured. Please add MONNIFY_API_KEY and MONNIFY_SECRET_KEY in Secrets to validate live bank accounts.',
    });
    return;
  }

  try {
    const token = await getMonnifyAccessToken();
    const candidateBankCodes = await resolveCandidateBankCodes(bankCode, bankName, token, baseUrl);

    // Official supported Monnify Validate Bank Account endpoint is /api/v1/disbursements/account/validate
    // (/api/v2/disbursements/account/validate returns a deprecation error on Monnify servers)
    const validationEndpoints = [
      '/api/v1/disbursements/account/validate',
      '/api/v2/disbursements/account/validate',
    ];

    let lastErrorMessage = 'Could not verify account number with the selected bank.';

    for (const endpointPath of validationEndpoints) {
      let endpointDeprecated = false;

      for (const candidateCode of candidateBankCodes) {
        const url = new URL(`${baseUrl}${endpointPath}`);
        url.searchParams.set('accountNumber', accountNumber);
        url.searchParams.set('bankCode', candidateCode);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = (await response.json()) as {
          requestSuccessful?: boolean;
          responseMessage?: string;
          responseCode?: string;
          responseBody?: {
            accountNumber?: string;
            accountName?: string;
            bankCode?: string;
          };
        };

        if (response.ok && data.requestSuccessful && data.responseBody?.accountName) {
          res.json({
            live: true,
            accountNumber: data.responseBody.accountNumber || accountNumber,
            accountName: data.responseBody.accountName.trim().toUpperCase(),
            bankCode: data.responseBody.bankCode || candidateCode,
          });
          return;
        }

        const rawMsg = data.responseMessage || '';
        if (rawMsg.toLowerCase().includes('deprecated')) {
          endpointDeprecated = true;
          break; // Immediately switch to the other endpoint version
        }

        if (rawMsg) {
          lastErrorMessage = rawMsg;
        }
      }

      if (!endpointDeprecated) {
        // Endpoint itself was active and not deprecated; no need to call deprecated fallback
        break;
      }
    }

    res.status(400).json({
      live: true,
      error: formatFriendlyMonnifyError(
        lastErrorMessage,
        'Account verification failed. Please confirm the account number and selected bank.'
      ),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error during account verification.';
    res.status(500).json({
      live: true,
      error: formatFriendlyMonnifyError(message),
    });
  }
});

// 4. Initiate Single Transfer Disbursement (POST /api/v2/disbursements/single)
app.post('/api/monnify/transfer', async (req: Request, res: Response) => {
  const {
    amount,
    destinationBankCode,
    destinationBankName,
    destinationAccountNumber,
    destinationAccountName,
    narration,
    idempotencyKey,
    sourceAccountNumber: customSourceAccount,
  } = req.body as {
    amount?: number;
    destinationBankCode?: string;
    destinationBankName?: string;
    destinationAccountNumber?: string;
    destinationAccountName?: string;
    narration?: string;
    idempotencyKey?: string;
    sourceAccountNumber?: string;
  };

  const numericAmount = Number(amount);
  const cleanAccount = String(destinationAccountNumber || '').replace(/\D/g, '').trim();

  if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
    res.status(400).json({
      error: 'Please enter a valid transfer amount greater than ₦0.00.',
    });
    return;
  }

  if (!/^\d{10}$/.test(cleanAccount) || !destinationBankCode) {
    res.status(400).json({
      error: 'A valid 10-digit recipient account number and bank selection are required.',
    });
    return;
  }

  if (!destinationAccountName || !destinationAccountName.trim()) {
    res.status(400).json({
      error: 'Recipient account must be verified before initiating a transfer.',
    });
    return;
  }

  // Prevent duplicate submissions
  const dedupeKey =
    idempotencyKey || `${cleanAccount}-${destinationBankCode}-${numericAmount.toFixed(2)}`;

  if (inFlightTransfers.has(dedupeKey)) {
    res.status(409).json({
      error: 'This transfer is already being processed. Please wait.',
    });
    return;
  }

  const existingProcessed = processedIdempotencyKeys.get(dedupeKey);
  if (existingProcessed && Date.now() - existingProcessed.timestamp < 60_000) {
    res.json({
      live: true,
      requestSuccessful: true,
      duplicatePrevented: true,
      reference: existingProcessed.reference,
      status: existingProcessed.status,
      responseBody: existingProcessed.responseBody,
    });
    return;
  }

  const { baseUrl, isConfigured, sourceAccountNumber } = getMonnifyConfig();
  const walletAccount = (customSourceAccount || sourceAccountNumber || '').trim();

  if (!isConfigured) {
    res.status(503).json({
      live: false,
      requestSuccessful: false,
      error:
        'Monnify API credentials are not configured. Please set MONNIFY_API_KEY, MONNIFY_SECRET_KEY, and MONNIFY_SOURCE_ACCOUNT_NUMBER in Secrets.',
    });
    return;
  }

  if (!walletAccount) {
    res.status(400).json({
      live: true,
      requestSuccessful: false,
      error:
        'MONNIFY_SOURCE_ACCOUNT_NUMBER (your Monnify Wallet Account Number) is not configured in Secrets.',
    });
    return;
  }

  const reference = `OB-${Date.now()}-${Math.floor(100000 + Math.random() * 899999)}`;
  inFlightTransfers.add(dedupeKey);

  try {
    const token = await getMonnifyAccessToken();
    const candidateBankCodes = await resolveCandidateBankCodes(
      destinationBankCode,
      destinationBankName || '',
      token,
      baseUrl
    );
    const resolvedBankCode = candidateBankCodes[0] || destinationBankCode;

    const payload = {
      amount: numericAmount,
      reference,
      narration:
        narration && narration.trim()
          ? narration.trim()
          : `Transfer to ${destinationAccountName.trim()}`,
      destinationBankCode: resolvedBankCode,
      destinationAccountNumber: cleanAccount,
      destinationAccountName: destinationAccountName.trim(),
      currency: 'NGN',
      sourceAccountNumber: walletAccount,
      async: false,
    };

    const response = await fetch(`${baseUrl}/api/v2/disbursements/single`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      requestSuccessful?: boolean;
      responseMessage?: string;
      responseCode?: string;
      responseBody?: {
        amount?: number;
        reference?: string;
        transactionReference?: string;
        status?: string;
        dateCreated?: string;
        totalFee?: number;
        destinationAccountName?: string;
        destinationBankName?: string;
        destinationAccountNumber?: string;
        destinationBankCode?: string;
      };
    };

    if (!response.ok || !data.requestSuccessful) {
      res.status(400).json({
        live: true,
        requestSuccessful: false,
        error: formatFriendlyMonnifyError(
          data.responseMessage,
          `Transfer could not be completed (HTTP ${response.status}).`
        ),
        responseCode: data.responseCode,
      });
      return;
    }

    const rawStatus = (data.responseBody?.status || 'PENDING').toUpperCase();
    const txRef = data.responseBody?.reference || reference;

    if (rawStatus === 'FAILED' || rawStatus === 'REVERSED' || rawStatus === 'EXPIRED') {
      res.status(400).json({
        live: true,
        requestSuccessful: false,
        status: 'FAILED',
        reference: txRef,
        error: formatFriendlyMonnifyError(
          data.responseMessage,
          `Transfer was declined by destination bank (Status: ${rawStatus}).`
        ),
      });
      return;
    }

    // Map Monnify statuses:
    // SUCCESS / COMPLETED -> SUCCESS
    // PENDING_AUTHORIZATION -> PENDING_AUTHORIZATION (requires 2FA OTP)
    // PENDING / IN_PROGRESS / AWAITING_PROCESSING -> PENDING
    let normalizedStatus: 'SUCCESS' | 'PENDING' | 'PENDING_AUTHORIZATION' = 'PENDING';
    if (rawStatus === 'SUCCESS' || rawStatus === 'COMPLETED' || rawStatus === 'PAID') {
      normalizedStatus = 'SUCCESS';
    } else if (rawStatus === 'PENDING_AUTHORIZATION') {
      normalizedStatus = 'PENDING_AUTHORIZATION';
    }

    processedIdempotencyKeys.set(dedupeKey, {
      status: normalizedStatus,
      reference: txRef,
      responseBody: (data.responseBody || {}) as Record<string, unknown>,
      timestamp: Date.now(),
    });

    res.json({
      live: true,
      requestSuccessful: true,
      reference: txRef,
      status: normalizedStatus,
      rawMonnifyStatus: rawStatus,
      responseBody: data.responseBody,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error while processing transfer.';
    res.status(500).json({
      live: true,
      requestSuccessful: false,
      error: formatFriendlyMonnifyError(message),
    });
  } finally {
    inFlightTransfers.delete(dedupeKey);
  }
});

// 5. Authorize 2FA OTP for Single Transfer (POST /api/v2/disbursements/single/validate-otp)
app.post('/api/monnify/validate-otp', async (req: Request, res: Response) => {
  const { reference, authorizationCode } = req.body as {
    reference?: string;
    authorizationCode?: string;
  };

  if (!reference || !authorizationCode) {
    res.status(400).json({ error: 'Transaction reference and OTP authorization code are required.' });
    return;
  }

  const { baseUrl, isConfigured } = getMonnifyConfig();
  if (!isConfigured) {
    res.status(503).json({ error: 'Monnify credentials are not configured.' });
    return;
  }

  try {
    const token = await getMonnifyAccessToken();
    const response = await fetch(`${baseUrl}/api/v2/disbursements/single/validate-otp`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: reference.trim(),
        authorizationCode: authorizationCode.trim(),
      }),
    });

    const data = (await response.json()) as {
      requestSuccessful?: boolean;
      responseMessage?: string;
      responseBody?: {
        status?: string;
        reference?: string;
      };
    };

    if (!response.ok || !data.requestSuccessful) {
      res.status(400).json({
        live: true,
        requestSuccessful: false,
        error: formatFriendlyMonnifyError(data.responseMessage, 'Invalid or expired OTP code.'),
      });
      return;
    }

    const rawStatus = (data.responseBody?.status || 'SUCCESS').toUpperCase();
    if (rawStatus === 'FAILED' || rawStatus === 'REVERSED') {
      res.status(400).json({
        live: true,
        requestSuccessful: false,
        error: 'Transfer failed after OTP validation.',
      });
      return;
    }

    res.json({
      live: true,
      requestSuccessful: true,
      status: rawStatus === 'SUCCESS' || rawStatus === 'COMPLETED' ? 'SUCCESS' : 'PENDING',
      reference: data.responseBody?.reference || reference,
      responseBody: data.responseBody,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error during OTP verification.';
    res.status(500).json({
      live: true,
      requestSuccessful: false,
      error: formatFriendlyMonnifyError(message),
    });
  }
});

// 6. Verify Single Transfer Status (GET /api/v2/disbursements/single/summary?reference=...)
app.get('/api/monnify/transfer-status', async (req: Request, res: Response) => {
  const reference = String(req.query.reference || '').trim();
  if (!reference) {
    res.status(400).json({ error: 'Transaction reference is required.' });
    return;
  }

  const { baseUrl, isConfigured } = getMonnifyConfig();
  if (!isConfigured) {
    res.status(503).json({ error: 'Monnify credentials are not configured.' });
    return;
  }

  try {
    const token = await getMonnifyAccessToken();
    const url = new URL(`${baseUrl}/api/v2/disbursements/single/summary`);
    url.searchParams.set('reference', reference);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as {
      requestSuccessful?: boolean;
      responseMessage?: string;
      responseBody?: {
        status?: string;
        reference?: string;
        amount?: number;
      };
    };

    if (!response.ok || !data.requestSuccessful) {
      res.status(400).json({
        live: true,
        error: formatFriendlyMonnifyError(data.responseMessage, 'Could not fetch transfer status.'),
      });
      return;
    }

    res.json({
      live: true,
      status: (data.responseBody?.status || 'PENDING').toUpperCase(),
      responseBody: data.responseBody,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to check transfer status.';
    res.status(500).json({ live: true, error: formatFriendlyMonnifyError(message) });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OneBank server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
