"use client";

import React, { useState, useEffect } from 'react';
import FarmGrid from '@/components/FarmGrid';
import { Tractor, Info, RefreshCw, Share2, Wallet, User, Loader2, Trophy } from 'lucide-react';
import { useFarcaster } from '@/hooks/useFarcaster';
import { NETWORKS } from '@/constants';
import { useFarmStats } from '@/hooks/useFarmStats';
import { useWaterPlant } from '@/hooks/useWaterPlant';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

export default function Home() {
  const { user } = useFarcaster();
  const { address: connectedAddress } = useAccount();

  // Prioritize connected wallet address
  const targetAddress = connectedAddress;

  const { userXP, userStreak, lastActionTimestamp, isLoading: statsLoading, refetch: refetchStats } = useFarmStats(targetAddress);
  const { waterPlant, isPending: isWatering, isSuccess: isWatered } = useWaterPlant();

  // State to track if we've shown the success alert/toast
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  const [selectedCell, setSelectedCell] = useState<{ networkId: string; dayIndex: number }>({
    networkId: NETWORKS[0].id, // Base
    dayIndex: new Date().getDate() - 1, // Default to today
  });

  // Effect to handle success state
  useEffect(() => {
    if (isWatered && !hasShownSuccess) {
      alert("Harvested! 🌿");
      setHasShownSuccess(true);
      refetchStats(); // Refresh stats after watering
    }
  }, [isWatered, hasShownSuccess, refetchStats]);

  // Reset success state when watering starts again
  useEffect(() => {
    if (isWatering) {
      setHasShownSuccess(false);
    }
  }, [isWatering]);


  const currentNetwork = NETWORKS.find(n => n.id === selectedCell.networkId);

  // Calculate cell value locally for the button logic
  // This mirrors the logic in FarmGrid, but applied to the single selected cell
  const getSelectedCellValue = () => {
    // Only 'base' is dynamic for now
    if (selectedCell.networkId !== 'base') return 0;

    const todayIndex = new Date().getDate() - 1;

    // If future, return 0 (or handle as disabled)
    if (selectedCell.dayIndex > todayIndex) return 0;

    const streak = Number(userStreak || 0);
    const lastActionTime = Number(lastActionTimestamp || 0);

    const now = new Date();
    const lastActionDate = new Date(lastActionTime * 1000);
    const isActionToday = lastActionTime > 0 &&
      lastActionDate.getDate() === now.getDate() &&
      lastActionDate.getMonth() === now.getMonth() &&
      lastActionDate.getFullYear() === now.getFullYear();

    // If selected today
    if (selectedCell.dayIndex === todayIndex) {
       return (isActionToday && streak > 0) ? 2 : 0;
    }

    // If selected past day
    let daysToHighlight = streak;
    if (isActionToday) daysToHighlight = streak - 1;

    const rangeEnd = todayIndex - 1;
    const rangeStart = rangeEnd - daysToHighlight + 1;

    if (selectedCell.dayIndex >= rangeStart && selectedCell.dayIndex <= rangeEnd) {
      return 1;
    }

    return 0;
  };

  const cellValue = getSelectedCellValue();

  const handleWaterPlant = () => {
    // Check if we are trying to water today's cell on Base network
    const todayIndex = new Date().getDate() - 1;
    if (selectedCell.networkId === 'base' && selectedCell.dayIndex === todayIndex && cellValue === 0) {
      waterPlant();
    }
  };

  // Button Logic
  let buttonText = "WATER PLANT";
  let buttonDisabled = false;
  let buttonColorClass = "bg-[#1a1d2d] hover:bg-[#23273a] text-gray-400 hover:text-white border-gray-700";

  if (cellValue === 1) {
    buttonText = "HARVESTED";
    buttonDisabled = true;
    buttonColorClass = "bg-green-900/20 text-green-500 border-green-900/50 cursor-not-allowed";
  } else if (cellValue === 2) {
    buttonText = "STREAK ACTIVE";
    buttonDisabled = true;
    buttonColorClass = "bg-orange-900/20 text-orange-500 border-orange-900/50 cursor-not-allowed";
  } else if (isWatering) {
    buttonText = "WATERING...";
    buttonDisabled = true;
  } else {
    // Enabled state (Empty cell)
    // Only enable if it's today and empty? Or can we water past days?
    // Usually only today.
    const todayIndex = new Date().getDate() - 1;
    const isToday = selectedCell.dayIndex === todayIndex;

    if (isToday) {
      buttonColorClass = "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-900/20";
    } else {
      buttonText = "MISSED"; // Or just keep "WATER PLANT" but disabled?
      buttonDisabled = true;
      buttonColorClass = "cursor-not-allowed opacity-50";
    }
  }

  // Display values
  // XP Adjustment: The contract returns 100 XP per action. The user wants to see "1 XP".
  const rawXP = userXP ? Number(userXP) : 0;
  const displayXP = Math.floor(rawXP / 100).toString();

  // Streak Display Logic
  const isBase = selectedCell.networkId === 'base';
  const streakTitle = isBase ? "Base Streak" : `${currentNetwork?.name || 'Network'} Streak`;
  const streakValue = isBase ? (userStreak ? userStreak.toString() : '0') : '0';

  return (
    <main className="min-h-screen bg-[#09090b] text-white p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navbar */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <Tractor className="text-black" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FARMCASTER</h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
             <div className="hidden md:flex items-center gap-4 text-gray-400">
                <Info size={20} className="hover:text-white cursor-pointer" />
                <RefreshCw size={20} className="hover:text-white cursor-pointer" onClick={() => refetchStats()} />
                <Share2 size={20} className="hover:text-white cursor-pointer" />
             </div>

             <button className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-white/50 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all">
                <Trophy size={18} />
                <span className="font-bold">Leaderboard</span>
             </button>

             <button className="flex items-center gap-2 bg-[#11131F] border border-green-900/50 hover:border-green-500/50 text-green-500 px-4 py-2 rounded-lg transition-all">
                <Wallet size={18} />
                <span className="font-mono font-bold">
                  {targetAddress ? `${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}` : (user?.username ? `@${user.username}` : 'Connect Wallet')}
                </span>
             </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile Card */}
          <div className="bg-[#11131F] border border-gray-800 p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50 overflow-hidden">
                   {user?.pfpUrl ? (
                     <img
                       src={user.pfpUrl}
                       alt={user.username || 'User'}
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <User className="text-purple-400" size={24} />
                   )}
                </div>
                <div>
                   <p className="text-gray-400 text-xs uppercase font-bold mb-1">Farmer Profile</p>
                   <h3 className="text-xl font-bold">
                     {user?.username ? `@${user.username}` : (targetAddress ? 'Connected' : '@...')}
                   </h3>
                </div>
             </div>

             <div className="text-right relative z-10">
                 <div className="text-yellow-400 font-bold text-2xl flex items-center gap-1 justify-end">
                    🏆 {statsLoading ? '...' : displayXP} XP
                 </div>
                 <p className="text-gray-500 text-xs">Harvest Points</p>
             </div>

             {/* Decorative background glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full pointer-events-none" />
          </div>

          {/* Streak Card */}
          <div className="bg-[#11131F] border border-gray-800 p-6 rounded-xl flex items-center justify-between relative overflow-hidden">
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                   <div className="text-2xl">🔥</div>
                </div>
                <div>
                   <p className="text-gray-400 text-xs uppercase font-bold mb-1">{streakTitle}</p>
                   <h3 className="text-orange-500 font-bold text-2xl">
                     {statsLoading ? '...' : streakValue} Days 🔥
                   </h3>
                </div>
             </div>

             <div className="text-right max-w-[150px] relative z-10">
                 <p className="text-gray-500 text-xs leading-relaxed">
                   Keep the streak alive! Harvest daily.
                 </p>
             </div>

             {/* Decorative background glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[50px] rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Main Grid */}
        <FarmGrid
          selectedCell={selectedCell}
          onSelect={setSelectedCell}
          userStreak={Number(userStreak)}
          lastActionTimestamp={Number(lastActionTimestamp)}
        />

        {/* Action Area & Daily Task */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Action Area */}
           <div className="md:col-span-2 bg-[#11131F] border border-gray-800 p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                 <span className="text-yellow-500">⚡</span>
                 <h3 className="font-bold text-gray-300 text-sm tracking-wide uppercase">ACTION AREA</h3>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${currentNetwork?.color || 'bg-gray-600'}`}>
                       {currentNetwork && <currentNetwork.icon size={32} className={currentNetwork.text || 'text-white'} />}
                    </div>
                    <div>
                       <h2 className="text-3xl font-bold">{currentNetwork?.name || 'Unknown'} <span className="text-lg text-gray-500 font-normal">Network</span></h2>
                       <p className="text-green-500 font-mono text-sm">Day {selectedCell.dayIndex + 1} — {new Date().toLocaleString('en-US', { month: 'long' })}</p>
                    </div>
                 </div>

                 <button
                    onClick={handleWaterPlant}
                    disabled={buttonDisabled}
                    className={`w-full md:w-auto px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all border ${buttonColorClass}`}
                 >
                    {isWatering ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                           {cellValue === 1 && <span>✅</span>}
                           {cellValue === 2 && <span>🔥</span>}
                           {cellValue === 0 && <span className="group-hover:rotate-12 transition-transform duration-300">💧</span>}
                        </>
                    )}
                    <span className="font-bold tracking-wide">{buttonText}</span>
                 </button>
              </div>

              {/* Decorative background glow */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
           </div>

           {/* Daily Task */}
           <div className="bg-[#11131F] border border-gray-800 p-6 rounded-xl relative overflow-hidden">
               <div className="flex items-center gap-2 mb-4">
                 <span className="text-blue-400">🗳️</span>
                 <h3 className="font-bold text-gray-300 text-sm tracking-wide uppercase">DAILY QUEST</h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                 Share your daily activity on Farcaster and earn extra XP.
              </p>

               {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full pointer-events-none" />
           </div>
        </div>

      </div>
    </main>
  );
}
