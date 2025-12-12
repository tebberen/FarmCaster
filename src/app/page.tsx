import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";

// Static metadata for GitHub Pages (Static Export) compatibility
// We use a default cover image because dynamic generation via searchParams
// is incompatible with static exports.
const imageUrl = "https://farmcaster-six.vercel.app/images/cover.png";

const miniappJSON = {
  version: "1",
  imageUrl: imageUrl,
  button: {
    title: "Play FarmCaster 🚜",
    action: {
      type: "launch_miniapp",
      url: "https://warpcast.com/~/miniapps/nso1qw0jxEyg/farmcaster",
      splashImageUrl: "https://farmcaster-six.vercel.app/images/icon.png",
      splashBackgroundColor: "#0f172a"
    }
  }
};

const stringifiedMeta = JSON.stringify(miniappJSON);

export const metadata: Metadata = {
  title: "FarmCaster",
  description: "Plant seeds, earn XP, and climb the leaderboard. The most vibrant onchain farming game.",
  openGraph: {
    title: "FarmCaster",
    description: "Plant seeds, earn XP, and climb the leaderboard. The most vibrant onchain farming game.",
    images: [imageUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmCaster",
    description: "Plant seeds, earn XP, and climb the leaderboard. The most vibrant onchain farming game.",
    images: [imageUrl],
  },
  other: {
    "fc:miniapp": stringifiedMeta,
    "fc:frame": stringifiedMeta,
  },
};

export default function Home() {
  return <HomeClient />;
}
