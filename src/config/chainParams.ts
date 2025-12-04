// Average block times in seconds
export const AVERAGE_BLOCK_TIMES: Record<string, number> = {
  eth: 12,
  bsc: 3,
  base: 2,
  arb: 0.25, // Arbitrum blocks are very fast
  celo: 5,
  monad: 1,
  hyper: 1, // Assumption for HyperEVM
};

export const BLOCKS_PER_DAY = (chain: string) => {
    const time = AVERAGE_BLOCK_TIMES[chain] || 2;
    return Math.ceil(86400 / time);
};
