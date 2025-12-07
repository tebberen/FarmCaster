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

// --- THEME DEFINITIONS ---
interface Theme {
    id: string;
    primary: string;    // Border color, Text color for active states
    secondary: string;  // Background accents
    badge: string;      // Active badge background
    button: string;     // Main action button gradient/color
    shadow: string;     // Glow/Shadow color
    today: string;      // Calendar today border
    text: string;       // Text color
}

const THEMES: Record<string, Theme> = {
    base: {
        id: 'base',
        primary: "border-blue-500",
        secondary: "bg-blue-900/20",
        badge: "bg-blue-600 text-white",
        button: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
        shadow: "shadow-blue-500/20 shadow-lg",
        today: "border-blue-400",
        text: "text-blue-500"
    },
    bsc: {
        id: 'bsc',
        primary: "border-yellow-500",
        secondary: "bg-yellow-900/20",
        badge: "bg-yellow-500 text-black",
        button: "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black",
        shadow: "shadow-yellow-500/20 shadow-lg",
        today: "border-yellow-400",
        text: "text-yellow-500"
    },
    arb: {
        id: 'arb',
        primary: "border-cyan-500",
        secondary: "bg-cyan-900/20",
        badge: "bg-cyan-600 text-white",
        button: "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400",
        shadow: "shadow-cyan-500/20 shadow-lg",
        today: "border-cyan-400",
        text: "text-cyan-500"
    },
    eth: {
        id: 'eth',
        primary: "border-slate-500",
        secondary: "bg-slate-800",
        badge: "bg-slate-600 text-white",
        button: "bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400",
        shadow: "shadow-slate-500/20 shadow-lg",
        today: "border-slate-400",
        text: "text-slate-400"
    },
    celo: {
        id: 'celo',
        primary: "border-green-500",
        secondary: "bg-green-900/20",
        badge: "bg-green-600 text-white",
        button: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400",
        shadow: "shadow-green-500/20 shadow-lg",
        today: "border-green-400",
        text: "text-green-500"
    },
    monad: {
        id: 'monad',
        primary: "border-purple-500",
        secondary: "bg-purple-900/20",
        badge: "bg-purple-600 text-white",
        button: "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400",
        shadow: "shadow-purple-500/20 shadow-lg",
        today: "border-purple-400",
        text: "text-purple-500"
    },
    hyper: {
        id: 'hyper',
        primary: "border-pink-500",
        secondary: "bg-pink-900/20",
        badge: "bg-pink-600 text-white",
        button: "bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400",
        shadow: "shadow-pink-500/20 shadow-lg",
        today: "border-pink-400",
        text: "text-pink-500"
    }
};

// Define Network list (Prioritize Base, Arb, Celo)
const NETWORKS = [
  { id: "base", name: "Base", chain: base },
  { id: "bsc", name: "BSC", chain: bsc },
  { id: "arb", name: "Arbitrum", chain: arbitrum },
  { id: "celo", name: "Celo", chain: celo },
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

  // Get current theme based on selected network
  const currentTheme = THEMES[selectedNetwork.id] || THEMES.base;

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

        newHistory.set(dateStr, seedType);
      });

      setPlantingHistory(newHistory);
    } else {
        // Clear history when switching networks if no data
        setPlantingHistory(new Map());
    }
  }, [historyData, selectedNetwork.id]);


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

      {/* SECTION 1: Network Tabs (The Header) */}
      <div className="sticky top-0 z-10 bg-[#0f0a06]/95 backdrop-blur-sm border-b border-[#3d2b20] pt-4 pb-2">
        <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold tracking-tight">FarmCaster</h1>
                {/* Wallet / XP Info */}
                <div className="flex items-center gap-4 text-xs">
                    <div className="text-[#8c7e73]">
                         {address ? (
                             <span className="flex items-center gap-1">
                                 <span className={`w-2 h-2 rounded-full ${chain?.id === CHAIN_IDS[selectedNetwork.id] ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                 {address.slice(0,6)}...
                             </span>
                         ) : (
                             <span>Not Connected</span>
                         )}
                    </div>
                    <div className={`font-bold ${currentTheme.text}`}>
                        {userXP ? Number(userXP).toLocaleString() : '0'} XP
                    </div>
                </div>
            </div>

            {/* Scrollable Network List */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {NETWORKS.map(net => {
                    const isActive = selectedNetwork.id === net.id;
                    const theme = THEMES[net.id] || THEMES.base;
                    return (
                        <button
                            key={net.id}
                            onClick={() => setSelectedNetwork(net)}
                            className={clsx(
                                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border",
                                isActive
                                ? `${theme.badge} border-transparent shadow-sm`
                                : "bg-[#1e140f] border-[#3d2b20] text-[#8c7e73] hover:text-[#b0a090] hover:border-[#5c4030]"
                            )}
                        >
                            {net.name}
                        </button>
                    )
                })}
            </div>
        </div>
      </div>

      <div className="px-4 max-w-3xl mx-auto space-y-8 mt-6">

        {/* SECTION 2: Single Calendar Grid */}
        <div className="space-y-2">
             <Calendar
                history={plantingHistory}
                networkName={selectedNetwork.name}
                theme={currentTheme}
            />
        </div>

        {/* SECTION 3: Seed Market (Tabs) */}
        <div className="space-y-4">
            <div className="flex gap-2 border-b border-[#3d2b20] pb-0 overflow-x-auto">
                {(['gm', 'deploy', 'launch', 'donate'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setSelectedSeed(SEED_DATA[tab][0]);
                        }}
                        className={clsx(
                            "px-6 py-3 font-bold text-sm transition-all uppercase tracking-wide",
                            activeTab === tab
                                ? `border-b-2 ${currentTheme.primary} ${currentTheme.text}`
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
                                ? `${currentTheme.primary} ${currentTheme.secondary}`
                                : "border-[#3d2b20] hover:border-[#5c4030]"
                        )}
                    >
                        <span className="text-3xl filter drop-shadow-md">{seed.icon}</span>
                        <div className="text-center">
                            <span className="block text-sm font-bold text-[#e7dac7]">{seed.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* SECTION 4: Action Panel (Bottom) */}
        <div className={clsx("bg-[#1e140f] border rounded-xl p-6 transition-all duration-300", currentTheme.primary)}>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-xl font-bold text-[#e7dac7]">
                        Planting {selectedSeed.icon} <span className={currentTheme.text}>{selectedSeed.name}</span>
                    </h3>
                    <p className="text-[#8c7e73] text-sm mt-1">
                        on {selectedNetwork.name} Chain
                    </p>
                </div>
                <div className="text-right">
                    <span className={`block text-3xl font-bold ${currentTheme.text}`}>{getPrice()}</span>
                    <span className="text-xs text-[#8c7e73] uppercase tracking-wider">Estimated Cost</span>
                </div>
            </div>

            <button
                onClick={handlePlant}
                disabled={isPending}
                className={clsx(
                    "w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 transform active:scale-[0.99]",
                    currentTheme.button,
                    isPending && "opacity-70 cursor-wait",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                {isPending ? 'Planting...' : 'PLANT NOW'}
            </button>

            {writeError && (
                 <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center">
                    {writeError.message.split('\n')[0]}
                 </div>
            )}
        </div>

        <div className="flex justify-center pt-4 pb-8 opacity-70 hover:opacity-100 transition-opacity">
             <ConnectButton showBalance={false} chainStatus="none" />
        </div>

      </div>
    </main>
  );
}
