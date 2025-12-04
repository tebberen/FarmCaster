"use client";

import React, { useState } from "react";
import { Tractor, Wallet, User, Droplets } from "lucide-react";

const NETWORKS = [
  { id: "base", name: "Base", color: "bg-blue-600" },
  { id: "bsc", name: "BSC", color: "bg-yellow-500" },
  { id: "eth", name: "Ethereum", color: "bg-slate-600" },
  { id: "arb", name: "Arbitrum", color: "bg-cyan-600" },
  { id: "monad", name: "Monad", color: "bg-purple-600" },
  { id: "hyper", name: "HyperEVM", color: "bg-pink-600" },
  { id: "celo", name: "Celo", color: "bg-green-500" },
];

const SEEDS = [
  { id: "starter", name: "Starter", price: "Free", xp: 1, icon: "🌱" },
  { id: "fruits", name: "Fruits", price: "$0.10", xp: 2, icon: "🍒" },
  { id: "flowers", name: "Flowers", price: "$0.15", xp: 3, icon: "🌻" },
  { id: "trees", name: "Trees", price: "$0.20", xp: 5, icon: "🌲" },
];

export default function FarmCaster() {
  const [selectedSeed, setSelectedSeed] = useState(SEEDS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

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
          <span className="font-medium">Farmer_01</span>
          <span className="text-emerald-400 font-bold">| 1,240 XP</span>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg font-bold text-sm text-white">
          <Wallet size={16} />
          Connect
        </button>
      </header>

      {/* CONTENT */}
      <div className="pt-20 px-4 max-w-3xl mx-auto space-y-8">
        {/* FARM GRID */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Weekly Schedule</h2>
            <span className="text-xs text-slate-500">Scroll →</span>
          </div>
          <div className="flex flex-col">
            {NETWORKS.map((net) => (
              <div key={net.id} className="flex items-center border-b border-slate-800 last:border-0 h-16 hover:bg-slate-800/30 transition-colors group">
                <div
                  className="w-[130px] flex-shrink-0 pl-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setSelectedNetwork(net)}
                >
                  <div className={`w-3 h-3 rounded-full ${net.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                  <span className={`text-sm font-medium transition-colors ${selectedNetwork.id === net.id ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {net.name}
                  </span>
                </div>
                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3 px-4 mask-linear-fade">
                   {[...Array(7)].map((_, i) => (
                     <div
                        key={i}
                        className="w-10 h-10 flex-shrink-0 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-xs font-medium hover:border-emerald-500/50 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                     >
                       {i + 1}
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </section>

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
            <button className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-lg py-3.5 rounded-xl shadow-lg shadow-emerald-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-emerald-400/20">
              <Droplets size={20} className="fill-white" />
              PLANT SEED NOW
            </button>
         </div>
      </section>
    </main>
  );
}
