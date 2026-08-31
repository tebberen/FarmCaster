import HomeClient from "@/components/HomeClient";
import { THEMES } from "@/config/theme";
import { Metadata } from "next";

// Force static build for all networks
export function generateStaticParams() {
  return Object.keys(THEMES).map((network) => ({
    network: network,
  }));
}

type Props = {
  params: { network: string };
};


export async function generateMetadata({ }: Props): Promise<Metadata> {
  // Official social preview image URL
  const imageUrl = "https://raw.githubusercontent.com/tebberen/farmcaster/farmcaster-frontend-skeleton/public/images/icon.png";

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

  const frameMetadata = {
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Open FarmCaster",
      action: {
        type: "launch_frame",
        name: "FarmCaster",
        url: "https://farmcaster-six.vercel.app/",
        splashImageUrl: "https://farmcaster-six.vercel.app/images/icon.png",
        splashBackgroundColor: "#0f172a"
      }
    }
  };

  const stringifiedMeta = JSON.stringify(miniappJSON);
  const title = "FarmCaster";
  const description = "Plant seeds onchain and grow rewards.";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
    other: {
      "fc:miniapp": stringifiedMeta,
      "fc:frame": JSON.stringify(frameMetadata),
    },
  };
}

export default function SharePage() {
  return <HomeClient />;
}
