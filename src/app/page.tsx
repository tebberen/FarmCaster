import { Metadata, ResolvingMetadata } from 'next';
import HomeClient from '../components/HomeClient';

// Define the exact filenames provided by the user
const networkImages: Record<string, string> = {
  arbitrum: 'arb-cover.png',
  base: 'base-cover.png',
  bsc: 'bsc-cover.png',
  celo: 'celo-cover.png',
  ethereum: 'eth-cover.png',
  hyper: 'hyper-cover.png',
  monad: 'monad-cover.png',
};

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 1. Get the network from the URL (default to 'base' if missing)
  const network = (searchParams.network as string)?.toLowerCase() || 'base';

  // 2. Find the correct image file
  const imageFilename = networkImages[network] || 'cover.png';

  // 3. Construct the full Image URL
  const imageUrl = `https://farmcaster-six.vercel.app/images/${imageFilename}`;

  return {
    title: "FarmCaster",
    description: `Plant seeds & harvest rewards on ${network.charAt(0).toUpperCase() + network.slice(1)}! 🚜`,
    metadataBase: new URL("https://farmcaster-six.vercel.app"),
    openGraph: {
      title: "FarmCaster",
      description: "The most vibrant onchain farming game.",
      url: "https://farmcaster-six.vercel.app",
      siteName: "FarmCaster",
      images: [
        {
          url: imageUrl, // DYNAMIC IMAGE
          width: 1200,
          height: 630,
          alt: `FarmCaster on ${network}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl, // DYNAMIC IMAGE FOR FRAME
      "fc:frame:button:1": "Play FarmCaster 🚜",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": "https://warpcast.com/~/miniapps/nso1qw0jxEyg/farmcaster",
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
