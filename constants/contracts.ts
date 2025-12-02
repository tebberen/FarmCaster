import { Address } from "viem";

// V2 ABI: Supports planting specific seeds
export const GARDEN_ABI = [
  { type: 'function', name: 'plant', inputs: [{ name: 'seedId', type: 'uint256' }], outputs: [], stateMutability: 'payable' },
  { type: 'event', name: 'SeedPlanted', inputs: [{ indexed: true, name: 'user', type: 'address' }, { indexed: true, name: 'seedId', type: 'uint256' }, { name: 'pricePaid', type: 'uint256' }] }
] as const;

export const HUB_ABI = [
  { type: 'function', name: 'userXP', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'userStreak', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'lastActionTimestamp', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' }
] as const;

export const CONTRACT_ADDRESSES: Record<number, { hub: Address; logic: Address }> = {
  8453: { // BASE
    hub: "0xdC0AB65C6de75D0A14bE498C21b7DAa5fc7a2548",
    logic: "0x2e19f870da94BACC93921D7E6839c895C195c152"
  },
  56: { // BSC
    hub: "0x69a9632Bd2385F5863CCD464f195aaeC8bC18c76",
    logic: "0x8CdfAD92aB6489a8E339b6e6D3e85A3909B7133f"
  },
  42161: { // ARBITRUM
    hub: "0xe81e5ad7a49b3Ff0F9468d52f0D60fb5ab92C69d",
    logic: "0x93F3C20212712C599d996b955a20b70711A553DA"
  },
  42220: { // CELO
    hub: "0x50bC8ed78A79CF9e41DA82919F828CBd45765Fc7",
    logic: "0x65EBed9Be55dBd971d02895093afD5541e6e8A9E"
  },
  1: { // ETHEREUM
    hub: "0x706778CdAAA8CfbaA49E0A931266E71C87Ea30Ef",
    logic: "0x42f96C6C61759f59c04D885AB221b61e2F526Dec"
  },
  143: { // MONAD
    hub: "0x9002634d00c91f7773e95a10d9D20a5e94263F61",
    logic: "0xA1CBa9fF6beEF833517eeE6f59A82f6a8C646764"
  },
  999: { // HYPEREVM
    hub: "0xbab962Cd818FC1f6246e2dA406DB2B3c324c608B",
    logic: "0xaf03e384B4bCC9E4A8B8992A4Ba6E3B201B551a4"
  }
};
