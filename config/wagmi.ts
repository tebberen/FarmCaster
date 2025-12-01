import { http, createConfig } from 'wagmi';
import { base, bsc, arbitrum, celo, mainnet } from 'wagmi/chains';
import { defineChain } from 'viem';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

// Custom Chain: Monad Mainnet
const monad = defineChain({
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

// Custom Chain: HyperEVM Mainnet
const hyperEvm = defineChain({
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

export const config = createConfig({
  chains: [base, bsc, arbitrum, celo, mainnet, monad, hyperEvm],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
    [mainnet.id]: http(),
    [monad.id]: http(),
    [hyperEvm.id]: http(),
  },
});
