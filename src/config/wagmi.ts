import { http, createConfig } from "wagmi";
import { base, mainnet, arbitrum, celo, bsc } from "wagmi/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { defineChain } from "viem";

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
    default: { http: ['https://rpc.hyper-evm.example.com'] },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [mainnet, base, bsc, arbitrum, celo, monadTestnet, hyperEvmTestnet],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
    [monadTestnet.id]: http(),
    [hyperEvmTestnet.id]: http(),
  },
  connectors: [
    farcasterMiniApp(),
  ],
});
