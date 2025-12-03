import React, { useState } from 'react';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { parseEther } from 'viem';
import { Loader2, Sprout } from 'lucide-react';

const SEED_TIERS = [
  {
    id: 0,
    name: 'Starter',
    xp: '1 XP',
    priceLabel: 'Free',
    priceValue: '0',
    color: '#9e9e9e',
    emojis: ['🌱','🌿']
  },
  {
    id: 1,
    name: 'Fruits',
    xp: 'High XP',
    priceLabel: '$0.10',
    priceValue: '0.00003',
    color: '#42a5f5',
    emojis: ['🫐','🍋','🌽','🍇','🍄','🍓','🍆','🥥','🍒']
  },
  {
    id: 2,
    name: 'Flowers',
    xp: 'Max XP',
    priceLabel: '$0.15',
    priceValue: '0.000045',
    color: '#ec407a',
    emojis: ['🌻','🌹','🌷','🪷','🌺','🌸','🌼']
  },
  {
    id: 3,
    name: 'Trees',
    xp: 'Epic XP',
    priceLabel: '$0.20',
    priceValue: '0.00006',
    color: '#66bb6a',
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
    <div className="bg-[#1a1614] border border-[#3e3229] rounded-xl p-6 w-full flex flex-col gap-6">

      <div className="flex justify-between items-center border-b border-[#3e3229] pb-4">
        <h3 className="text-xl font-bold text-[#e8d5c4] uppercase tracking-wider">Seed Market</h3>
        <span className="text-xs font-mono text-[#e8d5c4] opacity-50 uppercase">{activeTier.priceLabel} ENTRY</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SEED_TIERS.map(tier => (
          <button
            key={tier.id}
            onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }}
            className={`
              px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
              ${activeTab === tier.id
                ? 'bg-[#e8d5c4] text-[#1a1614]'
                : 'bg-[#0f0c0a] text-[#e8d5c4] border border-[#3e3229] opacity-70 hover:opacity-100'}
            `}
          >
            {tier.name}
          </button>
        ))}
      </div>

      {/* Grid Layout - 4 Columns */}
      <div className="grid grid-cols-4 gap-3">
        {activeTier.emojis.map(emoji => {
          const isSelected = selectedEmoji === emoji;
          return (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-3xl transition-all relative
                ${isSelected
                  ? 'bg-[#2c241b] border-2 border-[#e8d5c4] scale-105 shadow-[0_0_15px_rgba(232,213,196,0.1)]'
                  : 'bg-[#1a1614] border border-[#3e3229] hover:bg-[#251f1c] hover:border-[#5d4d3d]'}
              `}
            >
              {emoji}
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <button
        onClick={handlePlant}
        disabled={isPending || !selectedEmoji}
        className={`
          w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all mt-2
          ${isPending || !selectedEmoji
            ? 'bg-[#2c241b] text-[#5d4037] cursor-not-allowed border border-[#3e3229]'
            : 'bg-[#e8d5c4] text-[#1a1614] hover:bg-[#d4c3b3]'}
        `}
      >
        {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Sprout className="w-4 h-4" />}
        {selectedEmoji ? `Plant ${selectedEmoji}` : 'Select Seed'}
      </button>

      {isSuccess && (
        <div className="text-green-400 text-xs font-mono text-center mt-2">
          Seed planted successfully!
        </div>
      )}
    </div>
  );
}
