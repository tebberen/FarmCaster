"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useSwitchChain, usePublicClient, useConnect } from "wagmi";
import { parseEther } from "viem";
import sdk from "@farcaster/miniapp-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Trophy, Droplets, HelpCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { HUB_CONTRACTS, GARDEN_CONTRACTS, HUB_ABI, GARDEN_ABI } from "../config/contracts";
import { SEED_DATA, getEmojiById } from "../config/emojis";
import { OnboardingModal } from "../components/OnboardingModal";
import { LeaderboardModal } from "../components/LeaderboardModal";
import { SuccessModal } from "../components/SuccessModal";

// --- THEME CONFIG (Pastel Tone-on-Tone) ---
export interface Theme {
  id: string;
  name: string;
  pageBg: string;
  cardBg: string;
  accent: string;
  text: string;
  strongText: string;
  border: string;
  ring?: string;
  activeBox: string;
  bg?: string;
}

const THEMES: Record<string, Theme> = {
  base: {
    id: 'base',
    name: 'Base',
    pageBg: "bg-[#0F172A]", // Slate 900
    cardBg: "bg-[#1E293B]", // Slate 800
    accent: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 text-white shadow-blue-500/50 shadow-lg",
    text: "text-slate-200",
    strongText: "text-cyan-400",
    border: "border-blue-500/50",
    activeBox: "bg-blue-900/50 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    bg: "bg-blue-900/20"
  },
  bsc: {
    id: 'bsc',
    name: 'BSC',
    pageBg: "bg-[#1C1917]", // Stone 900
    cardBg: "bg-[#292524]",
    accent: "bg-gradient-to-r from-amber-500 to-yellow-400 hover:scale-105 text-black font-bold shadow-yellow-500/50 shadow-lg",
    text: "text-stone-200",
    strongText: "text-yellow-400",
    border: "border-yellow-500/50",
    activeBox: "bg-yellow-900/50 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
    bg: "bg-yellow-900/20"
  },
  celo: {
    id: 'celo',
    name: 'Celo',
    pageBg: "bg-[#022C22]", // Deep Forest Green
    cardBg: "bg-[#064E3B]",
    accent: "bg-gradient-to-r from-lime-400 to-green-500 hover:scale-105 text-black font-bold shadow-lime-500/50 shadow-lg",
    text: "text-lime-50",
    strongText: "text-lime-300",
    border: "border-lime-500/50",
    activeBox: "bg-lime-900/50 border-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.5)]",
    bg: "bg-lime-900/20"
  },
  monad: {
    id: 'monad',
    name: 'Monad',
    pageBg: "bg-[#1E1B4B]", // Deep Indigo
    cardBg: "bg-[#312E81]",
    accent: "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:scale-105 text-white shadow-violet-500/50 shadow-lg",
    text: "text-violet-100",
    strongText: "text-fuchsia-400",
    border: "border-violet-500/50",
    activeBox: "bg-violet-900/50 border-fuchsia-400 shadow-[0_0_15px_rgba(167,139,250,0.5)]",
    bg: "bg-violet-900/20"
  },
  hyper: {
    id: 'hyper',
    name: 'Hyper',
    pageBg: "bg-[#4C0519]", // Deep Rose
    cardBg: "bg-[#881337]",
    accent: "bg-gradient-to-r from-pink-500 to-rose-400 hover:scale-105 text-white shadow-pink-500/50 shadow-lg",
    text: "text-pink-100",
    strongText: "text-pink-300",
    border: "border-pink-500/50",
    activeBox: "bg-pink-900/50 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]",
    bg: "bg-pink-900/20"
  },
  arb: {
    id: 'arb',
    name: 'Arbitrum',
    pageBg: "bg-[#083344]",
    cardBg: "bg-[#164E63]",
    accent: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 text-white shadow-cyan-500/50 shadow-lg",
    text: "text-cyan-50",
    strongText: "text-cyan-300",
    border: "border-cyan-500/50",
    activeBox: "bg-cyan-900/50 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]",
    bg: "bg-cyan-900/20"
  },
  eth: {
    id: 'eth',
    name: 'Ethereum',
    pageBg: "bg-[#0A0A0A]",
    cardBg: "bg-[#171717]",
    accent: "bg-gradient-to-r from-slate-600 to-slate-400 hover:scale-105 text-white shadow-white/10 shadow-lg",
    text: "text-gray-300",
    strongText: "text-white",
    border: "border-gray-700",
    activeBox: "bg-gray-800 border-gray-500",
    bg: "bg-gray-800"
  }
};

const CHAIN_IDS: Record<string, number> = {
  base: 8453, bsc: 56, celo: 42220, arb: 42161, eth: 1, monad: 143, hyper: 999
};

export default function FarmCaster() {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();
  const { connect, connectors } = useConnect();

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'gm' | 'deploy' | 'launch' | 'donate'>('gm');
  const [viewDate, setViewDate] = useState(new Date());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [successData, setSuccessData] = useState<{ seedId: number, xp: number, hash: string } | null>(null);

  // Derive Current Theme
  const currentTheme = React.useMemo(() => {
    if (!chain) return THEMES.base;
    const themeId = Object.keys(CHAIN_IDS).find((k) => CHAIN_IDS[k] === chain.id);
    return (themeId && THEMES[themeId]) || THEMES.base;
  }, [chain]);

  // Fix Hydration & Check Onboarding
  useEffect(() => {
      setIsMounted(true);
      sdk.actions.ready();
      const hasSeen = localStorage.getItem('farmcaster_onboarding_v1');
      if (!hasSeen) setShowOnboarding(true);
  }, []);

  // Update localStorage when closing onboarding
  const handleCloseOnboarding = () => {
      setShowOnboarding(false);
      localStorage.setItem('farmcaster_onboarding_v1', 'true');
  };

  // --- DATA FETCHING (V4) ---
  const gardenAddress = GARDEN_CONTRACTS[currentTheme.id] || GARDEN_CONTRACTS.base;
  const { data: historyData } = useReadContract({
    address: gardenAddress,
    abi: GARDEN_ABI,
    functionName: 'getUserHistory',
    args: [address!],
    query: { enabled: !!address }
  });

  const historyMap = React.useMemo(() => {
    if (!historyData) return {};
    const map: Record<string, number> = {};
    historyData.forEach((item) => {
       const d = new Date(Number(item.timestamp) * 1000);
       const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
       const sid = Number(item.seedType);
       if (map[key] === undefined || sid > map[key]) map[key] = sid;
    });
    return Object.fromEntries(Object.entries(map).map(([k,v]) => [k, getEmojiById(v)?.icon || '']));
  }, [historyData]);

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    return { days, startDay, monthName: date.toLocaleString('default', { month: 'long' }), year };
  };

  const { days, startDay, monthName, year } = getDaysInMonth(viewDate);

  // --- ACTION ---
  const handleConnect = () => {
    // Filter for "injected" (Metamask/Browser) or "coinbaseWallet"
    const targetConnector = connectors.find(c => c.id === 'injected' || c.id === 'coinbaseWalletSDK');

    if (targetConnector) {
      connect({ connector: targetConnector });
    } else {
      // Fallback: try the first available one that isn't the mini-app (if on web)
      const fallback = connectors.find(c => c.id !== 'farcaster-mini-app');
      if (fallback) connect({ connector: fallback });
    }
  };

  const handlePlant = async (id: number) => {
    if (!chain) {
      handleConnect();
      return;
    }
    let func: 'gm' | 'deploy' | 'launch' | 'donate' = 'gm';
    let val = 0n;
    if (id >= 10 && id < 20) { func = 'deploy'; val = 30000000000000n; }
    else if (id >= 20 && id < 30) { func = 'launch'; val = 45000000000000n; }
    else if (id >= 30) { func = 'donate'; val = 60000000000000n; }

    // XP Logic
    let xp = 1;
    if (id >= 10 && id < 20) xp = 2;
    else if (id >= 20 && id < 30) xp = 3;
    else if (id >= 30) xp = 5;

    try {
      let hash;
      if (func === 'gm') {
        hash = await writeContractAsync({
          address: gardenAddress,
          abi: GARDEN_ABI,
          functionName: 'gm',
          args: [id]
        });
      } else {
        hash = await writeContractAsync({
          address: gardenAddress,
          abi: GARDEN_ABI,
          functionName: func,
          args: [id],
          value: val
        });
      }

      // Optimistic UI Success
      setSuccessData({ seedId: id, xp, hash });
    } catch (e) {
      console.error("Planting failed:", e);
    }
  };

  if (!isMounted) return null;

  return (
    <main className={`min-h-screen transition-colors duration-500 pb-20 ${currentTheme.pageBg} ${currentTheme.text} font-sans`}>
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        networkId={currentTheme.id}
        chainId={CHAIN_IDS[currentTheme.id]}
        theme={currentTheme}
      />
      <SuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        theme={currentTheme}
        emoji={successData ? getEmojiById(successData.seedId).icon : null}
        networkName={currentTheme.name}
        chainId={CHAIN_IDS[currentTheme.id]}
        xp={successData ? successData.xp : 0}
      />

      {/* 1. HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/5 h-16 flex justify-between items-center px-4`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${currentTheme.accent}`}>🚜</div>
          <span className="font-bold text-lg text-white">Farmer {address?.slice(0,6)}...</span>
        </div>
        <div className="flex items-center gap-2">
           <button
             onClick={() => setShowOnboarding(true)}
             className={`p-2 rounded-full hover:bg-white/10 transition-colors ${currentTheme.strongText}`}
             title="How to Play"
           >
             <HelpCircle size={24} />
           </button>
           <button
             onClick={() => setIsLeaderboardOpen(true)}
             className={`px-3 py-2 rounded-xl font-bold flex items-center gap-2 border ${currentTheme.border} bg-white/5 hover:bg-white/10 transition-colors text-white`}
           >
             🏆 Leaderboard
           </button>
           <button
             onClick={() => handlePlant(0)}
             className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
           >
             💧 WATER FARM
           </button>
        </div>
      </header>

      {/* 2. NETWORK TABS */}
      <div className="max-w-lg mx-auto mt-6 px-4 overflow-x-auto flex gap-2 pb-2 no-scrollbar">
        {Object.values(THEMES).map((t: any) => (
           <button
             key={t.id}
             onClick={() => switchChain({ chainId: CHAIN_IDS[t.id] })}
             className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${currentTheme.id === t.id ? t.accent : 'bg-white/50 border border-transparent'}`}
           >
             {t.name}
           </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 mt-6">

        {/* 3. WALL CALENDAR */}
        <section className={`p-6 rounded-3xl ${currentTheme.cardBg} border ${currentTheme.border} shadow-sm`}>
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">{monthName} {year}</h2>
              <div className="flex gap-2">
                <button onClick={() => setViewDate(new Date(year, viewDate.getMonth()-1, 1))} className={`p-1 rounded hover:bg-black/5`}><ChevronLeft /></button>
                <button onClick={() => setViewDate(new Date(year, viewDate.getMonth()+1, 1))} className={`p-1 rounded hover:bg-black/5`}><ChevronRight /></button>
              </div>
           </div>

           {/* Grid Header */}
           <div className={`grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold ${currentTheme.strongText}`}>
             {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
           </div>

           {/* The Grid */}
           <div className="grid grid-cols-7 gap-2">
              {[...Array(startDay)].map((_, i) => <div key={`empty-${i}`} />)}
              {[...Array(days)].map((_, i) => {
                 const dayNum = i + 1;
                 const currentDateStr = `${year}-${String(viewDate.getMonth()+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
                 const emoji = historyMap[currentDateStr];

                 return (
                   <div key={dayNum} className={`relative aspect-square rounded-xl border flex items-center justify-center transition-all ${emoji ? currentTheme.activeBox : 'bg-black/20 border-transparent'}`}>
                      <span className={`absolute top-0.5 right-1 text-[9px] font-bold ${currentTheme.strongText}`}>{dayNum}</span>
                      {emoji && <span className="text-xl">{emoji}</span>}
                   </div>
                 )
              })}
           </div>
        </section>

        {/* 4. SEED MARKET (Big Buttons) */}
        <section>
           <h3 className="font-bold text-lg mb-3 opacity-80">Seed Market</h3>
           <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'gm', label: '🌱 Seed / Gm', price: 'Free', xp: '1 XP' },
                { id: 'deploy', label: '💐 Flower / Deploy', price: '$0.10', xp: '2 XP' },
                { id: 'launch', label: '🎄 Tree / Launch', price: '$0.15', xp: '3 XP' },
                { id: 'donate', label: '🍒 Fruit / Donate', price: '$0.20', xp: '5 XP' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as any)}
                  className={`py-4 px-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all
                    ${activeTab === cat.id
                      ? `${currentTheme.accent} border-transparent scale-[1.02]`
                      : `bg-white/5 border-white/5 text-gray-400 hover:bg-white/10`}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{cat.label}</span>

                    <div className="flex items-center gap-2 mt-1">
                       {/* Price */}
                       <span className="text-xs opacity-80 font-mono">{cat.price}</span>

                       {/* XP Badge */}
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-black/40 text-white border border-white/20`}>
                         +{cat.xp}
                       </span>
                    </div>
                  </div>
                </button>
              ))}
           </div>

           {/* Emojis Grid */}
           <div className={`grid grid-cols-4 sm:grid-cols-5 gap-3 p-4 rounded-3xl ${currentTheme.cardBg} border ${currentTheme.border}`}>
              {SEED_DATA[activeTab].map((seed) => (
                <button
                  key={seed.id}
                  onClick={() => handlePlant(seed.id)}
                  className="aspect-square bg-white/10 rounded-xl shadow-sm flex items-center justify-center text-3xl hover:scale-110 active:scale-90 transition-transform cursor-pointer hover:bg-white/20"
                >
                  {seed.icon}
                </button>
              ))}
           </div>
        </section>

      </div>
    </main>
  );
}
