import React, { useState } from 'react';
import { StatusBar, OneBankLogo } from './StatusBar';
import { TransactionRecord } from '../data/bankData';

interface PaymentReceiptProps {
  transaction: TransactionRecord;
  onClose: () => void;
  onDone: () => void;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  transaction,
  onClose,
  onDone,
}) => {
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const formattedAmount = `₦${transaction.amount.toFixed(2)}`;

  const triggerActionFeedback = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 2600);
  };

  const handleDownloadReceipt = () => {
    const receiptText = [
      'ONEBANK BY STERLING - PAYMENT RECEIPT',
      `Date: ${transaction.dateFormatted} ${transaction.timeFormatted}`,
      'Status: Transfer Request initiated',
      `Transaction Amount: ${formattedAmount}`,
      `Sender Name: ${transaction.senderName}`,
      `Recipient Name: ${transaction.recipientName}`,
      `Recipient Account: ${transaction.recipientAccount}`,
      `Recipient Bank: ${transaction.recipientBank}`,
      `Reference: ${transaction.reference}`,
      `Narration: ${transaction.narration || '-'}`,
    ].join('\n');

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OneBank-Receipt-${transaction.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    triggerActionFeedback('Receipt downloaded to device');
  };

  const handleShareReceipt = async () => {
    const shareText = `OneBank Payment Receipt: ${formattedAmount} to ${transaction.recipientName} (${transaction.recipientBank} - ${transaction.recipientAccount}). Ref: ${transaction.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OneBank Payment Receipt',
          text: shareText,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
    triggerActionFeedback('Receipt details copied for sharing');
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between">
        {/* Status Bar */}
        <StatusBar time="12:19" showSecurityBadge />

      {/* Top Right Circular Close Button */}
      <div className="flex justify-end px-4 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] transition"
          aria-label="Close receipt"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main Scrollable Receipt Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-3">
        {/* Header: OneBank Logo + Payment Receipt Date */}
        <div className="flex items-start justify-between mb-4">
          <OneBankLogo size="sm" showSubtitle />

          <div className="text-right pt-1">
            <div className="text-[13px] font-semibold text-[#111827]">
              Payment Receipt
            </div>
            <div className="text-[10.5px] text-[#6B7280] mt-0.5 tabular-nums">
              {transaction.dateFormatted}{' '}
              <strong className="font-semibold text-[#111827] ml-0.5">
                {transaction.timeFormatted}
              </strong>
            </div>
          </div>
        </div>

        {/* Amber Status Banner: Transfer Request initiated */}
        <div className="mx-auto w-[84%] rounded-full bg-[#F7E3AF] py-2 px-4 flex items-center justify-center gap-2 mb-3">
          <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[12.5px] font-bold text-[#111827]">
            Transfer Request initiated
          </span>
        </div>

        {/* Center Transaction Amount */}
        <div className="text-center mb-4">
          <div className="text-[23px] font-extrabold text-[#111827] tracking-tight tabular-nums">
            {formattedAmount}
          </div>
          <div className="text-[12px] font-medium text-[#6B7280]">
            Transaction Amount
          </div>
        </div>

        {/* Receipt Key-Value Table Rows */}
        <div className="divide-y divide-[#F3F4F6] text-[12.5px] mb-3">
          <div className="flex items-center justify-between py-2.5">
            <span className="font-semibold text-[#374151]">Sender Name</span>
            <span className="font-semibold text-[#111827] uppercase text-right">
              {transaction.senderName}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="font-semibold text-[#374151]">Recipient Name</span>
            <span className="font-semibold text-[#111827] uppercase text-right">
              {transaction.recipientName}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="font-semibold text-[#374151]">Recipient Account</span>
            <span className="font-semibold text-[#111827] tabular-nums text-right">
              {transaction.recipientAccount}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="font-semibold text-[#374151]">Recipient Bank</span>
            <span className="font-semibold text-[#111827] uppercase text-right">
              {transaction.recipientBank}
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="font-semibold text-[#374151]">Reference</span>
            <span className="font-semibold text-[#111827] tabular-nums text-right text-[12px]">
              {transaction.reference}
            </span>
          </div>

          <div className="py-2.5">
            <div className="font-semibold text-[#374151]">Narration</div>
            {transaction.narration && (
              <div className="text-[#111827] font-medium mt-0.5">
                {transaction.narration}
              </div>
            )}
          </div>
        </div>

        {/* Promo Banner: NO MONEY NO PROBLEM */}
        <div className="relative w-full h-[98px] rounded-[8px] bg-gradient-to-r from-[#F3F4F6] via-[#F9FAFB] to-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-between px-4 mb-3">
          {/* Left Tilted Phone Mockup Illustration */}
          <div className="relative w-28 h-full flex items-end justify-center pt-2">
            <div className="w-20 h-24 bg-white rounded-t-xl border-[2.5px] border-[#111827] shadow-md transform -rotate-12 translate-y-2 p-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[6px] font-extrabold text-[#D92027]">OneBank</span>
                <div className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                </div>
              </div>
              <div className="w-full h-7 rounded-[3px] bg-[#1F2E4D] p-1 text-[5px] text-white font-bold">
                ₦0.40
              </div>
              <div className="w-full h-7 rounded-[3px] bg-[#1B6C63] p-1 text-[5px] text-white font-bold">
                Always On
              </div>
            </div>
          </div>

          {/* Right Headline Copy */}
          <div className="flex-1 pl-3">
            <div className="text-[16px] font-black italic tracking-tight leading-tight text-[#374151]">
              NO MONEY
            </div>
            <div className="text-[16px] font-black italic tracking-tight leading-tight text-[#374151] mb-1">
              NO <span className="text-[#EF4444]">PROBLEM</span>
            </div>
            <p className="text-[8.5px] font-medium text-[#6B7280] leading-tight">
              Access Always On Overdraft and Get up to
              <br />
              <strong className="text-[#374151]">NGN 1,000,000.00</strong>
            </p>
          </div>
        </div>

        {/* QR Code + Disclaimer Row */}
        <div className="flex items-stretch gap-3 mb-3">
          {/* Left High-Detail SVG QR Code */}
          <div className="flex flex-col items-center justify-between shrink-0">
            <div className="w-[84px] h-[84px] bg-white p-1 border border-[#E5E7EB]">
              <svg viewBox="0 0 29 29" className="w-full h-full" shapeRendering="crispEdges">
                {/* Finder Pattern Top-Left */}
                <path
                  fill="#111827"
                  d="M0,0 h7 v7 h-7 z M1,1 v5 h5 v-5 z M2,2 h3 v3 h-3 z
                     M22,0 h7 v7 h-7 z M23,1 v5 h5 v-5 z M24,2 h3 v3 h-3 z
                     M0,22 h7 v7 h-7 z M1,23 v5 h5 v-5 z M2,24 h3 v3 h-3 z
                     M8,0 h2 v1 h-2 z M11,0 h1 v3 h-1 z M14,0 h2 v2 h-2 z M18,0 h2 v1 h-2 z
                     M9,2 h2 v2 h-2 z M13,3 h3 v1 h-3 z M17,2 h3 v2 h-3 z M20,4 h1 v2 h-1 z
                     M8,5 h1 v2 h-1 z M10,6 h2 v1 h-2 z M14,5 h2 v3 h-2 z M18,6 h2 v2 h-2 z
                     M0,8 h3 v1 h-3 z M4,8 h2 v2 h-2 z M8,8 h2 v2 h-2 z M12,8 h1 v2 h-1 z M16,9 h2 v1 h-2 z M21,8 h2 v2 h-2 z M25,8 h3 v1 h-3 z
                     M1,10 h2 v2 h-2 z M6,11 h2 v1 h-2 z M10,11 h3 v2 h-3 z M15,11 h2 v2 h-2 z M19,10 h2 v3 h-2 z M23,11 h2 v1 h-2 z M27,10 h2 v2 h-2 z
                     M0,13 h2 v2 h-2 z M4,13 h3 v1 h-3 z M8,14 h2 v2 h-2 z M12,14 h3 v1 h-3 z M17,14 h1 v3 h-1 z M20,14 h3 v1 h-3 z M25,13 h2 v3 h-2 z
                     M2,16 h2 v2 h-2 z M6,16 h1 v3 h-1 z M11,16 h2 v2 h-2 z M14,17 h2 v2 h-2 z M19,16 h2 v2 h-2 z M22,17 h2 v2 h-2 z M27,17 h2 v2 h-2 z
                     M0,19 h3 v2 h-3 z M4,20 h2 v1 h-2 z M8,19 h3 v2 h-3 z M13,20 h1 v2 h-1 z M16,20 h3 v1 h-3 z M20,20 h5 v5 h-5 z M21,21 v3 h3 v-3 z M22,22 h1 v1 h-1 z
                     M8,22 h2 v2 h-2 z M11,23 h2 v1 h-2 z M15,22 h2 v2 h-2 z M18,23 h1 v2 h-1 z M26,21 h2 v2 h-2 z
                     M9,25 h1 v3 h-1 z M12,25 h3 v1 h-3 z M16,26 h2 v2 h-2 z M21,26 h2 v2 h-2 z M25,25 h3 v2 h-3 z
                     M8,28 h2 v1 h-2 z M13,27 h2 v2 h-2 z M19,27 h2 v2 h-2 z M24,28 h2 v1 h-2 z M28,27 h1 v2 h-1 z"
                />
              </svg>
            </div>
            <span className="text-[9.5px] font-medium text-[#6B7280] mt-1">
              Scan to download
            </span>
          </div>

          {/* Right Disclaimer Box */}
          <div className="flex-1 rounded-[6px] bg-[#ECEEEF] p-2.5">
            <div className="text-[11px] font-bold text-[#111827] mb-1">
              Disclaimer
            </div>
            <p className="text-[8.3px] text-[#4B5563] leading-[1.35]">
              Your transfer has been processed successfully and will be delivered.
              However, there may be interruptions or delays from third party services.
              Sterling Bank is therefore not liable for any failures not within our
              control. All transactions are also subject to verification and fraud
              checks. Please call 0201 888 8822 for more information.
            </p>
          </div>
        </div>

        {/* Colorful Geometric Pattern Strip */}
        <div className="w-full h-3 overflow-hidden mb-1">
          <svg viewBox="0 0 360 12" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,4 8,0 10,8" fill="#F59E0B" />
            <polygon points="22,0 32,0 40,12 28,12" fill="#DC2626" />
            <polygon points="48,2 56,12 44,12" fill="#EA580C" />
            <polygon points="62,0 74,0 66,12 58,12" fill="#DC2626" />
            <polygon points="82,0 92,0 84,12 74,12" fill="#EA580C" />
            <polygon points="94,8 110,0 112,12 94,12" fill="#F59E0B" />
            <polygon points="126,0 144,0 144,6 132,12 126,12" fill="#F59E0B" />
            <polygon points="145,0 156,0 146,12 138,12" fill="#DC2626" />
            <path d="M158,0 H172 V4 H164 V8 H172 V12 H158 Z" fill="#0F766E" />
            <polygon points="216,6 226,0 232,12 216,12" fill="#EA580C" />
            <polygon points="262,2 276,0 278,10 264,12" fill="#F59E0B" />
            <polygon points="298,0 315,0 332,12 312,12" fill="#0F766E" />
            <polygon points="344,0 360,0 356,12 348,12" fill="#DC2626" />
          </svg>
        </div>
      </div>

      {/* Feedback Toast if Download/Share clicked */}
      {feedbackToast && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-[#111827] text-white text-xs font-medium text-center">
          {feedbackToast}
        </div>
      )}

      {/* Bottom Action Bar: Download + Share + Done */}
      <div className="px-4 pb-2 pt-2 space-y-2.5 bg-white shrink-0">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="py-3 rounded-[10px] border border-[#D1D5DB] bg-white hover:bg-gray-50 text-[#111827] text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={handleShareReceipt}
            className="py-3 rounded-[10px] border border-[#D1D5DB] bg-white hover:bg-gray-50 text-[#111827] text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>
        </div>

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
