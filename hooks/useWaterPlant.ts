import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { GARDEN_ABI } from '@/constants/abis';

const CHAIN_ID_TO_KEY: Record<number, string> = {
  8453: 'base',
  56: 'bsc',
  42161: 'arb',
  42220: 'celo',
  1: 'eth',
  143: 'monad',
  999: 'hyperevm'
};

export function useWaterPlant() {
  const { chainId } = useAccount();
  const { writeContract, isPending, isSuccess, data: hash } = useWriteContract();

  const waterPlant = (seedId: number, value: bigint) => {
    const chainKey = chainId ? CHAIN_ID_TO_KEY[chainId] : undefined;

    if (!chainId || !chainKey || !CONTRACT_ADDRESSES[chainKey]) {
      alert("Please switch to a supported network first!");
      return;
    }

    const gardenAddress = CONTRACT_ADDRESSES[chainKey].garden;

    writeContract({
      address: gardenAddress as `0x${string}`,
      abi: GARDEN_ABI,
      functionName: 'plant',
      args: [BigInt(seedId)],
      value: value,
    });
  };

  return { waterPlant, isPending, isSuccess, hash };
}
