import { Metadata, ResolvingMetadata } from 'next';
import HomeClient from '../components/HomeClient';
import { getNetworkImage } from '../utils/networkImage';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Read the 'network' query parameter
  const network = searchParams.network as string;

  // Get the correct image filename
  const imageFilename = getNetworkImage(network);
  const imageUrl = `https://farmcaster-six.vercel.app/images/${imageFilename}`;

  const title = "FarmCaster";
  const description = network
    ? `Join the farm on ${network.charAt(0).toUpperCase() + network.slice(1)}!`
    : "The most vibrant onchain farming game. Plant seeds, earn XP, and climb the leaderboard.";

  return {
    title: title,
    description: description,
    metadataBase: new URL("https://farmcaster-six.vercel.app"),
    openGraph: {
      title: title,
      description: description,
      url: "https://farmcaster-six.vercel.app",
      siteName: "FarmCaster",
      images: [
        {
          url: imageUrl, // DYNAMIC IMAGE URL
          width: 1200,
          height: 630,
          alt: `FarmCaster ${network ? network : ''} Preview`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl], // DYNAMIC IMAGE URL
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl, // DYNAMIC IMAGE URL for the frame
      "fc:frame:button:1": "Play FarmCaster",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": "https://warpcast.com/~/miniapps/nso1qw0jxEyg/farmcaster",
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
