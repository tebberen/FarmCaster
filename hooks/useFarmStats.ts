import { useReadContracts, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, HUB_ABI } from '@/constants/contracts';

export function useFarmStats() {
  const { address, chainId } = useAccount();

  // Eğer desteklenmeyen bir ağdaysa varsayılan olarak Base (8453) adreslerini kullan,
  // ama veri çekmeye çalışma (hook enabled: false olur).
  const currentChainId = chainId && CONTRACT_ADDRESSES[chainId] ? chainId : 8453;
  const hubAddress = CONTRACT_ADDRESSES[currentChainId]?.hub;

  // Sadece desteklenen ağdaysak ve adresimiz varsa sorgu yap
  const isEnabled = !!address && !!CONTRACT_ADDRESSES[chainId || 0];

  const result = useReadContracts({
    contracts: [
      {
        address: hubAddress,
        abi: HUB_ABI,
        functionName: 'userXP',
        args: [address as `0x${string}`],
      },
      {
        address: hubAddress,
        abi: HUB_ABI,
        functionName: 'userStreak',
        args: [address as `0x${string}`],
      },
      {
        address: hubAddress,
        abi: HUB_ABI,
        functionName: 'lastActionTimestamp',
        args: [address as `0x${string}`],
      },
    ],
    query: {
      enabled: isEnabled, // Desteklenmeyen ağda sorgu yapma
      refetchInterval: 5000, // 5 saniyede bir güncelle
    }
  });

  return {
    xp: result.data?.[0].result ? Number(result.data[0].result) : 0,
    streak: result.data?.[1].result ? Number(result.data[1].result) : 0,
    lastAction: result.data?.[2].result ? Number(result.data[2].result) : 0,
    isLoading: result.isLoading,
    chainId: currentChainId
  };
}
