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

  const renderCell = (date: Date | null, index: number) => {
      if (!date) return <div key={`empty-${index}`} className="w-9 h-9" />;

      const dateStr = formatDate(date);
      const hasLog = history.has(dateStr);
      const seedId = history.get(dateStr);
      const isToday = formatDate(new Date()) === dateStr;

      return (
        <div
            key={dateStr}
            className={clsx(
                "relative flex items-center justify-center rounded-md transition-all w-9 h-9 text-sm border",
                hasLog
                    ? `${theme.bg} ${theme.border} ${theme.glow}`
                    : isToday
                        ? `bg-slate-800 ${theme.border} text-slate-200`
                        : "bg-slate-900/50 border-slate-800 text-slate-500"
            )}
        >
            {hasLog && seedId !== undefined ? (
                <span className="text-2xl filter drop-shadow-md">{getEmojiById(seedId).icon}</span>
            ) : (
                <span className="font-medium">
                    {date.getDate()}
                </span>
            )}
        </div>
      );
  };

  return (
    <div className={clsx("bg-slate-900 border rounded-2xl overflow-hidden shadow-lg p-4 transition-all duration-300", theme.border)}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h2 className={clsx("text-base font-bold", theme.accent)}>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} Farm Calendar
            </h2>

            <div className="flex items-center gap-2">
                {userXP && (
                    <div className="bg-slate-800 px-2 py-1 rounded text-emerald-400 text-xs font-bold">
                        {userXP} XP
                    </div>
                )}
                <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-y-3 gap-x-1 justify-items-center">
            {/* Weekday Headers */}
            {WEEKDAYS.map((d, i) => (
                <div key={i} className={clsx("text-xs font-bold mb-1", theme.accent)}>{d}</div>
            ))}

            {/* Days */}
            {getMonthDays().map((date, i) => renderCell(date, i))}
        </div>
    </div>
  );
};
