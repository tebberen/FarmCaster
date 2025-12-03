import React from 'react';
import { NETWORKS } from '@/constants';

// Manual Chain ID Map
const CHAIN_IDS: Record<string, number> = {
  base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999
};

export default function FarmGrid({ statsMap, onNetworkSelect }: any) {
  const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
  const today = new Date().getDate();
  const monthName = new Date().toLocaleString('default', { month: 'long' }).toUpperCase();

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-extrabold text-green-700 flex items-center gap-2">
          🌱 My Farm
        </h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {monthName}
        </span>
      </div>

      <div className="soil-container overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Days Header */}
          <div className="grid grid-cols-[120px_repeat(31,1fr)] gap-1 mb-2">
            <div className="text-[10px] font-bold text-[#a1887f] pl-2 self-end">NETWORKS</div>
            {days.map((day) => (
              <div key={day} className={`text-center text-[9px] font-bold ${day === today ? 'text-yellow-400' : 'text-[#a1887f]'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Rows */}
          {NETWORKS.map((network) => {
            const chainId = CHAIN_IDS[network.id];
            const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

            // HISTORY LOGIC: Backtrace from Last Action
            const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
            const lastActionDay = lastActionDate?.getDate() || -999;
            const currentMonth = new Date().getMonth();
            const lastActionMonth = lastActionDate?.getMonth();

            return (
              <div key={network.id} className="grid grid-cols-[120px_repeat(31,1fr)] gap-1 items-center mb-2">
                {/* Network Pill */}
                <button
                  onClick={() => onNetworkSelect(network.id)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 transition-colors border border-white/10"
                >
                  <span>{network.icon ? <network.icon size={12}/> : '•'}</span>
                  <span className="truncate">{network.name}</span>
                </button>

                {/* Soil Holes */}
                {days.map((day) => {
                  // Only show streak if it falls within the streak range AND it's the current month (or close enough logic)
                  const isStreak =
                    (lastActionMonth === currentMonth) &&
                    day <= lastActionDay &&
                    day > (lastActionDay - stats.streak);

                  return (
                    <div key={day} className="soil-hole aspect-square flex items-center justify-center text-sm">
                      {isStreak ? (
                        <span className="filter drop-shadow-md animate-in zoom-in">
                          {network.cropEmoji || '🌱'}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
