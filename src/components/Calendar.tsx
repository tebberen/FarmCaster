import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmojiById } from '../config/emojis';
import clsx from 'clsx';
import { Theme } from '../app/page';

// Helper for date formatting YYYY-MM-DD
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

interface CalendarProps {
  history: Map<string, number>;
  networkName: string;
  theme: Theme;
  userXP?: string;
}

// Screenshot starts with Sunday: S M T W T F S
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const Calendar: React.FC<CalendarProps> = ({ history, theme, userXP }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Generate days for Month View
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 0 = Sunday.
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // Padding empty days
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }

    // Real days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className={clsx("bg-white border rounded-2xl overflow-hidden shadow-lg p-4 transition-all duration-300 w-full", theme.border)}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h2 className={clsx("text-base font-bold text-slate-800")}>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} Farm Calendar
            </h2>

            <div className="flex items-center gap-2">
                {userXP && (
                    <div className="bg-slate-100 px-2 py-1 rounded text-slate-600 text-xs font-bold border border-slate-200">
                        {userXP} XP
                    </div>
                )}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-1.5 justify-items-center">
            {/* Weekday Headers */}
            {WEEKDAYS.map((d, i) => (
                <div key={i} className={clsx("text-[10px] font-bold mb-1 opacity-50 text-slate-500")}>{d}</div>
            ))}

            {/* Days */}
            {getMonthDays().map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="aspect-square" />;

                const dayDate = date;
                const dateStr = formatDate(dayDate);
                const hasLog = history.has(dateStr);
                const seedId = history.get(dateStr);
                const matchedLog = hasLog ? { seedType: seedId! } : null;

                return (
                  <div
                    key={i}
                    title={dateStr} // Tooltip
                    className={clsx(
                      "relative flex flex-col items-center justify-center aspect-square rounded-lg border transition-all duration-300 w-full",
                      hasLog
                          ? clsx(theme.bg, theme.border) // Active: Theme BG + Border
                          : "bg-transparent border-slate-100" // Inactive: Transparent + Light Border
                    )}
                    style={hasLog ? { boxShadow: `0 0 10px -2px var(--tw-shadow-color)` } : undefined} // Soft glow simulation if needed, or rely on ring
                  >
                    {/* 1. DATE NUMBER (Always Visible - Top Right) */}
                    <span className={clsx(
                        "absolute top-1 right-1.5 text-[10px] font-bold transition-opacity",
                        hasLog ? theme.text : "text-gray-400", // Log: Theme Color, No Log: Gray-400
                        hasLog ? "opacity-100" : "opacity-60"
                    )}>
                      {dayDate.getDate()}
                    </span>

                    {/* 2. EMOJI CONTENT (Centered) */}
                    {hasLog && matchedLog ? (
                      <span className="text-xl sm:text-2xl filter drop-shadow-sm animate-in zoom-in duration-300">
                        {getEmojiById(matchedLog.seedType).icon}
                      </span>
                    ) : (
                      // Optional: Tiny dot for empty days to keep grid structure visible
                      <span className="w-1 h-1 rounded-full bg-slate-100" />
                    )}
                  </div>
                );
            })}
        </div>
    </div>
  );
};
