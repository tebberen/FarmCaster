"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Tractor, User, Droplets } from "lucide-react";
import { useWriteContract, useAccount, useSwitchChain, usePublicClient, useReadContract } from "wagmi";
import { GARDEN_CONTRACTS, GARDEN_ABI, HUB_CONTRACTS, HUB_ABI } from "../config/contracts";
import { parseAbiItem } from "viem";

const NETWORKS = [
  { id: "base", name: "Base", color: "bg-blue-600" },
  { id: "bsc", name: "BSC", color: "bg-yellow-500" },
  { id: "eth", name: "Ethereum", color: "bg-slate-600" },
  { id: "arb", name: "Arbitrum", color: "bg-cyan-600" },
  { id: "monad", name: "Monad", color: "bg-purple-600" },
  { id: "hyper", name: "HyperEVM", color: "bg-pink-600" },
  { id: "celo", name: "Celo", color: "bg-green-500" },
];

const SEEDS = [
  { id: "starter", name: "Starter", price: "Free", xp: 1, icon: "🌱" },
  { id: "fruits", name: "Fruits", price: "$0.10", xp: 2, icon: "🍒" },
  { id: "flowers", name: "Flowers", price: "$0.15", xp: 3, icon: "🌻" },
  { id: "trees", name: "Trees", price: "$0.20", xp: 5, icon: "🌲" },
];

// Map network IDs to Chain IDs
const CHAIN_IDS: Record<string, number> = {
  base: 8453, bsc: 56, eth: 1, arb: 42161,
  monad: 10143, hyper: 999, celo: 42220
};

// Helper for date formatting DD/MM/YYYY
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function FarmCaster() {
  const [selectedSeed, setSelectedSeed] = useState(SEEDS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

  // Data Viz State
  const [viewMode, setViewMode] = useState<'7d' | 'month'>('7d');
  // Map date string (DD/MM/YYYY) -> seedId (number)
  const [plantingHistory, setPlantingHistory] = useState<Map<string, number>>(new Map());

  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending, error: writeError } = useWriteContract();

  // Fetch XP
  const { data: userXP } = useReadContract({
    address: HUB_CONTRACTS[selectedNetwork.id],
    abi: HUB_ABI,
    functionName: "userXP",
    args: address ? [address] : undefined,
    chainId: CHAIN_IDS[selectedNetwork.id],
    query: {
        enabled: !!address,
        refetchInterval: 5000
    }
  });

  // Client for fetching logs
  const publicClient = usePublicClient({
    chainId: CHAIN_IDS[selectedNetwork.id]
  });

  // 1. AUTO-SYNC: If wallet changes network, update UI
  useEffect(() => {
    if (chain) {
      const match = NETWORKS.find(n => CHAIN_IDS[n.id] === chain.id);
      if (match) setSelectedNetwork(match);
    }
  }, [chain]);

  // Fetch History Logs
  useEffect(() => {
    let isMounted = true;

    // Clear history when switching networks to avoid stale data
    setPlantingHistory(new Map());

    async function fetchHistory() {
        if (!address || !publicClient) return;

        const contractAddress = GARDEN_CONTRACTS[selectedNetwork.id];
        if (!contractAddress) return;

        try {
            const logs = await publicClient.getLogs({
                address: contractAddress,
                event: parseAbiItem('event SeedPlanted(address indexed user, uint256 indexed seedId, uint256 pricePaid)'),
                args: { user: address },
                fromBlock: 'earliest'
            });

            if (!isMounted) return;

            // Optimization: Fetch blocks in parallel
            // Note: In a real app with many logs, we should batch these or use an indexer.
            const blockPromises = logs.map(log =>
                publicClient.getBlock({ blockNumber: log.blockNumber })
            );

            const blocks = await Promise.all(blockPromises);

            if (!isMounted) return;

            const historyMap = new Map<string, number>();

            // Iterate logs and blocks together.
            // Logs are returned in chronological order by default from getLogs (by block number, then log index).
            // So processing them in order ensures the last one overwrites previous ones for the same day.
            for (let i = 0; i < logs.length; i++) {
                const log = logs[i];
                const block = blocks[i];
                if (!block) continue;

                const date = new Date(Number(block.timestamp) * 1000);
                const dateStr = formatDate(date);

                // log.args.seedId is a bigint
                const seedId = Number(log.args.seedId);
                historyMap.set(dateStr, seedId);
            }

            setPlantingHistory(historyMap);
        } catch (e) {
            console.error("Error fetching history:", e);
        }
    }

    fetchHistory();

    return () => { isMounted = false; };
  }, [address, selectedNetwork.id, publicClient]);


  const handlePlant = () => {
    if (!chain) return alert("Please connect wallet first");

    const targetChainId = CHAIN_IDS[selectedNetwork.id];

    if (chain.id !== targetChainId) {
      if (confirm(`Wrong Network! Switch to ${selectedNetwork.name}?`)) {
        switchChain({ chainId: targetChainId });
      }
      return;
    }

    const contractAddress = GARDEN_CONTRACTS[selectedNetwork.id];
    if (!contractAddress) return alert("Contract not defined");

    let seedId = 0n;
    let price = 0n;
    switch (selectedSeed.id) {
      case 'fruits': seedId = 1n; price = 30000000000000n; break;
      case 'flowers': seedId = 2n; price = 45000000000000n; break;
      case 'trees': seedId = 3n; price = 60000000000000n; break;
      default: seedId = 0n; price = 0n;
    }

    writeContract({
      address: contractAddress,
      abi: GARDEN_ABI,
      functionName: 'plant',
      args: [seedId],
      value: price,
    });
  };

  // Generate date list for grid
  const generateDates = (mode: '7d' | 'month') => {
      const dates = [];
      const today = new Date();

      if (mode === '7d') {
          // [Today - 6, ..., Today] -> Left is Oldest
          for (let i = 6; i >= 0; i--) {
              const d = new Date(today);
              d.setDate(today.getDate() - i);
              dates.push(formatDate(d));
          }
      } else {
          // [1st Day of Month, ..., Today]
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          const current = new Date(firstDay);

          while (current <= today) {
              dates.push(formatDate(current));
              current.setDate(current.getDate() + 1);
          }
      }
      return dates;
  };

  const gridDates = generateDates(viewMode);

  // Helper to get emoji for seedId
  const getSeedEmoji = (seedId: number) => {
      switch (seedId) {
          case 0: return "🌱";
          case 1: return "🍒";
          case 2: return "🌻";
          case 3: return "🌳";
          default: return "🌱";
      }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500 selection:text-white pb-24">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Tractor size={24} />
          <span className="font-bold text-lg tracking-tight">FarmCaster</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-sm border border-slate-700">
          <User size={16} className="text-slate-400" />
          <span className="font-medium">{address ? `${address.substring(0,6)}...` : 'Farmer'}</span>
          <span className="text-emerald-400 font-bold">| {userXP ? Number(userXP).toLocaleString() : '0'} XP</span>
        </div>
        <ConnectButton />
      </header>

      {/* CONTENT */}
      <div className="pt-20 px-4 max-w-3xl mx-auto space-y-8">
        {/* FARM GRID */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Planting History</h2>
            <div className="flex items-center gap-2">
                 <button
                    onClick={() => setViewMode('7d')}
                    className={`text-xs px-2 py-1 rounded ${viewMode === '7d' ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     7 Days
                 </button>
                 <button
                    onClick={() => setViewMode('month')}
                    className={`text-xs px-2 py-1 rounded ${viewMode === 'month' ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     This Month
                 </button>
            </div>
          </div>
          <div className="flex flex-col">
            {NETWORKS.map((net) => (
              <div key={net.id} className="flex items-center border-b border-slate-800 last:border-0 h-16 hover:bg-slate-800/30 transition-colors group">
                <div
                  className="w-[130px] flex-shrink-0 pl-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setSelectedNetwork(net)}
                >
                  <div className={`w-3 h-3 rounded-full ${net.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                  <span className={`text-sm font-medium transition-colors ${selectedNetwork.id === net.id ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {net.name}
                  </span>
                </div>
                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3 px-4 mask-linear-fade">
                   {gridDates.map((dateStr) => {
                     const isNetworkSelected = selectedNetwork.id === net.id;
                     const hasLog = isNetworkSelected && plantingHistory.has(dateStr);
                     const seedId = hasLog ? plantingHistory.get(dateStr) : null;

                     return (
                         <div
                            key={dateStr}
                            title={dateStr}
                            className={`w-10 h-10 flex-shrink-0 border rounded-lg flex items-center justify-center text-lg transition-all cursor-default
                                ${hasLog
                                    ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                    : 'bg-slate-800 border-slate-700 text-slate-600'}
                            `}
                         >
                           {hasLog && seedId !== null && seedId !== undefined ? getSeedEmoji(seedId) : ''}
                         </div>
                     );
                   })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEED MARKET */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Seed Market</h3>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {SEEDS.map((seed) => (
              <div
                key={seed.id}
                onClick={() => setSelectedSeed(seed)}
                className={`relative group bg-slate-900 border rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300
                  ${selectedSeed.id === seed.id
                    ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-900/10'
                    : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'}
                `}
              >
                <div className="text-4xl filter group-hover:scale-110 transition-transform duration-200 drop-shadow-lg">
                  {seed.icon}
                </div>
                <div className="text-center w-full">
                  <div className="text-xs font-bold text-white mb-1">{seed.name}</div>
                  <div className="text-[10px] text-slate-400 bg-slate-950/50 rounded-full py-1 px-2 border border-slate-800/50">
                    {seed.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ACTION PANEL */}
      <section className="fixed bottom-0 left-0 w-full p-4 bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800 z-40 pb-6">
         <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="hidden sm:flex flex-col min-w-[120px]">
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Summary</span>
               <div className="text-sm text-slate-300">
                  Planting <span className="text-white font-bold">{selectedSeed.name}</span> on <span className="text-emerald-400 font-bold">{selectedNetwork.name}</span>
               </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <button
                onClick={handlePlant}
                disabled={isPending}
                className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-lg py-3.5 rounded-xl shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Droplets size={20} className="fill-white" />
                {isPending ? "Planting..." : "PLANT SEED NOW"}
              </button>
              <div className="text-center">
                 <span className="text-[10px] text-slate-500">Cooldown: 1 min between plants</span>
              </div>
              {writeError && <div className="text-red-500 text-xs mt-2 text-center">{writeError.message.split('\n')[0]}</div>}
            </div>
         </div>
      </section>
    </main>
  );
}
