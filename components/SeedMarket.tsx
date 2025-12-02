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
    <div className="wood-texture p-6 w-full shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#ffecb3] drop-shadow-md flex items-center gap-2">
          <ShoppingBag className="text-[#aed581]" />
          Seed Market
        </h3>
        <span className="text-xs text-[#ffecb3] opacity-80 font-mono">Pay with Native Token</span>
      </div>

      {/* Tabs / Seed Selection */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {SEED_TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              activeTab === tier.id
                ? `${tier.bg} ${tier.color} text-white shadow-lg scale-105`
                : 'bg-[#3e2723]/50 border-transparent text-[#ffecb3]/70 hover:bg-[#3e2723] hover:text-[#ffecb3]'
            }`}
          >
            <span className="text-sm font-bold">{tier.name}</span>
            <span className="text-[10px] opacity-70">{tier.priceLabel}</span>
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="bg-[#3e2723]/40 rounded-xl p-4 mb-6 border-2 border-[#3e2723]/30">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
          {activeTier?.emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`aspect-square flex items-center justify-center text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                selectedEmoji === emoji
                  ? 'border-[#aed581] bg-[#aed581]/20 shadow-[0_0_15px_rgba(174,213,129,0.3)]'
                  : 'border-transparent bg-[#4e342e] hover:border-[#aed581]/50'
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
          className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group game-btn ${
            isPending || !selectedEmoji
              ? 'opacity-50 cursor-not-allowed grayscale'
              : 'hover:brightness-110'
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
        <p className="text-center text-[10px] text-[#ffecb3] opacity-70 font-mono mt-2">
            {activeTier?.name} seeds grant {activeTier?.sub}
        </p>
      </div>

      {isSuccess && (
        <div className="mt-4 p-3 bg-[#aed581]/20 border-2 border-[#aed581] rounded-lg text-[#aed581] text-center text-sm font-bold animate-pulse flex items-center justify-center gap-2">
          <span>🎉</span> Harvest Successful! Check the grid.
        </div>
      )}
    </div>
  );
}
