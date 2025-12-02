import React, { useState } from 'react';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { parseEther } from 'viem';
import { Loader2, Sprout, ShoppingBag } from 'lucide-react';

// CATALOG CONFIGURATION
// Prices are in ETH/Native Token (Matched to contract logic)
const SEED_TIERS = [
  {
    id: 0,
    name: 'Starter',
    sub: '1 XP',
    priceLabel: 'Free',
    priceValue: '0',
    color: 'border-gray-500',
    bg: 'bg-gray-800',
    emojis: ['🌱', '🌿', '🍃', '🎍']
  },
  {
    id: 1,
    name: 'Fruits',
    sub: '2 XP',
    priceLabel: '$0.10',
    priceValue: '0.00003', // ~10 Cent
    color: 'border-blue-500',
    bg: 'bg-blue-900/20',
    emojis: ['🫐','🍋','🌽','🍇','🍄','🍓','🍆','🥥','🍒','🥕','🥦','🍅','🥝','🥑','🫒','🥜','🥒','🌶️']
  },
  {
    id: 2,
    name: 'Flowers',
    sub: '3 XP',
    priceLabel: '$0.15',
    priceValue: '0.000045', // ~15 Cent
    color: 'border-pink-500',
    bg: 'bg-pink-900/20',
    emojis: ['🌻','🌹','🌷','🪷','🌺','🌸','🌼','💐','🥀','💮','🏵️','🪻']
  },
  {
    id: 3,
    name: 'Trees',
    sub: '5 XP',
    priceLabel: '$0.20',
    priceValue: '0.00006', // ~20 Cent
    color: 'border-green-500',
    bg: 'bg-green-900/20',
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
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="text-green-400" />
          Seed Market
        </h3>
        <span className="text-xs text-gray-500 font-mono">Pay with Native Token</span>
      </div>

      {/* Tabs / Seed Selection */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {SEED_TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              activeTab === tier.id
                ? `${tier.bg} ${tier.color} text-white shadow-lg`
                : 'bg-[#1a1a1a] border-transparent text-gray-500 hover:bg-[#222] hover:text-gray-300'
            }`}
          >
            <span className="text-sm font-bold">{tier.name}</span>
            <span className="text-[10px] opacity-70">{tier.priceLabel}</span>
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6 border border-white/5">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
          {activeTier?.emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`aspect-square flex items-center justify-center text-2xl rounded-lg border transition-all hover:scale-110 ${
                selectedEmoji === emoji
                  ? 'border-green-500 bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'border-transparent bg-[#1e1e1e] hover:border-white/20'
              }`}
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
          className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
            isPending || !selectedEmoji
              ? 'bg-[#222] text-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white shadow-xl hover:shadow-green-500/20'
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Planting...
            </>
          ) : (
            <>
              <Sprout size={24} className={selectedEmoji ? "animate-bounce" : ""} />
              {selectedEmoji ? `Plant ${selectedEmoji}` : 'Select a Seed'}
            </>
          )}
        </button>

        {/* Info Text */}
        <p className="text-center text-[10px] text-gray-600 font-mono mt-2">
            {activeTier?.name} seeds grant {activeTier?.sub}
        </p>
      </div>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400 text-center text-sm font-bold animate-pulse flex items-center justify-center gap-2">
          <span>🎉</span> Harvest Successful! Check the grid.
        </div>
      )}
    </div>
  );
}
