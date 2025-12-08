export const HUB_CONTRACTS: Record<string, `0x${string}`> = {
  base: "0xE77d1E8225921E3E7EFBC1E02713e1FAfbD1c6ea",
  bsc: "0xD429dc75BD30490b03b2878E1d2Cd21f4109ADD7",
  arb: "0x43087619F1D8b3680e6e9971D9cEF82c66d1D0de",
  celo: "0x8e352435Deeff7e9fd72C90C5843A2D449d9416c",
  monad: "0xaDA5213c387f0679Ed3f6331a00ba2b598FaD5c8",
  hyper: "0xf8BaC9c6902c96CeC31988dfb9ba89A51dd750Fa",
  eth: "0x26ffb261F790511D9077F23D1fEFA0694c478C5D", // Ethereum Mainnet
};

export const GARDEN_CONTRACTS: Record<string, `0x${string}`> = {
  base: "0xC699DaF3f7D757d5FCf3912b1A08Af1eea250ACd",
  bsc: "0x27436DAB07b951c9C3Bf49187063b962E0e68cD6",
  arb: "0xAe41c2Be134B3B9Ef50fcCc2a4369fe1f8016260",
  celo: "0x101FaEbD9891EEB7c85281519A22d6b144f8100E",
  monad: "0x10d0c4511341EdAB5AE25919EcC86Bf5c54C28c9",
  hyper: "0xD6b62609ec7B67532A126D6315410b8d6b7dB03e",
  eth: "0x6567Db0507bFF4add7fd065495447001911cbff6", // Ethereum Mainnet
};

export const GARDEN_ABI = [
  { inputs: [{ name: "user", type: "address" }], name: "getUserHistory", outputs: [{ components: [{ name: "timestamp", type: "uint32" }, { name: "seedType", type: "uint8" }, { name: "actionType", type: "string" }], name: "", type: "tuple[]" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "seedType", type: "uint8" }], name: "gm", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "seedType", type: "uint8" }], name: "deploy", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ name: "seedType", type: "uint8" }], name: "launch", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ name: "seedType", type: "uint8" }], name: "donate", outputs: [], stateMutability: "payable", type: "function" }
] as const;

export const HUB_ABI = [
  { inputs: [{ name: "user", type: "address" }], name: "userXP", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "user", type: "address" }], name: "userStreak", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getAllUsers", outputs: [{ name: "", type: "address[]" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getUserCount", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;
