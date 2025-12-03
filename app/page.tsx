import { Tractor, Wallet, Trophy, Sprout } from 'lucide-react';

export default function Home() {
  const networks = [
    { id: 'base', name: 'Base' },
    { id: 'bsc', name: 'BSC' },
    { id: 'eth', name: 'Eth' },
    { id: 'arb', name: 'Arb' },
    { id: 'monad', name: 'Monad' },
    { id: 'hyperevm', name: 'HyperEVM' },
    { id: 'celo', name: 'Celo' },
  ];

  return (
    <main className="w-full max-w-4xl p-4 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#1a1614] border border-[#3e3229] p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-[#3e3229] rounded-md">
             <Tractor className="w-6 h-6 text-[#e8d5c4]" />
           </div>
           <span className="text-xl font-bold tracking-wide">FARMCASTER</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-mono text-lg">0 XP</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0f0c0a] px-3 py-1 rounded border border-[#3e3229]">
            <Wallet className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-mono">0x...</span>
          </div>
        </div>
      </header>

      {/* Farm Grid */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-[#3e3229] pb-2">My Farm</h2>
        <div className="bg-[#1a1614] border border-[#3e3229] rounded-lg p-6 space-y-4">
          {networks.map((net) => (
            <div key={net.id} className="flex items-center h-12 border-b border-[#3e3229]/50 last:border-0">
              {/* Network Name (Left) - Fixed Width */}
              <div className="w-32 flex-shrink-0 font-bold text-[#e8d5c4]/80 flex items-center gap-2">
                 <span>{net.name}</span>
              </div>

              {/* Farm Cells (Right) - Flex Grow */}
              <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {/* Placeholder cells */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-[#0f0c0a] border border-[#3e3229] rounded-sm flex-shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seed Market */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-[#3e3229] pb-2">Seed Market</h2>
        <div className="grid grid-cols-4 gap-4">
          {/* Market Items */}
          {[1, 2, 3, 4].map((item) => (
             <div key={item} className="bg-[#1a1614] border border-[#3e3229] rounded-lg p-4 flex flex-col items-center gap-3 hover:border-[#e8d5c4]/50 transition-colors cursor-pointer shadow-sm">
                <div className="w-12 h-12 flex items-center justify-center bg-[#0f0c0a] rounded-full border border-[#3e3229]">
                  <Sprout className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Seed {item}</div>
                  <div className="text-xs text-gray-500">Inventory Card</div>
                </div>
                <button className="w-full mt-2 py-1 text-xs bg-[#3e3229] hover:bg-[#5c4d41] rounded text-[#e8d5c4]">
                  Buy
                </button>
             </div>
          ))}
        </div>
      </section>
    </main>
  );
}
