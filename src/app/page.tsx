"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Tractor, User, Droplets } from "lucide-react";
import { useWriteContract, useAccount, useSwitchChain, usePublicClient, useReadContract } from "wagmi";
import { GARDEN_CONTRACTS, GARDEN_ABI, HUB_CONTRACTS, HUB_ABI } from "../config/contracts";
import { BLOCKS_PER_DAY } from "../config/chainParams";
import { parseAbiItem } from "viem";
import { Calendar } from "../components/Calendar";

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

// Helper for date formatting YYYY-MM-DD
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export default function FarmCaster() {
  const [selectedSeed, setSelectedSeed] = useState(SEEDS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [isMounted, setIsMounted] = useState(false);

  // Map date string (YYYY-MM-DD) -> seedId (number)
  const [plantingHistory, setPlantingHistory] = useState<Map<string, number>>(new Map());

  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending, error: writeError } = useWriteContract();

  // Handle Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch XP
  const { data: userXP } = useReadContract({
    address: HUB_CONTRACTS[selectedNetwork.id],
    abi: HUB_ABI,
    functionName: "userXP",
    args: address ? [address] : undefined,
    chainId: CHAIN_IDS[selectedNetwork.id],
    query: {
        enabled: !!address && isMounted,
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
    let active = true;

    // Clear history when switching networks to avoid stale data
    setPlantingHistory(new Map());

    async function fetchHistory() {
        if (!address || !publicClient || !isMounted) return;

        const contractAddress = GARDEN_CONTRACTS[selectedNetwork.id];
        if (!contractAddress) return;

        try {
            const currentBlock = await publicClient.getBlockNumber();
            const blocksPerDay = BigInt(BLOCKS_PER_DAY(selectedNetwork.id));
            const totalBlocksToFetch = blocksPerDay * 32n;
            const startBlock = currentBlock - totalBlocksToFetch > 0n ? currentBlock - totalBlocksToFetch : 0n;

            // Maximum block range per request (conservative 20k to avoid RPC limits on L2s)
            const CHUNK_SIZE = 20000n;
            const chunks = [];

            for (let i = currentBlock; i > startBlock; i -= CHUNK_SIZE) {
                const to = i;
                const from = i - CHUNK_SIZE > startBlock ? i - CHUNK_SIZE : startBlock;
                chunks.push({ from, to });
            }

            // Fetch chunks in parallel (limited concurrency could be better but this is simple)
            // Flatten results
            const chunkPromises = chunks.map(({ from, to }) =>
                publicClient.getLogs({
                    address: contractAddress,
                    event: parseAbiItem('event SeedPlanted(address indexed user, uint256 indexed seedId, uint256 pricePaid)'),
                    args: { user: address },
                    fromBlock: from,
                    toBlock: to
                })
            );

            const nestedLogs = await Promise.all(chunkPromises);
            const logs = nestedLogs.flat();

            if (!active) return;

            // Optimization: Fetch blocks in parallel
            const blockPromises = logs.map(log =>
                publicClient.getBlock({ blockNumber: log.blockNumber })
            );

            const blocks = await Promise.all(blockPromises);

            if (!active) return;

            const historyMap = new Map<string, number>();

            // Iterate logs and blocks together.
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

    return () => { active = false; };
  }, [address, selectedNetwork.id, publicClient, isMounted]);


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

  // Generate date list for grid (Last 31 Days)
  const generateDates = () => {
      const dates = [];
      const today = new Date();
      // Generate last 31 days (Oldest to Today)
      for (let i = 30; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          dates.push(formatDate(d));
      }
      return dates;
  };

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

  // Only render content when mounted to prevent hydration mismatch
  if (!isMounted) return null;

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

        {/* NETWORK SELECTOR (Replaces old grid row headers) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {NETWORKS.map(net => (
                <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                        ${selectedNetwork.id === net.id
                            ? `bg-slate-800 border-emerald-500 text-white shadow-lg`
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }
                    `}
                >
                    <div className={`w-2 h-2 rounded-full ${net.color}`} />
                    {net.name}
                </button>
            ))}
        </div>

        {/* CALENDAR */}
        <Calendar
            history={plantingHistory}
            networkName={selectedNetwork.name}
        />

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
