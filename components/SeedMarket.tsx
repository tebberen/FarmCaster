import React, { useState } from 'react';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { parseEther } from 'viem';
import { Loader2, Sprout, ShoppingBag } from 'lucide-react';

const SEED_TIERS = [
  { id: 0, name: 'Starter (1 XP)', priceLabel: 'Free', priceValue: '0', bg: 'bg-gray-700', emojis: ['🌱','🌿'] },
  { id: 1, name: 'Fruits ($0.10)', priceLabel: '$0.10', priceValue: '0.00003', bg: 'bg-blue-600', emojis: ['🫐','🍋','🌽','🍇','🍄','🍓','🍆','🥥','🍒'] },
  { id: 2, name: 'Flowers ($0.15)', priceLabel: '$0.15', priceValue: '0.000045', bg: 'bg-pink-600', emojis: ['🌻','🌹','🌷','🪷','🌺','🌸','🌼'] },
  { id: 3, name: 'Trees ($0.20)', priceLabel: '$0.20', priceValue: '0.00006', bg: 'bg-green-700', emojis: ['🌳','🌲','🌴','🌵','🎄'] }
];

export default function SeedMarket() {
  const { waterPlant, isPending, isSuccess } = useWaterPlant();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const activeTier = SEED_TIERS.find(t => t.id === activeTab);

  const handlePlant = () => { if(activeTier) waterPlant(activeTier.id, parseEther(activeTier.priceValue)); };

  return (
    <div className="wood-panel p-6 w-full mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#3e2723] flex items-center gap-2"><ShoppingBag /> Seed Market</h3>
        <span className="text-xs font-bold text-[#5d4037]">Pay with Native Token</span>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {SEED_TIERS.map(tier => (
          <button key={tier.id} onClick={() => { setActiveTab(tier.id); setSelectedEmoji(null); }} className={`px-3 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-all ${activeTab === tier.id ? tier.bg : 'bg-[#a1887f]'}`}>
            {tier.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-4 bg-[#4e342e] p-3 rounded-xl border-2 border-[#3e2723] shadow-inner">
        {activeTier?.emojis.map(emoji => (
          <button key={emoji} onClick={() => setSelectedEmoji(emoji)} className={`aspect-square flex items-center justify-center text-2xl rounded-lg transition-all ${selectedEmoji === emoji ? 'bg-white/20 scale-110 shadow-lg' : 'hover:bg-white/10'}`}>{emoji}</button>
        ))}
      </div>

      <button onClick={handlePlant} disabled={isPending || !selectedEmoji} className={`w-full py-4 game-btn flex items-center justify-center gap-2 ${isPending || !selectedEmoji ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {isPending ? <Loader2 className="animate-spin"/> : <Sprout />}
        {selectedEmoji ? `Plant ${selectedEmoji} for ${activeTier?.priceLabel}` : 'Select a Seed'}
      </button>

      {isSuccess && <div className="mt-3 text-center text-green-800 font-bold bg-green-200 p-2 rounded border border-green-500">🎉 Planted Successfully!</div>}
    </div>
  );
}
