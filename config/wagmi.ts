import { http, createConfig } from 'wagmi';
import { base, bsc, arbitrum, celo, mainnet } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const config = createConfig({
  chains: [base, bsc, arbitrum, celo, mainnet],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [celo.id]: http(),
    [mainnet.id]: http(),
  },
});
