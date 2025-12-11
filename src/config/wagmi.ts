import { http, createConfig } from "wagmi";
import { base, mainnet, arbitrum, celo, bsc } from "wagmi/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { injected, coinbaseWallet } from "wagmi/connectors";
import { defineChain } from "viem";

export const monadMainnet = defineChain({
  id: 143,
  name: 'Monad Mainnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadVision', url: 'https://monadvision.com' },
  },
  testnet: false,
});

export const hyperEvmMainnet = defineChain({
  id: 999,
  name: 'HyperEVM Mainnet',
  nativeCurrency: { name: 'Hyper', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'HyperEVMScan', url: 'https://hyperevmscan.io' },
  },
  testnet: false,
});

export const config = createConfig({
  chains: [mainnet, base, bsc, arbitrum, celo, monadMainnet, hyperEvmMainnet],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
    [monadMainnet.id]: http(),
    [hyperEvmMainnet.id]: http(),
  },
  connectors: [
    farcasterMiniApp(),
    injected(),
    coinbaseWallet({ appName: 'FarmCaster' }),
  ],
  ssr: true,
});
