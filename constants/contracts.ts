export const HUB_ADDRESS = '0xdC0AB65C6de75D0A14bE498C21b7DAa5fc7a2548';
export const LOGIC_ADDRESS = '0xb63Aef71344DFCe564A114d3C3971F954A4EB2F6';

export const HUB_ABI = [
  { type: 'function', name: 'userXP', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'userStreak', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'lastActionTimestamp', inputs: [{ name: 'user', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' }
] as const;

export const LOGIC_ABI = [
  { type: 'function', name: 'waterPlant', inputs: [], outputs: [], stateMutability: 'nonpayable' }
] as const;
