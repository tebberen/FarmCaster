import { http, createConfig } from 'wagmi';
import { base, bsc } from 'wagmi/chains'; // BSC eklendi
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const config = createConfig({
  chains: [base, bsc], // BSC listeye eklendi
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [bsc.id]: http(),
  },
});
