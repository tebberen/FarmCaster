import React, { useState } from 'react';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { parseEther } from 'viem';
import { Loader2, Sprout, ShoppingBag } from 'lucide-react';

// CATALOG CONFIGURATION
// Prices are in ETH/Native Token (Approximate for logic)
const SEED_TIERS = [
  {
    id: 0,
    name: 'Starter',
    priceLabel: 'Free',
    priceValue: '0',
    color: 'border-gray-500',
    bg: 'bg-gray-800',
    emojis: ['🌱', '🌿', '🍃', '🎍']
  },
  {
    id: 1,
    name: 'Fruits ($0.10)',
    priceLabel: '0.00005 ETH',
    priceValue: '0.0000003', // Matches contract logic
    color: 'border-blue-500',
    bg: 'bg-blue-900/20',
    emojis: ['🫐','🍋','🌽','🍇','🍄','🍓','🍆','🥥','🍒','🥕','🥦','🍅','🥝','🥑','🫒','🥜','🥒','🌶️']
  },
  {
    id: 2,
    name: 'Flowers ($0.15)',
    priceLabel: '0.00010 ETH',
    priceValue: '0.00000045', // Matches contract logic
    color: 'border-pink-500',
    bg: 'bg-pink-900/20',
    emojis: ['🌻','🌹','🌷','🪷','🌺','🌸','🌼','💐','🥀','💮','🏵️','🪻']
  },
  {
    id: 3,
    name: 'Trees ($0.20)',
    priceLabel: '0.00020 ETH',
    priceValue: '0.0000006', // Matches contract logic
    color: 'border-green-500',
    bg: 'bg-green-900/20',
    emojis: ['🌳','🌲','🌴','🌵','🎄','🎋','🪵','🪴','🌲','🍂','🍁']
  }
];

export default function SeedMarket() {
  const { plant: waterPlant, isPending, isSuccess } = useWaterPlant();
  const [activeTab, setActiveTab] = useState(1); // Default to Fruits
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const activeTier = SEED_TIERS.find(t => t.id === activeTab);

  const handlePlant = () => {
    if (!activeTier) return;
    // Call contract with Seed ID (0, 1, 2, 3) and Price
    // Note: The specific emoji is visual only for now, the contract tracks the Tier.
    waterPlant(activeTier.id, parseEther(activeTier.priceValue));
  };

  return (
    <div className="bg-[#151515] border border-white/10 rounded-xl p-6 w-full shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="text-green-400" />
          Seed Market
        </h3>
        <span className="text-xs text-gray-500 font-mono">Pay with Native Token</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        {SEED_TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === tier.id
                ? `${tier.bg} ${tier.color} text-white shadow-lg`
                : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:bg-[#252525]'
            }`}
          >
            {tier.name}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 mb-6 max-h-48 overflow-y-auto custom-scrollbar p-1">
        {activeTier?.emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => setSelectedEmoji(emoji)}
            className={`aspect-square flex items-center justify-center text-2xl rounded-xl border-2 transition-all hover:scale-110 hover:shadow-lg ${
              selectedEmoji === emoji
                ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'border-transparent bg-[#1e1e1e] hover:border-white/20'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <div className="space-y-3">
        <button
          onClick={handlePlant}
          disabled={isPending || !selectedEmoji}
          className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
            isPending || !selectedEmoji
              ? 'bg-[#252525] text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-xl hover:shadow-green-500/20'
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Planting...
            </>
          ) : (
            <>
              <Sprout size={24} className={selectedEmoji ? "animate-bounce" : ""} />
              {selectedEmoji ? `Plant ${selectedEmoji} for ${activeTier?.priceLabel}` : 'Select a Seed'}
            </>
          )}
        </button>

        {/* Free Option Quick Link (If not on Free tab) */}
        {activeTab !== 0 && (
          <button
            onClick={() => { setActiveTab(0); setSelectedEmoji('🌱'); }}
            className="w-full text-center text-xs text-gray-500 hover:text-green-400 transition-colors"
          >
            Or plant a basic Sprout 🌱 (Free)
          </button>
        )}
      </div>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400 text-center text-sm font-bold animate-pulse flex items-center justify-center gap-2">
          <span>🎉</span> Harvest Successful! Check the grid.
        </div>
      )}
    </div>
  );
}
