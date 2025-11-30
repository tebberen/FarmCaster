import { useReadContracts } from 'wagmi';
import { HUB_ADDRESS, HUB_ABI } from '@/constants/contracts';
import { Address } from 'viem';

export function useFarmStats(address: Address | undefined) {
  const result = useReadContracts({
    contracts: [
      {
        address: HUB_ADDRESS,
        abi: HUB_ABI,
        functionName: 'userXP',
        args: address ? [address] : undefined,
      },
      {
        address: HUB_ADDRESS,
        abi: HUB_ABI,
        functionName: 'userStreak',
        args: address ? [address] : undefined,
      },
      {
        address: HUB_ADDRESS,
        abi: HUB_ABI,
        functionName: 'lastActionTimestamp',
        args: address ? [address] : undefined,
      },
    ],
    query: {
      enabled: !!address,
    }
  });

  return {
    userXP: result.data?.[0].result as bigint | undefined,
    userStreak: result.data?.[1].result as bigint | undefined,
    lastActionTimestamp: result.data?.[2].result as bigint | undefined,
    isLoading: result.isLoading,
    isError: result.isError,
    refetch: result.refetch,
  };
}
