"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useAccount, useSwitchChain, useReadContract } from "wagmi";
import { GARDEN_CONTRACTS, GARDEN_ABI, HUB_CONTRACTS, HUB_ABI } from "../config/contracts";
import { base, bsc, mainnet, arbitrum, celo } from "wagmi/chains";
import { monadTestnet, hyperEvmTestnet } from "../config/wagmi";
import { Calendar } from "../components/Calendar";
import { getEmojiById } from "../config/emojis";

// Define Network list (Prioritize Base, Arb, Celo)
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
  { id: "starter", name: "Start", sub: "Free", priceWei: 0n, seedId: 0, icon: "🌱", color: "text-green-500" }, // gm
  { id: "deploy", name: "Deploy", sub: "0.00003 ETH", priceWei: 30000000000000n, seedId: 10, icon: "🌸", color: "text-pink-500" }, // deploy
  { id: "launch", name: "Launch", sub: "0.000045 ETH", priceWei: 45000000000000n, seedId: 20, icon: "🌲", color: "text-green-700" }, // launch
  { id: "donate", name: "Donate", sub: "0.00006 ETH", priceWei: 60000000000000n, seedId: 30, icon: "🍒", color: "text-red-500" }, // donate
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

  // Fetch History via useReadContract
  const { data: historyData } = useReadContract({
    address: GARDEN_CONTRACTS[selectedNetwork.id],
    abi: GARDEN_ABI,
    functionName: "getUserHistory",
    args: address ? [address] : undefined,
    chainId: CHAIN_IDS[selectedNetwork.id],
    query: {
      enabled: !!address && isMounted,
      refetchInterval: 10000 // Poll every 10 seconds
    }
  });

  // Process history data
  useEffect(() => {
    if (historyData && Array.isArray(historyData)) {
      const newHistory = new Map<string, number>();

      historyData.forEach((record: any) => {
        // Record structure: [timestamp, seedType, actionType]
        const timestamp = Number(record.timestamp);
        const seedType = Number(record.seedType);

        const date = new Date(timestamp * 1000);
        const dateStr = formatDate(date);

        // If multiple on same day, this overwrites, which is expected for calendar view usually
        newHistory.set(dateStr, seedType);
      });

      setPlantingHistory(newHistory);
    }
  }, [historyData]);


  // 1. AUTO-SYNC: If wallet changes network, update UI
  useEffect(() => {
    if (chain) {
      const match = NETWORKS.find(n => CHAIN_IDS[n.id] === chain.id);
      if (match) setSelectedNetwork(match);
    }
  }, [chain]);


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

    let functionName: "gm" | "deploy" | "launch" | "donate" = 'gm';
    let value = 0n;

    if (seed.seedId < 10) {
      functionName = 'gm';
      value = 0n;
    } else if (seed.seedId >= 10 && seed.seedId < 20) {
      functionName = 'deploy';
      value = 30000000000000n; // 0.00003 ETH
    } else if (seed.seedId >= 20 && seed.seedId < 30) {
      functionName = 'launch';
      value = 45000000000000n; // 0.000045 ETH
    } else if (seed.seedId >= 30) {
      functionName = 'donate';
      value = 60000000000000n; // 0.00006 ETH
    }

    if (functionName === 'gm') {
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'gm',
        args: [seed.seedId],
      });
    } else {
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: functionName,
        args: [seed.seedId],
        value: value,
      });
    }
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
