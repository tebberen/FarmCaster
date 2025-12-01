import React, { useEffect, useState } from 'react';
import { createPublicClient, http, parseAbiItem, formatUnits, Address } from 'viem';
import { base, bsc, arbitrum, celo, mainnet } from 'wagmi/chains';
import { monad, hyperEvm } from '@/config/wagmi';
import { NETWORKS } from '@/constants';
import { CONTRACT_ADDRESSES, HUB_ABI } from '@/constants/contracts';
import { Loader2, Trophy, X, Medal } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaderboardUser {
  rank: number;
  address: string;
  xp: number;
  streak: number;
}

const NETWORK_CHAIN_IDS: Record<string, number> = {
  base: 8453,
  bsc: 56,
  eth: 1,
  arb: 42161,
  monad: 143,
  hyperevm: 999,
  celo: 42220,
};

const CHAIN_OBJECTS: Record<number, any> = {
  8453: base,
  56: bsc,
  1: mainnet,
  42161: arbitrum,
  143: monad,
  999: hyperEvm,
  42220: celo,
};

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [activeTab, setActiveTab] = useState<string>('base');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, activeTab]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setUsers([]);
    try {
      const chainId = NETWORK_CHAIN_IDS[activeTab];
      const chain = CHAIN_OBJECTS[chainId];
      const addresses = CONTRACT_ADDRESSES[chainId];

      if (!chain || !addresses) {
        console.error("Chain or addresses not found");
        setIsLoading(false);
        return;
      }

      const client = createPublicClient({
        chain,
        transport: http(),
      });

      const currentBlock = await client.getBlockNumber();
      const fromBlock = currentBlock - 10000n > 0n ? currentBlock - 10000n : 0n;

      // 1. Fetch Logs to find active users
      const logs = await client.getLogs({
        address: addresses.hub,
        event: parseAbiItem('event StatsUpdated(address indexed user, uint256 addedXP, uint256 newStreak)'),
        fromBlock,
        toBlock: 'latest',
      });

      // Extract unique users
      const uniqueUsers = Array.from(new Set(logs.map(log => log.args.user as Address)));

      if (uniqueUsers.length === 0) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      // 2. Fetch current stats for these users using Multicall
      // Prepare calls: 2 calls per user (userXP, userStreak)
      const contracts = uniqueUsers.flatMap(user => [
        {
          address: addresses.hub,
          abi: HUB_ABI,
          functionName: 'userXP',
          args: [user],
        },
        {
          address: addresses.hub,
          abi: HUB_ABI,
          functionName: 'userStreak',
          args: [user],
        }
      ]);

      const results = await client.multicall({
        contracts: contracts as any, // Type assertion to avoid strict typing issues with diverse calls if any
      });

      const leaderboardData: LeaderboardUser[] = [];

      for (let i = 0; i < uniqueUsers.length; i++) {
        const userAddress = uniqueUsers[i];
        const xpResult = results[i * 2];
        const streakResult = results[i * 2 + 1];

        if (xpResult.status === 'success' && streakResult.status === 'success') {
          // XP is stored with 2 decimals in contract (e.g. 100 -> 1.00 or similar?
          // Memory says: "XP values displayed in the UI are calculated by dividing the raw contract value by 100")
          // Let's follow that logic.
          const rawXP = Number(xpResult.result);
          const xp = Math.floor(rawXP / 100);
          const streak = Number(streakResult.result);

          leaderboardData.push({
            rank: 0, // Will assign after sorting
            address: userAddress,
            xp,
            streak,
          });
        }
      }

      // Sort by XP descending
      leaderboardData.sort((a, b) => b.xp - a.xp);

      // Assign ranks
      const rankedData = leaderboardData.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      setUsers(rankedData);

    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#09090b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0f1218]">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Network Tabs */}
        <div className="flex items-center gap-2 p-2 bg-[#050505] overflow-x-auto no-scrollbar border-b border-white/10">
          {NETWORKS.map((network) => {
            const Icon = network.icon;
            const isActive = activeTab === network.id;
            return (
              <button
                key={network.id}
                onClick={() => setActiveTab(network.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-[#1a1f2e] text-white border border-white/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}
                `}
              >
                <Icon size={16} className={isActive ? network.text || network.color.replace('bg-', 'text-') : ''} />
                {network.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500 gap-3">
              <Loader2 className="animate-spin text-green-500" size={32} />
              <p className="text-sm font-mono animate-pulse">Scanning blockchain...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.address}
                  className="bg-[#0f1218] hover:bg-[#1a1f2e] border border-white/5 hover:border-white/20 p-3 rounded-xl flex items-center gap-4 transition-all group"
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                      user.rank === 2 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/50' :
                      user.rank === 3 ? 'bg-orange-700/20 text-orange-400 border border-orange-700/50' :
                      'bg-white/5 text-gray-500'}
                  `}>
                    {user.rank <= 3 ? <Medal size={16} /> : user.rank}
                  </div>

                  <div className="flex-1">
                    <p className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-4">
                     <div className="flex flex-col items-end">
                       <span className="text-xs text-gray-500 uppercase font-bold">Streak</span>
                       <span className="text-white font-bold flex items-center gap-1">
                         🔥 {user.streak}
                       </span>
                     </div>
                     <div className="w-px h-8 bg-white/10" />
                     <div className="flex flex-col items-end min-w-[60px]">
                       <span className="text-xs text-gray-500 uppercase font-bold">XP</span>
                       <span className="text-yellow-400 font-black text-lg">
                         {user.xp.toLocaleString()}
                       </span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Trophy size={32} className="text-gray-600" />
              </div>
              <p className="text-lg font-bold text-gray-400">No farmers yet</p>
              <p className="text-sm">Be the first to harvest on {NETWORKS.find(n => n.id === activeTab)?.name}!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
