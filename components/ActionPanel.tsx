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
    <div className="flex flex-col gap-4 p-5 wood-panel rounded-lg h-full">
      <h3 className="text-xl font-black text-[#e0d8c8] text-center mb-2 tracking-widest uppercase">Farm Controls</h3>

      {!address ? (
        <div className="text-center text-red-400 font-bold bg-red-900/20 p-3 rounded border border-red-900/50">
          Please Connect Wallet
        </div>
      ) : !isChainSupported ? (
        <div className="text-center text-orange-400 font-bold bg-orange-900/20 p-3 rounded border border-orange-900/50">
          Unsupported Network
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 flex-1 justify-center">
            <div className="text-sm font-bold text-[#8d6e63] uppercase tracking-wide">
                Planting Seed ID: <span className="text-[#e0d8c8]">{seedId}</span>
            </div>

            <button
                onClick={handlePlant}
                disabled={isPending}
                className={`
                    w-full py-4 px-6 rounded-xl font-black text-white shadow-lg uppercase tracking-widest text-sm
                    transform transition-all active:scale-95
                    flex items-center justify-center gap-3
                    ${isPending
                        ? 'bg-[#2c241b] border-[#1a1614] text-[#5d4037] cursor-not-allowed'
                        : 'bg-gradient-to-b from-[#66bb6a] to-[#43a047] border-b-4 border-[#1b5e20] hover:brightness-110'}
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
                <div className="text-xs text-red-400 mt-2 text-center break-words bg-red-900/20 p-2 rounded border border-red-900/30 w-full">
                    {error.message.split('.')[0]}
                </div>
            )}

            {isSuccess && (
                <div className="text-xs text-green-400 mt-2 font-bold text-center bg-green-900/20 p-2 rounded border border-green-900/30 w-full animate-pulse">
                    Successfully planted!
                </div>
            )}
        </div>
      )}
    </div>
  );
}
