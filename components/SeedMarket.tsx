import React, { useState } from 'react';
import { parseEther } from 'viem';
import { Loader2, Sprout } from 'lucide-react';

interface Seed {
  id: number;
  emoji: string;
  name: string;
}

interface SeedCategory {
  name: string;
  price: string;
  ethPrice: string;
  seeds: Seed[];
}

interface SeedMarketProps {
  onPlant: (seedId: number, value: bigint) => void;
  isPending: boolean;
  disabled?: boolean;
}

const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: 'Fruits',
    price: '$0.15',
    ethPrice: '0.00005',
    seeds: [
      { id: 1, emoji: '🍇', name: 'Grapes' },
      { id: 1, emoji: '🍓', name: 'Strawberry' },
      { id: 1, emoji: '🍋', name: 'Lemon' },
      { id: 1, emoji: '🍒', name: 'Cherry' },
    ]
  },
  {
    name: 'Flowers',
    price: '$0.30',
    ethPrice: '0.0001',
    seeds: [
      { id: 2, emoji: '🌹', name: 'Rose' },
      { id: 2, emoji: '🌻', name: 'Sunflower' },
      { id: 2, emoji: '🌷', name: 'Tulip' },
      { id: 2, emoji: '🪷', name: 'Lotus' },
    ]
  },
  {
    name: 'Trees',
    price: '$0.60',
    ethPrice: '0.0002',
    seeds: [
      { id: 3, emoji: '🌳', name: 'Deciduous' },
      { id: 3, emoji: '🌲', name: 'Evergreen' },
      { id: 3, emoji: '🌴', name: 'Palm' },
      { id: 3, emoji: '🌵', name: 'Cactus' },
    ]
  }
];

export default function SeedMarket({ onPlant, isPending, disabled }: SeedMarketProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);

  const handlePlant = (isFree: boolean) => {
    if (isFree) {
      onPlant(0, BigInt(0));
    } else if (selectedSeed) {
      const category = SEED_CATEGORIES[activeTab];
      onPlant(selectedSeed.id, parseEther(category.ethPrice));
    }
  };

  const currentCategory = SEED_CATEGORIES[activeTab];

  return (
    <div className="bg-[#0f1218] rounded-xl border border-white/10 p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-600/20 p-2 rounded-lg text-green-500">
          <Sprout size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Seed Market</h2>
          <p className="text-gray-400 text-xs">Purchase and plant exotic seeds</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {SEED_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.name}
            onClick={() => {
              setActiveTab(idx);
              setSelectedSeed(null);
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border
              ${activeTab === idx
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-[#1a1f2e] border-white/5 text-gray-400 hover:text-white hover:border-white/20'}
            `}
          >
            {cat.name} <span className="text-blue-200 opacity-70">({cat.price})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {currentCategory.seeds.map((seed, idx) => (
          <button
            key={`${seed.id}-${idx}`}
            onClick={() => setSelectedSeed(seed)}
            className={`
              aspect-square rounded-xl text-3xl flex items-center justify-center transition-all border-2
              ${selectedSeed === seed
                ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105'
                : 'bg-[#1a1f2e] border-white/5 hover:border-white/20 hover:bg-[#252a3d]'}
            `}
          >
            {seed.emoji}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handlePlant(false)}
          disabled={disabled || !selectedSeed || isPending}
          className={`
            w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
            ${disabled || !selectedSeed || isPending
              ? 'bg-[#1a1f2e] text-gray-500 border border-white/5 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 shadow-lg shadow-blue-500/20'}
          `}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
             <>
               {selectedSeed ? `Plant ${selectedSeed.emoji}` : 'Select a Seed'}
               {selectedSeed && <span className="opacity-70 text-sm font-normal">for {currentCategory.ethPrice} ETH</span>}
             </>
          )}
        </button>

        <button
          onClick={() => handlePlant(true)}
          disabled={disabled || isPending}
          className={`
            w-full py-2 rounded-xl text-sm font-bold transition-all border
            ${disabled || isPending
              ? 'text-gray-600 border-transparent cursor-not-allowed'
              : 'text-gray-400 border-white/10 hover:bg-white/5 hover:text-white'}
          `}
        >
          Or plant basic Sprout 🌱 (Free)
        </button>
      </div>
    </div>
  );
}
