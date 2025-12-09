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
import { OnboardingModal } from "../components/OnboardingModal";
import { parseEther } from "viem";
import clsx from "clsx";
import { HelpCircle } from "lucide-react";

// --- THEME DEFINITIONS ---
export interface Theme {
    id: string;
    pageBg: string; // New: Page Background (Gradient)
    cardBg: string; // New: Card Background (Semi-transparent)
    bg: string;     // Keep for legacy or specific element backgrounds if needed, or remove if unused. Keeping for compatibility.
    accent: string;
    text: string;
    border: string;
    ring: string;
    lightButton: string;
}

const THEMES: Record<string, Theme> = {
  base: {
    id: 'base',
    pageBg: "bg-gradient-to-b from-blue-50 to-white",
    cardBg: "bg-white/60 backdrop-blur-sm",
    bg: "bg-blue-50",
    accent: "bg-blue-600 hover:bg-blue-700 text-white",
    text: "text-blue-900",
    border: "border-blue-200",
    ring: "ring-blue-500",
    lightButton: "bg-white/50 text-blue-700 hover:bg-white border border-blue-200"
  },
  bsc: {
    id: 'bsc',
    pageBg: "bg-gradient-to-b from-amber-50 to-white",
    cardBg: "bg-white/60 backdrop-blur-sm",
    bg: "bg-amber-50",
    accent: "bg-yellow-500 hover:bg-yellow-600 text-black",
    text: "text-yellow-900",
    border: "border-yellow-200",
    ring: "ring-yellow-500",
    lightButton: "bg-white/50 text-yellow-700 hover:bg-white border border-yellow-200"
  },
  arb: {
    id: 'arb',
    pageBg: "bg-gradient-to-b from-cyan-50 to-white",
    cardBg: "bg-white/60 backdrop-blur-sm",
    bg: "bg-cyan-50",
    accent: "bg-cyan-600 hover:bg-cyan-700 text-white",
    text: "text-cyan-900",
    border: "border-cyan-200",
    ring: "ring-cyan-500",
    lightButton: "bg-white/50 text-cyan-700 hover:bg-white border border-cyan-200"
  },
  celo: {
    id: 'celo',
    pageBg: "bg-gradient-to-b from-lime-50 to-white",
    cardBg: "bg-white/60 backdrop-blur-sm",
    bg: "bg-lime-50",
    accent: "bg-lime-600 hover:bg-lime-700 text-white",
    text: "text-lime-900",
    border: "border-lime-200",
    ring: "ring-lime-500",
    lightButton: "bg-white/50 text-lime-700 hover:bg-white border border-lime-200"
  },
  eth: {
    id: 'eth',
    pageBg: "bg-gradient-to-b from-slate-50 to-white",
    cardBg: "bg-white/60 backdrop-blur-sm",
    bg: "bg-slate-50",
    accent: "bg-slate-800 hover:bg-slate-900 text-white",
    text: "text-slate-900",
    border: "border-slate-200",
    ring: "ring-slate-500",
    lightButton: "bg-white/50 text-slate-700 hover:bg-white border border-slate-200"
  },
  monad: {
    id: 'monad',
    pageBg: "bg-gradient-to-b from-violet-50 to-white",
    cardBg: "bg-white/60 backdrop-blur-sm",
    bg: "bg-violet-50",
    accent: "bg-violet-600 hover:bg-violet-700 text-white",
    text: "text-violet-900",
    border: "border-violet-200",
    ring: "ring-violet-500",
    lightButton: "bg-white/50 text-violet-700 hover:bg-white border border-violet-200"
  },
  hyper: {
    id: 'hyper',
    pageBg: "bg-gradient-to-b from-rose-50 to-white",
    cardBg: "bg-white/60 backdrop-blur-sm",
    bg: "bg-rose-50",
    accent: "bg-rose-500 hover:bg-rose-600 text-white",
    text: "text-rose-900",
    border: "border-rose-200",
    ring: "ring-rose-500",
    lightButton: "bg-white/50 text-rose-700 hover:bg-white border border-rose-200"
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
  const [showOnboarding, setShowOnboarding] = useState(false);
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

    // Check onboarding
    const hasSeen = localStorage.getItem('farmcaster_onboarding_v1');
    if (!hasSeen) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('farmcaster_onboarding_v1', 'true');
  };

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
    <main className={clsx("min-h-screen transition-colors duration-500 font-sans pb-10", currentTheme.pageBg, currentTheme.text)}>

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

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />

      {/* Main Layout Container */}
      <div className="w-full max-w-lg mx-auto px-4 space-y-6">

        {/* SECTION 1: Header & Network Tabs */}
        {/* Sticky Header - Updated to be transparent/blur instead of white/80 */}
        <div className={clsx("sticky top-0 z-10 bg-transparent backdrop-blur-md pt-4 pb-2 transition-colors", "border-b-0")}>
             {/* Header Content */}
             <div className="flex justify-between items-center mb-4">
                {/* Left: Farmer Identity */}
                <div className="flex items-center gap-3">
                     <div className={clsx("p-2 rounded-full border flex items-center justify-center w-10 h-10", currentTheme.cardBg, currentTheme.border)}>
                        🚜
                     </div>
                     <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Farmer</div>
                        <div className={clsx("font-bold text-sm leading-tight", currentTheme.text)}>
                            {address ? (ensName || `${address.slice(0,6)}...${address.slice(-4)}`) : "(Guest)"}
                        </div>
                     </div>
                </div>

                {/* Right: Action / Connect Button */}
                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowOnboarding(true)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                      title="Help & Guide"
                    >
                        <HelpCircle size={20} />
                    </button>

                    <button
                      onClick={() => setLeaderboardOpen(true)}
                      className={clsx(
                          "flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm",
                          currentTheme.lightButton
                      )}
                    >
                      <span>🏆</span>
                      <span className="hidden sm:inline">Leaderboard</span>
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
                                        currentTheme.accent
                                    )}
                                  >
                                    Connect
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
                                        currentTheme.accent,
                                        isPending && "opacity-70 cursor-wait",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                >
                                    {isPending ? (
                                        <span>Watering...</span>
                                    ) : (
                                        <span>💧 WATER</span>
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

             {/* Network Tabs */}
             <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide w-full">
                {NETWORKS.map(net => {
                    const isActive = selectedNetwork.id === net.id;
                    return (
                        <button
                            key={net.id}
                            onClick={() => setSelectedNetwork(net)}
                            className={clsx(
                                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border",
                                isActive
                                ? clsx(currentTheme.accent, "border-transparent shadow-sm")
                                : clsx(currentTheme.cardBg, "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white")
                            )}
                        >
                            {net.name}
                        </button>
                    )
                })}
             </div>
        </div>

        {/* SECTION 2: Calendar */}
        <div className="w-full">
             <Calendar
                history={plantingHistory}
                networkName={selectedNetwork.name}
                theme={currentTheme}
                userXP={userXP ? Number(userXP).toLocaleString() : '0'}
            />
        </div>

        {/* SECTION 3: Seed Market Categories (Tabs) */}
        <div className="w-full grid grid-cols-2 gap-3">
                {(['gm', 'deploy', 'launch', 'donate'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                        }}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl font-bold text-sm border transition-all duration-200",
                            activeTab === tab
                                ? clsx(currentTheme.cardBg, "ring-2 ring-inset", currentTheme.ring, currentTheme.text, "border-transparent")
                                : "bg-white/50 shadow-sm border-transparent text-slate-500 hover:bg-white"
                        )}
                    >
                        <span>{CATEGORY_LABELS[tab]}</span>
                        <span className="text-[10px] font-normal opacity-70">
                            {TAB_PRICES[tab]}
                        </span>
                    </button>
                ))}
        </div>

        {/* SECTION 4: Seed Market Grid */}
        <div className="w-full grid grid-cols-2 gap-3">
                {SEED_DATA[activeTab].map((seed) => (
                    <button
                        key={seed.id}
                        onClick={() => handlePlant(seed.id)}
                        className={clsx(
                            "border rounded-xl p-4 flex flex-col items-center gap-2 relative overflow-hidden active:scale-95 transition-all",
                            "bg-white/50 hover:bg-white", // Tactile feel
                            currentTheme.border, // Apply theme border
                            "shadow-sm hover:shadow-md"
                        )}
                    >
                        <span className="text-3xl filter drop-shadow-sm">{seed.icon}</span>
                        <div className="text-center">
                            <span className="block text-sm font-bold text-slate-800">{seed.name}</span>
                        </div>
                    </button>
                ))}
        </div>

        {writeError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs text-center">
            {writeError.message.split('\n')[0]}
            </div>
        )}

      </div>
    </main>
  );
}
