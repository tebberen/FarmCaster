'use client';
import React from 'react';
import FarmGrid from '@/components/FarmGrid';
import SeedMarket from '@/components/SeedMarket';
import ActionPanel from '@/components/ActionPanel';
import { useFarmStats } from '@/hooks/useFarmStats';
import { useAccount, useSwitchChain } from 'wagmi';
import { Tractor, Wallet, Trophy } from 'lucide-react';
import { NETWORKS } from '@/constants';

export default function Home() {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { statsMap, globalTotalXP } = useFarmStats(); // Multichain Hook

  const activeNetworkName = NETWORKS.find(n => (n as any).chainId === chainId)?.name || "Unknown";

  const handleNetworkSelect = (id: string) => {
    const chainMap: Record<string, number> = { base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999 };
    if(chainMap[id]) switchChain({ chainId: chainMap[id] });
  };

  return (
    <main className="min-h-screen p-4 pb-20">
      <nav className="wood-panel mb-8 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#2c241b] p-2 rounded text-[#e0d8c8]"><Tractor size={24} /></div>
          <h1 className="text-2xl font-black text-[#e0d8c8] hidden md:block">FARMCASTER</h1>
        </div>
        <div className="flex gap-2">
           <button className="bg-[#2c241b] text-[#e0d8c8] px-3 py-1 rounded border-b-4 border-[#3e3229] font-bold text-xs flex items-center gap-1"><Trophy size={14}/> {Math.floor(globalTotalXP)} XP</button>
           <div className="bg-[#0f0c0a] text-[#e0d8c8] px-3 py-1 rounded font-mono text-xs flex items-center gap-2 border border-[#3e3229]"><Wallet size={14}/> {address ? address.slice(0,6) : 'Connect'}</div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto">
        <FarmGrid statsMap={statsMap} onNetworkSelect={handleNetworkSelect} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SeedMarket />
          <ActionPanel />
        </div>
      </div>
    </main>
  );
}
