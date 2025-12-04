import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import {
  arbitrum,
  base,
  bsc,
  celo,
  mainnet,
} from 'wagmi/chains';

const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ed'] },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://explorer.monadinfra.com/' },
  },
  testnet: true,
});

const hyperEvmTestnet = defineChain({
  id: 999,
  name: 'HyperEVM Testnet',
  nativeCurrency: { name: 'Hyper', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyper-evm.example.com'] }, // Placeholder
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Farmcaster',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    base,
    bsc,
    arbitrum,
    celo,
    monadTestnet,
    hyperEvmTestnet,
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
