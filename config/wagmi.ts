import { http, createConfig } from 'wagmi';
import { base, bsc, arbitrum } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const config = createConfig({
  chains: [base, bsc, arbitrum],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
  },
});
