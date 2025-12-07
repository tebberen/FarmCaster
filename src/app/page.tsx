"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useAccount, useSwitchChain, useReadContract } from "wagmi";
import { GARDEN_CONTRACTS, GARDEN_ABI, HUB_CONTRACTS, HUB_ABI } from "../config/contracts";
import { AVERAGE_BLOCK_TIMES } from "../config/chainParams";
import { createPublicClient, http, parseAbiItem } from "viem";
import { base, bsc, mainnet, arbitrum, celo } from "wagmi/chains";
import { monadTestnet, hyperEvmTestnet } from "../config/wagmi";
import { Calendar } from "../components/Calendar";

// Define Network list (Prioritize Base, Arb, Celo as per screenshot)
const NETWORKS = [
  { id: "base", name: "Base", chain: base },
  { id: "arb", name: "Arbitrum", chain: arbitrum },
  { id: "celo", name: "Celo", chain: celo },
  // Hidden but available
  { id: "bsc", name: "BSC", chain: bsc },
  { id: "eth", name: "Ethereum", chain: mainnet },
  { id: "monad", name: "Monad", chain: monadTestnet },
  { id: "hyper", name: "HyperEVM", chain: hyperEvmTestnet },
];

const SEEDS = [
  { id: "starter", name: "Start", sub: "Ücretsiz", priceWei: 0n, seedId: 0n, icon: "🌱", color: "text-green-500" },
  { id: "flowers", name: "Advanced", sub: "0,10 $", priceWei: 45000000000000n, seedId: 2n, icon: "🌻", color: "text-yellow-400" },
  { id: "trees", name: "Professional", sub: "0,25 $", priceWei: 60000000000000n, seedId: 3n, icon: "🌳", color: "text-green-700" },
  { id: "fruits", name: "Gelişmiş", sub: "0,50 $", priceWei: 30000000000000n, seedId: 1n, icon: "🍒", color: "text-red-500" },
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


  const handlePlant = (seed: typeof SEEDS[0]) => {
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

    writeContract({
      address: contractAddress,
      abi: GARDEN_ABI,
      functionName: 'plant',
      args: [seed.seedId],
      value: seed.priceWei,
    });
  };

  // Only render content when mounted to prevent hydration mismatch
  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#0f0a06] text-[#e7dac7] font-sans pb-10">
      {/* TOP BAR / HEADER */}
      <div className="pt-6 pb-4 px-4 flex justify-between items-center max-w-3xl mx-auto">
        <h1 className="text-xl font-bold tracking-tight">FarmCaster</h1>

        {/* Network Toggle (Base/Arb/Celo) */}
        <div className="flex bg-[#1e140f] p-1 rounded-lg border border-[#3d2b20]">
            {NETWORKS.slice(0,3).map(net => (
                <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        selectedNetwork.id === net.id
                        ? 'bg-[#3d2b20] text-[#e7dac7] shadow-sm'
                        : 'text-[#8c7e73] hover:text-[#b0a090]'
                    }`}
                >
                    {net.name}
                </button>
            ))}
        </div>
      </div>

      <div className="px-4 max-w-3xl mx-auto space-y-6">

        {/* Wallet / XP Info (Simplified) */}
        <div className="flex justify-between items-center">
            <div className="text-sm text-[#8c7e73]">
                {address ? (
                    <span>Connected: <span className="text-[#e7dac7]">{address.slice(0,6)}...</span></span>
                ) : (
                    <span>Wallet not connected</span>
                )}
            </div>
            <div className="text-sm font-bold text-[#84cc16]">
                {userXP ? Number(userXP).toLocaleString() : '0'} XP
            </div>
        </div>

        {/* CALENDAR */}
        <Calendar
            history={plantingHistory}
            networkName={selectedNetwork.name}
        />

        {/* SEED MARKET GRID (2x2) */}
        <div className="grid grid-cols-2 gap-3">
            {SEEDS.map((seed) => (
                <button
                    key={seed.id}
                    onClick={() => handlePlant(seed)}
                    disabled={isPending}
                    className="bg-[#1e140f] border border-[#3d2b20] rounded-xl p-4 flex flex-col items-start gap-1 relative overflow-hidden active:scale-95 transition-transform"
                >
                    <div className="flex justify-between w-full mb-1">
                        <span className="text-2xl">{seed.icon}</span>
                        {/* Fake 'Signal' icon or similar decor from screenshot if needed, ignoring for now */}
                    </div>

                    <span className="text-sm font-bold text-[#e7dac7]">{seed.name}</span>
                    <span className="text-xs text-[#8c7e73]">{seed.sub}</span>

                    {/* Hover/Active Effect */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
            ))}
        </div>

        <div className="flex justify-center mt-8">
             <ConnectButton />
        </div>

        {writeError && (
             <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center">
                {writeError.message.split('\n')[0]}
             </div>
        )}

      </div>
    </main>
  );
}
