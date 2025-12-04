import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, bsc, mainnet, arbitrum, celo } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define Monad Testnet (Placeholder)
const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
});

// Define HyperEVM (Placeholder)
const hyperEvm = defineChain({
  id: 999, // Replace with actual ID later
  name: 'HyperEVM',
  nativeCurrency: { name: 'Hyper', symbol: 'HYPE', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.hyper.xyz'] } },
});

export const config = getDefaultConfig({
  appName: 'FarmCaster',
  projectId: 'YOUR_PROJECT_ID', // Public testing ID
  chains: [base, bsc, mainnet, arbitrum, celo, monadTestnet, hyperEvm],
  ssr: true,
});
