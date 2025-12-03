"use client";

import { useAccount, useWriteContract, useSwitchChain } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../constants/contracts';
import { GARDEN_ABI } from '../constants/abis';
import { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { Loader2 } from 'lucide-react';

const CHAIN_ID_TO_KEY: Record<number, string> = {
  8453: 'base',
  56: 'bsc',
  42161: 'arb',
  42220: 'celo',
  1: 'eth',
  143: 'monad',
  999: 'hyperevm'
};

const SEED_PRICES: Record<number, string> = {
  0: '0',        // Free
  1: '0.00003',  // Fruits (~$0.10)
  2: '0.000045', // Flowers (~$0.15)
  3: '0.00006'   // Trees (~$0.20)
};

export default function ActionPanel({ seedId = 0 }: { seedId?: number }) {
  const { address, chainId } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  const { switchChain } = useSwitchChain();

  // Local state to track transaction status for UI feedback
  const [txHash, setTxHash] = useState<string | null>(null);

  const handlePlant = () => {
    if (!chainId) return;

    const chainKey = CHAIN_ID_TO_KEY[chainId];
    const contractData = CONTRACT_ADDRESSES[chainKey];

    if (!contractData) {
      console.error("Unsupported chain or missing contract address");
      return;
    }

    const price = SEED_PRICES[seedId] || '0';

    writeContract({
      address: contractData.garden as `0x${string}`,
      abi: GARDEN_ABI,
      functionName: 'plant',
      args: [BigInt(seedId)],
      value: parseEther(price)
    }, {
      onSuccess: (data) => {
        setTxHash(data);
        console.log("Transaction sent:", data);
      },
      onError: (err) => {
        console.error("Transaction failed:", err);
      }
    });
  };

  const isChainSupported = chainId && CHAIN_ID_TO_KEY[chainId];

  return (
    <div className="flex flex-col gap-4 p-4 wood-panel rounded-lg">
      <h3 className="text-xl font-bold text-[#5c3a21] text-center mb-2">Farm Controls</h3>

      {!address ? (
        <div className="text-center text-red-700 font-bold bg-red-100 p-2 rounded">
          Please Connect Wallet
        </div>
      ) : !isChainSupported ? (
        <div className="text-center text-orange-700 font-bold bg-orange-100 p-2 rounded">
          Unsupported Network
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-semibold text-[#5c3a21]">
                Planting Seed ID: {seedId}
            </div>

            <button
                onClick={handlePlant}
                disabled={isPending}
                className={`
                    w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg
                    transform transition-all active:scale-95
                    flex items-center justify-center gap-2
                    ${isPending
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-500 border-b-4 border-green-800 hover:border-green-700'}
                `}
            >
                {isPending ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Planting...
                    </>
                ) : (
                    <>
                        🌱 Plant Seed
                    </>
                )}
            </button>

            {error && (
                <div className="text-xs text-red-600 mt-2 text-center max-w-[200px] break-words">
                    {error.message.split('.')[0]}
                </div>
            )}

            {isSuccess && (
                <div className="text-xs text-green-700 mt-2 font-bold text-center">
                    Successfully planted!
                </div>
            )}
        </div>
      )}
    </div>
  );
}
