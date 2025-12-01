import { http, createConfig } from 'wagmi';
import { base, bsc, arbitrum, celo } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const config = createConfig({
  chains: [base, bsc, arbitrum, celo],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
  },
});
