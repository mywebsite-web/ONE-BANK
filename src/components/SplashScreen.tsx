import React from 'react';
import { OneBankLogo } from './StatusBar';

interface SplashScreenProps {
  onEnterApp: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnterApp }) => {
  return (
    <div
      onClick={onEnterApp}
      className="relative w-full min-h-screen bg-[#FCFCFC] flex flex-col justify-between items-center overflow-hidden cursor-pointer select-none"
      title="Tap anywhere to continue to OneBank Home"
    >
      {/* Subtle African geometric watermark background matching the exact screenshot */}
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.045]"
        viewBox="0 0 400 850"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top wave squiggles */}
        <path
          d="M140 10 C120 25, 165 40, 135 58 C110 72, 165 88, 135 105 C110 120, 165 135, 138 155"
          stroke="#111827"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M235 10 C215 25, 260 40, 230 58 C205 72, 260 88, 230 105 C205 120, 260 135, 233 155"
          stroke="#111827"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Top right sun rays & bars */}
        <line x1="330" y1="60" x2="390" y2="25" stroke="#111827" strokeWidth="20" strokeLinecap="round" />
        <line x1="340" y1="100" x2="405" y2="95" stroke="#111827" strokeWidth="20" strokeLinecap="round" />
        <line x1="330" y1="145" x2="395" y2="165" stroke="#111827" strokeWidth="20" strokeLinecap="round" />

        {/* Center spiral diamond motif */}
        <path
          d="M115 280 L235 210 L310 330 L185 405 L135 320 L215 270 L248 325 L195 355"
          stroke="#111827"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right ladder motif */}
        <line x1="315" y1="230" x2="410" y2="230" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
        <line x1="315" y1="295" x2="410" y2="295" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
        <line x1="315" y1="360" x2="410" y2="360" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
        <line x1="315" y1="425" x2="410" y2="425" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
        <circle cx="355" cy="262" r="11" fill="#111827" />
        <circle cx="355" cy="328" r="11" fill="#111827" />
        <circle cx="355" cy="392" r="11" fill="#111827" />

        {/* Scattered organic ovals & dots */}
        <circle cx="115" cy="210" r="24" fill="#111827" />
        <circle cx="288" cy="238" r="12" fill="#111827" />
        <ellipse cx="45" cy="285" rx="60" ry="20" transform="rotate(35 45 285)" fill="#111827" />
        <ellipse cx="40" cy="400" rx="55" ry="18" transform="rotate(-30 40 400)" fill="#111827" />
        <ellipse cx="170" cy="510" rx="75" ry="20" fill="#111827" />
        <ellipse cx="275" cy="485" rx="18" ry="52" fill="#111827" />
        <ellipse cx="335" cy="540" rx="18" ry="55" transform="rotate(15 335 540)" fill="#111827" />
        <ellipse cx="90" cy="595" rx="60" ry="20" transform="rotate(28 90 595)" fill="#111827" />
        <ellipse cx="195" cy="670" rx="95" ry="20" fill="#111827" />

        {/* Bottom dots & geometric shapes */}
        <circle cx="135" cy="735" r="22" fill="#111827" />
        <circle cx="215" cy="725" r="17" fill="#111827" />
        <circle cx="178" cy="785" r="18" fill="#111827" />
        <circle cx="255" cy="780" r="20" fill="#111827" />
        <path
          d="M-10 660 L75 705 L45 815 L-25 790"
          stroke="#111827"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="h-12" />

      {/* Center OneBank By Sterling Lockup */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto pb-6">
        <OneBankLogo size="lg" showBySterling />
      </div>

      {/* Footer CBN & NDIC Licensing Notice */}
      <div className="relative z-10 pb-5 px-4 flex items-center justify-center gap-1.5 text-[12.5px] text-[#71717A]">
        {/* CBN Coat of Arms Emblem */}
        <span className="inline-flex items-center justify-center w-4 h-4">
          <svg width="14" height="16" viewBox="0 0 24 28" fill="none">
            <path d="M12 2L4 6V14C4 20 12 25 12 25C12 25 20 20 20 14V6L12 2Z" fill="#15803D" />
            <path d="M8 12H16M12 8V18" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="12" cy="5" r="2" fill="#DC2626" />
          </svg>
        </span>
        <span>
          Licensed by the <strong className="font-bold text-[#52525B]">CBN</strong> and insured by the
        </span>
        <span className="inline-flex items-center border-l-2 border-[#1E3A8A] pl-1 font-extrabold text-[10px] tracking-tighter text-[#1E3A8A] bg-[#EFF6FF] px-1 py-0.5 rounded-xs">
          NDIC
        </span>
      </div>
    </div>
  );
};
