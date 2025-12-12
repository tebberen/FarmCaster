import HomeClient from "@/components/HomeClient";
import { Metadata, ResolvingMetadata } from "next";

// Force dynamic rendering to allow access to searchParams
export const dynamic = 'force-dynamic';

// Define the cover image map
const networkImages: Record<string, string> = {
  arbitrum: "arb-cover.png",
  base: "base-cover.png",
  bsc: "bsc-cover.png",
  celo: "celo-cover.png",
  ethereum: "eth-cover.png",
  hyper: "hyper-cover.png",
  monad: "monad-cover.png",
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 1. Get Network & Image
  const network = (searchParams.network as string)?.toLowerCase() || "base";
  const imageFilename = networkImages[network] || "base-cover.png";
  const imageUrl = `https://farmcaster-six.vercel.app/images/${imageFilename}`;

  // Placeholder for absolute URL as requested
  const placeholderImage = "https://farmcaster-six.vercel.app/images/cover.png";

  // 2. Build Official JSON Object
  const miniappJSON = {
    version: "1",
    imageUrl: imageUrl, // Dynamic Image based on network
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

  return {
    title: "FarmCaster",
    description: `Plant seeds on ${network}. The most vibrant onchain farming game.`,
    openGraph: {
      title: "FarmCaster",
      description: `Plant seeds on ${network}. The most vibrant onchain farming game.`,
      images: [placeholderImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "FarmCaster",
      description: `Plant seeds on ${network}. The most vibrant onchain farming game.`,
      images: [placeholderImage],
    },
    other: {
      // 3. Stringify JSON for the meta tag
      "fc:miniapp": stringifiedMeta,
      // Backward compatibility
      "fc:frame": stringifiedMeta,
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
