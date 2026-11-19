import React, { useState } from 'react';
import { StatusBar, OneBankLogo } from './StatusBar';
import { AppScreen, INITIAL_ACCOUNT, TransactionRecord, formatNaira } from '../data/bankData';
import { PWAInstallButton } from './PWAInstallButton';

interface SecondaryScreensProps {
  screen: 'airtime_data' | 'bill_payment' | 'products' | 'cards' | 'menu';
  balance: number;
  transactions: TransactionRecord[];
  onBackHome: () => void;
  onNavigate: (screen: AppScreen) => void;
  onQuickBuySuccess: (amount: number, label: string) => void;
}

export const SecondaryScreens: React.FC<SecondaryScreensProps> = ({
  screen,
  balance,
  transactions,
  onBackHome,
  onNavigate,
  onQuickBuySuccess,
}) => {
  const [phone, setPhone] = useState('09042769211');
  const [network, setNetwork] = useState('MTN');
  const [topupAmount, setTopupAmount] = useState('10.00');
  const [billCategory, setBillCategory] = useState('Electricity (IKEDC)');
  const [meterNumber, setMeterNumber] = useState('45019283741');
  const [cardFrozen, setCardFrozen] = useState(false);

  const titles: Record<typeof screen, string> = {
    airtime_data: 'Airtime & Data',
    bill_payment: 'Bill Payment',
    products: 'Sterling Products & Offers',
    cards: 'OneBank Cards',
    menu: 'Account Menu',
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden select-none">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between">
        <StatusBar time="12:17" />

      {/* Top App Bar */}
      <div className="flex items-center px-4 pt-3 pb-4 border-b border-[#F3F4F6]">
        <button
          type="button"
          onClick={onBackHome}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-[#111827] hover:bg-gray-100 rounded-full transition"
          aria-label="Back to Home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[16.5px] font-semibold text-[#111827] pr-8">
          {titles[screen]}
        </h1>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
        {screen === 'airtime_data' && (
          <>
            <div className="p-4 rounded-xl bg-[#1F2E4D] text-white">
              <div className="text-xs text-white/75">Source Account</div>
              <div className="text-base font-bold mt-0.5">{INITIAL_ACCOUNT.shortAccountLabel}</div>
              <div className="text-xs text-white/85 mt-1 tabular-nums">
                Available Balance: ₦{formatNaira(balance)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-2">
                Select Network Provider
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['MTN', 'Airtel', 'Glo', '9mobile'].map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setNetwork(net)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                      network === net
                        ? 'border-[#4F8D9E] bg-[#4F8D9E] text-white'
                        : 'border-gray-200 bg-white text-[#111827]'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#111827] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Amount (NGN)
              </label>
              <input
                type="text"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm font-bold text-[#111827] tabular-nums"
              />
              <div className="flex gap-2 mt-2.5">
                {['100.00', '200.00', '500.00', '1000.00'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className="px-3 py-1.5 rounded-full bg-[#ECEEEF] text-xs font-semibold text-[#374151] tabular-nums"
                  >
                    ₦{amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onQuickBuySuccess(parseFloat(topupAmount) || 10, `${network} Airtime ${phone}`)
              }
              className="w-full py-3.5 rounded-xl bg-[#D92027] text-white font-semibold text-sm shadow-xs"
            >
              Purchase Airtime
            </button>
          </>
        )}

        {screen === 'bill_payment' && (
          <>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-2">
                Biller Category
              </label>
              <div className="space-y-2">
                {[
                  'Electricity (IKEDC)',
                  'Cable TV (DSTV / GOtv)',
                  'Internet Services (Spectranet)',
                  'LCC Lekki Toll Pass',
                ].map((biller) => (
                  <button
                    key={biller}
                    type="button"
                    onClick={() => setBillCategory(biller)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold flex items-center justify-between ${
                      billCategory === biller
                        ? 'border-[#4F8D9E] bg-[#4F8D9E]/10 text-[#111827]'
                        : 'border-gray-200 text-[#374151]'
                    }`}
                  >
                    <span>{biller}</span>
                    {billCategory === biller && <span className="text-[#4F8D9E]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                Customer / Meter / Smartcard Number
              </label>
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#111827] tabular-nums"
              />
            </div>

            <button
              type="button"
              onClick={() => onQuickBuySuccess(10.0, billCategory)}
              className="w-full py-3.5 rounded-xl bg-[#1F2E4D] text-white font-semibold text-sm"
            >
              Pay Bill Now
            </button>
          </>
        )}

        {screen === 'products' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-[#1B6C63] to-[#114B46] text-white p-5">
              <div className="text-xs uppercase tracking-wider text-white/75 font-semibold">
                Sterling Credit Facility
              </div>
              <h3 className="text-xl font-extrabold mt-1">Always On Overdraft</h3>
              <p className="text-xs text-white/85 mt-1.5 leading-relaxed">
                Access instant liquidity up to NGN 1,000,000.00 directly into your Naira Savings or Current account with flexible repayment.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('transfer_other_banks')}
                className="mt-4 bg-[#D92027] text-white text-xs font-bold px-4 py-2.5 rounded-full"
              >
                Activate Overdraft Facility
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5">
              <div className="text-xs font-bold text-[#1E3A8A]">DANGOTE REFINERY OFFER</div>
              <h3 className="text-base font-bold text-[#111827] mt-1">
                Investment & Partner Opportunities
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Participate in curated fixed-income and equity offerings powered by Sterling Investment Banking.
              </p>
              <button
                type="button"
                onClick={onBackHome}
                className="mt-3 text-xs font-bold text-[#D92027] hover:underline"
              >
                Explore Offer Details →
              </button>
            </div>
          </div>
        )}

        {screen === 'cards' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-[#1F2E4D] via-[#16223A] to-[#0F172A] text-white p-5 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <OneBankLogo size="sm" />
                <span className="text-xs font-semibold text-white/80">Verve Virtual</span>
              </div>
              <div className="text-lg font-bold tracking-[0.18em] tabular-nums mb-4">
                5061 •••• •••• 9608
              </div>
              <div className="flex items-center justify-between text-xs text-white/80">
                <div>
                  <div className="text-[10px] text-white/60">CARDHOLDER</div>
                  <div className="font-semibold text-white">ABDULSALAM TIAMIYU</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/60">STATUS</div>
                  <div className="font-semibold text-emerald-300">
                    {cardFrozen ? 'FROZEN' : 'ACTIVE'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCardFrozen(!cardFrozen)}
                className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-[#111827] hover:bg-gray-50"
              >
                {cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('payment_receipt')}
                className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-[#111827] hover:bg-gray-50"
              >
                View Latest Receipt
              </button>
            </div>
          </div>
        )}

        {screen === 'menu' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="text-sm font-bold text-[#111827]">{INITIAL_ACCOUNT.accountName}</div>
              <div className="text-xs text-[#6B7280] mt-0.5 tabular-nums">
                Account No: {INITIAL_ACCOUNT.accountNumber} · {INITIAL_ACCOUNT.accountType}
              </div>
            </div>

            <div className="divide-y divide-[#F3F4F6] border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <PWAInstallButton />
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="w-full text-left px-4 py-3.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 flex justify-between"
              >
                <span>Profile & Account Details</span>
                <span className="text-gray-400">›</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('pay_and_transfer')}
                className="w-full text-left px-4 py-3.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 flex justify-between"
              >
                <span>Pay & Transfer Hub</span>
                <span className="text-gray-400">›</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('transaction_history')}
                className="w-full text-left px-4 py-3.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 flex justify-between"
              >
                <span>Transaction History</span>
                <span className="text-gray-400">›</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('transfer_other_banks')}
                className="w-full text-left px-4 py-3.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 flex justify-between"
              >
                <span>Transfer to Other Banks</span>
                <span className="text-gray-400">›</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('payment_receipt')}
                className="w-full text-left px-4 py-3.5 text-sm font-semibold text-[#111827] hover:bg-gray-50 flex justify-between"
              >
                <span>Latest Payment Receipt ({transactions.length})</span>
                <span className="text-gray-400">›</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('splash')}
                className="w-full text-left px-4 py-3.5 text-sm font-semibold text-[#D92027] hover:bg-gray-50 flex justify-between"
              >
                <span>View Splash Screen</span>
                <span className="text-gray-400">›</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#F3F4F6] bg-white">
        <button
          type="button"
          onClick={onBackHome}
          className="w-full py-3 rounded-xl bg-[#ECEEEF] text-[#111827] text-sm font-semibold"
        >
          Back to Home Dashboard
        </button>
      </div>
      </div>
    </div>
  );
};
