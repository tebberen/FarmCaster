# FarmCaster 🚜

> Plant seeds, harvest rewards on chain!

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Base](https://img.shields.io/badge/Network-Base-blue)
![Farcaster](https://img.shields.io/badge/Farcaster-MiniApp-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## 📖 About the Project

**FarmCaster** is a fully onchain farming game designed for the Farcaster ecosystem. It runs seamlessly as a **Farcaster Frame** and a **Base Mini App**, providing users with a native mobile-first experience directly within their social feed.

The core loop is simple yet addictive:
1.  **Plant:** Select seeds from the market (Gm, Deploy, Launch, Donate).
2.  **Grow:** Execute onchain transactions to plant your seeds.
3.  **Harvest:** Earn XP and climb the leaderboards.
4.  **Track:** Visualize your farming history on a persistent monthly calendar.

Designed with a "Vibrant Magic" aesthetic, FarmCaster leverages the power of Base and other EVM chains to deliver fast, low-cost interactions.

## ✨ Key Features

*   **Farcaster Native:** Fully integrated with Farcaster Frames (vNext) and Mini App SDK for instant access inside Warpcast.
*   **Multi-Chain Support:** Deployed on **Base**, **BSC**, **Celo**, **Monad**, **HyperEVM**, **Arbitrum**, and **Ethereum**.
*   **Onchain XP System:** Every action is recorded onchain, awarding XP based on the seed tier (1 XP to 5 XP).
*   **Real-time Leaderboard:** Compete with other farmers for the top spot on the global leaderboard.
*   **Dynamic Theming:** The UI automatically adapts its color palette and gradients based on the active network (e.g., Blue for Base, Yellow for BSC).
*   **Visual History:** A "Wall Calendar" view displays your highest-tier plant for each day, creating a visual streak of your activity.
*   **Gasless Attribution:** Utilizes **Ox** (ERC-8021) for onchain attribution of actions.

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
2.  **Select Network:** Choose your preferred chain from the tabs (Base is recommended).
3.  **Choose a Seed:** Navigate to the "Market" and select a seed tier:
    *   **Gm (Free):** 1 XP
    *   **Deploy ($0.10):** 2 XP
    *   **Launch ($0.15):** 3 XP
    *   **Donate ($0.20):** 5 XP
4.  **Plant:** Click on an emoji to initiate the transaction.
5.  **Confirm:** Sign the transaction in your wallet.
6.  **Success:** Once confirmed, you'll see a success modal and your XP will increase!

## 🔗 Smart Contracts (Base Mainnet)

| Contract | Address |
| :--- | :--- |
| **Garden (Game Logic)** | `0xC699DaF3f7D757d5FCf3912b1A08Af1eea250ACd` |
| **Hub (XP & Stats)** | `0xE77d1E8225921E3E7EFBC1E02713e1FAfbD1c6ea` |

*Contracts are also deployed on BSC, Arbitrum, Celo, Monad, HyperEVM, and Ethereum.*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
