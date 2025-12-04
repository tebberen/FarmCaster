export const GARDEN_CONTRACTS: Record<string, `0x${string}`> = {
  base: "0xb3fa8EcC4b73DA8fd4281Ac37D539ac53DE0663c",
  bsc: "0x63487E1a96Fd4877a38805F933d682881B6c16CA",
  arb: "0x93A42B500C00876139a5B9DE8387484CA92924eB",
  celo: "0x0473F3566434e1b08A48ca8a27d4371402eB0776",
  eth: "0xF8e54Bb2D4743A4eFBFA8912376BC2e1CB0fCD4c",
  monad: "0x1a7E946B4f6F4D49aDc073C30972494e3f9bd7Dc",
  hyper: "0xc124Ab91A2C3B83519056485d4521f23043b7a53",
};

export const GARDEN_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "seedId", "type": "uint256"}],
    "name": "plant",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;
