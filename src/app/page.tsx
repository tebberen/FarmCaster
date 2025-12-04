"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Tractor, User, Droplets } from "lucide-react";
import { useWriteContract, useAccount, useSwitchChain, useReadContract } from "wagmi";
import { GARDEN_CONTRACTS, GARDEN_ABI, HUB_CONTRACTS, HUB_ABI } from "../config/contracts";
import { AVERAGE_BLOCK_TIMES } from "../config/chainParams";
import { createPublicClient, http, parseAbiItem } from "viem";
import { base, bsc, mainnet, arbitrum, celo } from "wagmi/chains";
import { monadTestnet, hyperEvmTestnet } from "../config/wagmi";
import { Calendar } from "../components/Calendar";

const NETWORKS = [
  { id: "base", name: "Base", color: "bg-blue-600", chain: base },
  { id: "bsc", name: "BSC", color: "bg-yellow-500", chain: bsc },
  { id: "eth", name: "Ethereum", color: "bg-slate-600", chain: mainnet },
  { id: "arb", name: "Arbitrum", color: "bg-cyan-600", chain: arbitrum },
  { id: "monad", name: "Monad", color: "bg-purple-600", chain: monadTestnet },
  { id: "hyper", name: "HyperEVM", color: "bg-pink-600", chain: hyperEvmTestnet },
  { id: "celo", name: "Celo", color: "bg-green-500", chain: celo },
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

  // 1. AUTO-SYNC: If wallet changes network, update UI
  useEffect(() => {
    if (chain) {
      const match = NETWORKS.find(n => CHAIN_IDS[n.id] === chain.id);
      if (match) setSelectedNetwork(match);
    }
  }, [chain]);

  // Fetch History Logs from SELECTED network
  useEffect(() => {
    let active = true;

    async function fetchHistory() {
        if (!address || !isMounted) return;

        setPlantingHistory(new Map()); // Clear previous history

        const year = new Date().getFullYear();
        // Target: December 1st of the current year
        const targetDate = new Date(year, 11, 1); // Month is 0-indexed (11 = Dec)
        const now = new Date();

        if (now < targetDate) {
           targetDate.setFullYear(year - 1);
        }

        const net = selectedNetwork;
        const contractAddress = GARDEN_CONTRACTS[net.id];
        if (!contractAddress) return;

        try {
            const publicClient = createPublicClient({
                chain: net.chain,
                transport: http()
            });

            const currentBlock = await publicClient.getBlockNumber();
            const avgBlockTime = AVERAGE_BLOCK_TIMES[net.id] || 2;
            const secondsDiff = (now.getTime() - targetDate.getTime()) / 1000;
            const blocksToFetch = BigInt(Math.ceil(secondsDiff / avgBlockTime));

            // Ensure we don't go below 0
            const startBlock = currentBlock - blocksToFetch > 0n ? currentBlock - blocksToFetch : 0n;

            const CHUNK_SIZE = 20000n;
            const chunks = [];

            for (let i = currentBlock; i > startBlock; i -= CHUNK_SIZE) {
                const to = i;
                const chunkFrom = i - CHUNK_SIZE > startBlock ? i - CHUNK_SIZE : startBlock;
                chunks.push({ from: chunkFrom, to });
            }

            // Limit parallelism to avoid overwhelming the browser/RPC
            const logs = [];
            // Process chunks in batches of 5
            for (let i = 0; i < chunks.length; i += 5) {
                const batch = chunks.slice(i, i + 5);
                const batchResults = await Promise.all(batch.map(({ from, to }) =>
                    publicClient.getLogs({
                        address: contractAddress,
                        event: parseAbiItem('event SeedPlanted(address indexed user, uint256 indexed seedId, uint256 pricePaid)'),
                        args: { user: address },
                        fromBlock: from,
                        toBlock: to
                    }).catch(e => {
                        console.warn(`Failed to fetch logs for ${net.name} chunk ${from}-${to}`, e);
                        return [];
                    })
                ));
                logs.push(...batchResults.flat());
            }

            // Fetch timestamps for logs
            // Optimization: Group by blockNumber to avoid duplicate getBlock
            const uniqueBlockNumbers = [...new Set(logs.map(l => l.blockNumber))];

            // Fetch blocks in batches
            const blockMap = new Map<bigint, any>();
            for (let i = 0; i < uniqueBlockNumbers.length; i += 20) {
                  const batch = uniqueBlockNumbers.slice(i, i + 20);
                  const blocks = await Promise.all(batch.map(bn =>
                      publicClient.getBlock({ blockNumber: bn }).catch(() => null)
                  ));
                  blocks.forEach((b, idx) => {
                      if (b) blockMap.set(batch[idx], b);
                  });
            }

            // Process entries
            const newHistory = new Map<string, number>();
            logs.forEach(log => {
                const block = blockMap.get(log.blockNumber);
                if (block) {
                    const date = new Date(Number(block.timestamp) * 1000);
                    const dateStr = formatDate(date);
                    const dTime = new Date(dateStr).getTime();
                    const tTime = new Date(formatDate(targetDate)).getTime();

                    if (dTime >= tTime) {
                        const seedId = Number(log.args.seedId);
                        newHistory.set(dateStr, seedId);
                    }
                }
            });

            if (active) {
                setPlantingHistory(newHistory);
            }

        } catch (e) {
            console.error(`Error fetching history for ${net.name}:`, e);
        }
    }

    fetchHistory();

    return () => { active = false; };
  }, [address, isMounted, selectedNetwork]);


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
