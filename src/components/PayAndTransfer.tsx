import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { AppScreen, Beneficiary, SAVED_BENEFICIARIES } from '../data/bankData';

interface PayAndTransferProps {
  onOpenTransferModal: () => void;
  onSelectBeneficiaryAndTransfer: (ben: Beneficiary) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const PayAndTransfer: React.FC<PayAndTransferProps> = ({
  onOpenTransferModal,
  onSelectBeneficiaryAndTransfer,
  onNavigate,
}) => {
  const [showBeneficiariesModal, setShowBeneficiariesModal] = useState(false);
  const [showForeignModal, setShowForeignModal] = useState(false);
  const [showScheduledModal, setShowScheduledModal] = useState(false);

  const quickBeneficiaries = [
    {
      initials: 'AT',
      label: 'Abdulsal',
      bgClass: 'bg-[#A1B0BD]',
      beneficiary: SAVED_BENEFICIARIES[0],
    },
    {
      initials: 'GA',
      label: 'Goodnes',
      bgClass: 'bg-[#686A6C]',
      beneficiary: {
        id: 'ben-goodness',
        name: 'GOODNESS ADEYEMI',
        accountNumber: '0239481726',
        bankName: 'OPAY DIGITAL SERVICES LIMITED',
        bankCode: '999992',
      },
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <StatusBar time="12:37" />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 max-w-2xl w-full mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-5">
          <h1 className="text-[22px] font-bold text-[#111827] tracking-tight">
            Pay & Transfer
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Search Circle Button */}
            <button
              type="button"
              onClick={() => onNavigate('transaction_history')}
              className="w-11 h-11 rounded-full bg-[#ECEEEF] flex items-center justify-center text-[#1F2937] hover:bg-[#E2E5E8] active:scale-95 transition"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.2 16.2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Notification Bell Circle Button with red 21 badge */}
            <button
              type="button"
              onClick={() => onNavigate('transaction_history')}
              className="relative w-11 h-11 rounded-full bg-[#ECEEEF] flex items-center justify-center text-[#1F2937] hover:bg-[#E2E5E8] active:scale-95 transition"
              aria-label="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-1.5 right-1 bg-[#D92027] text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full leading-tight">
                21
              </span>
            </button>

            {/* Profile Avatar Button */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="w-11 h-11 rounded-full bg-[#ECEEEF] flex items-center justify-center overflow-hidden hover:opacity-90 active:scale-95 transition"
              aria-label="Profile"
            >
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#E5E7EB" />
                <circle cx="18" cy="13.5" r="6" fill="#BDBFC2" />
                <path d="M7 32c2.2-5.5 6.2-8 11-8s8.8 2.5 11 8" fill="#BDBFC2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Top Circular Beneficiary Avatars (AT & GA) */}
        <div className="flex items-start gap-5 px-4 mb-6">
          {quickBeneficiaries.map((item) => (
            <button
              key={item.initials}
              type="button"
              onClick={() => onSelectBeneficiaryAndTransfer(item.beneficiary)}
              className="flex flex-col items-center group"
            >
              <div
                className={`w-[72px] h-[72px] rounded-full ${item.bgClass} text-white flex items-center justify-center text-[22px] font-bold tracking-tight mb-2 group-active:scale-95 transition`}
              >
                {item.initials}
              </div>
              <span className="text-[13px] font-medium text-[#111827]">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Action List Rows */}
        <div className="px-4 divide-y divide-[#F3F4F6]">
          {/* 1. Send Money */}
          <button
            type="button"
            onClick={onOpenTransferModal}
            className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50/70 active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                  <rect x="1" y="3" width="32" height="18" rx="2" fill="#84CC16" />
                  <rect x="15" y="3" width="18" height="18" rx="1" fill="#4ADE80" />
                  <text x="12" y="16" fill="#14532D" fontSize="11" fontWeight="bold">₦</text>
                </svg>
              </div>
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  Send Money
                </div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">
                  Transfer to wallet, self and other banks.
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 2. Foreign Transfer */}
          <button
            type="button"
            onClick={() => setShowForeignModal(true)}
            className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50/70 active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  <path d="M8 14 C12 8, 22 8, 26 13" stroke="#22C55E" strokeWidth="2.8" strokeLinecap="round" />
                  <path d="M25 9 L28 14 L22 15" fill="#22C55E" />
                  <path d="M28 22 C24 28, 14 28, 10 23" stroke="#06B6D4" strokeWidth="2.8" strokeLinecap="round" />
                  <path d="M11 27 L8 22 L14 21" fill="#06B6D4" />
                  <circle cx="18" cy="18" r="6.5" fill="#F59E0B" />
                  <text x="15.5" y="21.5" fill="white" fontSize="9.5" fontWeight="bold">$</text>
                </svg>
              </div>
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  Foreign Transfer
                </div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">
                  Send USD, EUR and other currencies.
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 3. Bill Payment */}
          <button
            type="button"
            onClick={() => onNavigate('bill_payment')}
            className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50/70 active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <rect x="13" y="8" width="14" height="24" rx="1" fill="#F5D0FE" />
                  <rect x="11" y="8" width="18" height="3.2" rx="1" fill="#C084FC" />
                  <line x1="16" y1="15" x2="24" y2="15" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="16" y1="19" x2="24" y2="19" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="16" y1="23" x2="21" y2="23" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  Bill Payment
                </div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">
                  Electricity, Internet and other bills.
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 4. Airtime & Data Purchase */}
          <button
            type="button"
            onClick={() => onNavigate('airtime_data')}
            className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50/70 active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <rect x="11" y="7" width="15" height="26" rx="2.5" fill="#DBEAFE" stroke="#9CA3AF" strokeWidth="1.8" />
                  <line x1="14" y1="13" x2="21" y2="13" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="14" y1="17" x2="19" y2="17" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
                  <rect x="20" y="21" width="11" height="6.5" rx="1" fill="#3B82F6" />
                  <text x="21.5" y="26" fill="white" fontSize="5" fontWeight="bold">GB</text>
                </svg>
              </div>
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  Airtime & Data Purchase
                </div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">
                  MTN, Glo, Airtel, 9Mobile and others.
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 5. Beneficiaries */}
          <button
            type="button"
            onClick={() => setShowBeneficiariesModal(true)}
            className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50/70 active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg width="34" height="28" viewBox="0 0 36 28" fill="none">
                  <circle cx="10" cy="11" r="3.5" fill="#7DD3FC" />
                  <path d="M4 22c1-3.5 3-5 6-5s5 1.5 6 5" fill="#7DD3FC" />
                  <circle cx="26" cy="11" r="3.5" fill="#0284C7" />
                  <path d="M20 22c1-3.5 3-5 6-5s5 1.5 6 5" fill="#0284C7" />
                  <circle cx="18" cy="9" r="4.2" fill="#38BDF8" />
                  <path d="M10.5 23c1.5-4.5 4-6.5 7.5-6.5s6 2 7.5 6.5" fill="#38BDF8" />
                </svg>
              </div>
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  Beneficiaries
                </div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">
                  Create and manage beneficiaries.
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 6. Scheduled Transaction History */}
          <button
            type="button"
            onClick={() => setShowScheduledModal(true)}
            className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50/70 active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                  <rect x="5" y="7" width="22" height="20" rx="2.5" fill="#E0F2FE" />
                  <rect x="5" y="7" width="22" height="5.5" rx="1.5" fill="#EF4444" />
                  <circle cx="11" cy="16" r="1.2" fill="#3B82F6" />
                  <circle cx="16" cy="16" r="1.2" fill="#3B82F6" />
                  <circle cx="21" cy="16" r="1.2" fill="#3B82F6" />
                  <circle cx="11" cy="20" r="1.2" fill="#3B82F6" />
                  <circle cx="16" cy="20" r="1.2" fill="#3B82F6" />
                  <circle cx="24" cy="24" r="6" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.6" />
                  <path d="M24 21v3.2l2 1.2" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  Scheduled Transaction History
                </div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">
                  Review pending scheduled transfers
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 7. Transaction History */}
          <button
            type="button"
            onClick={() => onNavigate('transaction_history')}
            className="w-full py-5 flex items-center justify-between text-left hover:bg-gray-50/70 active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                  <path d="M8 14 C12 9, 22 9, 26 14" stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
                  <path d="M8 10 L8 15 L13 15" fill="#64748B" />
                  <circle cx="18" cy="20" r="6" fill="#FEF08A" />
                </svg>
              </div>
              <div>
                <div className="text-[15.5px] font-semibold text-[#111827]">
                  Transaction History
                </div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">
                  View all incoming and outgoing transactions
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Floating Blue Chat Bubble Button matching bottom-right of Pay & Transfer screenshot */}
        <div className="fixed bottom-20 right-5 z-20">
          <button
            type="button"
            onClick={() => onNavigate('transaction_history')}
            className="w-12 h-12 rounded-full bg-[#12A8D3] text-white flex items-center justify-center shadow-lg hover:bg-[#0E94BA] active:scale-95 transition"
            aria-label="Support chat"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.5 3 2 6.6 2 11c0 2.1 1 4.1 2.7 5.5-.2 1.3-.9 2.7-1.7 3.5 1.8 0 3.6-.6 4.9-1.5 1.3.4 2.7.5 4.1.5 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Tab Bar (Pay & Transf... Active in Red) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#F3F4F6] bg-white py-2 px-2 shrink-0">
        <div className="max-w-2xl mx-auto grid grid-cols-5 items-center">
          {/* Home */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center justify-center py-1 text-[#1F2937] hover:text-[#D92027] transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3L3 10v10a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10l-9-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-medium mt-1">Home</span>
          </button>

          {/* Pay & Transfer (Active Red) */}
          <button
            type="button"
            onClick={() => onNavigate('pay_and_transfer')}
            className="flex flex-col items-center justify-center py-1 text-[#D92027]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M17 8H3l4-4M7 16h14l-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-medium mt-1 truncate max-w-[76px]">
              Pay & Transf...
            </span>
          </button>

          {/* Products */}
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="flex flex-col items-center justify-center py-1 text-[#1F2937] hover:text-[#D92027] transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18M9 14h6" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-medium mt-1">Products</span>
          </button>

          {/* Cards */}
          <button
            type="button"
            onClick={() => onNavigate('cards')}
            className="flex flex-col items-center justify-center py-1 text-[#1F2937] hover:text-[#D92027] transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="8" cy="15" r="1" fill="currentColor" />
              <circle cx="11" cy="15" r="1" fill="currentColor" />
            </svg>
            <span className="text-[11px] font-medium mt-1">Cards</span>
          </button>

          {/* Menu */}
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="flex flex-col items-center justify-center py-1 text-[#1F2937] hover:text-[#D92027] transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="6" r="1.8" />
              <circle cx="12" cy="6" r="1.8" />
              <circle cx="18" cy="6" r="1.8" />
              <circle cx="6" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="18" cy="12" r="1.8" />
              <circle cx="6" cy="18" r="1.8" />
              <circle cx="12" cy="18" r="1.8" />
              <circle cx="18" cy="18" r="1.8" />
            </svg>
            <span className="text-[11px] font-medium mt-1">Menu</span>
          </button>
        </div>
      </div>

      {/* Beneficiaries Drawer */}
      {showBeneficiariesModal && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowBeneficiariesModal(false)} />
          <div className="bg-white rounded-t-[26px] p-6 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#111827]">Saved Beneficiaries</h3>
              <button
                type="button"
                onClick={() => setShowBeneficiariesModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
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
                    setShowBeneficiariesModal(false);
                    onSelectBeneficiaryAndTransfer(ben);
                  }}
                  className="w-full py-3.5 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-[#111827]">{ben.name}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5 tabular-nums">
                      {ben.accountNumber} · {ben.bankName}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#D92027]">Send →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Foreign Transfer Drawer */}
      {showForeignModal && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowForeignModal(false)} />
          <div className="bg-white rounded-t-[26px] p-6 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#111827]">Foreign Currency Transfer</h3>
              <button
                type="button"
                onClick={() => setShowForeignModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">
              Send USD, GBP, or EUR internationally. Please link or open a Sterling Domiciliary account to initiate SWIFT transfers.
            </p>
            <button
              type="button"
              onClick={() => setShowForeignModal(false)}
              className="w-full py-3 rounded-xl bg-[#1F2E4D] text-white text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Transactions Drawer */}
      {showScheduledModal && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowScheduledModal(false)} />
          <div className="bg-white rounded-t-[26px] p-6 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#111827]">Scheduled Transaction History</h3>
              <button
                type="button"
                onClick={() => setShowScheduledModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">
              You have no pending scheduled transfers. Switch to "Schedule" on the Transfer to Other Banks page to set up a recurring payment.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowScheduledModal(false);
                onNavigate('transfer_other_banks');
              }}
              className="w-full py-3 rounded-xl bg-[#4F8D9E] text-white text-sm font-semibold"
            >
              Schedule a Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
