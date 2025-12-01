import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, LOGIC_ABI } from '@/constants/contracts';

export function useWaterPlant() {
  const { chainId } = useAccount();
  const { writeContract, isPending, isSuccess, data: hash } = useWriteContract();

  const waterPlant = () => {
    // Geçerli bir ağda mıyız kontrol et
    if (!chainId || !CONTRACT_ADDRESSES[chainId]) {
      alert("Please switch to a supported network (Base or BSC) first!");
      return;
    }

    const logicAddress = CONTRACT_ADDRESSES[chainId].logic;

    writeContract({
      address: logicAddress,
      abi: LOGIC_ABI,
      functionName: 'waterPlant',
    });
  };

  return { waterPlant, isPending, isSuccess, hash };
}
