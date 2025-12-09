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
    pageBg: string; // New: Page Background (Solid or Gradient)
    cardBg: string; // New: Card Background
    bg: string;     // Legacy support (optional, can be mapped to pageBg)
    accent: string;
    text: string;
    border: string;
    ring: string;
    lightButton: string;
}

const THEMES: Record<string, Theme> = {
  celo: {
    id: 'celo',
    pageBg: "bg-[#FFF9E5]", // Creamy Yellow/Beige
    cardBg: "bg-[#FFECC2]", // Darker Cream
    bg: "bg-[#FFF9E5]",
    accent: "bg-[#FACC15] text-black hover:bg-[#EAB308]", // Golden Yellow
    text: "text-[#422006]", // Dark Brown
    border: "border-[#FDE047]",
    ring: "ring-[#FACC15]",
    lightButton: "bg-white/50 text-[#422006] hover:bg-white border border-[#FDE047]"
  },
  base: {
    id: 'base',
    pageBg: "bg-[#EFF6FF]", // Very Pale Blue
    cardBg: "bg-[#DBEAFE]", // Pale Blue
    bg: "bg-[#EFF6FF]",
    accent: "bg-[#3B82F6] text-white hover:bg-[#2563EB]",
    text: "text-[#1E3A8A]", // Dark Blue
    border: "border-[#93C5FD]",
    ring: "ring-[#3B82F6]",
    lightButton: "bg-white/50 text-[#1E3A8A] hover:bg-white border border-[#93C5FD]"
  },
  bsc: {
    id: 'bsc',
    pageBg: "bg-[#FEFCE8]", // Pale Yellow
    cardBg: "bg-[#FEF08A]", // Yellow-200
    bg: "bg-[#FEFCE8]",
    accent: "bg-[#CA8A04] text-white hover:bg-[#A16207]",
    text: "text-[#422006]", // Dark Brown
    border: "border-[#FDE047]",
    ring: "ring-[#CA8A04]",
    lightButton: "bg-white/50 text-[#422006] hover:bg-white border border-[#FDE047]"
  },
  arb: {
    id: 'arb',
    pageBg: "bg-[#ECFEFF]", // Cyan-50
    cardBg: "bg-[#CFFAFE]", // Cyan-100
    bg: "bg-[#ECFEFF]",
    accent: "bg-[#06B6D4] text-white hover:bg-[#0891B2]",
    text: "text-[#164E63]", // Cyan-900
    border: "border-[#67E8F9]",
    ring: "ring-[#06B6D4]",
    lightButton: "bg-white/50 text-[#164E63] hover:bg-white border border-[#67E8F9]"
  },
  monad: {
    id: 'monad',
    pageBg: "bg-[#F5F3FF]", // Violet-50
    cardBg: "bg-[#EDE9FE]", // Violet-100
    bg: "bg-[#F5F3FF]",
    accent: "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]",
    text: "text-[#4C1D95]", // Violet-900
    border: "border-[#C4B5FD]",
    ring: "ring-[#8B5CF6]",
    lightButton: "bg-white/50 text-[#4C1D95] hover:bg-white border border-[#C4B5FD]"
  },
  hyper: {
    id: 'hyper',
    pageBg: "bg-[#FDF2F8]", // Pink-50
    cardBg: "bg-[#FCE7F3]", // Pink-100
    bg: "bg-[#FDF2F8]",
    accent: "bg-[#EC4899] text-white hover:bg-[#DB2777]",
    text: "text-[#831843]", // Pink-900
    border: "border-[#F9A8D4]",
    ring: "ring-[#EC4899]",
    lightButton: "bg-white/50 text-[#831843] hover:bg-white border border-[#F9A8D4]"
  },
  eth: {
    id: 'eth',
    pageBg: "bg-[#FAFAF9]", // Stone-50
    cardBg: "bg-[#E7E5E4]", // Stone-200
    bg: "bg-[#FAFAF9]",
    accent: "bg-[#57534E] text-white hover:bg-[#44403C]",
    text: "text-[#292524]", // Stone-800
    border: "border-[#D6D3D1]",
    ring: "ring-[#57534E]",
    lightButton: "bg-white/50 text-[#292524] hover:bg-white border border-[#D6D3D1]"
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
        {/* Sticky Header - Transparent to blend with background */}
        <div className={clsx("sticky top-0 z-10 bg-transparent backdrop-blur-md pt-4 pb-2 transition-colors", "border-b-0")}>
             {/* Header Content */}
             <div className="flex justify-between items-center mb-4">
                {/* Left: Farmer Identity */}
                <div className="flex items-center gap-3">
                     <div className={clsx("p-2 rounded-full border flex items-center justify-center w-10 h-10 shadow-sm", currentTheme.cardBg, currentTheme.border)}>
                        🚜
                     </div>
                     <div>
                        <div className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Farmer</div>
                        <div className={clsx("font-bold text-sm leading-tight", currentTheme.text)}>
                            {address ? (ensName || `${address.slice(0,6)}...${address.slice(-4)}`) : "(Guest)"}
                        </div>
                     </div>
                </div>

                {/* Right: Action / Connect Button */}
                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowOnboarding(true)}
                      className={clsx("p-2 rounded-lg transition-colors hover:bg-white/40", currentTheme.text)}
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
                                : clsx(currentTheme.cardBg, "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/60")
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
                            <span className="block text-sm font-bold opacity-90" style={{ color: 'inherit' }}>{seed.name}</span>
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
