import { useWriteContract } from 'wagmi';
import { LOGIC_ADDRESS, LOGIC_ABI } from '@/constants/contracts';

export function useWaterPlant() {
  const { writeContract, isPending, isSuccess, data: hash, error } = useWriteContract();

  const waterPlant = () => {
    writeContract({
      address: LOGIC_ADDRESS,
      abi: LOGIC_ABI,
      functionName: 'waterPlant',
    });
  };

  return {
    waterPlant,
    isPending,
    isSuccess,
    hash,
    error,
  };
}
