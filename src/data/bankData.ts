export type AppScreen =
  | 'splash'
  | 'home'
  | 'pay_and_transfer'
  | 'transaction_history'
  | 'profile'
  | 'transfer_other_banks'
  | 'transaction_confirmation'
  | 'transfer_submitted_confetti'
  | 'transfer_submitted_clean'
  | 'payment_receipt'
  | 'airtime_data'
  | 'bill_payment'
  | 'products'
  | 'cards'
  | 'menu';

export interface BankOption {
  id: string;
  name: string;
  code: string;
  nipBankCode?: string;
  successRate: number;
  isTopSuggested?: boolean;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'PENDING_AUTHORIZATION' | 'FAILED';

export interface TransactionRecord {
  id: string;
  amount: number;
  charges: number;
  stampDuty: number;
  total: number;
  senderName: string;
  sourceAccount: string;
  recipientName: string;
  recipientAccount: string;
  recipientBank: string;
  reference: string;
  narration: string;
  category: string;
  dateFormatted: string;
  timeFormatted: string;
  status?: TransactionStatus;
}

export const INITIAL_ACCOUNT = {
  accountName: 'Abdulsalam  Tiamiyu',
  senderReceiptName: 'TIAMIYU ABDULSALAM',
  sourceDisplay: 'ABDULSALAM  TIAMIYU - 0137569608',
  accountNumber: '0137569608',
  accountType: 'Savings - Financial Inclusion-1',
  shortAccountLabel: 'Savings - 0137569608',
  balance: 50000.40,
};

export function formatNaira(amount: number): string {
  return amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const NIGERIAN_BANKS: BankOption[] = [
  { id: 'opay', name: 'OPAY DIGITAL SERVICES LIMITED', code: '305', nipBankCode: '999992', successRate: 99, isTopSuggested: true },
  { id: 'palmpay', name: 'PALMPAY LIMITED', code: '999991', nipBankCode: '999991', successRate: 99, isTopSuggested: true },
  { id: 'suntrust', name: 'SUNTRUST BANK', code: '100', nipBankCode: '000022', successRate: 98, isTopSuggested: true },
  { id: 'waya', name: 'WAYA MICROFINANCE BANK', code: '51355', nipBankCode: '090590', successRate: 97, isTopSuggested: true },
  { id: 'uhuru', name: 'UHURU MICROFINANCE BANK', code: '51322', nipBankCode: '090679', successRate: 96, isTopSuggested: true },
  { id: 'gtb', name: 'GUARANTY TRUST BANK', code: '058', nipBankCode: '000013', successRate: 99 },
  { id: 'access', name: 'ACCESS BANK PLC', code: '044', nipBankCode: '000014', successRate: 98 },
  { id: 'zenith', name: 'ZENITH BANK PLC', code: '057', nipBankCode: '000015', successRate: 99 },
  { id: 'uba', name: 'UNITED BANK FOR AFRICA', code: '033', nipBankCode: '000004', successRate: 97 },
  { id: 'firstbank', name: 'FIRST BANK OF NIGERIA', code: '011', nipBankCode: '000016', successRate: 96 },
  { id: 'kuda', name: 'KUDA MICROFINANCE BANK', code: '50211', nipBankCode: '090267', successRate: 99 },
  { id: 'moniepoint', name: 'MONIEPOINT MICROFINANCE BANK', code: '50515', nipBankCode: '090405', successRate: 99 },
  { id: 'fidelity', name: 'FIDELITY BANK PLC', code: '070', nipBankCode: '000007', successRate: 98 },
  { id: 'fcmb', name: 'FIRST CITY MONUMENT BANK', code: '214', nipBankCode: '000003', successRate: 97 },
  { id: 'wema', name: 'WEMA BANK PLC', code: '035', nipBankCode: '000017', successRate: 98 },
  { id: 'stanbic', name: 'STANBIC IBTC BANK', code: '221', nipBankCode: '000012', successRate: 99 },
  { id: 'sterling', name: 'STERLING BANK PLC', code: '232', nipBankCode: '000001', successRate: 100 },
];

export const SAVED_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben-1',
    name: 'ABDULSALAM ADEDAYO TIAMIYU',
    accountNumber: '9042769211',
    bankName: 'PALMPAY LIMITED',
    bankCode: '999991',
  },
  {
    id: 'ben-2',
    name: 'ABDULSALAM ADEDAYO TIAMIYU',
    accountNumber: '8104529182',
    bankName: 'OPAY DIGITAL SERVICES LIMITED',
    bankCode: '305',
  },
  {
    id: 'ben-3',
    name: 'CHUKWUEMEKA ADEWALE',
    accountNumber: '0129485712',
    bankName: 'GUARANTY TRUST BANK',
    bankCode: '058',
  },
];

export const TRANSACTION_CATEGORIES = [
  'General',
  'Transfer',
  'Food & Dining',
  'Bills & Utilities',
  'Family & Friends',
  'Business',
  'Transportation',
];
