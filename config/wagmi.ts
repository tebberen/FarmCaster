import { http, createConfig } from 'wagmi';
import { base, bsc, arbitrum, celo, mainnet } from 'wagmi/chains';
import { defineChain } from 'viem';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

// 1. Define Monad Mainnet
export const monad = defineChain({
  id: 143,
  name: 'Monad Mainnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadExplorer', url: 'https://monadexplorer.com' },
  },
});

// 2. Define HyperEVM Mainnet
export const hyperEvm = defineChain({
  id: 999,
  name: 'Hyperliquid EVM',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'HyperEVM Scan', url: 'https://hyperevmscan.io' },
  },
});

// 3. Create Config with ROBUST RPCs (LlamaNodes / Public High-Perf)
export const config = createConfig({
  chains: [base, bsc, arbitrum, celo, mainnet, monad, hyperEvm],
  connectors: [farcasterFrame()],
  transports: {
    // Base: LlamaNodes (High limit for logs)
    [base.id]: http('https://base.llamarpc.com'),

    // BSC: LlamaNodes
    [bsc.id]: http('https://binance.llamarpc.com'),

    // Arbitrum: LlamaNodes
    [arbitrum.id]: http('https://arbitrum.llamarpc.com'),

    // Celo: Official Public Node (Usually robust)
    [celo.id]: http('https://forno.celo.org'),

    // Ethereum: LlamaNodes
    [mainnet.id]: http('https://eth.llamarpc.com'),

    // Custom Chains (Official RPCs are usually performant for new chains)
    [monad.id]: http('https://rpc.monad.xyz'),
    [hyperEvm.id]: http('https://rpc.hyperliquid.xyz/evm'),
  },
});
