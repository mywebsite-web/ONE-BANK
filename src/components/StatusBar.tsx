import React from 'react';

interface StatusBarProps {
  time?: string;
  showSecurityBadge?: boolean;
  darkOverlay?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = () => {
  return null;
};

interface OneBankLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showBySterling?: boolean;
}

export const OneBankLogo: React.FC<OneBankLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  showBySterling = false,
}) => {
  const textSizes = {
    sm: 'text-[24px]',
    md: 'text-[30px]',
    lg: 'text-[42px]',
  };

  return (
    <div className="inline-flex flex-col select-none">
      <div className={`${textSizes[size]} leading-none tracking-[-0.03em] flex items-baseline`}>
        <span className="font-extrabold text-[#D92027]">One</span>
        <span className="font-normal text-[#808285]">Bank</span>
      </div>
      {showSubtitle && (
        <span className="text-[11px] font-medium text-[#1F2937] mt-1 tracking-tight">
          A Product of Sterling Bank
        </span>
      )}
      {showBySterling && (
        <div className="flex items-center gap-2 mt-2 pl-0.5">
          <span className="text-[15px] font-medium text-[#58595B]">By</span>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-[#D92027] relative flex items-center justify-center shadow-xs">
              <div className="w-2 h-2 rounded-full bg-white absolute top-1.5 right-1.5" />
            </div>
            <span className="text-[16px] font-bold text-[#58595B] tracking-tight">
              Sterling
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
