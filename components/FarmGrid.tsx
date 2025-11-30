import React from 'react';
import { NETWORKS, MOCK_GRID_DATA } from '@/constants';
import { Flame } from 'lucide-react';

const FarmGrid = () => {
  // We'll create an array of days to display as columns.
  // The mock data has 7 items, but the design shows a full month (28 days).
  // We will repeat the mock data pattern to fill 28 days for visual fidelity,
  // or just use the 7 items if strict adherence to "mock data" is preferred.
  // Given "Replicate this exact design", I will aim for 28 columns.

  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  // Helper to get data for a day index (looping the mock data)
  const getDataForDay = (networkId: string, dayIndex: number) => {
    const data = MOCK_GRID_DATA[networkId];
    if (!data) return 0;
    return data[dayIndex % data.length];
  };

  return (
    <div className="w-full bg-[#11131F] rounded-xl border border-gray-800 p-4 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold flex items-center gap-2">
          <span className="text-green-500">📅</span> KASIM AYI TARLASI
        </h2>
        <div className="text-xs text-gray-400 border border-gray-700 rounded px-2 py-1">
          ← Sağa/Sola Kaydırılabilir →
        </div>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-[800px]"> {/* Ensure minimum width for scrolling on mobile */}
          {/* Header Row */}
          <div className="flex items-center mb-2">
            <div className="w-24 md:w-32 shrink-0 text-gray-400 text-xs font-bold uppercase tracking-wider pl-2">
              Ağlar
            </div>
            <div className="flex-1 flex justify-between px-1">
              {days.map((day) => (
                <div key={day} className="w-6 text-center text-[10px] text-gray-500 font-mono">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Network Rows */}
          <div className="space-y-3">
            {NETWORKS.map((network) => (
              <div key={network.id} className="flex items-center group hover:bg-white/5 rounded-lg transition-colors py-1">
                {/* Network Label */}
                <div className="w-24 md:w-32 shrink-0 flex items-center gap-2 pl-2">
                  <div className={`p-1.5 rounded-full ${network.color} ${network.text || 'text-white'}`}>
                     <network.icon size={12} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-bold text-gray-300 uppercase">{network.name}</span>
                </div>

                {/* Grid Cells */}
                <div className="flex-1 flex justify-between px-1 relative">
                    {/* Background grid lines could go here */}
                  {days.map((day, index) => {
                    const status = getDataForDay(network.id, index);

                    return (
                      <div key={day} className="w-6 h-6 flex items-center justify-center">
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
                           <div className="w-0.5 h-0.5 bg-gray-700 rounded-full" />
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
