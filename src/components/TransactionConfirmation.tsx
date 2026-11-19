import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { BankOption, INITIAL_ACCOUNT, NIGERIAN_BANKS, formatNaira } from '../data/bankData';

interface TransactionConfirmationProps {
  amount: number;
  recipientName: string;
  recipientAccount: string;
  selectedBank: BankOption;
  narration: string;
  isProcessingTransfer?: boolean;
  transferError?: string | null;
  pendingOtpReference?: string | null;
  onBack: () => void;
  onSubmitPin: (pin: string) => void;
  onSubmitOtp?: (otp: string) => void;
}

export const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  amount,
  recipientName,
  recipientAccount,
  selectedBank,
  narration,
  isProcessingTransfer = false,
  transferError = null,
  pendingOtpReference = null,
  onBack,
  onSubmitPin,
  onSubmitOtp,
}) => {
  const [pin, setPin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [showAllBankRatesModal, setShowAllBankRatesModal] = useState(false);

  const formattedAmount = `₦${formatNaira(amount)}`;

  const handleDigitPress = (digit: string) => {
    if (isProcessingTransfer) return;
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          onSubmitPin(next);
        }, 180);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between">
        {/* Status Bar */}
        <StatusBar time="12:17" />

        {/* Top App Bar */}
        <div className="flex items-center px-4 pt-3 pb-3">
          <button
            type="button"
            disabled={isProcessingTransfer}
            onClick={onBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-[#111827] hover:bg-gray-100 rounded-full active:scale-95 transition disabled:opacity-50"
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

        {/* Main Confirmation Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-6">
          <h2 className="text-[19px] font-bold text-[#111827] tracking-tight">
            Transaction Confirmation
          </h2>
          <p className="text-[13.5px] font-medium text-[#374151] mt-0.5 mb-4">
            {pendingOtpReference
              ? 'Enter your Monnify 2FA OTP to authorize disbursement'
              : 'Enter your 4-digit PIN to continue'}
          </p>

          {/* Light Blue Summary Box */}
          <div className="rounded-[12px] bg-[#AED8E6] px-4 py-3.5 space-y-2.5 mb-6">
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="font-medium text-[#1F2937]">Amount</span>
              <span className="font-bold text-[#111827] tabular-nums">{formattedAmount}</span>
            </div>
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="font-medium text-[#1F2937]">Charges (Fee & Vat)</span>
              <span className="font-bold text-[#111827] tabular-nums">₦0.00</span>
            </div>
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="font-medium text-[#1F2937]">Stamp Duty</span>
              <span className="font-bold text-[#111827] tabular-nums">₦0.00</span>
            </div>
            <div className="flex items-center justify-between text-[13.5px] pt-0.5">
              <span className="font-medium text-[#1F2937]">Total</span>
              <span className="font-bold text-[#111827] tabular-nums">{formattedAmount}</span>
            </div>
          </div>

          {/* Account & Bank Details Stack */}
          <div className="space-y-4 mb-5">
            <div>
              <div className="text-[12px] text-[#9CA3AF] font-medium mb-0.5">
                Destination Account
              </div>
              <div className="text-[14.5px] font-semibold text-[#111827] tracking-tight tabular-nums">
                {recipientName} - {recipientAccount}
              </div>
            </div>

            <div>
              <div className="text-[12px] text-[#9CA3AF] font-medium mb-0.5">
                Bank
              </div>
              <div className="text-[14.5px] font-semibold text-[#111827] uppercase">
                {selectedBank.name}
              </div>
            </div>

            <div>
              <div className="text-[12px] text-[#9CA3AF] font-medium mb-0.5">
                Source Account
              </div>
              <div className="text-[14.5px] font-semibold text-[#111827] tracking-tight tabular-nums">
                {INITIAL_ACCOUNT.sourceDisplay}
              </div>
            </div>

            <div className="pb-4 border-b border-[#F3F4F6]">
              <div className="text-[12px] text-[#9CA3AF] font-medium mb-1">
                Narration
              </div>
              {narration ? (
                <div className="text-[14px] font-medium text-[#111827]">{narration}</div>
              ) : (
                <div className="h-3" />
              )}
            </div>
          </div>

          {/* Bank Transfer Success Rate Section */}
          <div className="mb-6">
            <div className="text-[13.5px] font-medium text-[#374151] mb-3">
              Bank Transfer success rate in the last 30 minutes.
            </div>

            <div className="flex items-center justify-between py-1.5 mb-3.5">
              <div className="flex items-center gap-3">
                {/* Classical dark bank building icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1F2937">
                  <path d="M12 2L2 7v2h20V7L12 2zm-7 9v7H3v2h18v-2h-2v-7h-3v7h-3v-7h-2v7H8v-7H5z" />
                </svg>
                <span className="text-[15px] font-normal text-[#1F2937] uppercase">
                  {selectedBank.name}
                </span>
              </div>
              <span className="text-[15px] font-medium text-[#669B82] tabular-nums">
                {selectedBank.successRate}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAllBankRatesModal(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-[10px] bg-[#F2F4F7] hover:bg-[#E5E7EB] transition"
            >
              <span className="text-[13.5px] font-semibold text-[#111827]">
                Check All Banks Transfer Success Rates
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F8D9E" strokeWidth="2.4">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Monnify 2FA OTP Step (if required by merchant account) */}
          {pendingOtpReference && onSubmitOtp ? (
            <div className="flex flex-col items-center justify-center pt-2 pb-4">
              <div className="w-full max-w-xs space-y-3">
                <label className="block text-xs font-semibold text-[#374151] text-center">
                  Enter Monnify OTP Code (Ref: {pendingOtpReference})
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] text-center text-lg font-bold tracking-widest text-[#1D3557] focus:outline-none focus:border-[#4F8D9E] tabular-nums"
                />
                {transferError && (
                  <div className="px-3.5 py-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[12px] font-medium text-[#D92027] text-center">
                    {transferError}
                  </div>
                )}
                <button
                  type="button"
                  disabled={isProcessingTransfer || !otpCode.trim()}
                  onClick={() => onSubmitOtp(otpCode)}
                  className="w-full py-3 rounded-xl bg-[#1D3557] hover:bg-[#152741] disabled:opacity-50 text-white text-sm font-semibold transition"
                >
                  {isProcessingTransfer ? 'Verifying OTP...' : 'Authorize OTP'}
                </button>
              </div>
            </div>
          ) : (
            /* Large Navy 0000 PIN Display & Trigger */
            <div className="flex flex-col items-center justify-center pt-2 pb-4">
              <button
                type="button"
                disabled={isProcessingTransfer}
                onClick={() => {
                  if (pin.length === 4) {
                    onSubmitPin(pin);
                  } else {
                    setShowKeypad(true);
                  }
                }}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div className="text-[38px] font-bold tracking-[0.06em] text-[#1D3557] leading-none mb-2 tabular-nums">
                  {pin.length === 0 ? '0000' : pin.padEnd(4, '0')}
                </div>
                <span className="text-[13.5px] font-normal text-[#374151] group-hover:text-[#D92027] transition">
                  {isProcessingTransfer
                    ? 'Processing transfer via Monnify...'
                    : 'Enter Your Transaction PIN'}
                </span>
              </button>

              {transferError && (
                <div className="mt-3 px-3.5 py-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[12.5px] font-medium text-[#D92027] text-center max-w-sm">
                  {transferError}
                </div>
              )}

              {/* Keypad & Authorize buttons */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={isProcessingTransfer}
                  onClick={() => setShowKeypad(!showKeypad)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F2F4F7] hover:bg-[#E5E7EB] disabled:opacity-50 text-[12px] font-semibold text-[#1D3557] transition"
                >
                  {showKeypad ? 'Hide Keypad' : 'Open PIN Keypad'}
                </button>
                <button
                  type="button"
                  disabled={isProcessingTransfer}
                  onClick={() => onSubmitPin(pin || '1234')}
                  className="px-4 py-1.5 rounded-full bg-[#1D3557] hover:bg-[#152741] disabled:opacity-50 text-[12px] font-semibold text-white transition"
                >
                  {isProcessingTransfer ? 'Sending...' : 'Authorize Transfer'}
                </button>
              </div>
            </div>
          )}

          {/* Optional Interactive Numeric Keypad Drawer */}
          {showKeypad && !pendingOtpReference && (
            <div className="mt-2 bg-[#F9FAFB] rounded-2xl p-3 border border-[#E5E7EB]">
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    disabled={isProcessingTransfer}
                    onClick={() => handleDigitPress(digit)}
                    className="h-11 rounded-xl bg-white border border-gray-200 text-[17px] font-bold text-[#111827] hover:bg-gray-50 active:scale-95 transition tabular-nums disabled:opacity-50"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={isProcessingTransfer}
                  onClick={() => setPin('')}
                  className="h-11 rounded-xl bg-white border border-gray-200 text-[12px] font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={isProcessingTransfer}
                  onClick={() => handleDigitPress('0')}
                  className="h-11 rounded-xl bg-white border border-gray-200 text-[17px] font-bold text-[#111827] hover:bg-gray-50 active:scale-95 transition tabular-nums disabled:opacity-50"
                >
                  0
                </button>
                <button
                  type="button"
                  disabled={isProcessingTransfer}
                  onClick={handleBackspace}
                  className="h-11 rounded-xl bg-white border border-gray-200 text-[14px] font-semibold text-[#111827] hover:bg-gray-50 disabled:opacity-50"
                >
                  ⌫
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Banks Transfer Success Rates Modal */}
      {showAllBankRatesModal && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowAllBankRatesModal(false)} />
          <div className="bg-white rounded-t-[26px] pt-5 pb-4 px-5 shadow-2xl max-h-[78%] max-w-2xl w-full mx-auto flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15.5px] font-bold text-[#111827]">
                Live Bank Transfer Success Rates
              </h3>
              <button
                type="button"
                onClick={() => setShowAllBankRatesModal(false)}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#111827]"
              >
                ✕
              </button>
            </div>
            <p className="text-[12px] text-[#6B7280] mb-3">
              Updated every 30 minutes based on NIBSS Instant Payment (NIP) telemetry.
            </p>
            <div className="overflow-y-auto no-scrollbar divide-y divide-[#F3F4F6]">
              {NIGERIAN_BANKS.map((bank) => (
                <div
                  key={bank.id}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4B5563">
                      <path d="M12 2L2 7v2h20V7L12 2zm-7 9v7H3v2h18v-2h-2v-7h-3v7h-3v-7h-2v7H8v-7H5z" />
                    </svg>
                    <span className="text-[13.5px] font-medium text-[#111827]">
                      {bank.name}
                    </span>
                  </div>
                  <span className="text-[14px] font-semibold text-[#669B82] tabular-nums">
                    {bank.successRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
