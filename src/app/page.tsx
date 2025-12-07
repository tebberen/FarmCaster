"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useAccount, useSwitchChain, useReadContract } from "wagmi";
import { GARDEN_CONTRACTS, GARDEN_ABI, HUB_CONTRACTS, HUB_ABI } from "../config/contracts";
import { base, bsc, mainnet, arbitrum, celo } from "wagmi/chains";
import { monadTestnet, hyperEvmTestnet } from "../config/wagmi";
import { Calendar } from "../components/Calendar";
import { SEED_DATA } from "../config/emojis";
import { parseEther } from "viem";
import clsx from "clsx";

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

type TabType = 'gm' | 'deploy' | 'launch' | 'donate';

export default function FarmCaster() {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('gm');
  const [selectedSeed, setSelectedSeed] = useState(SEED_DATA.gm[0]);

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

    let value = 0n;

    if (activeTab === 'gm') {
      value = 0n;
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'gm',
        args: [selectedSeed.id],
      });
    } else if (activeTab === 'deploy') {
      value = parseEther("0.00003");
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'deploy',
        args: [selectedSeed.id],
        value,
      });
    } else if (activeTab === 'launch') {
      value = parseEther("0.000045");
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'launch',
        args: [selectedSeed.id],
        value,
      });
    } else if (activeTab === 'donate') {
      value = parseEther("0.00006");
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'donate',
        args: [selectedSeed.id],
        value,
      });
    }
  };

  // Only render content when mounted to prevent hydration mismatch
  if (!isMounted) return null;

  const getPrice = () => {
      switch(activeTab) {
          case 'gm': return 'Free';
          case 'deploy': return '~$0.10';
          case 'launch': return '~$0.15';
          case 'donate': return '~$0.20';
          default: return 'Free';
      }
  }

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

        {/* TABS */}
        <div className="flex gap-2 border-b border-[#3d2b20] pb-2 overflow-x-auto">
            {(['gm', 'deploy', 'launch', 'donate'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => {
                        setActiveTab(tab);
                        setSelectedSeed(SEED_DATA[tab][0]);
                    }}
                    className={clsx(
                        "px-4 py-2 rounded-t-lg font-bold text-sm transition-colors uppercase",
                        activeTab === tab
                            ? "text-emerald-500 border-b-2 border-emerald-500"
                            : "text-[#8c7e73] hover:text-[#b0a090]"
                    )}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* SEED MARKET GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SEED_DATA[activeTab].map((seed) => (
                <button
                    key={seed.id}
                    onClick={() => setSelectedSeed(seed)}
                    className={clsx(
                        "bg-[#1e140f] border rounded-xl p-4 flex flex-col items-center gap-2 relative overflow-hidden active:scale-95 transition-all",
                        selectedSeed.id === seed.id
                            ? "border-emerald-500 bg-[#2a1d15]"
                            : "border-[#3d2b20] hover:border-[#5c4030]"
                    )}
                >
                    <span className="text-3xl">{seed.icon}</span>
                    <div className="text-center">
                        <span className="block text-sm font-bold text-[#e7dac7]">{seed.name}</span>
                        {/* Optional: <span className="block text-xs text-[#8c7e73]">{seed.desc}</span> */}
                    </div>
                </button>
            ))}
        </div>

        {/* ACTION PANEL */}
        <div className="bg-[#1e140f] border border-[#3d2b20] rounded-xl p-6">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#e7dac7]">
                        Planting {selectedSeed.icon} {selectedSeed.name}
                    </h3>
                    <p className="text-[#8c7e73] text-sm mt-1">
                        on {selectedNetwork.name}
                    </p>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-bold text-emerald-500">{getPrice()}</span>
                    <span className="text-xs text-[#8c7e73]">Est. cost</span>
                </div>
            </div>

            <button
                onClick={handlePlant}
                disabled={isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
                {isPending ? 'Planting...' : 'Plant Now'}
            </button>

            {writeError && (
                 <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center">
                    {writeError.message.split('\n')[0]}
                 </div>
            )}
        </div>

        <div className="flex justify-center mt-8">
             <ConnectButton />
        </div>

      </div>
    </main>
  );
}
