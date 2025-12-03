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

interface FarmGridProps {
    statsMap: any;
    onNetworkSelect?: (networkId: string) => void;
    activeNetworkId?: string;
    history?: Record<number, Record<number, number>>;
}

export default function FarmGrid({ statsMap, onNetworkSelect, history }: FarmGridProps) {
  // Dynamic Date Logic
  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();

  // Get days in current month
  const daysInMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="wood-texture p-4 sm:p-6 w-full mb-8 relative">
      {/* Nails */}
      <div className="absolute top-2 left-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>
      <div className="absolute top-2 right-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#3e2723] rounded-full shadow-inner opacity-80"></div>

      {/* Header Board */}
      <div className="bg-[#5d4037] rounded-lg p-2 mb-4 text-center border-2 border-[#3e2723] shadow-md transform -rotate-1 mx-auto max-w-xs">
        <h3 className="text-xl font-bold text-[#ffecb3] uppercase tracking-widest drop-shadow-md">
          {currentMonthName} {currentYear}
        </h3>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px] bg-[#4e342e]/50 p-4 rounded-xl border-2 border-[#3e2723]/30">

          {/* Calendar Header */}
          <div className="flex mb-2">
             <div className="w-24 shrink-0"></div>
             <div
               className="flex-1 grid gap-1"
               style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
             >
               {days.map(d => <div key={d} className="text-center text-[9px] font-bold text-[#ffecb3] opacity-60">{d}</div>)}
             </div>
          </div>

          {/* Rows */}
          {NETWORKS.map((network) => {
            const chainId = NETWORK_CHAIN_IDS[network.id] || 0;
            const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

            // Streak fallback logic
            const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
            const isCurrentMonth = lastActionDate && lastActionDate.getMonth() === now.getMonth() && lastActionDate.getFullYear() === now.getFullYear();
            const lastActionDay = isCurrentMonth ? (lastActionDate?.getDate() || -999) : -999;

            const chainHistory = history?.[chainId] || {};

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
                <div
                  className="flex-1 grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
                >
                  {days.map((day) => {
                    // 1. Check precise history
                    const plantedSeedId = chainHistory[day];
                    const hasHistory = plantedSeedId !== undefined;

                    // 2. Check streak (fallback)
                    // Logic: day <= lastActionDay && day > (lastActionDay - stats.streak)
                    const isStreak = day <= lastActionDay && day > (lastActionDay - stats.streak);

                    let content = null;
                    if (hasHistory) {
                        // Render exact crop
                        content = <span className="filter drop-shadow-lg animate-in zoom-in">{network.cropEmoji}</span>;
                    } else if (isStreak) {
                        // Render default seedling
                        content = <span className="filter drop-shadow-lg opacity-80">🌱</span>;
                    }

                    return (
                      <div key={day} className="soil-pit aspect-square flex items-center justify-center text-sm relative">
                        {content}
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
