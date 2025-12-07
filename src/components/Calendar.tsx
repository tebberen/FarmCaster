import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getEmojiById } from '../config/emojis';
import clsx from 'clsx';

// Helper for date formatting YYYY-MM-DD
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

interface Theme {
    primary: string; // Text color, Border color
    secondary: string; // Background accents
    badge: string; // Active badge bg
    button: string; // Main action button
    shadow: string; // Glow
    today: string; // Today border
}

interface CalendarProps {
  history: Map<string, number>;
  networkName: string;
  theme: Theme;
}

// Screenshot starts with Sunday: S M T W T F S
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const Calendar: React.FC<CalendarProps> = ({ history, theme }) => {
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
                    ? `bg-[#3d2b20] ${theme.primary} text-[#e7dac7]` // Use theme border for logged days? Or keep standard?
                    : isToday
                        ? `bg-[#3d2b20] ${theme.today} text-[#e7dac7]`
                        : "bg-[#261a15] border-transparent text-[#8c7e73]"
            )}
        >
            {hasLog && seedId !== undefined ? (
                <span>{getEmojiById(seedId)}</span>
            ) : (
                <span className="font-medium">
                    {date.getDate()}
                </span>
            )}
        </div>
      );
  };

  return (
    <div className={clsx("bg-[#1e140f] border rounded-2xl overflow-hidden shadow-lg p-4 transition-all duration-300", theme.primary, theme.shadow)}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-[#e7dac7]">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>

            <div className="flex items-center gap-1 bg-[#2c1f18] rounded-lg p-1">
                 <button onClick={prevMonth} className="p-1 hover:bg-[#3d2b20] rounded text-[#8c7e73] hover:text-[#e7dac7] transition-colors">
                    <ChevronLeft size={16} />
                 </button>
                 <button onClick={nextMonth} className="p-1 hover:bg-[#3d2b20] rounded text-[#8c7e73] hover:text-[#e7dac7] transition-colors">
                    <ChevronRight size={16} />
                 </button>
            </div>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-y-3 gap-x-1 justify-items-center">
            {/* Weekday Headers */}
            {WEEKDAYS.map((d, i) => (
                <div key={i} className="text-xs font-bold text-[#6b5d54] mb-1">{d}</div>
            ))}

            {/* Days */}
            {getMonthDays().map((date, i) => renderCell(date, i))}
        </div>
    </div>
  );
};
