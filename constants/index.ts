import { Box, Circle, Database, Globe, Layers, Zap, Hexagon, Command } from "lucide-react";

export const NETWORKS = [
  {
    id: "base",
    name: "Base",
    color: "bg-blue-500",
    icon: Circle,
    cropEmoji: '🫐',
    cropName: 'Blueberry',
    weather: 'Rainy'
  },
  {
    id: "bsc",
    name: "BSC",
    color: "bg-yellow-500",
    text: "text-black",
    icon: Hexagon,
    cropEmoji: '🌽',
    cropName: 'Corn',
    weather: 'Sunny'
  },
  {
    id: "eth",
    name: "Ethereum",
    color: "bg-gray-200",
    text: "text-black",
    icon: Box,
    cropEmoji: '🍄',
    cropName: 'Mushroom',
    weather: 'Foggy'
  },
  {
    id: "arb",
    name: "Arbitrum",
    color: "bg-blue-600",
    icon: Database,
    cropEmoji: '🍇',
    cropName: 'Grape',
    weather: 'Windy'
  },
  {
    id: "monad",
    name: "Monad",
    color: "bg-purple-600",
    icon: Command,
    cropEmoji: '🍆',
    cropName: 'Eggplant',
    weather: 'Stormy'
  },
  {
    id: "hyperevm",
    name: "HyperEVM",
    color: "bg-teal-400",
    text: "text-black",
    icon: Zap,
    cropEmoji: '⚡',
    cropName: 'Electric Melon',
    weather: 'Thunder'
  },
  {
    id: "celo",
    name: "Celo",
    color: "bg-yellow-300",
    text: "text-black",
    icon: Globe,
    cropEmoji: '🥑',
    cropName: 'Avocado',
    weather: 'Clear'
  },
];

// Mock Data
export const MOCK_GRID_DATA: Record<string, number[]> = {
  base: [1, 1, 2, 0, 0, 0, 0],
  bsc:  [0, 1, 0, 0, 0, 0, 0],
  eth:  [0, 0, 0, 0, 0, 0, 0],
  arb:  [1, 1, 1, 0, 0, 0, 0],
  monad:[0, 0, 2, 2, 1, 0, 0],
  hyperevm:[0, 0, 0, 0, 0, 0, 0],
  celo: [1, 1, 0, 0, 0, 0, 0],
};
