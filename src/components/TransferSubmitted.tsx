import React from 'react';
import { StatusBar } from './StatusBar';

interface TransferSubmittedProps {
  amount: number;
  recipientName: string;
  confettiDensity?: 'full' | 'settled';
  onViewReceipt: () => void;
  onDone: () => void;
}

export const TransferSubmitted: React.FC<TransferSubmittedProps> = ({
  amount,
  recipientName,
  confettiDensity = 'full',
  onViewReceipt,
  onDone,
}) => {
  const formattedAmount = `₦${amount.toFixed(2)}`;

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between">
        {/* Status Bar with security shield icon */}
        <StatusBar time={confettiDensity === 'full' ? '12:19' : '12:18'} showSecurityBadge />

      {/* Top Header with Title & Close X */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="w-8" />
        <h1 className="text-[16.5px] font-semibold text-[#111827]">
          Transfer to Other Banks
        </h1>
        <button
          type="button"
          onClick={onDone}
          className="w-8 h-8 flex items-center justify-center text-[#111827] hover:bg-gray-100 rounded-full transition"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-5 pt-4">
        {/* Confetti + Teal Checkmark Graphic Area */}
        <div className="relative w-64 h-52 flex items-center justify-center mb-3">
          {confettiDensity === 'full' ? (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 240 200"
              fill="none"
            >
              {/* Authentic diamond & polygon confetti particles matching Screenshot 7 */}
              <polygon points="88,18 93,22 90,27 85,23" fill="#4F6BED" />
              <polygon points="145,28 150,33 146,39 141,34" fill="#F5B82E" />
              <polygon points="170,34 176,37 173,43 168,39" fill="#818CF8" />
              <polygon points="56,52 60,56 57,62 52,58" fill="#F4A2B8" />
              <polygon points="82,66 87,69 85,74 80,71" fill="#818CF8" />
              <polygon points="96,60 100,66 96,72 92,66" fill="#F5B82E" />
              <polygon points="154,62 162,64 160,70 151,68" fill="#E11D48" />
              <polygon points="184,74 189,77 187,82 182,78" fill="#FDE68A" />
              <polygon points="41,90 45,96 41,102 37,96" fill="#E11D48" />
              <polygon points="62,102 68,105 66,110 60,107" fill="#3B5998" />
              <polygon points="164,95 169,98 166,104 161,101" fill="#A5B4FC" />
              <polygon points="179,108 185,110 183,115 177,112" fill="#93C5FD" />
              <polygon points="64,122 69,127 65,133 60,127" fill="#6366F1" />
              <polygon points="89,135 95,137 93,142 87,139" fill="#E11D48" />
              <polygon points="145,130 149,134 146,139 142,135" fill="#C7D2FE" />
              <polygon points="170,145 174,149 171,154 167,150" fill="#F472B6" />
              <polygon points="48,150 53,154 50,159 45,155" fill="#F9A8D4" />
              <polygon points="65,163 70,168 66,174 61,168" fill="#F59E0B" />
              <polygon points="94,160 98,164 95,169 91,165" fill="#FDE047" />
              <polygon points="71,182 76,185 73,190 68,187" fill="#F59E0B" />
              <polygon points="103,182 107,187 104,192 100,187" fill="#FB7185" />
              <polygon points="118,187 122,191 119,196 115,192" fill="#818CF8" />
              <polygon points="135,179 140,183 137,188 132,184" fill="#FBBF24" />
            </svg>
          ) : (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 240 200"
              fill="none"
            >
              {/* Sparse settled confetti matching Screenshot 8 */}
              <polygon points="50,48 55,51 53,55 48,52" fill="#93A3E8" />
              <polygon points="78,43 83,48 80,54 75,49" fill="#F6C445" />
              <polygon points="62,92 67,95 64,100 59,97" fill="#E2E8F0" />
              <polygon points="74,158 79,161 76,166 71,163" fill="#F9D5DF" />
            </svg>
          )}

          {/* Central Teal Checkmark Circle */}
          <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-[#26B397] flex items-center justify-center shadow-xs">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Title & Subtitle Copy */}
        <h2 className="text-[16.5px] font-semibold text-[#111827] text-center mb-3">
          Transaction Submitted for processing
        </h2>

        <p className="text-[13.5px] font-medium text-[#1F2937] text-center leading-[1.42] mb-7 px-1">
          Your transfer of <span className="font-semibold">{formattedAmount}</span> to{' '}
          <span className="font-semibold uppercase">{recipientName}</span> is currently being
          processed - absolutely charge-free! Enjoy seamless banking with zero deductions.
        </p>

        {/* Sage Green Summary Card */}
        <div className="w-full rounded-[12px] bg-[#D0E3D8] py-6 px-4 flex flex-col items-center text-center">
          <div className="text-[22px] font-extrabold text-[#111827] tracking-tight tabular-nums">
            {formattedAmount}
          </div>
          <div className="text-[13px] font-medium text-[#526058] mt-0.5 mb-5">
            Amount Transferred
          </div>

          <div className="text-[14.5px] font-semibold text-[#111827] uppercase tracking-tight">
            {recipientName}
          </div>
          <div className="text-[13px] font-medium text-[#526058] mt-0.5">
            Recipient
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="px-4 pb-2 pt-4 space-y-3 bg-white shrink-0">
        <button
          type="button"
          onClick={onViewReceipt}
          className="w-full py-3.5 rounded-[10px] border border-[#D1D5DB] bg-white hover:bg-gray-50 text-[#111827] text-[14.5px] font-semibold active:scale-[0.99] transition"
        >
          View Receipt
        </button>

        <button
          type="button"
          onClick={onDone}
          className="w-full py-3.5 rounded-[10px] bg-[#648C6F] hover:bg-[#557A5F] text-white text-[14.5px] font-semibold active:scale-[0.99] transition"
        >
          Done
        </button>
      </div>
      </div>
    </div>
  );
};
