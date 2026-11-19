import React, { useState } from 'react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="h-11 px-3.5 rounded-full bg-[#ECEEEF] hover:bg-[#E2E5E8] text-[#111827] text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition whitespace-nowrap shrink-0"
          title="Install OneBank Web App"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D92027" strokeWidth="2.2">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">Install App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full text-left px-4 py-3.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 flex items-center justify-between"
        >
          <span className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D92027" strokeWidth="2">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Install OneBank PWA to Home Screen</span>
          </span>
          <span className="text-xs font-bold text-[#D92027]">Install</span>
        </button>
      )}

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#111827]">
                Install OneBank App
              </h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>
            {isIOS ? (
              <p className="text-xs text-[#4B5563] leading-relaxed">
                1. Tap the <strong>Share</strong> icon in your Safari toolbar.<br />
                2. Scroll down and select <strong>Add to Home Screen</strong> to launch OneBank in full standalone mode.
              </p>
            ) : (
              <p className="text-xs text-[#4B5563] leading-relaxed">
                To install <strong>OneBank by Sterling</strong> as a standalone Progressive Web App, open this app in its own browser tab and click the <strong>Install OneBank</strong> icon in your browser address bar or select <strong>Add to Home Screen</strong> from the browser menu.
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full rounded-xl bg-[#1F2E4D] py-3 text-xs font-semibold text-white hover:bg-[#16223A] transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#1F2E4D] px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
      <span>Offline Mode — Cached OneBank data active</span>
    </div>
  );
};
