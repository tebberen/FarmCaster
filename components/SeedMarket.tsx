import React, { useState } from 'react';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { parseEther } from 'viem';
import { Loader2, Sprout, ShoppingBag, Leaf, Flower, Trees } from 'lucide-react';

// CATALOG CONFIGURATION
const SEED_TIERS = [
  {
    id: 0,
    name: 'STARTER',
    sub: '1 XP',
    priceLabel: 'FREE',
    priceValue: '0',
    color: 'border-[#444]',
    bg: 'bg-[#111]',
    activeColor: 'bg-gray-800',
    icon: Sprout,
    emojis: ['🌱', '🌿', '🍃', '🎍']
  },
  {
    id: 1,
    name: 'FRUITS',
    sub: '2 XP',
    priceLabel: '0.00003 ETH',
    priceValue: '0.00003',
    color: 'border-blue-900',
    bg: 'bg-[#0a1120]',
    activeColor: 'bg-blue-900/40',
    icon: Leaf,
    emojis: ['🫐','🍋','🌽','🍇','🍄','🍓','🍆','🥥','🍒','🥕','🥦','🍅','🥝','🥑','🫒','🥜','🥒','🌶️']
  },
  {
    id: 2,
    name: 'FLOWERS',
    sub: '3 XP',
    priceLabel: '0.000045 ETH',
    priceValue: '0.000045',
    color: 'border-pink-900',
    bg: 'bg-[#200a11]',
    activeColor: 'bg-pink-900/40',
    icon: Flower,
    emojis: ['🌻','🌹','🌷','🪷','🌺','🌸','🌼','💐','🥀','💮','🏵️','🪻']
  },
  {
    id: 3,
    name: 'TREES',
    sub: '5 XP',
    priceLabel: '0.00006 ETH',
    priceValue: '0.00006',
    color: 'border-green-900',
    bg: 'bg-[#0a2011]',
    activeColor: 'bg-green-900/40',
    icon: Trees,
    emojis: ['🌳','🌲','🌴','🌵','🎄','🎋','🪵','🪴','🌲','🍂','🍁']
  }
];

export default function SeedMarket() {
  const { waterPlant, isPending, isSuccess } = useWaterPlant();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const activeTier = SEED_TIERS.find(t => t.id === activeTab);

  const handlePlant = () => {
    if (!activeTier) return;
    waterPlant(activeTier.id, parseEther(activeTier.priceValue));
  };

  return (
    <div className="bg-[#050505] border border-[#222] rounded-3xl p-6 w-full shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
        <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-wider uppercase">
          <div className="p-2 bg-[#111] rounded-lg border border-[#333] text-green-500">
             <ShoppingBag size={20} />
          </div>
          Seed Market
        </h3>
        <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Payment Method</span>
             <span className="text-xs font-mono text-gray-400">NATIVE TOKEN</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {SEED_TIERS.map((tier) => {
          const isActive = activeTab === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group
                ${isActive
                  ? `${tier.activeColor} ${tier.color} text-white shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)]`
                  : 'bg-[#0a0a0a] border-[#1a1a1a] text-[#444] hover:bg-[#111] hover:border-[#333] hover:text-[#888]'
                }
              `}
            >
              <div className={`mb-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>
                 <tier.icon size={20} />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase">{tier.name}</span>
              <span className="text-[9px] font-mono opacity-60 mt-1">{tier.priceLabel}</span>

              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Emoji Selection Panel */}
      <div className="bg-[#080808] rounded-2xl p-4 mb-6 border border-[#1a1a1a] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center mb-3 px-2">
            <span className="text-[10px] uppercase font-bold text-[#444] tracking-widest">Select Variant</span>
            <span className="text-[10px] text-[#333] font-mono">{activeTier?.sub} REWARD</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
          {activeTier?.emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`
                aspect-square flex items-center justify-center text-2xl rounded-lg border transition-all duration-200
                ${selectedEmoji === emoji
                  ? 'border-green-500 bg-[#112211] shadow-[0_0_10px_rgba(34,197,94,0.3)] scale-110 z-10'
                  : 'border-transparent bg-[#0f0f0f] hover:bg-[#161616] hover:border-[#333] opacity-60 hover:opacity-100'
                }
              `}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-3">
        <button
          onClick={handlePlant}
          disabled={isPending || !selectedEmoji}
          className={`
            w-full py-5 rounded-2xl font-black text-lg tracking-widest uppercase transition-all flex items-center justify-center gap-4 relative overflow-hidden
            ${isPending || !selectedEmoji
              ? 'bg-[#111] text-[#333] border border-[#222] cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-black border border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transform hover:-translate-y-0.5 active:translate-y-0'
            }
          `}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> PLANTING...
            </>
          ) : (
            <>
              {selectedEmoji && <span className="text-2xl animate-bounce">{selectedEmoji}</span>}
              {selectedEmoji ? `PLANT SEED` : 'SELECT A SEED'}
            </>
          )}
        </button>
      </div>

      {isSuccess && (
        <div className="mt-4 p-4 bg-green-900/10 border border-green-500/20 rounded-xl text-green-400 text-center text-xs font-bold tracking-widest uppercase animate-pulse flex items-center justify-center gap-2">
          <span>🎉</span> Harvest Successful
        </div>
      )}
    </div>
  );
}
