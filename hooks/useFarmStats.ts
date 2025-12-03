import { useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { HUB_ABI } from '@/constants/abis';

// Helper to map chain ID to contract key
const CHAIN_ID_TO_KEY: Record<number, string> = {
  8453: 'base',
  56: 'bsc',
  42161: 'arb',
  42220: 'celo',
  1: 'eth',
  143: 'monad',
  999: 'hyperevm'
};

export function useFarmStats() {
  const { address } = useAccount();

  // Create contract calls for ALL 7 chains
  const chainIds = Object.keys(CHAIN_ID_TO_KEY).map(Number);

  const contracts = chainIds.flatMap((chainId) => {
    const chainKey = CHAIN_ID_TO_KEY[chainId];
    const hubAddress = CONTRACT_ADDRESSES[chainKey]?.hub as `0x${string}`;

    // Safety check if address is missing
    if (!hubAddress) return [];

    return [
      { address: hubAddress, abi: HUB_ABI, functionName: 'getUserStats', args: [address], chainId },
    ];
  });

  const { data, isLoading } = useReadContracts({
    contracts,
    query: {
      enabled: !!address,
      refetchInterval: 10000
    },
  });

  // Map the results
  const statsMap: Record<number, { xp: number; streak: number; lastAction: number }> = {};
  let globalTotalXP = 0;

  if (data) {
    chainIds.forEach((chainId, index) => {
      // The new ABI has getUserStats returning a tuple/struct
      // Output: [totalPoints, currentStreak, maxStreak, totalTxCount, lastActivityTime, joinedAt]

      const result = data[index]?.result as any;

      let xp = 0;
      let streak = 0;
      let lastAction = 0;

      if (result) {
        // Struct usually returned as object or array depending on wagmi config/version
        // Assuming object based on ABI components names
        xp = Number(result.totalPoints || result[0] || 0);
        streak = Number(result.currentStreak || result[1] || 0);
        lastAction = Number(result.lastActivityTime || result[4] || 0);
      }

      statsMap[chainId] = { xp, streak, lastAction };
      globalTotalXP += Math.floor(xp / 100);
    });
  }

  return { statsMap, globalTotalXP, isLoading };
}
