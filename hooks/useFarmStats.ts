import { useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, HUB_ABI } from '@/constants/contracts';

export function useFarmStats() {
  const { address } = useAccount();

  // Create contract calls for ALL 7 chains
  // We use Object.keys(CONTRACT_ADDRESSES) which gives strings, so map to Number
  const chains = Object.keys(CONTRACT_ADDRESSES).map(Number);
  const contracts = chains.flatMap((chainId) => {
    const hubAddress = CONTRACT_ADDRESSES[chainId].hub;
    return [
      { address: hubAddress, abi: HUB_ABI, functionName: 'userXP', args: [address], chainId },
      { address: hubAddress, abi: HUB_ABI, functionName: 'userStreak', args: [address], chainId },
      { address: hubAddress, abi: HUB_ABI, functionName: 'lastActionTimestamp', args: [address], chainId },
    ];
  });

  const { data, isLoading } = useReadContracts({
    contracts,
    query: {
      enabled: !!address,
      refetchInterval: 5000
    },
  });

  // Map the results
  const statsMap: Record<number, { xp: number; streak: number; lastAction: number }> = {};
  let globalTotalXP = 0;

  if (data) {
    chains.forEach((chainId, index) => {
      const i = index * 3;
      // Handle potential read errors gracefully with defaults
      // data[i] is the result object which has { result, status, error }
      const xp = Number(data[i]?.result || 0);
      const streak = Number(data[i+1]?.result || 0);
      const lastAction = Number(data[i+2]?.result || 0);

      statsMap[chainId] = { xp, streak, lastAction };
      globalTotalXP += Math.floor(xp / 100); // XP is usually scaled by 100 in this app based on memory
    });
  }

  return { statsMap, globalTotalXP, isLoading };
}
