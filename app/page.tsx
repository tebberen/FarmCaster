'use client';

import React, { useState } from 'react';
import FarmGrid from '@/components/FarmGrid';
import LeaderboardModal from '@/components/LeaderboardModal';
import WeatherOverlay from '@/components/WeatherOverlay';
import BarnModal from '@/components/BarnModal';
import SeedMarket from '@/components/SeedMarket';
import { useFarmStats } from '@/hooks/useFarmStats';
import { useAccount, useSwitchChain } from 'wagmi';
import { Tractor, Flame, Trophy, Wallet, Warehouse } from 'lucide-react';
import { NETWORKS } from '@/constants';

export default function Home() {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const { statsMap, globalTotalXP, isLoading, history } = useFarmStats();

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isBarnOpen, setIsBarnOpen] = useState(false);

  // Determine Active Network Name
  const activeNetwork = NETWORKS.find(n =>
    (n.id === 'base' && chainId === 8453) ||
    (n.id === 'bsc' && chainId === 56) ||
    (n.id === 'arb' && chainId === 42161) ||
    (n.id === 'celo' && chainId === 42220) ||
    (n.id === 'eth' && chainId === 1) ||
    (n.id === 'monad' && chainId === 143) ||
    (n.id === 'hyperevm' && chainId === 999)
  );

  const activeNetworkName = activeNetwork?.name || "Unknown Network";
  const activeNetworkId = activeNetwork?.id || "base";

  // Extract Active Network Stats from Map
  const currentStats = (chainId && statsMap[chainId]) || { xp: 0, streak: 0, lastAction: 0 };
  const { streak: currentStreak, lastAction: currentLastAction, xp: currentXP } = currentStats;

  const handleNetworkSelect = (networkId: string) => {
    if (networkId === 'base') switchChain({ chainId: 8453 });
    if (networkId === 'bsc') switchChain({ chainId: 56 });
    if (networkId === 'arb') switchChain({ chainId: 42161 });
    if (networkId === 'celo') switchChain({ chainId: 42220 });
    if (networkId === 'eth') switchChain({ chainId: 1 });
    if (networkId === 'monad') switchChain({ chainId: 143 });
    if (networkId === 'hyperevm') switchChain({ chainId: 999 });
  };

  const isTodayDone = currentLastAction > 0 && new Date(currentLastAction * 1000).toDateString() === new Date().toDateString();

  return (
    <main className="min-h-screen selection:bg-green-500/30 font-sans relative">
      <WeatherOverlay />

      <nav className="sticky top-0 z-50 wood-texture mx-4 mt-4 mb-8 !rounded-xl !p-2">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#aed581] p-1.5 rounded-lg shadow-inner">
              <Tractor className="text-[#5d4037]" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-[#ffecb3] drop-shadow-md hidden md:block">
              FARM<span className="text-[#aed581]">CASTER</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <button
                onClick={() => setIsBarnOpen(true)}
                className="game-btn px-3 py-1.5 text-sm font-bold flex items-center gap-2"
             >
                <Warehouse size={16} />
                Barn
             </button>
             <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="game-btn px-3 py-1.5 text-sm font-bold flex items-center gap-2"
             >
                <Trophy size={16} />
                Leaderboard
             </button>
             <div className="flex items-center gap-2 bg-[#3e2723] border-2 border-[#5d4037] text-[#ffecb3] px-3 py-1.5 rounded-lg text-sm font-bold shadow-inner">
               <Wallet size={16} />
               {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
             </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="wood-texture p-6 flex items-center justify-between relative overflow-hidden">
             <div className="flex items-center gap-4 z-10">
               <div className="w-12 h-12 rounded-full bg-[#3e2723] flex items-center justify-center text-xl border-2 border-[#5d4037] shadow-inner">🧑‍🌾</div>
               <div>
                 <p className="text-[#ffecb3] opacity-80 text-xs font-mono uppercase tracking-widest">Global XP</p>
                 <h2 className="text-lg font-bold text-white drop-shadow-md">Farmer Level {Math.floor(globalTotalXP / 1000) + 1}</h2>
               </div>
             </div>
             <div className="text-right z-10">
               <h3 className="text-2xl font-black text-[#ffecb3] flex items-center justify-end gap-2 drop-shadow-md">
                 <Trophy size={20} className="text-yellow-400" />
                 {globalTotalXP} XP
               </h3>
               <p className="text-xs text-[#ffecb3] opacity-80">Total Harvest Points</p>
             </div>
          </div>

          <div className="wood-texture p-6 flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-full bg-[#3e2723] flex items-center justify-center border-2 border-[#5d4037] shadow-inner">
                <Flame className="text-orange-500" size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-[#ffecb3] opacity-80 text-xs font-mono uppercase tracking-widest">{activeNetworkName} Streak</p>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">{currentStreak} Days 🔥</h2>
              </div>
            </div>
            <div className="text-right max-w-[150px] z-10 hidden md:block">
              <p className="text-xs text-[#ffecb3] opacity-80 leading-relaxed">Keep the streak alive! Harvest daily.</p>
            </div>
          </div>
        </div>

        {/* The Grid */}
        <FarmGrid
          statsMap={statsMap}
          onNetworkSelect={handleNetworkSelect}
          activeNetworkId={activeNetworkId}
          history={history}
        />

        {/* Action Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2">
             {/* Replaced the old Action Area card with the Market */}
             <SeedMarket />
          </div>

          <div className="wood-texture p-6 flex flex-col justify-center">
            <h4 className="text-[#ffecb3] text-xs font-bold uppercase mb-2 flex items-center gap-2 drop-shadow-md">
              <span className="text-lg">🎁</span> DAILY QUEST
            </h4>
            <p className="text-sm text-[#ffecb3] opacity-80 leading-relaxed font-bold">
              Share your daily activity on Farcaster to earn <span className="text-[#aed581] font-black">+50 XP</span> bonus.
            </p>
          </div>
        </div>
      </div>

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <BarnModal
        isOpen={isBarnOpen}
        onClose={() => setIsBarnOpen(false)}
        currentNetworkId={activeNetworkId}
        userXP={Number(currentXP)}
      />
    </main>
  );
}
