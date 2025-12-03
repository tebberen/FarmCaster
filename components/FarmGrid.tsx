import React from 'react';
import { NETWORKS } from '@/constants';

// Manual Chain ID Map
const CHAIN_IDS: Record<string, number> = {
  base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999
};

// Crop Emojis
const CROPS: Record<string, string> = {
  base: '🫐', bsc: '🌽', eth: '🍄', arb: '🍇', celo: '🥑', monad: '🍆', hyperevm: '⚡'
};

export default function FarmGrid({ statsMap, onNetworkSelect }: any) {
  const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();

  return (
    <div className="wood-fence p-6 w-full mb-8 mt-4">
      {/* Wooden Header Sign */}
      <div className="flex justify-center -mt-10 mb-6">
        <div className="bg-[#5d4037] px-8 py-2 rounded-lg border-4 border-[#3e2723] shadow-lg transform rotate-1">
          <h3 className="text-2xl font-black text-[#fff8e1] tracking-widest uppercase drop-shadow-md">
            🚜 My Farm
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[800px]">
          {/* Day Numbers */}
          <div className="grid grid-cols-[140px_repeat(31,1fr)] gap-1 mb-2">
            <div className="text-xs font-bold text-[#8d6e63] pl-2 self-end uppercase">Plots</div>
            {days.map((day) => (
              <div key={day} className={`text-center text-[10px] font-bold ${day === today ? 'text-yellow-400 scale-125' : 'text-[#8d6e63]'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Farm Rows */}
          {NETWORKS.map((network) => {
            const chainId = CHAIN_IDS[network.id];
            // Safe fallback for stats
            const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

            // HISTORY LOGIC: Backtrace from Last Action
            const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
            const lastActionDay = lastActionDate?.getDate() || -999;
            const lastActionMonth = lastActionDate?.getMonth();

            return (
              <div key={network.id} className="grid grid-cols-[140px_repeat(31,1fr)] gap-1 items-center mb-3">

                {/* Network Sign (Button) */}
                <button
                  onClick={() => onNetworkSelect(network.id)}
                  className="wood-btn px-2 py-1.5 flex items-center gap-2 text-xs font-bold mr-2 hover:brightness-110 w-full"
                >
                  <span className="text-lg bg-black/20 rounded p-0.5 shadow-inner">
                    {network.icon ? <network.icon size={14}/> : '🌱'}
                  </span>
                  <span className="uppercase truncate flex-1 text-left">{network.name}</span>
                </button>

                {/* Soil Pits (The Field) */}
                {days.map((day) => {
                  // THE MAGIC FORMULA:
                  // Show crop IF: (Same Month) AND (Day <= Last Harvest) AND (Day > Last Harvest - Streak)
                  const isStreak =
                    lastActionMonth === currentMonth &&
                    day <= lastActionDay &&
                    day > (lastActionDay - stats.streak);

                  return (
                    <div key={day} className="soil-pit aspect-square flex items-center justify-center text-lg relative">
                      {isStreak ? (
                        <span className="filter drop-shadow-md animate-in zoom-in duration-300">
                          {CROPS[network.id] || '🌱'}
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
