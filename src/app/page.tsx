"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useAccount, useSwitchChain, useReadContract, useEnsName } from "wagmi";
import { GARDEN_CONTRACTS, GARDEN_ABI, HUB_CONTRACTS, HUB_ABI } from "../config/contracts";
import { base, bsc, mainnet, arbitrum, celo } from "wagmi/chains";
import { monadTestnet, hyperEvmTestnet } from "../config/wagmi";
import { Calendar } from "../components/Calendar";
import { SEED_DATA, CATEGORY_LABELS, getEmojiById } from "../config/emojis";
import { LeaderboardModal } from "../components/LeaderboardModal";
import { SuccessModal } from "../components/SuccessModal";
import { parseEther } from "viem";
import clsx from "clsx";

// --- THEME DEFINITIONS ---
export interface Theme {
    accent: string;
    border: string;
    bg: string;
    button: string;
    glow: string;
}

const THEMES: Record<string, Theme> = {
    base: {
        accent: "text-blue-400",
        border: "border-blue-500",
        bg: "bg-blue-500/10",
        button: "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white",
        glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]"
    },
    bsc: {
        accent: "text-yellow-400",
        border: "border-yellow-500",
        bg: "bg-yellow-500/10",
        button: "bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black",
        glow: "shadow-[0_0_15px_rgba(234,179,8,0.2)]"
    },
    arb: {
        accent: "text-cyan-400",
        border: "border-cyan-500",
        bg: "bg-cyan-500/10",
        button: "bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white",
        glow: "shadow-[0_0_15px_rgba(34,211,238,0.2)]"
    },
    celo: {
        accent: "text-green-400",
        border: "border-green-500",
        bg: "bg-green-500/10",
        button: "bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white",
        glow: "shadow-[0_0_15px_rgba(74,222,128,0.2)]"
    },
    monad: {
        accent: "text-purple-400",
        border: "border-purple-500",
        bg: "bg-purple-500/10",
        button: "bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white",
        glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]"
    },
    hyper: {
        accent: "text-pink-400",
        border: "border-pink-500",
        bg: "bg-pink-500/10",
        button: "bg-gradient-to-r from-pink-600 to-pink-400 hover:from-pink-500 hover:to-pink-300 text-white",
        glow: "shadow-[0_0_15px_rgba(236,72,153,0.2)]"
    },
    eth: {
        accent: "text-slate-200",
        border: "border-slate-500",
        bg: "bg-slate-500/10",
        button: "bg-gradient-to-r from-slate-600 to-slate-400 hover:from-slate-500 hover:to-slate-300 text-white",
        glow: "shadow-[0_0_15px_rgba(148,163,184,0.2)]"
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

const TAB_PRICES: Record<TabType, string> = {
    gm: "Free",
    deploy: "$0.10",
    launch: "$0.15",
    donate: "$0.20"
};

export default function FarmCaster() {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('gm');
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [lastPlantedSeedId, setLastPlantedSeedId] = useState<number | null>(null);

  // Map date string (YYYY-MM-DD) -> seedId (number)
  const [plantingHistory, setPlantingHistory] = useState<Map<string, number>>(new Map());

  const { address, chain } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending, isSuccess, error: writeError } = useWriteContract();

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

      // First pass: Group by date and find max seedType
      const dailyMaxSeed = new Map<string, number>();

      historyData.forEach((record: any) => {
        // Record structure: [timestamp, seedType, actionType]
        const timestamp = Number(record.timestamp);
        const seedType = Number(record.seedType);

        const date = new Date(timestamp * 1000);
        const dateStr = formatDate(date);

        const currentMax = dailyMaxSeed.get(dateStr) || -1;
        if (seedType > currentMax) {
          dailyMaxSeed.set(dateStr, seedType);
        }
      });

      setPlantingHistory(dailyMaxSeed);
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

  // Handle Transaction Success
  useEffect(() => {
    if (isSuccess) {
      setSuccessModalOpen(true);
    }
  }, [isSuccess]);

  const handlePlant = (seedId: number) => {
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

    setLastPlantedSeedId(seedId);

    let value = 0n;

    // Logic: 0-9 gm, 10-19 deploy, 20-29 launch, 30-39 donate
    if (seedId >= 0 && seedId <= 9) {
      value = 0n;
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'gm',
        args: [seedId],
      });
    } else if (seedId >= 10 && seedId <= 19) {
      value = parseEther("0.00003");
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'deploy',
        args: [seedId],
        value,
      });
    } else if (seedId >= 20 && seedId <= 29) {
      value = parseEther("0.000045");
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'launch',
        args: [seedId],
        value,
      });
    } else if (seedId >= 30 && seedId <= 39) {
      value = parseEther("0.00006");
      writeContract({
        address: contractAddress,
        abi: GARDEN_ABI,
        functionName: 'donate',
        args: [seedId],
        value,
      });
    }
  };

  const handleWaterFarm = () => {
      // Calls gm(0)
      handlePlant(0);
  };

  // Only render content when mounted to prevent hydration mismatch
  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-10">

      {/* MODALS */}
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        networkId={selectedNetwork.id}
        chainId={CHAIN_IDS[selectedNetwork.id]}
        theme={currentTheme}
      />

      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        theme={currentTheme}
        emoji={lastPlantedSeedId !== null ? getEmojiById(lastPlantedSeedId).icon : null}
        networkName={selectedNetwork.name}
        xpEarned={userXP ? Number(userXP).toLocaleString() : '0'}
      />

      {/* SECTION 1: Header & Network Tabs */}
      <div className={clsx("sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b pt-4 pb-2", currentTheme.border)}>
        <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
                {/* Left: Farmer Identity */}
                <div className="flex items-center gap-3">
                     <div className={clsx("p-2 rounded-full border flex items-center justify-center w-10 h-10", currentTheme.bg, "border-transparent text-white")}>
                        🚜
                     </div>
                     <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Farmer</div>
                        <div className={clsx("font-bold text-sm leading-tight", currentTheme.accent)}>
                            {address ? (ensName || `${address.slice(0,6)}...${address.slice(-4)}`) : "(Guest)"}
                        </div>
                     </div>
                </div>

                {/* Right: Action / Connect Button */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLeaderboardOpen(true)}
                        className={clsx(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all shadow-lg active:scale-95 bg-slate-800 border border-slate-700 hover:bg-slate-700"
                        )}
                        title="Leaderboard"
                        aria-label="Leaderboard"
                    >
                        🏆
                    </button>

                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                      }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                        return (
                          <div
                            {...(!ready && {
                              'aria-hidden': true,
                              'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                              },
                            })}
                          >
                            {(() => {
                              if (!connected) {
                                return (
                                  <button
                                    onClick={openConnectModal}
                                    type="button"
                                    className={clsx(
                                        "px-4 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm",
                                        currentTheme.button,
                                        currentTheme.glow
                                    )}
                                  >
                                    Connect Wallet
                                  </button>
                                );
                              }

                              if (chain.unsupported) {
                                return (
                                  <button
                                    onClick={openChainModal}
                                    type="button"
                                    className="px-4 py-2 rounded-xl font-bold bg-red-600 text-white hover:bg-red-500 transition-all text-sm"
                                  >
                                    Wrong Network
                                  </button>
                                );
                              }

                              // ACTION: Water Farm
                              return (
                                <button
                                    onClick={handleWaterFarm}
                                    disabled={isPending}
                                    className={clsx(
                                        "px-4 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm flex items-center gap-2",
                                        "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400", // Distinct Cyan/Blue gradient
                                        "shadow-[0_0_15px_rgba(6,182,212,0.5)]", // Cyan glow
                                        isPending && "opacity-70 cursor-wait",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {isPending ? (
                                        <span>Watering...</span>
                                    ) : (
                                        <span>💧 WATER FARM</span>
                                    )}
                                </button>
                              );
                            })()}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
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
                                ? `${theme.bg} ${theme.glow} text-white border-transparent shadow-sm`
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600"
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
                userXP={userXP ? Number(userXP).toLocaleString() : '0'}
            />
        </div>

        {/* SECTION 3: Seed Market (Tabs) */}
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {(['gm', 'deploy', 'launch', 'donate'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                        }}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl font-bold text-sm border transition-all duration-200",
                            activeTab === tab
                                ? `${currentTheme.bg} ${currentTheme.border} ${currentTheme.accent} ${currentTheme.glow}`
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700"
                        )}
                    >
                        <span>{CATEGORY_LABELS[tab]}</span>
                        <span className="text-[10px] font-normal opacity-70">
                            {TAB_PRICES[tab]}
                        </span>
                    </button>
                ))}
            </div>

            {/* SEED MARKET GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SEED_DATA[activeTab].map((seed) => (
                    <button
                        key={seed.id}
                        onClick={() => handlePlant(seed.id)}
                        className={clsx(
                            "bg-slate-900 border rounded-xl p-4 flex flex-col items-center gap-2 relative overflow-hidden active:scale-95 transition-all hover:bg-slate-800",
                            currentTheme.border, // Apply theme border
                            "shadow-sm hover:shadow-md"
                        )}
                    >
                        <span className="text-3xl filter drop-shadow-md">{seed.icon}</span>
                        <div className="text-center">
                            <span className="block text-sm font-bold text-slate-200">{seed.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {writeError && (
            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs text-center">
            {writeError.message.split('\n')[0]}
            </div>
        )}

      </div>
    </main>
  );
}
