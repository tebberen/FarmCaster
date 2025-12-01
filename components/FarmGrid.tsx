'use client';

import React, { useMemo } from 'react';
import { NETWORKS } from '@/constants';
import { Flame } from 'lucide-react';

interface FarmGridProps {
  // We keep gridData for other networks if needed, but primarily use streak/action for visualization
  gridData?: Record<string, number[]>;
  selectedCell?: { networkId: string; dayIndex: number };
  onSelect?: (cell: { networkId: string; dayIndex: number }) => void;
  onNetworkSelect?: (networkId: string) => void;
  userStreak?: number;
  lastActionTimestamp?: number;
  activeNetworkId?: string;
}

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const FarmGrid = ({
  gridData,
  selectedCell,
  onSelect,
  onNetworkSelect,
  userStreak = 0,
  lastActionTimestamp = 0,
  activeNetworkId
}: FarmGridProps) => {

  // 1. Dynamic Date Logic
  const { currentMonthName, daysInMonth, days, todayIndex, currentYear } = useMemo(() => {
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

  // 2. Visualization Logic (Lazy Indexer)
  // We calculate the status of each day for the ACTIVE network based on streak and last action.
  const getCellStatus = (networkId: string, dayIndex: number) => {
    // Determine which network logic to use.
    // If activeNetworkId is provided, use it to check match.
    // If not provided (legacy), default to 'base'.
    const targetNetworkId = activeNetworkId || 'base';

    // Only apply dynamic logic to the target (active) network
    if (networkId !== targetNetworkId) {
      // Fallback to static gridData if available, or 0
      return gridData?.[networkId]?.[dayIndex] ?? 0;
    }

    // If future day, it's empty (or disabled)
    if (dayIndex > todayIndex) return 0;

    const streak = Number(userStreak);
    const lastActionTime = Number(lastActionTimestamp);

    // Check if last action was today
    const now = new Date();
    const lastActionDate = new Date(lastActionTime * 1000);

    const isActionToday = lastActionTime > 0 &&
      lastActionDate.getDate() === now.getDate() &&
      lastActionDate.getMonth() === now.getMonth() &&
      lastActionDate.getFullYear() === now.getFullYear();

    // Logic:
    // If Action Today:
    //   - Today (todayIndex) is FIRE (2)
    //   - Previous (streak - 1) days are GREEN (1)
    // If Action NOT Today:
    //   - Today is EMPTY (0)
    //   - Previous (streak) days are GREEN (1) (assuming streak is unbroken from yesterday)

    if (dayIndex === todayIndex) {
      if (isActionToday && streak > 0) return 2; // Fire
      return 0; // Empty
    }

    // Past days logic
    let daysToHighlight = streak;
    if (isActionToday) {
      daysToHighlight = streak - 1; // Since today is already counted as Fire
    }

    // Calculate the start index for the green streak
    // The streak ends at:
    // - If action today: todayIndex - 1
    // - If action not today: todayIndex - 1 (since today is missed/pending)
    // So the range is [todayIndex - daysToHighlight, todayIndex - 1]

    const rangeEnd = todayIndex - 1;
    const rangeStart = rangeEnd - daysToHighlight + 1;

    if (dayIndex >= rangeStart && dayIndex <= rangeEnd) {
      return 1; // Green
    }

    return 0;
  };

  return (
    <div className="w-full bg-[#11131F] rounded-xl border border-gray-800 p-4 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold flex items-center gap-2">
          <span className="text-green-500">📅</span> {currentMonthName} FARMING GRID <span className="text-gray-500 text-sm font-normal">{currentYear}</span>
        </h2>
        <div className="text-xs text-gray-400 border border-gray-700 rounded px-2 py-1">
          ← Scrollable →
        </div>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-[800px]"> {/* Ensure minimum width for scrolling on mobile */}
          {/* Header Row */}
          <div className="flex items-center mb-2">
            <div className="w-24 md:w-32 shrink-0 text-gray-400 text-xs font-bold uppercase tracking-wider pl-2">
              Networks
            </div>
            <div className="flex-1 flex justify-between px-1">
              {days.map((day) => (
                <div key={day} className={`w-6 text-center text-[10px] font-mono ${day - 1 === todayIndex ? 'text-green-500 font-bold' : 'text-gray-500'}`}>
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Network Rows */}
          <div className="space-y-3">
            {NETWORKS.map((network) => (
              <div key={network.id} className="flex items-center group hover:bg-white/5 rounded-lg transition-colors py-1">
                {/* Network Label - Clickable for Switching */}
                <div
                  className={`w-24 md:w-32 shrink-0 flex items-center gap-2 pl-2 ${onNetworkSelect ? 'cursor-pointer hover:bg-white/10 rounded-md py-1' : ''}`}
                  onClick={() => onNetworkSelect && onNetworkSelect(network.id)}
                >
                  <div className={`p-1.5 rounded-full ${network.color} ${network.text || 'text-white'}`}>
                     <network.icon size={12} strokeWidth={3} />
                  </div>
                  <span className={`text-xs font-bold uppercase ${activeNetworkId === network.id ? 'text-white' : 'text-gray-500'}`}>
                    {network.name}
                  </span>
                </div>

                {/* Grid Cells */}
                <div className="flex-1 flex justify-between px-1 relative">
                  {days.map((day, index) => {
                    const status = getCellStatus(network.id, index);
                    const isSelected = selectedCell?.networkId === network.id && selectedCell?.dayIndex === index;
                    const isFuture = index > todayIndex;
                    const isToday = index === todayIndex;

                    return (
                      <div
                        key={day}
                        onClick={() => {
                          if (!isFuture && onSelect) {
                            onSelect({ networkId: network.id, dayIndex: index });
                          }
                        }}
                        className={`w-6 h-6 flex items-center justify-center rounded transition-colors relative
                          ${isFuture ? 'cursor-not-allowed opacity-30' : (onSelect ? 'cursor-pointer' : '')}
                          ${isSelected ? 'ring-2 ring-white z-10' : (!isFuture && onSelect && 'hover:bg-white/10')}
                        `}
                      >
                        {status === 1 && (
                          <div className="w-3 h-3 bg-green-500 rounded-sm shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse-slow" />
                        )}
                        {status === 2 && (
                          <div className="relative">
                              <div className="absolute inset-0 bg-orange-500 blur-sm opacity-50 rounded-full" />
                              <Flame size={14} className="text-orange-500 fill-orange-500 relative z-10" />
                          </div>
                        )}
                        {status === 0 && (
                           <div className={`w-0.5 h-0.5 rounded-full ${isToday ? 'bg-blue-500 w-1 h-1' : 'bg-gray-700'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmGrid;
