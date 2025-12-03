import { useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, HUB_ABI } from '@/constants/contracts';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base, bsc, arbitrum, celo, mainnet } from 'wagmi/chains';
import { useState, useEffect, useMemo } from 'react';
import { config } from '@/config/wagmi';

// RPC URLs (High Performance)
const RPC_URLS: Record<number, string> = {
  8453: 'https://base.llamarpc.com',
  56: 'https://binance.llamarpc.com',
  42161: 'https://arbitrum.llamarpc.com',
  42220: 'https://forno.celo.org',
  1: 'https://eth.llamarpc.com',
  143: 'https://rpc.monad.xyz',
  999: 'https://rpc.hyperliquid.xyz/evm',
};

const BLOCKS_PER_DAY: Record<number, number> = {
  8453: 43200,   // 2s
  56: 28800,     // 3s
  42161: 345600, // 0.25s approx
  42220: 17280,  // 5s
  1: 7200,       // 12s
  143: 86400,    // 1s
  999: 86400     // 1s
};

export function useFarmStats() {
  const { address } = useAccount();
  // History: chainId -> { 'latest': emoji }
  const [history, setHistory] = useState<Record<number, Record<string, string>>>({});

  // 1. Fetch Basic Stats (XP, Streak) - Lightweight
  const chains = useMemo(() => Object.keys(CONTRACT_ADDRESSES).map(Number), []);
  const contracts = useMemo(() => {
      if (!address) return [];
      return chains.flatMap((chainId) => {
        const hubAddress = CONTRACT_ADDRESSES[chainId].hub;
        return [
          { address: hubAddress, abi: HUB_ABI, functionName: 'userXP', args: [address], chainId },
          { address: hubAddress, abi: HUB_ABI, functionName: 'userStreak', args: [address], chainId },
          { address: hubAddress, abi: HUB_ABI, functionName: 'lastActionTimestamp', args: [address], chainId },
        ];
      });
  }, [address, chains]);

  const { data: readData, isLoading } = useReadContracts({
    contracts,
    query: { enabled: !!address, refetchInterval: 10000 },
  });

  // Process Basic Stats
  const { statsMap, globalTotalXP } = useMemo(() => {
    const stats: Record<number, { xp: number; streak: number; lastAction: number }> = {};
    let globalXP = 0;

    if (readData) {
      chains.forEach((chainId, index) => {
        const i = index * 3;
        const xp = Number(readData[i]?.result || 0);
        stats[chainId] = {
          xp,
          streak: Number(readData[i+1]?.result || 0),
          lastAction: Number(readData[i+2]?.result || 0)
        };
        globalXP += Math.floor(xp / 100);
      });
    }
    return { statsMap: stats, globalTotalXP: globalXP };
  }, [readData, chains]);

  // 2. Fetch History Logs (The Heavy Part) - Optimized
  useEffect(() => {
    if (!address) return;

    const fetchLogs = async () => {
      const newHistory: Record<number, Record<string, string>> = {};

      await Promise.all(chains.map(async (chainId) => {
        try {
          const chainDef = config.chains.find(c => c.id === chainId);
          // Use our custom RPC URL if available, else fallback to undefined (default)
          const transport = RPC_URLS[chainId] ? http(RPC_URLS[chainId]) : http();

          const client = createPublicClient({
            chain: chainDef,
            transport
          });

          // Calculate "From Block" roughly based on time (30 days ago) to save RPC calls
          let fromBlock = BigInt(0);
          try {
             const currentBlock = await client.getBlockNumber();
             const blocksBack = BigInt(BLOCKS_PER_DAY[chainId] ? BLOCKS_PER_DAY[chainId] * 30 : 100000);
             fromBlock = currentBlock - blocksBack > BigInt(0) ? currentBlock - blocksBack : BigInt(0);
          } catch(err) {
             console.warn(`Could not fetch block number for chain ${chainId}`, err);
          }

          // Get logs for 'SeedPlanted'
          const logs = await client.getLogs({
            address: CONTRACT_ADDRESSES[chainId].logic,
            event: parseAbiItem('event SeedPlanted(address indexed user, uint256 indexed seedId, uint256 pricePaid)'),
            args: { user: address },
            fromBlock: fromBlock === BigInt(0) ? 'earliest' : fromBlock
          });

          newHistory[chainId] = {};

          if (logs.length > 0) {
              const lastLog = logs[logs.length - 1];
              const seedId = Number(lastLog.args.seedId);
              newHistory[chainId]['latest'] = getEmojiForSeed(seedId);
          }

        } catch (e) {
          console.error(`Failed to fetch logs for chain ${chainId}`, e);
        }
      }));

      setHistory(newHistory);
    };

    fetchLogs();
  }, [address, chains]);

  return { statsMap, globalTotalXP, isLoading, history };
}

// Helper
function getEmojiForSeed(id: number) {
  if (id === 1) return '🍇'; // Default fruit
  if (id === 2) return '🌹'; // Default flower
  if (id === 3) return '🌳'; // Default tree
  return '🌱';
}
