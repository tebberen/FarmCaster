"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useSwitchChain, usePublicClient } from "wagmi";
import { parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Trophy, Droplets, HelpCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { HUB_CONTRACTS, GARDEN_CONTRACTS, HUB_ABI, GARDEN_ABI } from "../config/contracts";
import { SEED_DATA, getEmojiById } from "../config/emojis";
import { OnboardingModal } from "../components/OnboardingModal";
import { LeaderboardModal } from "../components/LeaderboardModal";

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
    pageBg: "bg-[#EFF6FF]", // Ice Blue
    cardBg: "bg-[#DBEAFE]", // Pale Blue
    accent: "bg-blue-600 hover:bg-blue-700 text-white",
    text: "text-blue-900",
    strongText: "text-blue-600",
    border: "border-blue-300",
    ring: "ring-blue-500",
    activeBox: "bg-white shadow-blue-200",
    bg: "bg-[#DBEAFE]"
  },
  bsc: {
    id: 'bsc',
    name: 'BSC',
    pageBg: "bg-[#FFFBEB]", // Cream
    cardBg: "bg-[#FEF3C7]", // Pale Gold
    accent: "bg-amber-500 hover:bg-amber-600 text-white",
    text: "text-amber-900",
    strongText: "text-amber-600",
    border: "border-amber-300",
    ring: "ring-amber-500",
    activeBox: "bg-white shadow-amber-200",
    bg: "bg-[#FEF3C7]"
  },
  celo: {
    id: 'celo',
    name: 'Celo',
    pageBg: "bg-[#FFFFF0]", // Ivory/Cream (Like reference)
    cardBg: "bg-[#FEF9C3]", // Light Yellow
    accent: "bg-[#EAB308] hover:bg-[#CA8A04] text-[#422006]", // Golden Button
    text: "text-[#422006]", // Dark Brown Text
    strongText: "text-green-600",
    border: "border-[#FDE047]",
    ring: "ring-yellow-400",
    activeBox: "bg-white shadow-yellow-200",
    bg: "bg-[#FEF9C3]"
  },
  arb: {
    id: 'arb',
    name: 'Arbitrum',
    pageBg: "bg-[#ECFEFF]", // Cyan Tint
    cardBg: "bg-[#CFFAFE]",
    accent: "bg-cyan-600 hover:bg-cyan-700 text-white",
    text: "text-cyan-900",
    strongText: "text-cyan-600",
    border: "border-cyan-300",
    ring: "ring-cyan-500",
    activeBox: "bg-white shadow-cyan-200",
    bg: "bg-[#CFFAFE]"
  },
  // Add defaults for others to prevent crash
  eth: { id: 'eth', name: 'Ethereum', pageBg: 'bg-slate-50', cardBg: 'bg-slate-200', accent: 'bg-slate-800 text-white', text: 'text-slate-900', strongText: 'text-slate-600', border: 'border-slate-300', activeBox: 'bg-white', bg: 'bg-slate-200' },
  monad: { id: 'monad', name: 'Monad', pageBg: 'bg-purple-50', cardBg: 'bg-purple-200', accent: 'bg-purple-600 text-white', text: 'text-purple-900', strongText: 'text-purple-600', border: 'border-purple-300', activeBox: 'bg-white', bg: 'bg-purple-200' },
  hyper: { id: 'hyper', name: 'Hyper', pageBg: 'bg-pink-50', cardBg: 'bg-pink-200', accent: 'bg-pink-500 text-white', text: 'text-pink-900', strongText: 'text-pink-600', border: 'border-pink-300', activeBox: 'bg-white', bg: 'bg-pink-200' }
};

const CHAIN_IDS: Record<string, number> = {
  base: 8453, bsc: 56, celo: 42220, arb: 42161, eth: 1, monad: 143, hyper: 999
};

export default function FarmCaster() {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending, isSuccess } = useWriteContract();

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'gm' | 'deploy' | 'launch' | 'donate'>('gm');
  const [viewDate, setViewDate] = useState(new Date());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Derive Current Theme
  const currentTheme = React.useMemo(() => {
    if (!chain) return THEMES.base;
    const themeId = Object.keys(CHAIN_IDS).find((k) => CHAIN_IDS[k] === chain.id);
    return (themeId && THEMES[themeId]) || THEMES.base;
  }, [chain]);

  // Fix Hydration & Check Onboarding
  useEffect(() => {
      setIsMounted(true);
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
  const handlePlant = (id: number) => {
    if (!chain) return alert("Connect Wallet!");
    let func: 'gm' | 'deploy' | 'launch' | 'donate' = 'gm';
    let val = 0n;
    if (id >= 10 && id < 20) { func = 'deploy'; val = 30000000000000n; }
    else if (id >= 20 && id < 30) { func = 'launch'; val = 45000000000000n; }
    else if (id >= 30) { func = 'donate'; val = 60000000000000n; }

    if (func === 'gm') {
      writeContract({
        address: gardenAddress,
        abi: GARDEN_ABI,
        functionName: 'gm',
        args: [id]
      });
    } else {
      writeContract({
        address: gardenAddress,
        abi: GARDEN_ABI,
        functionName: func,
        args: [id],
        value: val
      });
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

      {/* 1. HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${currentTheme.border} h-16 flex justify-between items-center px-4`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${currentTheme.accent}`}>🚜</div>
          <span className="font-bold text-lg">Farmer {address?.slice(0,6)}...</span>
        </div>
        <div className="flex items-center gap-2">
           <button
             onClick={() => setShowOnboarding(true)}
             className={`p-2 rounded-full hover:bg-black/5 transition-colors ${currentTheme.strongText}`}
             title="How to Play"
           >
             <HelpCircle size={24} />
           </button>
           <button
             onClick={() => setIsLeaderboardOpen(true)}
             className={`px-3 py-2 rounded-xl font-bold flex items-center gap-2 border ${currentTheme.border} bg-white/50 hover:bg-white transition-colors`}
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
                   <div key={dayNum} className={`relative aspect-square rounded-xl border flex items-center justify-center transition-all ${emoji ? currentTheme.activeBox : 'bg-white/30 border-transparent'}`}>
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
                      ? `${currentTheme.accent} border-transparent shadow-lg scale-[1.02]`
                      : `bg-white/50 ${currentTheme.border} ${currentTheme.text} hover:bg-white`}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{cat.label}</span>

                    <div className="flex items-center gap-2 mt-1">
                       {/* Price */}
                       <span className="text-xs opacity-80 font-mono">{cat.price}</span>

                       {/* XP Badge */}
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-black/10 ${currentTheme.text}`}>
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
                  className="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl hover:scale-110 active:scale-90 transition-transform cursor-pointer"
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
