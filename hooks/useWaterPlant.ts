import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, GARDEN_ABI } from '@/constants/contracts';

export function useWaterPlant() {
  const { chainId } = useAccount();
  const { writeContract, isPending, isSuccess, data: hash } = useWriteContract();

  const plant = (seedId: number, value: bigint) => {
    // Check if we are on a valid network
    if (!chainId || !CONTRACT_ADDRESSES[chainId]) {
      alert("Please switch to a supported network first!");
      return;
    }

    const logicAddress = CONTRACT_ADDRESSES[chainId].logic;

    writeContract({
      address: logicAddress,
      abi: GARDEN_ABI,
      functionName: 'plant',
      args: [BigInt(seedId)],
      value: value,
    });
  };

  return { plant, isPending, isSuccess, hash };
}
