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
  // Determine network from search params, default to 'base'
  const network = (searchParams.network as string)?.toLowerCase() || "base";

  // Select the appropriate cover image
  const imageFilename = networkImages[network] || "base-cover.png";

  // Construct the full image URL (Vercel)
  const imageUrl = `https://farmcaster-six.vercel.app/images/${imageFilename}`;

  // Construct the Official JSON Object
  const miniappMetadata = {
    version: "1",
    imageUrl: imageUrl, // Dynamic Image
    button: {
      title: "Play FarmCaster 🚜",
      action: {
        type: "launch_miniapp",
        url: "https://warpcast.com/~/miniapps/nso1qw0jxEyg/farmcaster", // Deep Link
        name: "FarmCaster",
        splashImageUrl: "https://farmcaster-six.vercel.app/images/icon.png",
        splashBackgroundColor: "#0f172a"
      }
    }
  };

  const stringifiedMeta = JSON.stringify(miniappMetadata);

  return {
    title: "FarmCaster",
    description: `Plant seeds on ${network}`,
    openGraph: {
      title: "FarmCaster",
      description: "Plant seeds and grow your onchain garden!",
      images: [imageUrl],
    },
    other: {
      // Inject the JSON into the correct tags
      "fc:miniapp": stringifiedMeta,
      "fc:frame": stringifiedMeta, // Backward compatibility
    },
  };
}

export default function Home() {
  return <HomeClient />;
}
