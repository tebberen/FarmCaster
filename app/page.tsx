import React from 'react';
import FarmGrid from '@/components/FarmGrid';
import { Tractor, Info, RefreshCw, Share2, Wallet, User } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navbar */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <Tractor className="text-black" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FARMCASTER</h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
             <div className="hidden md:flex items-center gap-4 text-gray-400">
                <Info size={20} className="hover:text-white cursor-pointer" />
                <RefreshCw size={20} className="hover:text-white cursor-pointer" />
                <Share2 size={20} className="hover:text-white cursor-pointer" />
             </div>

             <button className="flex items-center gap-2 bg-[#11131F] border border-green-900/50 hover:border-green-500/50 text-green-500 px-4 py-2 rounded-lg transition-all">
                <Wallet size={18} />
                <span className="font-mono font-bold">0x12...F4A2</span>
             </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile Card */}
          <div className="bg-[#11131F] border border-gray-800 p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                   <User className="text-purple-400" size={24} />
                </div>
                <div>
                   <p className="text-gray-400 text-xs uppercase font-bold mb-1">Çiftçi Profili</p>
                   <h3 className="text-xl font-bold">@kullanici</h3>
                </div>
             </div>

             <div className="text-right relative z-10">
                 <div className="text-yellow-400 font-bold text-2xl flex items-center gap-1 justify-end">
                    🏆 1,470 XP
                 </div>
                 <p className="text-gray-500 text-xs">Hasat Puanı</p>
             </div>

             {/* Decorative background glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full pointer-events-none" />
          </div>

          {/* Streak Card */}
          <div className="bg-[#11131F] border border-gray-800 p-6 rounded-xl flex items-center justify-between relative overflow-hidden">
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                   <div className="text-2xl">🔥</div>
                </div>
                <div>
                   <p className="text-gray-400 text-xs uppercase font-bold mb-1">Global Streak</p>
                   <h3 className="text-orange-500 font-bold text-2xl">15 Gün 🔥</h3>
                </div>
             </div>

             <div className="text-right max-w-[150px] relative z-10">
                 <p className="text-gray-500 text-xs leading-relaxed">
                   Zinciri kırmamak için her gün en az 1 işlem yap!
                 </p>
             </div>

             {/* Decorative background glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[50px] rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Main Grid */}
        <FarmGrid />

        {/* Action Area & Daily Task */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Action Area */}
           <div className="md:col-span-2 bg-[#11131F] border border-gray-800 p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                 <span className="text-yellow-500">⚡</span>
                 <h3 className="font-bold text-gray-300 text-sm tracking-wide uppercase">Aksiyon Alanı</h3>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                       <div className="w-8 h-8 rounded-full bg-white/20" />
                    </div>
                    <div>
                       <h2 className="text-3xl font-bold">BASE <span className="text-lg text-gray-500 font-normal">Ağı</span></h2>
                       <p className="text-green-500 font-mono text-sm">Gün 14 — Kasım</p>
                    </div>
                 </div>

                 <button className="w-full md:w-auto bg-[#1a1d2d] hover:bg-[#23273a] text-gray-400 hover:text-white border border-gray-700 px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all group">
                    <span className="group-hover:rotate-12 transition-transform duration-300">💧</span>
                    <span className="font-bold tracking-wide">SULANDI</span>
                 </button>
              </div>

              {/* Decorative background glow */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
           </div>

           {/* Daily Task */}
           <div className="bg-[#11131F] border border-gray-800 p-6 rounded-xl relative overflow-hidden">
               <div className="flex items-center gap-2 mb-4">
                 <span className="text-blue-400">🗳️</span>
                 <h3 className="font-bold text-gray-300 text-sm tracking-wide uppercase">Günlük Görev</h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                 Farcaster üzerinde günlük aktiviteni paylaş ve ekstra XP kazan.
              </p>

               {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full pointer-events-none" />
           </div>
        </div>

      </div>
    </main>
  );
}
