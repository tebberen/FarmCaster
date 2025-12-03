import React from 'react';
import { NETWORKS } from '@/constants';

// Network ID to Chain ID
const CHAIN_IDS: Record<string, number> = {
  base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999
};

// Default Crops (Since we aren't fetching logs for specific seeds, use the Network Default)
const NETWORK_CROPS: Record<string, string> = {
  base: '🫐', bsc: '🌽', eth: '🍄', arb: '🍇', celo: '🥑', monad: '🍆', hyperevm: '⚡'
};

export default function FarmGrid({ statsMap, onNetworkSelect }: any) {
  // Calendar Logic
  const date = new Date();
  const currentMonthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
  const currentMonth = date.getMonth(); // 0-indexed (Dec is 11)
  const currentMonthName = date.toLocaleString('default', { month: 'long' });
  const today = date.getDate();

  return (
    <div className="wood-panel p-6 w-full mb-8 relative">
      {/* ... Keep the Header & Decoration HTML from previous "Game Style" version ... */}
      <div className="flex items-center justify-between mb-6 bg-[#3e2723]/30 p-2 rounded-xl border border-[#5d3a1a]/50">
        <h3 className="text-xl font-black text-[#ffecb3] tracking-widest drop-shadow-md uppercase">
          🚜 My Farm
        </h3>
        <div className="bg-[#fff8e1] text-[#3e2723] px-3 py-1 rounded-lg text-xs font-bold border-2 border-[#8b5a2b] uppercase">
          {currentMonthName} SEASON
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-[140px_repeat(31,1fr)] gap-1 mb-2">
            <div className="text-xs font-bold text-[#ffecb3]/60 pl-2 self-end uppercase">Plot</div>
            {days.map((day) => (
              <div key={day} className={`text-center text-[10px] font-bold ${day === today ? 'text-yellow-300 scale-125' : 'text-[#ffecb3]/60'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Rows */}
          {NETWORKS.map((network) => {
            const chainId = CHAIN_IDS[network.id];
            const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

            // Logic: Calculate date range
            const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
            const lastActionDay = lastActionDate?.getDate() || -999;
            const lastActionMonth = lastActionDate?.getMonth();

            return (
              <div key={network.id} className="grid grid-cols-[140px_repeat(31,1fr)] gap-1 items-center mb-2">
                {/* Network Sign */}
                <div
                  onClick={() => onNetworkSelect && onNetworkSelect(network.id)}
                  className="wood-btn px-2 py-1.5 cursor-pointer flex items-center gap-2 text-xs font-bold mr-2 hover:brightness-110"
                >
                  <span className="text-lg bg-black/20 rounded p-0.5">{network.icon ? <network.icon size={14}/> : '🌱'}</span>
                  <span className="uppercase truncate flex-1 text-left">{network.name}</span>
                </div>

                {/* Soil Pits */}
                {days.map((day) => {
                  // MATH MAGIC:
                  // 1. Must be same month
                  // 2. Day must be less than or equal to the last harvest day
                  // 3. Day must be greater than (Last Harvest - Streak Length)
                  // Example: Last: 5th, Streak: 3. -> Show 5, 4, 3.
                  const isStreak =
                    lastActionMonth === currentMonth &&
                    day <= lastActionDay &&
                    day > (lastActionDay - stats.streak);

                  return (
                    <div key={day} className="soil-pit aspect-square flex items-center justify-center text-sm relative group">
                      {isStreak ? (
                        <span className="filter drop-shadow-lg z-10 animate-in zoom-in duration-300">
                          {/* Use Network Default Crop */}
                          {NETWORK_CROPS[network.id] || '🌱'}
                        </span>
                      ) : (
                        <div className="w-1 h-1 bg-black/30 rounded-full opacity-30"></div>
                      )}
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
