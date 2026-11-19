import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { INITIAL_ACCOUNT, TransactionRecord, formatNaira } from '../data/bankData';

interface TransactionHistoryProps {
  balance: number;
  transactions: TransactionRecord[];
  onBack: () => void;
  onSelectTransaction: (tx: TransactionRecord) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  balance,
  transactions,
  onBack,
  onSelectTransaction,
}) => {
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'OneBank Transfers' | 'Airtime' | 'Bill' | 'Always On' | 'All Transactions'
  >('OneBank Transfers');
  const [selectedMonth, setSelectedMonth] = useState('November 2026');
  const [showMonthModal, setShowMonthModal] = useState(false);

  const tabs: Array<typeof activeTab> = [
    'OneBank Transfers',
    'Airtime',
    'Bill',
    'Always On',
    'All Transactions',
  ];

  const totalMoneyOut = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <StatusBar time="12:38" />

        {/* Header with Left Arrow & Title */}
        <div className="flex items-center px-4 pt-3 pb-5">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-[#111827] hover:bg-gray-100 rounded-full active:scale-95 transition"
            aria-label="Go back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-[16.5px] font-semibold text-[#111827] pr-8">
            Transaction History
          </h1>
        </div>

        {/* Navy Account Balance Card (showing ₦40.40 as in the Transaction History screenshot) */}
        <div className="px-4 mb-6">
          <div className="relative w-full rounded-[16px] bg-[#1F2E4D] text-white p-5 overflow-hidden shadow-sm">
            {/* Light blue abstract knot artwork on the right side */}
            <svg
              className="absolute right-0 top-0 h-full w-40 pointer-events-none"
              viewBox="0 0 160 185"
              fill="none"
            >
              <path
                d="M148 -10 C95 0, 72 48, 92 92 C110 130, 165 130, 175 100 C185 70, 130 40, 118 90 C106 140, 108 175, 102 195"
                stroke="#49A8C4"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <circle cx="135" cy="48" r="26" stroke="#49A8C4" strokeWidth="16" />
            </svg>

            {/* Top Row: Balance + Dropdown Chevron & Upgrade Button */}
            <div className="relative z-10 flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[23px] font-bold tracking-tight tabular-nums">
                  {hideBalance ? '₦****' : `₦${formatNaira(balance)}`}
                </span>
                <button
                  type="button"
                  className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white/90"
                  aria-label="Switch account"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                className="flex items-center gap-1.5 bg-white text-[#111827] px-3.5 py-2 rounded-full text-[13px] font-semibold shadow-xs"
              >
                <span className="w-4 h-4 rounded-full bg-[#111827] text-white flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Upgrade</span>
              </button>
            </div>

            {/* Account Number */}
            <div className="relative z-10 text-[15px] text-white/85 font-normal tracking-wide mb-5 tabular-nums">
              {INITIAL_ACCOUNT.accountNumber}
            </div>

            {/* Bottom Row: Account Type + Holder Name & Hide Balance Button */}
            <div className="relative z-10 flex items-end justify-between">
              <div className="space-y-0.5">
                <div className="text-[13.5px] text-white/80 font-normal">
                  {INITIAL_ACCOUNT.accountType}
                </div>
                <div className="text-[14.5px] text-white/95 font-medium">
                  {INITIAL_ACCOUNT.accountName}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHideBalance(!hideBalance)}
                className="w-9 h-9 rounded-full bg-white text-[#1F2937] flex items-center justify-center shadow-xs"
                aria-label="Toggle balance visibility"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Pill & Calendar Filter Button */}
        <div className="flex items-center justify-between px-4 mb-5">
          <div className="p-1.5 rounded-full bg-[#ECEEEF]">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#4F8D9E] text-white text-[13.5px] font-medium tracking-tight">
              Transaction History
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMonthModal(true)}
            className="w-11 h-11 rounded-full border border-[#D1D5DB] bg-white flex items-center justify-center text-[#111827] hover:bg-gray-50 active:scale-95 transition"
            aria-label="Filter by date"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="8" y1="2" x2="8" y2="5" strokeLinecap="round" />
              <line x1="16" y1="2" x2="16" y2="5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Showing results for November 2026 */}
        <div className="px-5 mb-4">
          <h2 className="text-[15.5px] font-semibold text-[#58595B]">
            Showing results for {selectedMonth}
          </h2>
        </div>

        {/* Money In / Money Out Summary Boxes */}
        <div className="grid grid-cols-2 gap-3.5 px-5 mb-7">
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
            <div className="text-[15.5px] font-bold text-[#111827] tabular-nums">
              NGN 50,000.00
            </div>
            <div className="text-[13.5px] font-normal text-[#5F8D8B] mt-0.5">
              Money In
            </div>
          </div>

          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
            <div className="text-[15.5px] font-bold text-[#111827] tabular-nums">
              NGN {formatNaira(totalMoneyOut)}
            </div>
            <div className="text-[13.5px] font-normal text-[#D65A62] mt-0.5">
              Money Out
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between px-4 mb-6 overflow-x-auto no-scrollbar gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex flex-col items-center shrink-0 focus:outline-none"
              >
                <span
                  className={`text-[12.5px] font-semibold pb-1.5 transition ${
                    isActive ? 'text-[#D65A62]' : 'text-[#111827]'
                  }`}
                >
                  {tab}
                </span>
                <span
                  className={`h-[3px] w-full rounded-full transition ${
                    isActive ? 'bg-[#D92027]' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Transaction List Items */}
        <div className="px-4 divide-y divide-[#F3F4F6] pb-12">
          {transactions.map((tx) => (
            <button
              key={tx.id}
              type="button"
              onClick={() => onSelectTransaction(tx)}
              className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition group"
            >
              <div className="flex items-center gap-4 pr-3">
                {/* Red Circular Outgoing Arrow Icon matching screenshot */}
                <div className="w-11 h-11 rounded-full bg-[#DB545A] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M13 6l-6 6 6 6v-4h3v-4h-3V6zm5 4h2v4h-2v-4z" />
                  </svg>
                </div>

                <div>
                  <div className="text-[15.5px] font-bold text-[#111827] tabular-nums mb-0.5">
                    NGN{tx.amount.toFixed(2)}
                  </div>
                  <p className="text-[13.5px] text-[#374151] leading-[1.35]">
                    OneBank Transfer from ABDULSALAM TIAMIYU to{' '}
                    <span className="uppercase">{tx.recipientName}</span>
                  </p>
                  <div className="text-[13px] text-[#6B7280] mt-1 tabular-nums">
                    19/11/2026
                  </div>
                </div>
              </div>

              {/* Three black dots menu icon */}
              <div className="flex items-center gap-1 pr-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Month Picker Bottom Sheet */}
      {showMonthModal && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowMonthModal(false)} />
          <div className="bg-white rounded-t-[26px] p-6 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#111827]">Select Statement Period</h3>
              <button
                type="button"
                onClick={() => setShowMonthModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-[#F3F4F6]">
              {['November 2026', 'October 2026', 'September 2026'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(m);
                    setShowMonthModal(false);
                  }}
                  className="w-full py-3.5 text-left text-sm font-semibold text-[#111827] flex items-center justify-between"
                >
                  <span>{m}</span>
                  {selectedMonth === m && <span className="text-[#4F8D9E] font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
