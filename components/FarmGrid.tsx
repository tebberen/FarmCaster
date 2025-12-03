import React from 'react';
import { NETWORKS } from '@/constants';

const CHAIN_IDS: Record<string, number> = { base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999 };
const CROPS: Record<string, string> = { base: '🫐', bsc: '🌽', eth: '🍄', arb: '🍇', celo: '🥑', monad: '🍆', hyperevm: '⚡' };

export default function FarmGrid({ statsMap, onNetworkSelect }: any) {
  const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
  const currentMonth = new Date().getMonth();

  return (
    <div className="bg-[#1a1614] border border-[#3e3229] rounded-xl p-6 w-full mb-6">
      <h2 className="text-xl font-bold text-[#e8d5c4] mb-6 uppercase tracking-wider">My Farm</h2>

      <div className="flex flex-col gap-3">
        {NETWORKS.map((network) => {
          const chainId = (network as any).chainId || CHAIN_IDS[network.id];
          const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

          const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
          const lastActionDay = lastActionDate?.getDate() || -999;
          const lastActionMonth = lastActionDate?.getMonth();

          return (
            <div key={network.id} className="flex items-center w-full h-12 gap-4">
              {/* Network Name (Fixed Width) */}
              <button
                onClick={() => onNetworkSelect(network.id)}
                className="w-32 shrink-0 h-full flex items-center text-[#e8d5c4] hover:text-white transition-colors text-sm font-bold appearance-none bg-transparent border-none focus:outline-none p-0 cursor-pointer text-left"
              >
                 <div className="flex items-center gap-3">
                   {network.icon && <network.icon className="w-5 h-5 opacity-80" />}
                   <span>{network.name}</span>
                 </div>
              </button>

              {/* Scrollable Farm Slots */}
              <div className="flex-1 h-full flex items-center overflow-x-auto no-scrollbar gap-1">
                {days.map((day) => {
                  const isStreak = lastActionMonth === currentMonth && day <= lastActionDay && day > (lastActionDay - stats.streak);
                  return (
                    <div
                      key={day}
                      className="w-10 h-10 shrink-0 bg-[#0f0c0a] border border-[#3e3229] rounded flex items-center justify-center text-lg"
                    >
                      {isStreak ? (
                        <span className="animate-in zoom-in duration-300">{CROPS[network.id] || '🌱'}</span>
                      ) : (
                        <span className="opacity-10 text-[10px] text-[#3e3229]">{day}</span>
                      )}
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
