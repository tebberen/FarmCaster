export const GARDEN_CONTRACTS: Record<string, `0x${string}`> = {
  base: "0xb3fa8EcC4b73DA8fd4281Ac37D539ac53DE0663c",
  bsc: "0x63487E1a96Fd4877a38805F933d682881B6c16CA",
  arb: "0x93A42B500C00876139a5B9DE8387484CA92924eB",
  celo: "0x0473F3566434e1b08A48ca8a27d4371402eB0776",
  eth: "0xF8e54Bb2D4743A4eFBFA8912376BC2e1CB0fCD4c",
  monad: "0x1a7E946B4f6F4D49aDc073C30972494e3f9bd7Dc",
  hyper: "0xc124Ab91A2C3B83519056485d4521f23043b7a53",
};

export const HUB_CONTRACTS: Record<string, `0x${string}`> = {
  base: "0xdC0AB65C6de75D0A14bE498C21b7DAa5fc7a2548",
  bsc: "0x69a9632Bd2385F5863CCD464f195aaeC8bC18c76",
  arb: "0xe81e5ad7a49b3Ff0F9468d52f0D60fb5ab92C69d",
  celo: "0x50bC8ed78A79CF9e41DA82919F828CBd45765Fc7",
  eth: "0x706778CdAAA8CfbaA49E0A931266E71C87Ea30Ef",
  monad: "0x9002634d00c91f7773e95a10d9D20a5e94263F61",
  hyper: "0xbab962Cd818FC1f6246e2dA406DB2B3c324c608B",
};

export const GARDEN_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "seedId", "type": "uint256"}],
    "name": "plant",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "seedId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "pricePaid", "type": "uint256" }
    ],
    "name": "SeedPlanted",
    "type": "event"
  }
] as const;

export const HUB_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "userXP",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
