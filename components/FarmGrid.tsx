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
  onNetworkSelect,
  activeNetworkId
}: FarmGridProps) => {

  const { currentMonthName, currentYear, days, todayIndex } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const daysCount = new Date(year, month + 1, 0).getDate();
    const daysArr = Array.from({ length: daysCount }, (_, i) => i + 1);

    return {
      currentMonthName: MONTH_NAMES[month],
      currentYear: year,
      days: daysArr,
      todayIndex: date // 1-based index for logic, but we usually use 0-based for arrays. Let's keep it 1-based as per logic below?
      // Actually the snippet uses: day <= lastActionDay. day is from daysArr (1..31).
    };
  }, []);

  // Helper to get streak status
  // Returns true if the day is part of the streak
  const isDayInStreak = (networkId: string, day: number) => {
    const chainId = NETWORK_CHAIN_IDS[networkId];
    const stats = statsMap?.[chainId];
    if (!stats || stats.streak === 0 || stats.lastAction === 0) return false;

    const now = new Date();
    const lastActionDate = new Date(stats.lastAction * 1000);

    // If last action is not in current month/year, we assume streak is broken or irrelevant for this month view
    // (unless we want to show past month streaks, but usually grid is current month).
    // The prompt snippet has a simplified logic: day <= lastActionDay && day > (lastActionDay - stats.streak)

    if (lastActionDate.getMonth() !== now.getMonth() || lastActionDate.getFullYear() !== now.getFullYear()) {
       return false;
    }

    const lastActionDay = lastActionDate.getDate(); // 1-31
    return day <= lastActionDay && day > (lastActionDay - stats.streak);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full mb-8 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white tracking-widest">{currentMonthName} <span className="text-gray-600">{currentYear}</span></h3>
          <p className="text-xs text-gray-500 font-mono">FARM SCHEDULE</p>
        </div>
        <div className="flex gap-4 text-[10px] uppercase font-bold text-gray-500">
          <span className="flex items-center gap-2"><div className="w-3 h-3 bg-[#1a1a1a] border border-white/10 rounded"></div> Fallow</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-900/30 border border-green-500 rounded"></div> Planted</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Days Header Row */}
        <div className="flex items-center gap-2">
          <div className="w-32 md:w-48 shrink-0"></div> {/* Spacer for Network Names */}
          <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
            {days.map(day => (
              <div key={day} className="text-center text-[9px] text-gray-600 font-mono">{day}</div>
            ))}
          </div>
        </div>

        {/* Network Rows */}
        {NETWORKS.map((network) => {
          const chainId = NETWORK_CHAIN_IDS[network.id] || 0;
          const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

          // Dynamic Style for Active Row
          // Note: The user prompt asked to use specific logic.
          const isActiveRow = activeNetworkId === network.id;

          return (
            <div key={network.id} className="flex items-center gap-2 group hover:bg-white/5 p-2 rounded-lg transition-colors">
              {/* Network Button (Left Side) */}
              <button
                onClick={() => onNetworkSelect && onNetworkSelect(network.id)}
                className={`w-32 md:w-48 shrink-0 flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                  ${isActiveRow
                    ? `border-${network.color.split('-')[1]}-500 bg-[#111]`
                    : 'border-white/10 bg-[#111] hover:border-white/20'
                  }
                `}
              >
                <div className={`p-2 rounded-lg bg-black/50 text-${network.color.split('-')[1]}-400`}>
                  {network.icon ? <network.icon size={18}/> : '🌱'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider truncate">{network.name}</span>
                  <span className="text-[10px] text-gray-600">{stats.streak} Days Streak</span>
                </div>
              </button>

              {/* The Grid Cells (Right Side) */}
              <div className="flex-1 grid grid-cols-[repeat(31,minmax(0,1fr))] gap-1">
                {days.map((day) => {
                  const isStreak = isDayInStreak(network.id, day);

                  // Highlight logic based on prompt: "When active/planted, they show the Emoji"
                  // "Use the specific Network Color ... to highlight the active row" (handled in button/row)
                  // "Grid Cells: Dark Empty Slots (bg-[#1a1a1a])."

                  return (
                    <div
                      key={day}
                      className={`
                        aspect-square rounded-[4px] border border-white/5 flex items-center justify-center text-sm relative
                        ${isStreak
                           ? 'bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] border-white/20'
                           : 'bg-[#1a1a1a]'
                        }
                      `}
                    >
                      {isStreak ? (
                        <span>{network.cropEmoji || '🌱'}</span>
                      ) : (
                        // Optional: Show sprout icon on hover for empty cells or nothing
                        null
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

export default FarmGrid;
