import { useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, HUB_ABI } from '@/constants/contracts';
import { useMemo } from 'react';

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

  return {
    statsMap,
    globalTotalXP,
    isLoading: result.isLoading,
    refetch: result.refetch,
  };
}
