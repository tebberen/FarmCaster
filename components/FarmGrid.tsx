'use client';

import React, { useMemo } from 'react';
import { NETWORKS } from '@/constants';

interface FarmGridProps {
  statsMap: Record<number, { streak: number; lastAction: number }>;
  onSelect?: (cell: { networkId: string; dayIndex: number }) => void;
  onNetworkSelect?: (networkId: string) => void;
  activeNetworkId?: string;
}

const NETWORK_CHAIN_IDS: Record<string, number> = {
  base: 8453,
  bsc: 56,
  arb: 42161,
  celo: 42220,
  eth: 1,
  monad: 143,
  hyperevm: 999
};

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const FarmGrid = ({
  statsMap,
  onNetworkSelect,
  activeNetworkId
}: FarmGridProps) => {

  const { currentMonthName, currentYear, days } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const daysArr = Array.from({ length: daysCount }, (_, i) => i + 1);

    return {
      currentMonthName: MONTH_NAMES[month],
      currentYear: year,
      days: daysArr,
    };
  }, []);

  const isDayInStreak = (networkId: string, day: number) => {
    const chainId = NETWORK_CHAIN_IDS[networkId];
    const stats = statsMap?.[chainId];
    if (!stats || stats.streak === 0 || stats.lastAction === 0) return false;

    const now = new Date();
    const lastActionDate = new Date(stats.lastAction * 1000);

    if (lastActionDate.getMonth() !== now.getMonth() || lastActionDate.getFullYear() !== now.getFullYear()) {
       return false;
    }

    const lastActionDay = lastActionDate.getDate();
    return day <= lastActionDay && day > (lastActionDay - stats.streak);
  };

  return (
    <div className="bg-[#050505] border border-[#222] rounded-3xl p-6 w-full mb-8 shadow-2xl relative overflow-hidden">
      {/* Texture Overlay (Optional, simple gradient for depth) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-20"></div>

      {/* Header */}
      <div className="relative flex justify-between items-center mb-8 pb-4 border-b border-[#222]">
        <div>
          <h3 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-md">
            {currentMonthName} <span className="text-[#444]">{currentYear}</span>
          </h3>
          <p className="text-[10px] text-[#666] font-mono tracking-[0.2em] mt-1">TACTICAL FARM SCHEDULE</p>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-[10px] uppercase font-bold text-[#555] font-mono bg-[#0f0f0f] px-4 py-2 rounded-full border border-[#222]">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#111] border border-[#333] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] rounded-sm"></div>
            Fallow
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500 rounded-sm shadow-[0_0_5px_rgba(34,197,94,0.4)]"></div>
            Planted
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-3 z-10">
        {/* Days Header Row */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-32 md:w-48 shrink-0"></div>
          <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
            {days.map(day => (
              <div key={day} className="text-center text-[8px] text-[#444] font-mono">{day}</div>
            ))}
          </div>
        </div>

        {/* Network Rows */}
        {NETWORKS.map((network) => {
          const chainId = NETWORK_CHAIN_IDS[network.id] || 0;
          const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };
          const isActiveRow = activeNetworkId === network.id;

          return (
            <div key={network.id} className={`flex items-stretch gap-3 p-1 rounded-2xl transition-all duration-300 ${isActiveRow ? 'bg-[#111] border border-[#222]' : 'border border-transparent'}`}>

              {/* Sidebar Button */}
              <button
                onClick={() => onNetworkSelect && onNetworkSelect(network.id)}
                className={`
                  w-32 md:w-48 shrink-0 flex items-center gap-3 p-3 rounded-xl border transition-all text-left relative overflow-hidden group
                  ${isActiveRow
                    ? `${network.borderColor} bg-[#0a0a0a] shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)]`
                    : 'border-[#222] bg-[#0a0a0a] opacity-60 hover:opacity-100 hover:border-[#444]'
                  }
                `}
              >
                {/* Active Indicator Strip */}
                {isActiveRow && <div className={`absolute left-0 top-0 bottom-0 w-1 ${network.color}`}></div>}

                <div className={`
                  relative z-10 p-2 rounded-lg transition-transform duration-300 group-hover:scale-110
                  ${isActiveRow ? 'bg-[#1a1a1a] text-white' : 'bg-[#111] text-[#444]'}
                `}>
                  {network.icon ? <network.icon size={18}/> : '🌱'}
                </div>

                <div className="flex flex-col relative z-10">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isActiveRow ? 'text-white' : 'text-[#666]'}`}>
                    {network.name}
                  </span>
                  <span className="text-[9px] text-[#444] font-mono mt-0.5">
                    {stats.streak > 0 ? `${stats.streak} DAY STREAK` : 'INACTIVE'}
                  </span>
                </div>
              </button>

              {/* Grid Cells */}
              <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1 p-1 bg-[#080808] rounded-xl border border-[#1a1a1a]">
                {days.map((day) => {
                  const isStreak = isDayInStreak(network.id, day);

                  return (
                    <div
                      key={day}
                      className={`
                        aspect-square rounded-[2px] flex items-center justify-center text-xs relative transition-all duration-300
                        ${isStreak
                           ? `bg-[#111] border ${network.borderColor} shadow-[0_0_10px_-2px_rgba(255,255,255,0.1)] z-10 scale-110`
                           : 'bg-[#0e0e0e] border border-[#1a1a1a] shadow-[inset_0_1px_2px_rgba(0,0,0,1)] opacity-80'
                        }
                      `}
                    >
                      {isStreak ? (
                        <span className="drop-shadow-md filter">{network.cropEmoji}</span>
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
  );
}

export default FarmGrid;
