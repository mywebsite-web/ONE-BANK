import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { INITIAL_ACCOUNT } from '../data/bankData';

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [activeDetailModal, setActiveDetailModal] = useState<
    'bvn' | 'nin' | 'display' | null
  >(null);

  const handleCopy = async (label: string, value: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value);
    }
    setCopiedMessage(`${label} (${value}) copied`);
    setTimeout(() => {
      setCopiedMessage(null);
    }, 2200);
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <StatusBar time="12:37" />

        {/* Header with Back Chevron & Title */}
        <div className="flex items-center px-4 pt-3 pb-4">
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
            Profile
          </h1>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-12">
          {/* Large Avatar Circle with Bottom Photo Overlay Band */}
          <div className="flex flex-col items-center mt-1 mb-7">
            <div className="relative w-[148px] h-[148px] rounded-full bg-gradient-to-b from-[#ECEEEF] to-[#DCDFE3] overflow-hidden flex flex-col items-center justify-center mb-4">
              {/* Silhouette head & shoulders */}
              <div className="w-[54px] h-[54px] rounded-full bg-[#B8BCC2] -mt-4" />
              <div className="w-[96px] h-[44px] rounded-t-full bg-[#B8BCC2] mt-2" />

              {/* Bottom dark grey overlay strip with gallery picture icon */}
              <div className="absolute bottom-0 inset-x-0 h-[38px] bg-[#636466] flex items-center justify-center">
                <svg width="20" height="17" viewBox="0 0 24 20" fill="none" stroke="white" strokeWidth="1.7">
                  <rect x="2" y="2" width="20" height="16" rx="1.5" />
                  <circle cx="16.5" cy="7" r="1.5" fill="white" />
                  <path d="M3 16l5.5-5.5 4.5 4.5 3.5-3 4.5 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h2 className="text-[19px] font-bold text-[#111827] tracking-tight uppercase">
              ABDULSALAM TIAMIYU
            </h2>
            <button
              type="button"
              onClick={() => handleCopy('Referral Code', 'ABDUT659')}
              className="text-[14px] font-medium text-[#58595B] mt-1 hover:text-[#111827] transition"
            >
              Ref Code: ABDUT659
            </button>
          </div>

          {/* Account Details Section Header */}
          <div className="text-[15.5px] font-semibold text-[#6B7280] mb-3">
            Account Details
          </div>

          <div className="divide-y divide-[#F3F4F6] mb-7">
            {/* 1. Bank Account Number */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Blue person avatar icon */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="9" r="5" fill="#29ABE2" />
                    <path d="M4 25c1.5-5 5-7.5 10-7.5s8.5 2.5 10 7.5" fill="#29ABE2" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#111827]">
                    Bank Account Number
                  </div>
                  <div className="text-[13px] text-[#6B7280] mt-0.5 tabular-nums">
                    {INITIAL_ACCOUNT.accountNumber}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy('Bank Account Number', INITIAL_ACCOUNT.accountNumber)}
                className="p-2 text-[#4A89B0] hover:bg-gray-50 rounded-lg active:scale-95 transition"
                aria-label="Copy Bank Account Number"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <rect x="5" y="7" width="11" height="13" rx="1.5" />
                  <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v11a1.5 1.5 0 0 1-1.5 1.5H16" />
                </svg>
              </button>
            </div>

            {/* 2. BVN */}
            <div className="py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveDetailModal('bvn')}
                className="flex items-center gap-4 text-left flex-1"
              >
                {/* Light blue shield with checkmark */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
                    <path d="M13 2L3 6.5V13.5C3 20 7.3 25.5 13 27C18.7 25.5 23 20 23 13.5V6.5L13 2Z" fill="#BAE6FD" />
                    <path d="M13 4.5L5.5 8V13.5C5.5 18.6 8.8 23 13 24.3C17.2 23 20.5 18.6 20.5 13.5V8L13 4.5Z" fill="#38BDF8" />
                    <path d="M9.5 14L12 16.5L17 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#111827]">
                    BVN
                  </div>
                  <div className="text-[13px] text-[#6B7280] mt-0.5">
                    View your details
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleCopy('BVN', '22481903745')}
                className="p-2 text-[#4A89B0] hover:bg-gray-50 rounded-lg active:scale-95 transition"
                aria-label="Copy BVN"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <rect x="5" y="7" width="11" height="13" rx="1.5" />
                  <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v11a1.5 1.5 0 0 1-1.5 1.5H16" />
                </svg>
              </button>
            </div>

            {/* 3. Bank Sort Code */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Bank building with green BANK roof */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="9" width="20" height="15" fill="#BAE6FD" />
                    <rect x="6" y="4" width="16" height="5" rx="1" fill="#ECFCCB" />
                    <text x="8" y="8" fill="#4ADE80" fontSize="4.5" fontWeight="bold">BANK</text>
                    <rect x="7" y="12" width="3" height="3" fill="#38BDF8" />
                    <rect x="12.5" y="12" width="3" height="3" fill="#38BDF8" />
                    <rect x="18" y="12" width="3" height="3" fill="#38BDF8" />
                    <rect x="11" y="18" width="6" height="6" fill="#0284C7" />
                    <rect x="2" y="24" width="24" height="2" fill="#84CC16" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#111827]">
                    Bank Sort Code
                  </div>
                  <div className="text-[13px] text-[#6B7280] mt-0.5 tabular-nums">
                    232
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy('Bank Sort Code', '232')}
                className="p-2 text-[#4A89B0] hover:bg-gray-50 rounded-lg active:scale-95 transition"
                aria-label="Copy Bank Sort Code"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <rect x="5" y="7" width="11" height="13" rx="1.5" />
                  <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v11a1.5 1.5 0 0 1-1.5 1.5H16" />
                </svg>
              </button>
            </div>

            {/* 4. NIN */}
            <div className="py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveDetailModal('nin')}
                className="flex items-center gap-4 text-left flex-1"
              >
                {/* Light blue shield with checkmark */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
                    <path d="M13 2L3 6.5V13.5C3 20 7.3 25.5 13 27C18.7 25.5 23 20 23 13.5V6.5L13 2Z" fill="#BAE6FD" />
                    <path d="M13 4.5L5.5 8V13.5C5.5 18.6 8.8 23 13 24.3C17.2 23 20.5 18.6 20.5 13.5V8L13 4.5Z" fill="#38BDF8" />
                    <path d="M9.5 14L12 16.5L17 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#111827]">
                    NIN
                  </div>
                  <div className="text-[13px] text-[#6B7280] mt-0.5">
                    View your details
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleCopy('NIN', '59102837461')}
                className="p-2 text-[#4A89B0] hover:bg-gray-50 rounded-lg active:scale-95 transition"
                aria-label="Copy NIN"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <rect x="5" y="7" width="11" height="13" rx="1.5" />
                  <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v11a1.5 1.5 0 0 1-1.5 1.5H16" />
                </svg>
              </button>
            </div>

            {/* 5. Display Preference */}
            <button
              type="button"
              onClick={() => setActiveDetailModal('display')}
              className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                {/* Dark green/slate crescent moon icon */}
                <div className="w-9 h-9 flex items-center justify-center shrink-0">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#364E48">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#111827]">
                    Display Preference
                  </div>
                  <div className="text-[13px] text-[#6B7280] mt-0.5">
                    Manage display preference
                  </div>
                </div>
              </div>

              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.2" className="mr-1">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Your Personal Information Section */}
          <div className="text-[15.5px] font-semibold text-[#6B7280] mb-3">
            Your Personal Information
          </div>
          <div className="divide-y divide-[#F3F4F6] text-sm">
            <div className="py-3 flex justify-between">
              <span className="text-[#6B7280]">Full Name</span>
              <span className="font-semibold text-[#111827]">ABDULSALAM TIAMIYU</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-[#6B7280]">Account Tier</span>
              <span className="font-semibold text-[#111827]">Tier 1 (Savings - Financial Inclusion)</span>
            </div>
          </div>
        </div>

        {/* Copy Feedback Toast */}
        {copiedMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#111827] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg">
            {copiedMessage}
          </div>
        )}
      </div>

      {/* BVN / NIN / Display Preference Modal */}
      {activeDetailModal && (
        <div className="fixed inset-0 z-30 flex flex-col justify-end bg-black/45">
          <div className="flex-1" onClick={() => setActiveDetailModal(null)} />
          <div className="bg-white rounded-t-[26px] p-6 max-w-2xl w-full mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#111827]">
                {activeDetailModal === 'bvn' && 'Bank Verification Number (BVN)'}
                {activeDetailModal === 'nin' && 'National Identification Number (NIN)'}
                {activeDetailModal === 'display' && 'Display Preference'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveDetailModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {activeDetailModal === 'bvn' && (
              <div className="space-y-2 text-sm mb-4">
                <div className="p-3.5 rounded-xl bg-gray-50 flex items-center justify-between">
                  <span className="text-[#6B7280]">Verified BVN</span>
                  <span className="font-bold text-[#111827] tabular-nums">22481903745</span>
                </div>
              </div>
            )}

            {activeDetailModal === 'nin' && (
              <div className="space-y-2 text-sm mb-4">
                <div className="p-3.5 rounded-xl bg-gray-50 flex items-center justify-between">
                  <span className="text-[#6B7280]">Verified NIN</span>
                  <span className="font-bold text-[#111827] tabular-nums">59102837461</span>
                </div>
              </div>
            )}

            {activeDetailModal === 'display' && (
              <div className="space-y-2 text-sm mb-4">
                <div className="p-3.5 rounded-xl border border-[#4F8D9E] bg-[#4F8D9E]/10 flex items-center justify-between font-semibold text-[#111827]">
                  <span>OneBank Light Mode (Default)</span>
                  <span className="text-[#4F8D9E]">✓</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveDetailModal(null)}
              className="w-full py-3 rounded-xl bg-[#1F2E4D] text-white text-sm font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
