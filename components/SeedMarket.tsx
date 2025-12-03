import React, { useState } from 'react';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { parseEther } from 'viem';
import { Loader2, Sprout, ShoppingBag, Coins, Zap } from 'lucide-react';

const SEED_TIERS = [
  {
    id: 0,
    name: 'Starter',
    xp: '1 XP',
    priceLabel: 'Free',
    priceValue: '0',
    color: '#9e9e9e', // Grey
    bgClass: 'bg-[#424242]',
    emojis: ['🌱','🌿']
  },
  {
    id: 1,
    name: 'Fruits',
    xp: 'High XP',
    priceLabel: '$0.10',
    priceValue: '0.00003',
    color: '#42a5f5', // Blue
    bgClass: 'bg-[#1565c0]',
    emojis: ['🫐','🍋','🌽','🍇','🍄','🍓','🍆','🥥','🍒']
  },
  {
    id: 2,
    name: 'Flowers',
    xp: 'Max XP',
    priceLabel: '$0.15',
    priceValue: '0.000045',
    color: '#ec407a', // Pink
    bgClass: 'bg-[#ad1457]',
    emojis: ['🌻','🌹','🌷','🪷','🌺','🌸','🌼']
  },
  {
    id: 3,
    name: 'Trees',
    xp: 'Epic XP',
    priceLabel: '$0.20',
    priceValue: '0.00006',
    color: '#66bb6a', // Green
    bgClass: 'bg-[#2e7d32]',
    emojis: ['🌳','🌲','🌴','🌵','🎄']
  }
];

export default function SeedMarket() {
  const { waterPlant, isPending, isSuccess } = useWaterPlant();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const activeTier = SEED_TIERS.find(t => t.id === activeTab) || SEED_TIERS[0];

  const handlePlant = () => {
    if(activeTier) waterPlant(activeTier.id, parseEther(activeTier.priceValue));
  };

  return (
    <div className="wood-panel p-5 w-full mt-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[#3e3229] pb-3">
        <div>
          <h3 className="text-xl font-black text-[#e0d8c8] flex items-center gap-2 uppercase tracking-wide">
            <ShoppingBag className="text-[#8d6e63]" /> Seed Market
          </h3>
          <p className="text-[10px] font-bold text-[#8d6e63] mt-1 uppercase tracking-wider">
            Select a category to view seeds
          </p>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-bold text-[#5d4037] bg-[#e0d8c8] px-2 py-1 rounded">
             {activeTier.priceLabel === 'Free' ? 'NO COST' : 'PAID ENTRY'}
           </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {SEED_TIERS.map(tier => {
          const isActive = activeTab === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }}
              className={`
                relative flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-200
                ${isActive
                  ? `border-[#e0d8c8] bg-gradient-to-br from-[#2c241b] to-[#0f0c0a] shadow-inner`
                  : 'border-transparent bg-[#1a1614] hover:bg-[#2c241b] opacity-70 hover:opacity-100'}
              `}
            >
              <div
                className={`w-3 h-3 rounded-full mb-1 shadow-sm`}
                style={{ backgroundColor: tier.color }}
              />
              <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-[#e0d8c8]' : 'text-[#8d6e63]'}`}>
                {tier.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#e0d8c8]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="bg-[#0f0c0a] rounded-lg p-3 flex justify-between items-center border border-[#3e3229] shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${activeTier.bgClass} text-white shadow-md`}>
            <Coins size={16} />
          </div>
          <div>
             <div className="text-xs font-bold text-[#8d6e63] uppercase">Price</div>
             <div className="text-sm font-black text-[#e0d8c8]">{activeTier.priceLabel}</div>
          </div>
        </div>
        <div className="h-8 w-px bg-[#3e3229]"></div>
        <div className="flex items-center gap-3 text-right">
          <div>
             <div className="text-xs font-bold text-[#8d6e63] uppercase">Reward</div>
             <div className="text-sm font-black text-[#e0d8c8]">{activeTier.xp}</div>
          </div>
          <div className={`p-2 rounded-md bg-[#2c241b] text-[#e0d8c8] border border-[#3e3229]`}>
            <Zap size={16} />
          </div>
        </div>
      </div>

      {/* Seed Grid */}
      <div className="bg-[#151210] p-4 rounded-xl border-2 border-[#3e3229] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
          {activeTier.emojis.map(emoji => {
            const isSelected = selectedEmoji === emoji;
            return (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`
                  aspect-square flex items-center justify-center text-3xl rounded-lg transition-all duration-150
                  ${isSelected
                    ? 'bg-[#2c241b] shadow-[0_0_0_2px_#e0d8c8,0_4px_10px_rgba(0,0,0,0.5)] transform -translate-y-1'
                    : 'bg-[#0f0c0a] border border-[#2c241b] hover:bg-[#1a1614] hover:border-[#5d4037] opacity-80 hover:opacity-100'}
                `}
              >
                <span className="filter drop-shadow-md">{emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handlePlant}
        disabled={isPending || !selectedEmoji}
        className={`
          w-full py-4 rounded-xl border-b-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all
          ${isPending || !selectedEmoji
            ? 'bg-[#2c241b] border-[#1a1614] text-[#5d4037] cursor-not-allowed'
            : 'bg-gradient-to-b from-[#66bb6a] to-[#43a047] border-[#1b5e20] text-white hover:brightness-110 active:border-b-0 active:translate-y-1'}
        `}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <Sprout strokeWidth={3} />}
        {selectedEmoji ? (
          <span>Plant <span className="text-yellow-200 mx-1">{selectedEmoji}</span> for {activeTier.priceLabel}</span>
        ) : (
          'Choose a Seed'
        )}
      </button>

      {isSuccess && (
        <div className="bg-[#1b5e20] text-green-100 text-xs font-bold text-center p-3 rounded border border-green-500 animate-pulse">
          🌱 Seed planted successfully! Watch it grow!
        </div>
      )}
    </div>
  );
}
