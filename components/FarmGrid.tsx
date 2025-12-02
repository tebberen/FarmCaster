'use client';

import React, { useMemo } from 'react';
import { NETWORKS } from '@/constants';
import { Sprout } from 'lucide-react';

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
  onSelect,
  onNetworkSelect,
  activeNetworkId
}: FarmGridProps) => {

  // 1. Dynamic Date Logic
  const { currentMonthName, days, todayIndex, currentYear } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const date = now.getDate(); // 1-indexed

    const daysCount = new Date(year, month + 1, 0).getDate();
    const daysArr = Array.from({ length: daysCount }, (_, i) => i + 1);

    return {
      currentMonthName: MONTH_NAMES[month],
      currentYear: year,
      daysInMonth: daysCount,
      days: daysArr,
      todayIndex: date - 1 // 0-indexed index for today
    };
  }, []);

  // 2. Visualization Logic (Backtrace Streak)
  const getCellStatus = (networkId: string, dayIndex: number) => {
    if (dayIndex > todayIndex) return -1; // Future

    const chainId = NETWORK_CHAIN_IDS[networkId];
    const stats = statsMap[chainId];
    if (!stats) return 0; // No data loaded yet or invalid chain

    const { streak, lastAction } = stats;

    if (streak === 0 || lastAction === 0) return 0;

    const now = new Date();
    const lastActionDate = new Date(lastAction * 1000);

    // If last action not in current month/year, don't show (simple calendar view logic)
    if (lastActionDate.getMonth() !== now.getMonth() || lastActionDate.getFullYear() !== now.getFullYear()) {
      return 0;
    }

    const lastActionDayIndex = lastActionDate.getDate() - 1;

    // Streak range: [lastActionDay - streak + 1, lastActionDay]
    const startDayIndex = lastActionDayIndex - streak + 1;
    const endDayIndex = lastActionDayIndex;

    if (dayIndex >= startDayIndex && dayIndex <= endDayIndex) {
      return 1; // Planted
    }

    return 0; // Empty
  };

  return (
    <div className="w-full bg-[#1c1c1c] rounded-xl border border-[#333] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#333] p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
           <div className="bg-[#2a2a2a] p-2 rounded-lg border border-[#444]">
             <span className="text-xl">📅</span>
           </div>
           <div>
              <h2 className="text-white font-bold tracking-widest text-lg flex items-baseline gap-2">
                {currentMonthName} <span className="text-[#666] text-sm font-normal">{currentYear}</span>
              </h2>
              <p className="text-[#666] text-xs uppercase font-bold tracking-widest">Farm Schedule</p>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-[#555]">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1e1e1e] border border-white/5 rounded-sm"></div>
              <span>FALLOW</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1a1a1a] border border-[#333] rounded-sm flex items-center justify-center text-[8px]">🌱</div>
              <span>PLANTED</span>
           </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto custom-scrollbar bg-[#0f0f0f]">
        <div className="min-w-[1000px] p-6">

          {/* Calendar Header Row (Days) */}
          <div className="flex mb-4">
             <div className="w-36 shrink-0 mr-4"></div>
             <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
                {days.map((day) => (
                  <div key={day} className={`text-center flex flex-col items-center gap-1 group`}>
                    <span className={`text-[10px] font-bold font-mono ${day - 1 === todayIndex ? 'text-green-500' : 'text-[#444] group-hover:text-gray-400'}`}>
                      {day}
                    </span>
                    {day - 1 === todayIndex && (
                       <div className="w-1 h-1 rounded-full bg-green-500"></div>
                    )}
                  </div>
                ))}
             </div>
          </div>

          {/* Network Rows */}
          <div className="space-y-4">
            {NETWORKS.map((network) => {
               const isActive = activeNetworkId === network.id;

               return (
              <div key={network.id} className={`flex items-stretch group relative ${isActive ? 'bg-white/5 rounded-xl -mx-2 px-2 py-2 border border-white/5' : 'py-2'}`}>

                {/* Network Label */}
                <div className="w-36 shrink-0 mr-4 flex items-center">
                   <button
                     onClick={() => onNetworkSelect && onNetworkSelect(network.id)}
                     className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                        ${isActive
                           ? `bg-[#1a1a1a] ${network.borderColor} shadow-lg ${network.shadowColor ? network.shadowColor + '/20' : ''}`
                           : 'bg-[#111] border-[#222] hover:border-[#444] hover:bg-[#161616] text-gray-500 grayscale hover:grayscale-0'
                        }
                     `}
                   >
                     <div className={`p-2 rounded-lg ${isActive ? network.color : 'bg-[#222]'} text-white transition-colors`}>
                        <network.icon size={16} />
                     </div>
                     <div className="text-left">
                        <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-[#666]'}`}>
                          {network.name}
                        </div>
                        <div className="text-[10px] text-[#444] font-mono mt-0.5">
                          {network.weather}
                        </div>
                     </div>
                   </button>
                </div>

                {/* The Soil Grid */}
                <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1.5 items-center">
                  {days.map((day, index) => {
                    const status = getCellStatus(network.id, index);
                    const isFuture = status === -1;
                    const isFilled = status === 1;
                    const isToday = index === todayIndex;

                    // Updated Styling per request
                    // Empty Cell: bg-[#1e1e1e] border-white/5
                    let cellClasses = "relative w-full aspect-square rounded-[4px] border transition-all duration-300 flex items-center justify-center";

                    if (isFuture) {
                      cellClasses += " bg-[#0a0a0a] border-[#1a1a1a] opacity-50 cursor-not-allowed";
                    } else if (isFilled) {
                      // Planted
                      cellClasses += ` bg-[#1a1a1a] ${network.borderColor} border-opacity-50 shadow-[0_0_10px_-2px_rgba(0,0,0,0.5)] z-10 transform hover:scale-110`;
                    } else {
                      // Empty / Fallow Soil
                      cellClasses += " bg-[#1e1e1e] border-white/5 hover:border-white/10 group/cell";
                    }

                    if (isToday && !isFuture) {
                       cellClasses += " ring-1 ring-white/20";
                    }

                    return (
                      <div
                        key={day}
                        className={cellClasses}
                        onClick={() => {
                           if (!isFuture && onSelect) {
                              onSelect({ networkId: network.id, dayIndex: index });
                           }
                        }}
                      >
                        {isFilled && (
                           <div className="text-sm md:text-base animate-in zoom-in duration-300 filter drop-shadow-md cursor-default select-none">
                              {network.cropEmoji}
                           </div>
                        )}

                        {!isFilled && !isFuture && (
                           <div className="opacity-0 group-hover/cell:opacity-100 text-[8px] text-[#333] transition-opacity select-none">
                              <Sprout size={8} />
                           </div>
                        )}

                        {/* Today Marker if empty */}
                        {isToday && !isFilled && (
                           <div className="absolute inset-0 bg-white/5 pointer-events-none animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmGrid;
