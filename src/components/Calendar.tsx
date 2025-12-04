import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const Calendar: React.FC<CalendarProps> = ({ history, networkName }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Helper to get emoji for seedId
  const getSeedEmoji = (seedId: number) => {
    switch (seedId) {
        case 0: return "🌱";
        case 1: return "🍒";
        case 2: return "🌻";
        case 3: return "🌳";
        default: return "🌱";
    }
  };

  // Generate days for Week View (Last 7 days)
  const getWeekDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d);
    }
    return dates;
  };

  // Generate days for Month View
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 0 = Sunday, 1 = Monday. We want Monday start.
    // Day of week for first day (0-6).
    let startDayOfWeek = firstDay.getDay();
    // Convert so 1 (Mon) is 0, 0 (Sun) is 6.
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

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

  const renderCell = (date: Date | null, index: number, isMonthView: boolean = false) => {
      if (!date) return <div key={`empty-${index}`} className="w-10 h-10" />;

      const dateStr = formatDate(date);
      const hasLog = history.has(dateStr);
      const seedId = history.get(dateStr);
      const isToday = formatDate(new Date()) === dateStr;

      return (
        <div
            key={dateStr}
            className={`
                relative flex items-center justify-center rounded-lg transition-all
                ${isMonthView ? 'w-10 h-10 text-sm' : 'w-10 h-10 text-lg'}
                ${hasLog
                    ? 'bg-emerald-500/20 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : isToday
                        ? 'bg-slate-700 border border-slate-600'
                        : 'bg-transparent text-slate-500 hover:bg-slate-800'
                }
            `}
        >
            {hasLog && seedId !== undefined ? (
                <span>{getSeedEmoji(seedId)}</span>
            ) : (
                <span className={isMonthView ? 'font-medium' : ''}>
                    {isMonthView ? date.getDate() : isToday ? 'Today' : '·'}
                </span>
            )}

            {/* Show dot for today if planted */}
            {isToday && hasLog && (
                <div className="absolute bottom-0.5 w-1 h-1 bg-white rounded-full" />
            )}
        </div>
      );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
                <CalendarIcon size={18} className="text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    {isExpanded ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : '7 Day History'}
                </h2>
            </div>

            <div className="flex items-center gap-2">
                 {isExpanded && (
                     <div className="flex items-center mr-2 bg-slate-800 rounded-lg p-1">
                         <button onClick={prevMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                            <ChevronLeft size={16} />
                         </button>
                         <button onClick={nextMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                            <ChevronRight size={16} />
                         </button>
                     </div>
                 )}
                 <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium px-3 py-1.5 bg-emerald-950/30 border border-emerald-900/50 rounded-lg transition-colors"
                 >
                    {isExpanded ? 'Minimize' : 'View Calendar'}
                 </button>
            </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
            {!isExpanded ? (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 flex justify-between items-center overflow-x-auto no-scrollbar"
                >
                     {/* Week View: Last 7 days */}
                     <div className="flex items-center justify-between w-full gap-2">
                        {getWeekDays().map((date, i) => (
                            <div key={date.toISOString()} className="flex flex-col items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</span>
                                {renderCell(date, i, false)}
                            </div>
                        ))}
                     </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6"
                >
                    {/* Month View */}
                    <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-2">
                        {WEEKDAYS.map((d, i) => (
                            <div key={i} className="text-xs font-bold text-slate-500">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 gap-x-2 justify-items-center">
                        {getMonthDays().map((date, i) => renderCell(date, i, true))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
