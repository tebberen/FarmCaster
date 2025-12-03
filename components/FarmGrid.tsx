import React from 'react';
import { NETWORKS } from '@/constants';

const CHAIN_IDS: Record<string, number> = { base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999 };
const CROPS: Record<string, string> = { base: '🫐', bsc: '🌽', eth: '🍄', arb: '🍇', celo: '🥑', monad: '🍆', hyperevm: '⚡' };

export default function FarmGrid({ statsMap, onNetworkSelect }: any) {
  const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
  const currentMonth = new Date().getMonth();

  return (
    <div className="bg-[#1a1614] border-4 border-[#3e3229] rounded-xl p-4 w-full mb-8 relative shadow-xl">
      {/* Header */}
      <div className="flex justify-center -mt-8 mb-6">
        <div className="bg-[#1a1614] px-6 py-2 rounded-lg border-2 border-[#3e3229] shadow-lg transform rotate-1">
          <h3 className="text-xl font-black text-[#e0d8c8] tracking-widest uppercase">My Farm</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {NETWORKS.map((network) => {
          const chainId = (network as any).chainId || CHAIN_IDS[network.id];
          const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

          // HISTORY LOGIC
          const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
          const lastActionDay = lastActionDate?.getDate() || -999;
          const lastActionMonth = lastActionDate?.getMonth();

          return (
            <div key={network.id} className="flex items-center w-full">
              {/* Left: Network Name - Perfectly aligned with grid */}
              <button
                onClick={() => onNetworkSelect(network.id)}
                style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
                className="w-32 shrink-0 flex items-center pl-2 font-bold text-gray-400 hover:text-white transition-colors text-xs h-8 !bg-transparent !border-0 appearance-none focus:outline-none focus:ring-0"
              >
                 {network.icon && <network.icon className="mr-2 w-4 h-4" />}
                 {network.name}
              </button>

              {/* Right: The Grid Cells */}
              <div className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-1 h-8">
                {days.map((day) => {
                  const isStreak = lastActionMonth === currentMonth && day <= lastActionDay && day > (lastActionDay - stats.streak);
                  return (
                    <div key={day} className="w-8 h-8 shrink-0 bg-[#2c241b] border border-[#3e3229] rounded-sm flex items-center justify-center text-sm">
                      {isStreak && <span className="filter drop-shadow-md animate-in zoom-in">{CROPS[network.id] || '🌱'}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
