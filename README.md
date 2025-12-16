# FarmCaster 🚜

> Plant seeds, harvest rewards on chain!

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Multi-Chain](https://img.shields.io/badge/Network-Multi_Chain-blueviolet)
![Farcaster](https://img.shields.io/badge/Farcaster-MiniApp-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## 📖 About the Project

**FarmCaster** is a **Multi-chain Onchain Farming Game** designed for the Farcaster ecosystem. It runs seamlessly as a **Farcaster Frame** and a **Mini App**, providing users with a native mobile-first experience directly within their social feed.

The core loop is simple yet addictive:
1.  **Plant:** Select seeds from the market (Gm, Deploy, Launch, Donate).
2.  **Grow:** Execute onchain transactions to plant your seeds.
3.  **Harvest:** Earn XP and climb the leaderboards.
4.  **Track:** Visualize your farming history on a persistent monthly calendar.

Designed with a "Vibrant Magic" aesthetic, FarmCaster leverages the power of **Base and 6 other major networks** to deliver fast, low-cost interactions everywhere you go.

## ✨ Key Features

*   **Multi-Chain Support:** Fully deployed and supported on **Base**, **Arbitrum**, **BSC**, **Celo**, **Ethereum**, **Monad**, and **HyperEVM**.
*   **Farcaster Native:** Fully integrated with Farcaster Frames (vNext) and Mini App SDK for instant access inside Warpcast.
*   **Onchain XP System:** Every action is recorded onchain, awarding XP based on the seed tier (1 XP to 5 XP).
*   **Real-time Leaderboard:** Compete with other farmers for the top spot on the global leaderboard.
*   **Dynamic Theming:** The UI automatically adapts its color palette and gradients based on the active network (e.g., Blue for Base, Yellow for BSC, Pink for HyperEVM).
*   **Visual History:** A "Wall Calendar" view displays your highest-tier plant for each day, creating a visual streak of your activity.
*   **Gasless Attribution:** Utilizes **Ox** (ERC-8021) for onchain attribution of actions.

## 🌍 Supported Networks

FarmCaster runs on 7 major blockchain networks, allowing users to farm on their chain of choice.

| Network | Chain ID | Description |
| :--- | :--- | :--- |
| **Base** | 8453 | Coinbase's L2, fast and cheap. |
| **Arbitrum One** | 42161 | Leading optimistic rollup. |
| **BSC** | 56 | Binance Smart Chain. |
| **Celo** | 42220 | Mobile-first EVM chain. |
| **Ethereum** | 1 | The mainnet that started it all. |
| **Monad** | 143 | High-performance EVM L1. |
| **HyperEVM** | 999 | High-speed L1 optimized for DeFi. |

## 🔗 Smart Contracts

Below are the deployed contract addresses for the Game Logic (Garden) and XP System (Hub) across all supported networks.

| Network | Hub Contract (XP & Stats) | Garden Contract (Game Logic) |
| :--- | :--- | :--- |
| **Base** | `0xE77d1E8225921E3E7EFBC1E02713e1FAfbD1c6ea` | `0xC699DaF3f7D757d5FCf3912b1A08Af1eea250ACd` |
| **Arbitrum** | `0x43087619F1D8b3680e6e9971D9cEF82c66d1D0de` | `0xAe41c2Be134B3B9Ef50fcCc2a4369fe1f8016260` |
| **BSC** | `0xD429dc75BD30490b03b2878E1d2Cd21f4109ADD7` | `0x27436DAB07b951c9C3Bf49187063b962E0e68cD6` |
| **Celo** | `0x8e352435Deeff7e9fd72C90C5843A2D449d9416c` | `0x101FaEbD9891EEB7c85281519A22d6b144f8100E` |
| **Ethereum** | `0x26ffb261F790511D9077F23D1fEFA0694c478C5D` | `0x6567Db0507bFF4add7fd065495447001911cbff6` |
| **Monad** | `0xaDA5213c387f0679Ed3f6331a00ba2b598FaD5c8` | `0x10d0c4511341EdAB5AE25919EcC86Bf5c54C28c9` |
| **HyperEVM** | `0xf8BaC9c6902c96CeC31988dfb9ba89A51dd750Fa` | `0xD6b62609ec7B67532A126D6315410b8d6b7dB03e` |

## 🛠 Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
*   **Blockchain Interaction:** [Wagmi v2](https://wagmi.sh/) & [Viem](https://viem.sh/)
*   **Farcaster Integration:** `@farcaster/miniapp-sdk`
*   **State Management:** `@tanstack/react-query`
*   **Attribution:** `ox` (Open Exchange)
*   **Wallet Connection:** [RainbowKit](https://www.rainbowkit.com/)

## 🚀 Getting Started

Follow these steps to run FarmCaster locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/farmcaster.git
    cd farmcaster
    ```

2.  **Install dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

This project is configured to work out-of-the-box with public RPCs configured in Wagmi. No `.env` file is strictly required for local development unless you are adding custom RPC endpoints or analytics keys.

## 🎮 How to Play

1.  **Connect Wallet:** Click "Connect" or open the app within Warpcast to auto-connect.
2.  **Select Network:** Choose your preferred chain from the tabs (Base is recommended, but you can use any of the 7 supported networks).
3.  **Choose a Seed:** Navigate to the "Market" and select a seed tier:
    *   **Gm (Free):** 1 XP
    *   **Deploy (Low Cost):** 2 XP
    *   **Launch (Mid Cost):** 3 XP
    *   **Donate (High Cost):** 5 XP
4.  **Plant:** Click on an emoji to initiate the transaction.
5.  **Confirm:** Sign the transaction in your wallet.
6.  **Success:** Once confirmed, you'll see a success modal and your XP will increase!

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
