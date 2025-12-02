'use client';

import React, { useState } from 'react';
import FarmGrid from '@/components/FarmGrid';
import LeaderboardModal from '@/components/LeaderboardModal';
import WeatherOverlay from '@/components/WeatherOverlay';
import BarnModal from '@/components/BarnModal';
import SeedMarket from '@/components/SeedMarket';
import { useFarmStats } from '@/hooks/useFarmStats';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { useAccount, useSwitchChain } from 'wagmi';
import { Tractor, Flame, Trophy, Wallet, Warehouse } from 'lucide-react';
import { NETWORKS } from '@/constants';

export default function Home() {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const { statsMap, globalTotalXP, isLoading } = useFarmStats();
  const { plant, isPending } = useWaterPlant();

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

  let isDisabled = false;

  if (!address) {
    isDisabled = true;
  } else if (isLoading) {
    isDisabled = true;
  } else if (isTodayDone) {
    isDisabled = true;
  } else if (isPending) {
    isDisabled = true;
  }

  const handlePlant = (seedId: number, value: bigint) => {
    plant(seedId, value);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30 font-sans relative">
      <WeatherOverlay />

      <nav className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <Tractor className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white hidden md:block">
              FARM<span className="text-gray-400">CASTER</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <button
                onClick={() => setIsBarnOpen(true)}
                className="flex items-center gap-2 border border-white/20 hover:border-blue-500 text-gray-300 hover:text-blue-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
             >
                <Warehouse size={16} />
                Barn
             </button>
             <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="flex items-center gap-2 border border-white/20 hover:border-yellow-500 text-gray-300 hover:text-yellow-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
             >
                <Trophy size={16} />
                Leaderboard
             </button>
             <div className="flex items-center gap-2 bg-[#1a1f2e] border border-green-900/50 text-green-400 px-3 py-1.5 rounded-lg text-sm font-bold">
               <Wallet size={16} />
               {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
             </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0f1218] p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden">
             <div className="flex items-center gap-4 z-10">
               <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl border border-indigo-500/30">🧑‍🌾</div>
               <div>
                 <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">Global XP</p>
                 <h2 className="text-lg font-bold text-white">Farmer Level {Math.floor(globalTotalXP / 1000) + 1}</h2>
               </div>
             </div>
             <div className="text-right z-10">
               <h3 className="text-2xl font-black text-yellow-400 flex items-center justify-end gap-2">
                 <Trophy size={20} />
                 {globalTotalXP} XP
               </h3>
               <p className="text-xs text-gray-500">Total Harvest Points</p>
             </div>
          </div>

          <div className="bg-[#0f1218] p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-full bg-orange-900/20 flex items-center justify-center border border-orange-500/30">
                <Flame className="text-orange-500" size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">{activeNetworkName} Streak</p>
                <h2 className="text-2xl font-bold text-white">{currentStreak} Days 🔥</h2>
              </div>
            </div>
            <div className="text-right max-w-[150px] z-10 hidden md:block">
              <p className="text-xs text-gray-500 leading-relaxed">Keep the streak alive! Harvest daily.</p>
            </div>
          </div>
        </div>

        {/* The Grid */}
        <FarmGrid
          statsMap={statsMap}
          onNetworkSelect={handleNetworkSelect}
          activeNetworkId={activeNetworkId}
        />

        {/* Action Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#0f1218] rounded-xl border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

             <div className="w-full h-full flex flex-col gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${isTodayDone ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest">ACTION AREA</h4>
                  </div>
                  <h2 className="text-3xl font-bold text-white">{activeNetworkName} Network</h2>
                  <p className="text-green-400 text-sm font-mono mt-1">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • {isTodayDone ? 'Harvested' : 'Ready to Harvest'}
                  </p>
                </div>

                <div className="w-full">
                  <SeedMarket
                    onPlant={handlePlant}
                    isPending={isPending}
                    disabled={isDisabled}
                  />
                </div>
             </div>
          </div>

          <div className="bg-[#0f1218] rounded-xl border border-white/10 p-6 flex flex-col justify-center">
            <h4 className="text-purple-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
              <span className="text-lg">🎁</span> DAILY QUEST
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Share your daily activity on Farcaster to earn <span className="text-yellow-400 font-bold">+50 XP</span> bonus.
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
