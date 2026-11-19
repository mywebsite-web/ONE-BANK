import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import {
  BankOption,
  Beneficiary,
  INITIAL_ACCOUNT,
  NIGERIAN_BANKS,
  SAVED_BENEFICIARIES,
  TRANSACTION_CATEGORIES,
  formatNaira,
} from '../data/bankData';

interface TransferOtherBanksProps {
  balance: number;
  amount: string;
  recipientAccount: string;
  recipientName: string;
  isAccountVerified: boolean;
  selectedBank: BankOption | null;
  availableBanks?: BankOption[];
  isResolvingAccount?: boolean;
  accountResolutionError?: string | null;
  narration: string;
  category: string;
  addToBeneficiaries: boolean;
  showBankModal: boolean;
  onChangeAmount: (val: string) => void;
  onChangeRecipientAccount: (val: string) => void;
  onSelectBank: (bank: BankOption) => void;
  onSelectBeneficiary: (ben: Beneficiary) => void;
  onChangeNarration: (val: string) => void;
  onChangeCategory: (val: string) => void;
  onToggleAddToBeneficiaries: () => void;
  onOpenBankModal: () => void;
  onCloseBankModal: () => void;
  onRetryAccountValidation?: () => void;
  onBack: () => void;
  onConfirmTransaction: () => void;
}

export const TransferOtherBanks: React.FC<TransferOtherBanksProps> = ({
  balance,
  amount,
  recipientAccount,
  recipientName,
  isAccountVerified,
  selectedBank,
  availableBanks = NIGERIAN_BANKS,
  isResolvingAccount = false,
  accountResolutionError = null,
  narration,
  category,
  addToBeneficiaries,
  showBankModal,
  onChangeAmount,
  onChangeRecipientAccount,
  onSelectBank,
  onSelectBeneficiary,
  onChangeNarration,
  onChangeCategory,
  onToggleAddToBeneficiaries,
  onOpenBankModal,
  onCloseBankModal,
  onRetryAccountValidation,
  onBack,
  onConfirmTransaction,
}) => {
  const [transferMode, setTransferMode] = useState<'single' | 'schedule'>('single');
  const [showAllBanksInModal, setShowAllBanksInModal] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [showBeneficiariesSheet, setShowBeneficiariesSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  const topFiveDefaultBanks = NIGERIAN_BANKS.filter((b) => b.isTopSuggested);

  const displayedBanks = (() => {
    if (!showAllBanksInModal) {
      return topFiveDefaultBanks;
    }
    const q = bankSearchQuery.trim().toLowerCase();
    if (!q) return availableBanks;
    return availableBanks.filter(
      (b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)
    );
  })();

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormValidationError(null);
    onChangeRecipientAccount(digitsOnly);
    if (digitsOnly.length === 10 && !selectedBank) {
      onOpenBankModal();
    }
  };

  const handleConfirmClick = () => {
    setFormValidationError(null);

    if (!/^\d{10}$/.test(recipientAccount)) {
      setFormValidationError('Please enter a valid 10-digit recipient account number.');
      return;
    }

    if (!selectedBank) {
      onOpenBankModal();
      return;
    }

    if (isResolvingAccount) {
      setFormValidationError('Please wait while the recipient account is being verified.');
      return;
    }

    if (!isAccountVerified || !recipientName.trim() || accountResolutionError) {
      setFormValidationError(
        accountResolutionError ||
          'Recipient account could not be verified. Please check the account number and selected bank.'
      );
      return;
    }

    const parsedAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormValidationError('Please enter a transfer amount greater than ₦0.00.');
      return;
    }

    if (parsedAmount > balance) {
      setFormValidationError(
        `Insufficient balance. Your available balance is ₦${formatNaira(balance)}.`
      );
      return;
    }

    onConfirmTransaction();
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between">
        {/* Status Bar */}
        <StatusBar time="12:17" />

        {/* Header with Back Chevron & Title */}
        <div className="flex items-center px-4 pt-3 pb-4 relative">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-[#111827] hover:bg-gray-100 rounded-full active:scale-95 transition"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[16.5px] font-semibold text-[#111827] pr-8">
            Transfer to Other Banks
          </h1>
        </div>

        {/* Main Form Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
          {/* Single / Schedule Toggle Row */}
          <div className="flex items-center justify-between mb-6 pt-1">
            <div className="p-1.5 rounded-full bg-[#ECEEEF]">
              <button
                type="button"
                onClick={() => setTransferMode('single')}
                className={`px-5 py-1.5 rounded-full text-[13.5px] font-medium transition ${
                  transferMode === 'single'
                    ? 'bg-[#4F8D9E] text-white'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                Single
              </button>
            </div>

            <button
              type="button"
              onClick={() => setTransferMode(transferMode === 'single' ? 'schedule' : 'single')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[13.5px] font-semibold transition ${
                transferMode === 'schedule'
                  ? 'border-[#4F8D9E] bg-[#4F8D9E]/10 text-[#111827]'
                  : 'border-[#E5E7EB] bg-white text-[#111827] hover:bg-gray-50'
              }`}
            >
              {/* Stopwatch icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2.5 1.5M9 2h6M19 6l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Schedule</span>
            </button>
          </div>

          {/* Select Account Section */}
          <div className="pb-4 mb-5 border-b border-[#F3F4F6]">
            <div className="text-[12px] font-medium text-[#6B7280] mb-1">
              Select Account
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  {INITIAL_ACCOUNT.shortAccountLabel}
                </div>
                <div className="text-[12.5px] text-[#6B7280] mt-0.5 tabular-nums">
                  Balance: ₦{formatNaira(balance)}
                </div>
              </div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111827"
                strokeWidth="2.2"
                className="mr-1"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Amount Section */}
          <div className="pb-5 mb-5 border-b border-[#F3F4F6]">
            <label className="block text-[12px] font-medium text-[#6B7280] mb-2">
              Amount
            </label>
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-[22px] font-bold text-[#111827] tracking-tight">NGN</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  setFormValidationError(null);
                  onChangeAmount(e.target.value);
                }}
                placeholder="0.0"
                className="w-full text-[22px] font-bold text-[#111827] placeholder-[#111827] focus:outline-none bg-transparent tabular-nums"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['1,000.00', '2,000.00', '5,000.00', '10,000.00'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setFormValidationError(null);
                    onChangeAmount(preset.replace(/,/g, ''));
                  }}
                  className="px-3.5 py-2 rounded-full bg-[#ECEEEF] hover:bg-[#E2E5E8] text-[#4B5563] text-[13px] font-semibold whitespace-nowrap shrink-0 tabular-nums active:scale-95 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Account Number & Bank Selection Section */}
          <div className="pb-3.5 mb-3.5 border-b border-[#F3F4F6]">
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-[12px] font-medium text-[#6B7280]">
                Recipient Account Number
              </label>
              <button
                type="button"
                onClick={onOpenBankModal}
                className="text-[12px] font-semibold text-[#4F8D9E] hover:text-[#111827] transition"
              >
                {selectedBank ? 'Change Recipient Bank' : 'Select Recipient Bank'}
              </button>
            </div>

            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={recipientAccount}
              onChange={handleAccountChange}
              placeholder="0000000000"
              className="w-full text-[16px] font-medium text-[#111827] placeholder-[#9CA3AF] focus:outline-none bg-transparent tracking-wide tabular-nums"
            />

            {selectedBank && (
              <div className="mt-2.5 flex items-center justify-between bg-[#F9FAFB] px-3 py-2.5 rounded-lg border border-[#E5E7EB]">
                <div className="pr-2">
                  <div className="text-[11.5px] font-semibold text-[#4F8D9E]">
                    {selectedBank.name}
                  </div>
                  {isResolvingAccount ? (
                    <div className="text-[12px] font-medium text-[#6B7280] mt-0.5">
                      Validating account number with Monnify...
                    </div>
                  ) : accountResolutionError ? (
                    <div className="text-[12px] font-medium text-[#D92027] mt-0.5">
                      {accountResolutionError}
                    </div>
                  ) : isAccountVerified && recipientName ? (
                    <div className="text-[12.5px] font-bold text-[#111827] mt-0.5">
                      {recipientName}
                    </div>
                  ) : (
                    <div className="text-[12px] text-[#6B7280] mt-0.5">
                      Enter 10-digit account number to verify recipient
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {accountResolutionError && onRetryAccountValidation && (
                    <button
                      type="button"
                      onClick={onRetryAccountValidation}
                      className="text-[11.5px] font-semibold text-[#4F8D9E] hover:underline"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenBankModal}
                    className="text-[11.5px] font-semibold text-[#D92027] hover:underline"
                  >
                    Change Bank
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Select from Beneficiaries Link */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowBeneficiariesSheet(true)}
              className="inline-flex items-center gap-2 text-[#C83E4D] hover:text-[#D92027] text-[14px] font-semibold py-1 active:scale-98 transition"
            >
              <svg width="20" height="18" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="9" cy="6" r="3" />
                <path d="M3 17c1-3 3.2-4.5 6-4.5s5 1.5 6 4.5" strokeLinecap="round" />
                <circle cx="17" cy="7" r="2.3" />
                <path d="M16 12.5c2 0 3.8 1.2 4.5 3.5" strokeLinecap="round" />
              </svg>
              <span>Select from Beneficiaries</span>
            </button>
          </div>

          {/* Narration Section */}
          <div className="pb-3.5 mb-5 border-b border-[#F3F4F6]">
            <label className="block text-[12px] font-medium text-[#6B7280] mb-2.5">
              Narration
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => onChangeNarration(e.target.value)}
              placeholder="Enter Narration"
              className="w-full text-[15px] font-medium text-[#111827] placeholder-[#9CA3AF] focus:outline-none bg-transparent"
            />
          </div>

          {/* Transaction Category Section */}
          <div className="pb-4 mb-5">
            <div className="text-[12px] font-medium text-[#6B7280] mb-2.5">
              Transaction Category
            </div>
            <button
              type="button"
              onClick={() => setShowCategorySheet(true)}
              className="w-full flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-3.5">
                {/* Circular blue gauge icon matching screenshot */}
                <div className="w-8 h-8 rounded-full bg-[#BAE6FD] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 16 A8 8 0 0 1 20 16"
                      stroke="#0284C7"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.5 16 A5.5 5.5 0 0 1 17.5 16"
                      stroke="#10B981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <line x1="12" y1="16" x2="15.5" y2="11.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.8" fill="#1E293B" />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold text-[#111827]">{category}</span>
              </div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111827"
                strokeWidth="2.2"
                className="mr-1"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Add to Beneficiaries Switch */}
          <div className="flex items-center gap-3.5 mb-5">
            <button
              type="button"
              role="switch"
              aria-checked={addToBeneficiaries}
              onClick={onToggleAddToBeneficiaries}
              className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center ${
                addToBeneficiaries ? 'bg-[#4F8D9E] justify-end' : 'bg-[#6B7280] justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs block" />
            </button>
            <span className="text-[14.5px] font-semibold text-[#111827]">
              Add to Beneficiaries
            </span>
          </div>

          {/* Form Error Banner */}
          {formValidationError && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[12.5px] font-medium text-[#D92027]">
              {formValidationError}
            </div>
          )}

          {/* Confirm Transaction Button */}
          <button
            type="button"
            disabled={isResolvingAccount}
            onClick={handleConfirmClick}
            className="w-full py-4 rounded-[12px] border border-[#D1D5DB] bg-white hover:bg-gray-50 disabled:opacity-60 text-[#111827] text-[15px] font-semibold shadow-2xs active:scale-[0.99] transition"
          >
            {isResolvingAccount ? 'Verifying Account...' : 'Confirm Transaction'}
          </button>
        </div>
      </div>

      {/* Screenshot 5: Select Recipient Bank Bottom Sheet Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div
            className="flex-1"
            onClick={() => {
              setShowAllBanksInModal(false);
              setBankSearchQuery('');
              onCloseBankModal();
            }}
          />
          <div className="bg-white rounded-t-[26px] pt-5 pb-4 px-5 shadow-2xl max-h-[82%] max-w-2xl w-full mx-auto flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Close X Button on Top Right */}
            <div className="flex justify-end mb-1">
              <button
                type="button"
                onClick={() => {
                  setShowAllBanksInModal(false);
                  setBankSearchQuery('');
                  onCloseBankModal();
                }}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827]"
                aria-label="Close bank selector"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <h3 className="text-center text-[15.5px] font-semibold text-[#111827] mb-4">
              Select Recipient Bank
            </h3>

            {showAllBanksInModal && (
              <div className="mb-3">
                <input
                  type="text"
                  value={bankSearchQuery}
                  onChange={(e) => setBankSearchQuery(e.target.value)}
                  placeholder="Search Nigerian banks..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#4F8D9E]"
                />
              </div>
            )}

            <div className="overflow-y-auto no-scrollbar divide-y divide-[#F3F4F6]">
              {displayedBanks.map((bank) => (
                <button
                  key={`${bank.id}-${bank.code}`}
                  type="button"
                  onClick={() => {
                    setFormValidationError(null);
                    onSelectBank(bank);
                    setShowAllBanksInModal(false);
                    setBankSearchQuery('');
                    onCloseBankModal();
                  }}
                  className="w-full flex items-center gap-3.5 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition"
                >
                  {/* Classical grey bank building icon */}
                  <div className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] shrink-0">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v2h20V7L12 2zm-7 9v7H3v2h18v-2h-2v-7h-3v7h-3v-7h-2v7H8v-7H5z" />
                    </svg>
                  </div>
                  <span className="text-[14.5px] font-medium text-[#111827] tracking-tight">
                    {bank.name}
                  </span>
                </button>
              ))}

              {/* SEE MORE BANKS Row */}
              {!showAllBanksInModal && (
                <button
                  type="button"
                  onClick={() => setShowAllBanksInModal(true)}
                  className="w-full flex items-center gap-3.5 py-4 text-left hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#4F8D9E] flex items-center justify-center shrink-0">
                    <span className="w-3.5 h-3.5 rounded-full border-[1.6px] border-[#111827]" />
                  </div>
                  <span className="text-[14.5px] font-medium text-[#111827]">
                    SEE MORE BANKS
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Select from Beneficiaries Modal */}
      {showBeneficiariesSheet && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowBeneficiariesSheet(false)} />
          <div className="bg-white rounded-t-[26px] pt-5 pb-4 px-5 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15.5px] font-semibold text-[#111827]">
                Saved Beneficiaries
              </h3>
              <button
                type="button"
                onClick={() => setShowBeneficiariesSheet(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111827]"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-[#F3F4F6]">
              {SAVED_BENEFICIARIES.map((ben) => (
                <button
                  key={ben.id}
                  type="button"
                  onClick={() => {
                    setFormValidationError(null);
                    onSelectBeneficiary(ben);
                    setShowBeneficiariesSheet(false);
                  }}
                  className="w-full text-left py-3.5 hover:bg-gray-50 transition"
                >
                  <div className="text-[14px] font-bold text-[#111827]">{ben.name}</div>
                  <div className="text-[12.5px] text-[#6B7280] mt-0.5 tabular-nums">
                    {ben.accountNumber} · {ben.bankName}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Category Picker Modal */}
      {showCategorySheet && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowCategorySheet(false)} />
          <div className="bg-white rounded-t-[26px] pt-5 pb-4 px-5 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15.5px] font-semibold text-[#111827]">
                Select Transaction Category
              </h3>
              <button
                type="button"
                onClick={() => setShowCategorySheet(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111827]"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-[#F3F4F6]">
              {TRANSACTION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onChangeCategory(cat);
                    setShowCategorySheet(false);
                  }}
                  className="w-full text-left py-3.5 text-[14.5px] font-medium text-[#111827] hover:text-[#4F8D9E] flex items-center justify-between"
                >
                  <span>{cat}</span>
                  {category === cat && (
                    <span className="text-[#4F8D9E] font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
