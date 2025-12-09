import React from 'react';
import clsx from 'clsx';
import { Theme } from '../app/page';
import { getEmojiById } from '../config/emojis';

interface CalendarProps {
  history: Map<string, number>;
  networkName: string;
  theme: Theme;
  userXP?: string;
}

const DAYS_IN_MONTH = 35; // 5 rows * 7 columns

export function Calendar({ history, networkName, theme, userXP }: CalendarProps) {
  // Generate days based on current date
  const today = new Date();
  const days = Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (DAYS_IN_MONTH - 1 - i));
    return d;
  });

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={clsx(
      "relative p-4 rounded-3xl border backdrop-blur-sm shadow-sm transition-all duration-300",
      theme.cardBg, // Use the creamy darker shade
      theme.border
    )}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div>
           <h2 className={clsx("text-lg font-bold leading-none", theme.text)}>
              {networkName} Garden
           </h2>
           <p className="text-xs opacity-60 font-medium mt-1">
              Last 35 Days
           </p>
        </div>
        {userXP && (
            <div className={clsx("text-right")}>
                 <div className={clsx("text-xs font-bold uppercase tracking-wider opacity-60")}>XP</div>
                 <div className={clsx("text-xl font-black leading-none", theme.text)}>
                    {userXP}
                 </div>
            </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5 w-full">
        {days.map((date, i) => {
          const dateStr = formatDate(date);
          const seedId = history.get(dateStr);
          const emoji = seedId !== undefined ? getEmojiById(seedId).icon : null;
          const isToday = i === DAYS_IN_MONTH - 1;
          const active = !!emoji;

          return (
            <div
              key={dateStr}
              className={clsx(
                "aspect-square rounded-xl flex items-center justify-center text-xl transition-all relative group",
                active
                  ? clsx("bg-white shadow-md scale-100 z-10", theme.text) // Pop effect
                  : "bg-white/40 hover:bg-white/60 scale-95 opacity-80", // Blended inactive
                isToday && !active && "ring-2 ring-inset ring-black/5"
              )}
              title={dateStr}
            >
              {emoji ? (
                <span className="filter drop-shadow-sm transform group-hover:scale-110 transition-transform">
                    {emoji}
                </span>
              ) : (
                <span className="opacity-0 group-hover:opacity-20 text-xs">
                    •
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
