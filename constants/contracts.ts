import { Address } from "viem";

// ABI Tanımları (İki ağda da aynı)
export const HUB_ABI = [
  { type: 'function', name: 'userXP', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'userStreak', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'lastActionTimestamp', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' }
] as const;

export const LOGIC_ABI = [
  { type: 'function', name: 'waterPlant', inputs: [], outputs: [], stateMutability: 'nonpayable' }
] as const;

// Ağ ID'sine göre Adres Haritası
export const CONTRACT_ADDRESSES: Record<number, { hub: Address; logic: Address }> = {
  8453: { // BASE
    hub: "0xdC0AB65C6de75D0A14bE498C21b7DAa5fc7a2548",
    logic: "0xb63Aef71344DFCe564A114d3C3971F954A4EB2F6"
  },
  56: { // BSC
    hub: "0x69a9632Bd2385F5863CCD464f195aaeC8bC18c76",
    logic: "0x129bF887BDA3D21f6f1E19f329829e0ba2DF3CF8"
  }
};
