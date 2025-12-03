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
    color: 'border-gray-300',
    bg: 'bg-gray-100',
    activeBg: 'bg-gray-200',
    emojis: ['🌱', '🌿', '🍃', '🎍']
  },
  {
    id: 1,
    name: 'Fruits',
    sub: '2 XP',
    priceLabel: '$0.10',
    priceValue: '0.00003', // ~10 Cent
    color: 'border-blue-300',
    bg: 'bg-blue-50',
    activeBg: 'bg-blue-100',
    emojis: ['🫐','🍋','🌽','🍇','🍄','🍓','🍆','🥥','🍒','🥕','🥦','🍅','🥝','🥑','🫒','🥜','🥒','🌶️']
  },
  {
    id: 2,
    name: 'Flowers',
    sub: '3 XP',
    priceLabel: '$0.15',
    priceValue: '0.000045', // ~15 Cent
    color: 'border-pink-300',
    bg: 'bg-pink-50',
    activeBg: 'bg-pink-100',
    emojis: ['🌻','🌹','🌷','🪷','🌺','🌸','🌼','💐','🥀','💮','🏵️','🪻']
  },
  {
    id: 3,
    name: 'Trees',
    sub: '5 XP',
    priceLabel: '$0.20',
    priceValue: '0.00006', // ~20 Cent
    color: 'border-green-300',
    bg: 'bg-green-50',
    activeBg: 'bg-green-100',
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
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-green-700 flex items-center gap-2">
          <ShoppingBag className="text-green-500" />
          Seed Market
        </h3>
        <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded">Pay with Native Token</span>
      </div>

      {/* Tabs / Seed Selection */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {SEED_TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
              activeTab === tier.id
                ? `${tier.activeBg} ${tier.color} text-gray-800 shadow-sm scale-105`
                : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm font-bold">{tier.name}</span>
            <span className="text-[10px] opacity-70">{tier.priceLabel}</span>
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border-2 border-dashed border-gray-200">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
          {activeTier?.emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`aspect-square flex items-center justify-center text-2xl rounded-lg transition-all hover:scale-110 ${
                selectedEmoji === emoji
                  ? 'bg-white shadow-md border-2 border-green-400'
                  : 'bg-gray-200/50 hover:bg-white hover:shadow-sm'
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
          className={`w-full pill-btn flex items-center justify-center gap-3 relative overflow-hidden group ${
            isPending || !selectedEmoji
              ? 'opacity-50 cursor-not-allowed grayscale'
              : 'hover:brightness-105'
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
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">
            {activeTier?.name} seeds grant {activeTier?.sub}
        </p>
      </div>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-center text-sm font-bold animate-pulse flex items-center justify-center gap-2">
          <span>🎉</span> Harvest Successful! Check the grid.
        </div>
      )}
    </div>
  );
}
