import React from 'react';
import { NETWORKS } from '@/constants';

const CHAIN_IDS: Record<string, number> = { base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999 };
const CROPS: Record<string, string> = { base: '🫐', bsc: '🌽', eth: '🍄', arb: '🍇', celo: '🥑', monad: '🍆', hyperevm: '⚡' };

export default function FarmGrid({ statsMap, onNetworkSelect }: any) {
  const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const days = Array.from({ length: currentMonthDays }, (_, i) => i + 1);
  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();

  return (
    <div className="wood-panel p-6 w-full mb-8">
      {/* Header */}
      <div className="flex justify-center -mt-10 mb-6">
        <div className="bg-[#5d4037] px-6 py-2 rounded-lg border-4 border-[#3e2723] shadow-lg transform rotate-1">
          <h3 className="text-xl font-black text-[#fff8e1] tracking-widest uppercase">My Farm</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[120px_repeat(31,1fr)] gap-1 mb-2">
            <div className="text-xs font-bold text-[#3e2723] pl-2 self-end">PLOTS</div>
            {days.map(d => <div key={d} className={`text-center text-[9px] font-bold ${d===today?'text-yellow-300':'text-[#5d4037]'}`}>{d}</div>)}
          </div>

          {NETWORKS.map((network) => {
            const chainId = (network as any).chainId || CHAIN_IDS[network.id];
            const stats = statsMap?.[chainId] || { streak: 0, lastAction: 0 };

            // HISTORY LOGIC (Backtrace)
            const lastActionDate = stats.lastAction > 0 ? new Date(stats.lastAction * 1000) : null;
            const lastActionDay = lastActionDate?.getDate() || -999;
            const lastActionMonth = lastActionDate?.getMonth();

            return (
              <div key={network.id} className="grid grid-cols-[120px_repeat(31,1fr)] gap-1 items-center mb-2">
                <button onClick={() => onNetworkSelect(network.id)} className="bg-[#8d6e63] text-white p-1.5 rounded border-2 border-[#5d4037] flex items-center gap-2 text-xs font-bold hover:brightness-110 shadow-sm">
                  <span>{network.icon ? <network.icon size={14}/> : '🌱'}</span>
                  <span className="truncate">{network.name}</span>
                </button>

                {days.map((day) => {
                  const isStreak = lastActionMonth === currentMonth && day <= lastActionDay && day > (lastActionDay - stats.streak);
                  return (
                    <div key={day} className="soil-pit aspect-square flex items-center justify-center text-sm">
                      {isStreak && <span className="filter drop-shadow-md animate-in zoom-in">{CROPS[network.id] || '🌱'}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
