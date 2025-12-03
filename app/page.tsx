'use client';
import React from 'react';
import FarmGrid from '@/components/FarmGrid';
import SeedMarket from '@/components/SeedMarket';
import ActionPanel from '@/components/ActionPanel'; // Keeping ActionPanel as requested implicitly by "assemble everything" but user only asked to rewrite 3 files. I will assume ActionPanel is still needed for layout balance or I can remove it if "assemble cleanly" implies only using the new SeedMarket. But the previous page had it. I'll keep it.
import { useFarmStats } from '@/hooks/useFarmStats';
import { useAccount, useSwitchChain } from 'wagmi';
import { Tractor, Wallet, Trophy } from 'lucide-react';
import { NETWORKS } from '@/constants';

export default function Home() {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { statsMap, globalTotalXP } = useFarmStats();

  const handleNetworkSelect = (id: string) => {
    const chainMap: Record<string, number> = { base: 8453, bsc: 56, arb: 42161, celo: 42220, eth: 1, monad: 143, hyperevm: 999 };
    if(chainMap[id]) switchChain({ chainId: chainMap[id] });
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">

      {/* Navbar - Wood Panel Style */}
      <nav className="bg-[#1a1614] border border-[#3e3229] rounded-xl p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#0f0c0a] p-2 rounded border border-[#3e3229] text-[#e8d5c4]">
            <Tractor size={20} />
          </div>
          <h1 className="text-xl font-bold text-[#e8d5c4] tracking-widest hidden sm:block">FARMCASTER</h1>
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-[#0f0c0a] px-4 py-2 rounded border border-[#3e3229] text-[#e8d5c4] text-xs font-mono flex items-center gap-2">
             <Trophy size={14} className="text-[#e8d5c4]" />
             <span>{Math.floor(globalTotalXP)} XP</span>
           </div>
           <div className="bg-[#0f0c0a] px-4 py-2 rounded border border-[#3e3229] text-[#e8d5c4] text-xs font-mono flex items-center gap-2">
             <Wallet size={14} className="text-[#e8d5c4]" />
             <span>{address ? `${address.slice(0,6)}...` : 'Connect'}</span>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col gap-8">
        <FarmGrid statsMap={statsMap} onNetworkSelect={handleNetworkSelect} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SeedMarket />
          {/* Preserving ActionPanel for balance, assuming it handles other quick actions */}
          <div className="opacity-80 hover:opacity-100 transition-opacity">
             <ActionPanel />
          </div>
        </div>
      </div>

    </main>
  );
}
