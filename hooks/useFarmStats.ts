import { useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, HUB_ABI } from '@/constants/contracts';
import { useMemo, useState, useEffect } from 'react';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base, bsc, arbitrum, celo, mainnet } from 'viem/chains';
import { monad, hyperEvm } from '@/config/wagmi';

const RPC_URLS: Record<number, string> = {
  8453: 'https://base.llamarpc.com',
  56: 'https://binance.llamarpc.com',
  42161: 'https://arbitrum.llamarpc.com',
  42220: 'https://forno.celo.org',
  1: 'https://eth.llamarpc.com',
  143: 'https://rpc.monad.xyz',
  999: 'https://rpc.hyperliquid.xyz/evm',
};

const CHAINS: Record<number, any> = {
  8453: base,
  56: bsc,
  42161: arbitrum,
  42220: celo,
  1: mainnet,
  143: monad,
  999: hyperEvm
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

  const chainIds = useMemo(() => Object.keys(CONTRACT_ADDRESSES).map(Number), []);

  const contracts = useMemo(() => {
    if (!address) return [];

    return chainIds.flatMap((chainId) => {
      const hubAddress = CONTRACT_ADDRESSES[chainId].hub;
      return [
        {
          address: hubAddress,
          abi: HUB_ABI,
          functionName: 'userXP',
          args: [address],
          chainId,
        },
        {
          address: hubAddress,
          abi: HUB_ABI,
          functionName: 'userStreak',
          args: [address],
          chainId,
        },
        {
          address: hubAddress,
          abi: HUB_ABI,
          functionName: 'lastActionTimestamp',
          args: [address],
          chainId,
        },
      ];
    });
  }, [address, chainIds]);

  const result = useReadContracts({
    contracts,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  const { statsMap, globalTotalXP } = useMemo(() => {
    if (!result.data) return { statsMap: {}, globalTotalXP: 0 };

    const map: Record<number, { xp: number; streak: number; lastAction: number }> = {};
    let totalXP = 0;

    chainIds.forEach((chainId, index) => {
      const offset = index * 3;
      const xpRes = result.data[offset];
      const streakRes = result.data[offset + 1];
      const lastActionRes = result.data[offset + 2];

      const xp = xpRes?.status === 'success' ? Number(xpRes.result) : 0;
      const streak = streakRes?.status === 'success' ? Number(streakRes.result) : 0;
      const lastAction = lastActionRes?.status === 'success' ? Number(lastActionRes.result) : 0;

      map[chainId] = { xp, streak, lastAction };
      totalXP += Math.floor(xp / 100);
    });

    return { statsMap: map, globalTotalXP: totalXP };
  }, [result.data, chainIds]);

  // --- History Fetching Logic ---
  const [history, setHistory] = useState<Record<number, Record<number, number>>>({});

  useEffect(() => {
    if (!address) return;

    const fetchHistory = async () => {
      const newHistory: Record<number, Record<number, number>> = {};

      await Promise.all(Object.keys(CONTRACT_ADDRESSES).map(async (chainIdStr) => {
        const chainId = Number(chainIdStr);
        const rpc = RPC_URLS[chainId];
        const chain = CHAINS[chainId];
        const logicAddress = CONTRACT_ADDRESSES[chainId].logic;

        if (!rpc || !chain || !logicAddress) return;

        try {
          const client = createPublicClient({
            chain,
            transport: http(rpc),
          });

          // Fetch recent blocks
          const currentBlock = await client.getBlockNumber();
          const blocksBack = BigInt(BLOCKS_PER_DAY[chainId] ? BLOCKS_PER_DAY[chainId] * 32 : 1000000);
          const fromBlock = currentBlock - blocksBack > 0n ? currentBlock - blocksBack : 0n;

          const logs = await client.getLogs({
            address: logicAddress,
            event: parseAbiItem('event SeedPlanted(address indexed user, uint256 indexed seedId, uint256 pricePaid)'),
            args: { user: address },
            fromBlock,
            toBlock: 'latest'
          });

          if (logs.length === 0) return;

          // Process timestamps by fetching blocks
          const blockNumbers = Array.from(new Set(logs.map(l => l.blockNumber)));
          const blockTimestamps: Record<string, number> = {};

          await Promise.all(blockNumbers.map(async (bn) => {
             try {
                const block = await client.getBlock({ blockNumber: bn });
                blockTimestamps[bn.toString()] = Number(block.timestamp);
             } catch (err) {
                console.warn(`Failed to fetch block ${bn} on chain ${chainId}`, err);
             }
          }));

          const chainHistory: Record<number, number> = {};
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          logs.forEach(log => {
            const ts = blockTimestamps[log.blockNumber.toString()];
            if (ts) {
              const date = new Date(ts * 1000);
              // Only add if it belongs to the current month view
              if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                chainHistory[date.getDate()] = Number(log.args.seedId);
              }
            }
          });

          if (Object.keys(chainHistory).length > 0) {
              newHistory[chainId] = chainHistory;
          }

        } catch (e) {
          console.error(`Failed to fetch history for chain ${chainId}`, e);
        }
      }));

      setHistory(newHistory);
    };

    fetchHistory();
  }, [address]);

  return {
    statsMap,
    globalTotalXP,
    isLoading: result.isLoading,
    refetch: result.refetch,
    history,
  };
}
