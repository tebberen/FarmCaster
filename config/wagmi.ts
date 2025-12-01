import { http, createConfig } from 'wagmi';
import { mainnet, base, bsc, arbitrum, celo } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const config = createConfig({
  chains: [mainnet, base, bsc, arbitrum, celo],
  connectors: [farcasterFrame()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
  },
});
