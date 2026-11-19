/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  AppScreen,
  BankOption,
  Beneficiary,
  INITIAL_ACCOUNT,
  NIGERIAN_BANKS,
  TransactionRecord,
  TransactionStatus,
  formatNaira,
} from './data/bankData';
import { SplashScreen } from './components/SplashScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { PayAndTransfer } from './components/PayAndTransfer';
import { TransactionHistory } from './components/TransactionHistory';
import { ProfileScreen } from './components/ProfileScreen';
import { TransferOtherBanks } from './components/TransferOtherBanks';
import { TransactionConfirmation } from './components/TransactionConfirmation';
import { TransferSubmitted } from './components/TransferSubmitted';
import { PaymentReceipt } from './components/PaymentReceipt';
import { SecondaryScreens } from './components/SecondaryScreens';
import { OfflineIndicator } from './components/PWAInstallButton';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  // Account & Form State
  const [balance, setBalance] = useState<number>(INITIAL_ACCOUNT.balance);
  const [amountInput, setAmountInput] = useState<string>('0.0');
  const [confirmationAmount, setConfirmationAmount] = useState<number>(0.40);
  const [submittedAmount, setSubmittedAmount] = useState<number>(10.00);

  const [recipientAccount, setRecipientAccount] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [isAccountVerified, setIsAccountVerified] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<BankOption | null>(null);
  const [availableBanks, setAvailableBanks] = useState<BankOption[]>(NIGERIAN_BANKS);
  const [isResolvingAccount, setIsResolvingAccount] = useState<boolean>(false);
  const [accountResolutionError, setAccountResolutionError] = useState<string | null>(null);
  const [validationAttempt, setValidationAttempt] = useState<number>(0);

  const [isProcessingTransfer, setIsProcessingTransfer] = useState<boolean>(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [pendingOtpReference, setPendingOtpReference] = useState<string | null>(null);
  const [transferIdempotencyKey, setTransferIdempotencyKey] = useState<string>('');

  const [narration, setNarration] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [addToBeneficiaries, setAddToBeneficiaries] = useState<boolean>(false);

  // Official receipt state
  const [latestTransaction, setLatestTransaction] = useState<TransactionRecord>({
    id: 'tx-initial',
    amount: 10.00,
    charges: 0.00,
    stampDuty: 0.00,
    total: 10.00,
    senderName: INITIAL_ACCOUNT.senderReceiptName,
    sourceAccount: INITIAL_ACCOUNT.sourceDisplay,
    recipientName: 'ABDULSALAM ADEDAYO TIAMIYU',
    recipientAccount: '9042769211',
    recipientBank: 'PALMPAY LIMITED',
    reference: '000001261119001847662176533576',
    narration: '',
    category: 'General',
    dateFormatted: 'November 19, 2026',
    timeFormatted: '12.19AM',
    status: 'SUCCESS',
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>([latestTransaction]);

  // Load real Nigerian banks directory from Monnify backend on mount
  useEffect(() => {
    let cancelled = false;
    async function loadMonnifyBanks() {
      try {
        const res = await fetch('/api/monnify/banks');
        if (!res.ok) return;
        const data = (await res.json()) as {
          live?: boolean;
          banks?: BankOption[];
        };
        if (!cancelled && data.live && Array.isArray(data.banks) && data.banks.length > 0) {
          // Sync top 5 suggested banks with the exact bank code returned by Monnify's live directory
          const liveBanks = data.banks;
          const updatedTopFive = NIGERIAN_BANKS.filter((b) => b.isTopSuggested).map((top) => {
            const match = liveBanks.find((lb) => {
              const lbName = lb.name.toUpperCase();
              if (top.id === 'opay') {
                return lbName.includes('OPAY') || lbName.includes('PAYCOM') || lb.code === '305';
              }
              if (top.id === 'palmpay') {
                return lbName.includes('PALMPAY');
              }
              return lbName.includes(top.name.split(' ')[0]);
            });
            return match ? { ...top, code: match.code, nipBankCode: match.nipBankCode } : top;
          });

          const remainingBanks = liveBanks.filter(
            (lb) => !updatedTopFive.some((t) => t.code === lb.code || t.name === lb.name)
          );
          setAvailableBanks([...updatedTopFive, ...remainingBanks]);
        }
      } catch {
        // Keep static NIGERIAN_BANKS if offline
      }
    }
    loadMonnifyBanks();
    return () => {
      cancelled = true;
    };
  }, []);

  // Perform real-time Monnify Name Enquiry whenever a 10-digit account number and bank are selected
  useEffect(() => {
    if (recipientAccount.length !== 10 || !selectedBank) {
      setIsAccountVerified(false);
      setAccountResolutionError(null);
      if (recipientAccount.length < 10) {
        setRecipientName('');
      }
      return;
    }

    let cancelled = false;
    async function resolveAccountWithMonnify() {
      setIsResolvingAccount(true);
      setIsAccountVerified(false);
      setAccountResolutionError(null);

      try {
        const params = new URLSearchParams({
          accountNumber: recipientAccount,
          bankCode: selectedBank!.code,
          bankName: selectedBank!.name,
        });
        const res = await fetch(`/api/monnify/validate-account?${params.toString()}`);
        const data = (await res.json()) as {
          live?: boolean;
          accountName?: string | null;
          bankCode?: string;
          error?: string;
        };

        if (cancelled) return;

        if (res.ok && data.accountName) {
          setRecipientName(data.accountName);
          setIsAccountVerified(true);
          setAccountResolutionError(null);
          // If the backend resolved a specific canonical Monnify bankCode (e.g. 305 for OPay), update selectedBank
          if (data.bankCode && data.bankCode !== selectedBank!.code) {
            setSelectedBank((prev) => (prev ? { ...prev, code: data.bankCode! } : prev));
          }
        } else {
          setRecipientName('');
          setIsAccountVerified(false);
          setAccountResolutionError(
            data.error || 'Could not verify account number with the selected bank.'
          );
        }
      } catch {
        if (!cancelled) {
          setRecipientName('');
          setIsAccountVerified(false);
          setAccountResolutionError(
            'Network error while validating account. Please check your connection and retry.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsResolvingAccount(false);
        }
      }
    }

    resolveAccountWithMonnify();
    return () => {
      cancelled = true;
    };
  }, [recipientAccount, selectedBank, validationAttempt]);

  // Auto-advance from splash screen to home dashboard after 2.2s (or tap anywhere immediately)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('home');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Auto-transition from full confetti burst (Screen 7) to settled confetti (Screen 8) after 1.8s
  useEffect(() => {
    if (currentScreen === 'transfer_submitted_confetti') {
      const timer = setTimeout(() => {
        setCurrentScreen('transfer_submitted_clean');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleSelectTransferOption = (option: string) => {
    setShowTransferModal(false);
    setTransferError(null);
    setPendingOtpReference(null);
    if (option === 'Transfer to Beneficiaries') {
      setRecipientAccount('9042769211');
      setSelectedBank(
        availableBanks.find((b) => b.id === 'palmpay' || b.name.includes('PALMPAY')) ||
          NIGERIAN_BANKS[1]
      );
    }
    setCurrentScreen('transfer_other_banks');
  };

  const handleSelectBeneficiary = (ben: Beneficiary) => {
    const matchedBank =
      availableBanks.find(
        (b) =>
          b.name === ben.bankName ||
          b.code === ben.bankCode ||
          (ben.bankName.includes('OPAY') && (b.name.includes('OPAY') || b.name.includes('PAYCOM')))
      ) || NIGERIAN_BANKS[1];
    setSelectedBank(matchedBank);
    setRecipientAccount(ben.accountNumber);
  };

  const handleConfirmTransactionForm = () => {
    const parsed = parseFloat(amountInput.replace(/,/g, ''));
    if (isNaN(parsed) || parsed <= 0) {
      return;
    }
    if (parsed > balance) {
      return;
    }
    if (!selectedBank || !isAccountVerified || !recipientName.trim()) {
      return;
    }

    setConfirmationAmount(parsed);
    setTransferError(null);
    setPendingOtpReference(null);
    setTransferIdempotencyKey(
      `IDEMP-${recipientAccount}-${selectedBank.code}-${parsed.toFixed(2)}-${Date.now()}`
    );
    setCurrentScreen('transaction_confirmation');
  };

  const finalizeVerifiedTransfer = useCallback(
    (
      finalAmount: number,
      bankUsed: BankOption,
      destAccount: string,
      verifiedName: string,
      txReference: string,
      txStatus: TransactionStatus
    ) => {
      setSubmittedAmount(finalAmount);

      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const timeFormatted = now
        .toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .replace(':', '.')
        .replace(/\s+/g, '');

      const newTx: TransactionRecord = {
        id: `tx-${Date.now()}`,
        amount: finalAmount,
        charges: 0.00,
        stampDuty: 0.00,
        total: finalAmount,
        senderName: INITIAL_ACCOUNT.senderReceiptName,
        sourceAccount: INITIAL_ACCOUNT.sourceDisplay,
        recipientName: verifiedName,
        recipientAccount: destAccount,
        recipientBank: bankUsed.name,
        reference: txReference,
        narration,
        category,
        dateFormatted,
        timeFormatted,
        status: txStatus,
      };

      setLatestTransaction(newTx);
      setTransactions((prev) => [newTx, ...prev]);

      // Only deduct user balance when Monnify confirms SUCCESS or COMPLETED/PENDING settlement
      if (txStatus === 'SUCCESS' || txStatus === 'PENDING') {
        setBalance((prev) => Math.max(0, Number((prev - finalAmount).toFixed(2))));
      }

      setPendingOtpReference(null);
      setCurrentScreen('transfer_submitted_confetti');
    },
    [category, narration]
  );

  const handleAuthorizePin = async () => {
    if (isProcessingTransfer) return;

    const finalAmount = confirmationAmount;
    if (!finalAmount || finalAmount <= 0) {
      setTransferError('Invalid transfer amount.');
      return;
    }
    if (finalAmount > balance) {
      setTransferError(
        `Insufficient balance. Your available balance is ₦${formatNaira(balance)}.`
      );
      return;
    }
    if (!selectedBank || !isAccountVerified || !recipientName.trim()) {
      setTransferError('Recipient account has not been verified.');
      return;
    }

    setIsProcessingTransfer(true);
    setTransferError(null);

    try {
      const res = await fetch('/api/monnify/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          destinationBankCode: selectedBank.code,
          destinationBankName: selectedBank.name,
          destinationAccountNumber: recipientAccount,
          destinationAccountName: recipientName,
          narration: narration || `Transfer to ${recipientName}`,
          idempotencyKey: transferIdempotencyKey,
        }),
      });

      const data = (await res.json()) as {
        live?: boolean;
        requestSuccessful?: boolean;
        reference?: string;
        status?: TransactionStatus;
        error?: string;
      };

      if (!res.ok || !data.requestSuccessful) {
        setTransferError(
          data.error || 'Transfer could not be completed by Monnify. Your balance has not been debited.'
        );
        return;
      }

      const txReference = data.reference || `OB-${Date.now()}`;
      const txStatus: TransactionStatus = data.status || 'PENDING';

      if (txStatus === 'PENDING_AUTHORIZATION') {
        // Monnify 2FA OTP is enabled on this merchant wallet
        setPendingOtpReference(txReference);
        return;
      }

      finalizeVerifiedTransfer(
        finalAmount,
        selectedBank,
        recipientAccount,
        recipientName,
        txReference,
        txStatus
      );
    } catch {
      setTransferError(
        'Network error while communicating with Monnify transfer server. Please check your connection.'
      );
    } finally {
      setIsProcessingTransfer(false);
    }
  };

  const handleAuthorizeOtp = async (otpCode: string) => {
    if (isProcessingTransfer || !pendingOtpReference || !selectedBank) return;

    setIsProcessingTransfer(true);
    setTransferError(null);

    try {
      const res = await fetch('/api/monnify/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: pendingOtpReference,
          authorizationCode: otpCode,
        }),
      });

      const data = (await res.json()) as {
        requestSuccessful?: boolean;
        status?: TransactionStatus;
        reference?: string;
        error?: string;
      };

      if (!res.ok || !data.requestSuccessful) {
        setTransferError(data.error || 'OTP authorization failed. Please check the code and try again.');
        return;
      }

      finalizeVerifiedTransfer(
        confirmationAmount,
        selectedBank,
        recipientAccount,
        recipientName,
        data.reference || pendingOtpReference,
        data.status || 'SUCCESS'
      );
    } catch {
      setTransferError('Network error while verifying OTP code.');
    } finally {
      setIsProcessingTransfer(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#111827] flex flex-col">
      <OfflineIndicator />
      <main className="w-full min-h-screen bg-white flex flex-col flex-1">
        {currentScreen === 'splash' && (
          <SplashScreen onEnterApp={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'home' && (
          <HomeDashboard
            balance={balance}
            showTransferModal={showTransferModal}
            onOpenTransferModal={() => setShowTransferModal(true)}
            onCloseTransferModal={() => setShowTransferModal(false)}
            onSelectTransferOption={handleSelectTransferOption}
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {currentScreen === 'pay_and_transfer' && (
          <PayAndTransfer
            onOpenTransferModal={() => {
              setCurrentScreen('home');
              setShowTransferModal(true);
            }}
            onSelectBeneficiaryAndTransfer={(ben) => {
              handleSelectBeneficiary(ben);
              setCurrentScreen('transfer_other_banks');
            }}
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {currentScreen === 'transaction_history' && (
          <TransactionHistory
            balance={balance}
            transactions={transactions}
            onBack={() => setCurrentScreen('pay_and_transfer')}
            onSelectTransaction={(tx) => {
              setLatestTransaction(tx);
              setCurrentScreen('payment_receipt');
            }}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen onBack={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'transfer_other_banks' && (
          <TransferOtherBanks
            balance={balance}
            amount={amountInput}
            recipientAccount={recipientAccount}
            recipientName={recipientName}
            isAccountVerified={isAccountVerified}
            selectedBank={selectedBank}
            availableBanks={availableBanks}
            isResolvingAccount={isResolvingAccount}
            accountResolutionError={accountResolutionError}
            narration={narration}
            category={category}
            addToBeneficiaries={addToBeneficiaries}
            showBankModal={showBankModal}
            onChangeAmount={setAmountInput}
            onChangeRecipientAccount={(acc) => {
              setRecipientAccount(acc);
            }}
            onSelectBank={(bank) => {
              setSelectedBank(bank);
            }}
            onSelectBeneficiary={handleSelectBeneficiary}
            onChangeNarration={setNarration}
            onChangeCategory={setCategory}
            onToggleAddToBeneficiaries={() => setAddToBeneficiaries(!addToBeneficiaries)}
            onOpenBankModal={() => setShowBankModal(true)}
            onCloseBankModal={() => setShowBankModal(false)}
            onRetryAccountValidation={() => setValidationAttempt((prev) => prev + 1)}
            onBack={() => setCurrentScreen('pay_and_transfer')}
            onConfirmTransaction={handleConfirmTransactionForm}
          />
        )}

        {currentScreen === 'transaction_confirmation' && (
          <TransactionConfirmation
            amount={confirmationAmount}
            recipientName={recipientName}
            recipientAccount={recipientAccount}
            selectedBank={selectedBank || NIGERIAN_BANKS[1]}
            narration={narration}
            isProcessingTransfer={isProcessingTransfer}
            transferError={transferError}
            pendingOtpReference={pendingOtpReference}
            onBack={() => setCurrentScreen('transfer_other_banks')}
            onSubmitPin={handleAuthorizePin}
            onSubmitOtp={handleAuthorizeOtp}
          />
        )}

        {currentScreen === 'transfer_submitted_confetti' && (
          <TransferSubmitted
            amount={submittedAmount}
            recipientName={recipientName}
            confettiDensity="full"
            onViewReceipt={() => setCurrentScreen('payment_receipt')}
            onDone={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'transfer_submitted_clean' && (
          <TransferSubmitted
            amount={submittedAmount}
            recipientName={recipientName}
            confettiDensity="settled"
            onViewReceipt={() => setCurrentScreen('payment_receipt')}
            onDone={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'payment_receipt' && (
          <PaymentReceipt
            transaction={latestTransaction}
            onClose={() => setCurrentScreen('home')}
            onDone={() => setCurrentScreen('home')}
          />
        )}

        {(currentScreen === 'airtime_data' ||
          currentScreen === 'bill_payment' ||
          currentScreen === 'products' ||
          currentScreen === 'cards' ||
          currentScreen === 'menu') && (
          <SecondaryScreens
            screen={currentScreen}
            balance={balance}
            transactions={transactions}
            onBackHome={() => setCurrentScreen('home')}
            onNavigate={(scr) => setCurrentScreen(scr)}
            onQuickBuySuccess={(amt, label) => {
              if (amt > balance) return;
              setSubmittedAmount(amt);
              const tx: TransactionRecord = {
                id: `tx-${Date.now()}`,
                amount: amt,
                charges: 0.0,
                stampDuty: 0.0,
                total: amt,
                senderName: INITIAL_ACCOUNT.senderReceiptName,
                sourceAccount: INITIAL_ACCOUNT.sourceDisplay,
                recipientName: label.toUpperCase(),
                recipientAccount: recipientAccount || '9042769211',
                recipientBank: 'STERLING BILLS',
                reference: `OB-BILL-${Date.now()}`,
                narration: label,
                category: 'Bills & Utilities',
                dateFormatted: 'November 19, 2026',
                timeFormatted: '12.19AM',
                status: 'SUCCESS',
              };
              setLatestTransaction(tx);
              setTransactions((prev) => [tx, ...prev]);
              setBalance((prev) => Math.max(0, Number((prev - amt).toFixed(2))));
              setCurrentScreen('transfer_submitted_confetti');
            }}
          />
        )}
      </main>
    </div>
  );
}
