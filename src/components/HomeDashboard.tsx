import React, { useState } from 'react';
import { StatusBar, OneBankLogo } from './StatusBar';
import { AppScreen, INITIAL_ACCOUNT, formatNaira } from '../data/bankData';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeDashboardProps {
  balance: number;
  showTransferModal: boolean;
  onOpenTransferModal: () => void;
  onCloseTransferModal: () => void;
  onSelectTransferOption: (option: string) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  balance,
  showTransferModal,
  onOpenTransferModal,
  onCloseTransferModal,
  onSelectTransferOption,
  onNavigate,
}) => {
  const [hideBalance, setHideBalance] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Status Bar */}
      <StatusBar time={showTransferModal ? '12:17' : '12:16'} />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 max-w-2xl w-full mx-auto">
        {/* Top App Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-4">
          <button
            type="button"
            onClick={() => onNavigate('splash')}
            className="text-left focus:outline-none active:opacity-80 transition"
            title="OneBank by Sterling"
          >
            <OneBankLogo size="md" />
          </button>

          <div className="flex items-center gap-2.5">
            {/* In-App PWA Install Button */}
            <PWAInstallButton compact />

            {/* Search Circle Button */}
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="w-11 h-11 rounded-full bg-[#ECEEEF] flex items-center justify-center text-[#1F2937] hover:bg-[#E2E5E8] active:scale-95 transition"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L16.2 16.2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Notification Bell Circle Button with red 20 badge */}
            <button
              type="button"
              onClick={() => setShowNotificationsModal(true)}
              className="relative w-11 h-11 rounded-full bg-[#ECEEEF] flex items-center justify-center text-[#1F2937] hover:bg-[#E2E5E8] active:scale-95 transition"
              aria-label="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-1.5 right-1 bg-[#D92027] text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full leading-tight">
                20
              </span>
            </button>

            {/* Profile Circle Button */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="w-11 h-11 rounded-full bg-[#ECEEEF] flex items-center justify-center text-[#1F2937] hover:bg-[#E2E5E8] active:scale-95 transition"
              aria-label="Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Account Filter Pill & See All */}
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="p-1.5 rounded-full bg-[#ECEEEF]">
            <button
              type="button"
              onClick={() => setShowAccountsModal(true)}
              className="px-4 py-1.5 rounded-full bg-[#4F8D9E] text-white text-[13.5px] font-medium tracking-tight"
            >
              Naira Account
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('transaction_history')}
            className="text-[#D92027] text-[14px] font-medium hover:underline"
          >
            See All
          </button>
        </div>

        {/* Primary Navy Account Balance Card */}
        <div className="px-4 mb-6">
          <div className="relative w-full rounded-[16px] bg-[#1F2E4D] text-white p-5 overflow-hidden shadow-sm">
            {/* Light blue abstract knot artwork on the right side matching screenshot */}
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
                  onClick={() => setShowAccountsModal(true)}
                  className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white/90 hover:bg-white/25 transition"
                  aria-label="Switch account"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-1.5 bg-white text-[#111827] px-3.5 py-2 rounded-full text-[13px] font-semibold shadow-xs hover:bg-gray-100 active:scale-95 transition"
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
                className="w-9 h-9 rounded-full bg-white text-[#1F2937] flex items-center justify-center shadow-xs hover:bg-gray-100 active:scale-95 transition"
                aria-label="Toggle balance visibility"
              >
                {hideBalance ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mb-6">
          <h2 className="px-4 text-[16px] font-semibold text-[#6B7280] mb-3.5">
            Quick Links
          </h2>

          <div className="flex items-start gap-4 px-4 overflow-x-auto no-scrollbar">
            {/* 1. Send Money */}
            <button
              type="button"
              onClick={onOpenTransferModal}
              className="flex flex-col items-center shrink-0 w-[72px] group"
            >
              <div className="w-[62px] h-[62px] rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center mb-2 shadow-2xs group-active:scale-95 transition">
                {/* Circular arrows around green banknote */}
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M10 15 A12 12 0 0 1 30 14"
                    stroke="#F59E0B"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path d="M28 10 L31 15 L26 16" fill="#F59E0B" />
                  <path
                    d="M30 25 A12 12 0 0 1 10 26"
                    stroke="#EF4444"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path d="M12 30 L9 25 L14 24" fill="#EF4444" />
                  <rect x="12" y="16" width="16" height="9" rx="1.5" fill="#10B981" />
                  <circle cx="20" cy="20.5" r="2" fill="#A7F3D0" />
                </svg>
              </div>
              <span className="text-[12.5px] font-medium text-[#1F2937] leading-tight text-center">
                Send<br />Money
              </span>
            </button>

            {/* 2. Airtime & Data */}
            <button
              type="button"
              onClick={() => onNavigate('airtime_data')}
              className="flex flex-col items-center shrink-0 w-[72px] group"
            >
              <div className="w-[62px] h-[62px] rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center mb-2 shadow-2xs group-active:scale-95 transition">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <rect x="12" y="8" width="14" height="24" rx="2.5" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.8" />
                  <line x1="15" y1="13" x2="22" y2="13" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="15" y1="17" x2="20" y2="17" stroke="#60A5FA" strokeWidth="1.6" strokeLinecap="round" />
                  <rect x="20" y="20" width="10" height="6" rx="1" fill="#3B82F6" />
                  <text x="21.5" y="24.5" fill="white" fontSize="4.8" fontWeight="bold">GB</text>
                </svg>
              </div>
              <span className="text-[12.5px] font-medium text-[#1F2937] leading-tight text-center">
                Airtime &<br />Data
              </span>
            </button>

            {/* 3. Bill Payment */}
            <button
              type="button"
              onClick={() => onNavigate('bill_payment')}
              className="flex flex-col items-center shrink-0 w-[72px] group"
            >
              <div className="w-[62px] h-[62px] rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center mb-2 shadow-2xs group-active:scale-95 transition">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <rect x="13" y="9" width="14" height="22" rx="1" fill="#F5D0FE" />
                  <rect x="12" y="9" width="16" height="3" rx="1" fill="#C084FC" />
                  <line x1="16" y1="16" x2="24" y2="16" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="16" y1="20" x2="24" y2="20" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="16" y1="24" x2="21" y2="24" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[12.5px] font-medium text-[#1F2937] leading-tight text-center">
                Bill<br />Payment
              </span>
            </button>

            {/* 4. Dangote Refinery Offer */}
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="flex flex-col items-center shrink-0 w-[76px] group"
            >
              <div className="w-[62px] h-[62px] rounded-full border border-[#E5E7EB] bg-white flex flex-col items-center justify-center mb-2 shadow-2xs group-active:scale-95 transition">
                <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
                  <path d="M12 2L8 8H16L12 2Z" fill="#1E3A8A" />
                  <circle cx="12" cy="8" r="3" fill="#DC2626" />
                </svg>
                <span className="text-[7px] font-extrabold tracking-tight text-[#1E3A8A] mt-0.5">
                  DANGOTE
                </span>
              </div>
              <span className="text-[12.5px] font-medium text-[#1F2937] leading-tight text-center">
                Dangote<br />Refinery<br />Offer
              </span>
            </button>

            {/* 5. Partially visible 5th quick link on right edge */}
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="flex flex-col items-center shrink-0 w-[64px] group opacity-90"
            >
              <div className="w-[62px] h-[62px] rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center mb-2 shadow-2xs">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F8D9E" strokeWidth="1.8">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[12.5px] font-medium text-[#1F2937] leading-tight text-center">
                AlwaysOn
              </span>
            </button>
          </div>
        </div>

        {/* Special Offers Carousel Section */}
        <div>
          <h2 className="px-4 text-[16px] font-semibold text-[#6B7280] mb-3">
            Special Offers
          </h2>

          <div className="flex items-stretch gap-3 px-2 overflow-x-auto no-scrollbar">
            {/* Left edge peek card */}
            <div className="w-3 shrink-0 rounded-r-xl bg-[#E5EBF0] overflow-hidden flex flex-col justify-between py-4 items-end pr-0.5">
              <span className="text-[11px] font-bold text-[#1E3A8A]">Sp</span>
              <div className="w-2.5 h-16 bg-[#7C93B6] rounded-t-sm" />
            </div>

            {/* Main Teal Card: Always On Overdraft */}
            <div className="relative flex-1 min-w-[310px] rounded-[16px] bg-gradient-to-br from-[#1B6C63] via-[#175E57] to-[#114B46] text-white p-5 overflow-hidden shadow-xs">
              <div className="relative z-10 max-w-[185px]">
                <h3 className="text-[23px] font-extrabold leading-[1.15] tracking-tight mb-1.5">
                  Always On<br />Overdraft
                </h3>
                <p className="text-[12px] text-white/85 mb-4">
                  Low on cash? Not a problem
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="bg-[#D92027] hover:bg-[#B91C1C] text-white text-[12px] font-semibold px-4 py-2 rounded-full shadow-xs active:scale-95 transition"
                >
                  Get Overdraft
                </button>
              </div>

              {/* 3D Hand holding Naira notes illustration on right */}
              <div className="absolute right-3 bottom-3 w-32 h-32 pointer-events-none flex items-center justify-center">
                <svg width="130" height="125" viewBox="0 0 130 125" fill="none">
                  {/* Tilted green banknotes */}
                  <g transform="rotate(-14 68 52)">
                    <rect x="30" y="24" width="72" height="44" rx="5" fill="#4ADE80" />
                    <rect x="35" y="29" width="62" height="34" rx="3" fill="#86EFAC" />
                    <circle cx="66" cy="46" r="11" fill="#FBBF24" />
                    <text x="61" y="51" fill="white" fontSize="14" fontWeight="bold">₦</text>
                  </g>
                  {/* Soft 3D Stylized Hand */}
                  <rect x="18" y="88" width="16" height="18" rx="6" fill="#6366F1" />
                  <path
                    d="M32 90 C45 88, 68 92, 88 80 C95 75, 102 80, 96 89 C104 82, 111 88, 102 96 C92 106, 62 108, 32 104 Z"
                    fill="#FDA4AF"
                  />
                  <ellipse cx="86" cy="83" rx="6" ry="11" transform="rotate(20 86 83)" fill="#FECDD3" />
                  <ellipse cx="97" cy="85" rx="6" ry="12" transform="rotate(20 97 85)" fill="#FDA4AF" />
                  <ellipse cx="106" cy="89" rx="5.5" ry="10" transform="rotate(22 106 89)" fill="#FB7185" />
                </svg>
              </div>

              {/* Floating Blue Chat Bubble Button */}
              <button
                type="button"
                onClick={() => setShowNotificationsModal(true)}
                className="absolute right-3 bottom-2.5 w-11 h-11 rounded-full bg-[#12A8D3] text-white flex items-center justify-center shadow-md hover:bg-[#0E94BA] active:scale-95 transition"
                aria-label="Live support chat"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.5 3 2 6.6 2 11c0 2.1 1 4.1 2.7 5.5-.2 1.3-.9 2.7-1.7 3.5 1.8 0 3.6-.6 4.9-1.5 1.3.4 2.7.5 4.1.5 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
                </svg>
              </button>
            </div>

            {/* Right edge peek dark navy card */}
            <div className="w-3.5 shrink-0 rounded-l-xl bg-[#15233C]" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#F3F4F6] bg-white py-2 px-2 shrink-0">
        <div className="max-w-2xl mx-auto grid grid-cols-5 items-center">
          {/* Home (Active Red) */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center justify-center py-1 text-[#D92027]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L3 10v10a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10l-9-7z" />
            </svg>
            <span className="text-[11px] font-medium mt-1">Home</span>
          </button>

          {/* Pay & Transfer */}
          <button
            type="button"
            onClick={() => onNavigate('pay_and_transfer')}
            className="flex flex-col items-center justify-center py-1 text-[#1F2937] hover:text-[#D92027] transition"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 8H3l4-4M7 16h14l-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-medium mt-1 truncate max-w-[72px]">
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

      {/* Screenshot 3: Select transfer option Bottom Sheet Modal */}
      {showTransferModal && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={onCloseTransferModal} />
          <div className="bg-white rounded-t-[26px] pt-7 pb-3 px-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <h3 className="text-center text-[16.5px] font-semibold text-[#111827] mb-5">
              Select transfer option
            </h3>

            <div className="divide-y divide-[#F3F4F6]">
              {[
                'Transfer to Self',
                'Transfer to Sterling',
                'Transfer to Other Banks',
                'Transfer to Beneficiaries',
                'Transfer to Wallet',
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectTransferOption(option)}
                  className="w-full text-left py-5 text-[15px] font-semibold text-[#111827] hover:text-[#D92027] active:bg-gray-50 transition flex items-center justify-between"
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>

            {/* Bottom Home Indicator Pill inside modal */}
            <div className="w-32 h-1 bg-[#9CA3AF] rounded-full mx-auto mt-6" />
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowSearchModal(false)} />
          <div className="bg-white rounded-t-[24px] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#111827]">Quick Search</h3>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transfers, bills, airtime..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm mb-3 focus:outline-none focus:border-[#4F8D9E]"
            />
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setShowSearchModal(false);
                  onSelectTransferOption('Transfer to Other Banks');
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-[#111827]"
              >
                Transfer to Other Banks
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSearchModal(false);
                  onNavigate('airtime_data');
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-[#111827]"
              >
                Buy Airtime & Data
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSearchModal(false);
                  onNavigate('payment_receipt');
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-[#111827]"
              >
                View Latest Payment Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Sheet Modal */}
      {showAccountsModal && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowAccountsModal(false)} />
          <div className="bg-white rounded-t-[24px] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#111827]">Your Sterling Accounts</h3>
              <button
                type="button"
                onClick={() => setShowAccountsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#1F2E4D] text-white mb-4">
              <div className="text-xs text-white/75">{INITIAL_ACCOUNT.accountType}</div>
              <div className="text-lg font-bold mt-0.5">₦{formatNaira(balance)}</div>
              <div className="text-xs text-white/80 mt-1 tabular-nums">
                {INITIAL_ACCOUNT.accountNumber} · {INITIAL_ACCOUNT.accountName}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAccountsModal(false)}
              className="w-full py-3 rounded-xl bg-[#4F8D9E] text-white font-semibold text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Account Tier Sheet */}
      {showUpgradeModal && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowUpgradeModal(false)} />
          <div className="bg-white rounded-t-[24px] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold text-[#111827]">Upgrade Account Tier</h3>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Current Tier: <strong>Savings - Financial Inclusion-1</strong>. Upgrade to Tier 3 by providing proof of address to unlock unlimited daily transfers.
            </p>
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="w-full py-3 rounded-xl bg-[#1F2E4D] text-white font-semibold text-sm"
            >
              Continue Tier Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Notifications Sheet */}
      {showNotificationsModal && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setShowNotificationsModal(false)} />
          <div className="bg-white rounded-t-[24px] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#111827]">Notifications (20)</h3>
              <button
                type="button"
                onClick={() => setShowNotificationsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto text-xs">
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="font-semibold text-[#111827]">Zero-Deduction Transfers Active</div>
                <div className="text-gray-600 mt-0.5">
                  Enjoy charge-free interbank transfers on OneBank by Sterling.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="font-semibold text-[#111827]">Always On Overdraft</div>
                <div className="text-gray-600 mt-0.5">
                  Access up to NGN 1,000,000.00 instant overdraft facility today.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
