import React from 'react';
import { NETWORKS } from '@/constants';

const NETWORK_CHAIN_IDS: Record<string, number> = {
  base: 8453,
  bsc: 56,
  arb: 42161,
  celo: 42220,
  eth: 1,
  monad: 143,
  hyperevm: 999
};

export default function FarmGrid({ statsMap, onNetworkSelect }: any) {
  const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);

  return (
    <div className="wood-texture p-4 sm:p-6 w-full mb-8 relative">
      {/* The "Nails" in corners */}
      <div className="absolute top-2 left-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>
      <div className="absolute top-2 right-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>

      {/* Header Board */}
      <div className="bg-[#5d4037] rounded-lg p-2 mb-4 text-center border-2 border-[#3e2723] shadow-md transform -rotate-1 mx-auto max-w-xs">
        <h3 className="text-xl font-bold text-[#ffecb3] uppercase tracking-widest drop-shadow-md">
          Farm Schedule
        </h3>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px] bg-[#4e342e]/50 p-4 rounded-xl border-2 border-[#3e2723]/30">

          {/* Calendar Header */}
          <div className="flex mb-2">
             <div className="w-24 shrink-0"></div>
             <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
               {days.map(d => <div key={d} className="text-center text-[9px] font-bold text-[#ffecb3] opacity-60">{d}</div>)}
             </div>
          </div>

          {/* Rows */}
          {NETWORKS.map((network) => {
            const chainId = NETWORK_CHAIN_IDS[network.id] || 0;
            const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

            const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
            // Ensure we only highlight if last action was in current month/year to avoid stale streaks showing up weirdly
            // (Or follow snippet logic exactly. Snippet had: const lastActionDay = lastActionDate?.getDate() || -999;)
            // But let's check month match to be safe, although snippet didn't explicitly show it, it's safer.
            // Actually, if lastAction is old, lastActionDay will be some day.
            // If today is 5th, and lastAction was 5th of previous month, streak logic might show it?
            // `day <= lastActionDay`. Yes.
            // So we should verify month/year match.
            const now = new Date();
            const isCurrentMonth = lastActionDate && lastActionDate.getMonth() === now.getMonth() && lastActionDate.getFullYear() === now.getFullYear();

            const lastActionDay = isCurrentMonth ? (lastActionDate?.getDate() || -999) : -999;

            return (
              <div key={network.id} className="flex items-center mb-3">
                {/* Network Sign */}
                <button
                  onClick={() => onNetworkSelect && onNetworkSelect(network.id)}
                  className="w-24 shrink-0 game-btn px-2 py-1 text-xs font-bold mr-2 flex items-center justify-center gap-1 hover:brightness-110"
                >
                  <span>{network.icon ? <network.icon size={14}/> : '🌱'}</span>
                  {network.name}
                </button>

                {/* Soil Pits */}
                <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
                  {days.map((day) => {
                    // Logic from snippet: day <= lastActionDay && day > (lastActionDay - stats.streak)
                    const isStreak = day <= lastActionDay && day > (lastActionDay - stats.streak);
                    return (
                      <div key={day} className="soil-pit aspect-square flex items-center justify-center text-sm relative">
                        {isStreak ? (
                          <span className="filter drop-shadow-lg animate-in zoom-in">
                            {/* Emoji Logic */}
                            {network.cropEmoji || '🌱'}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
