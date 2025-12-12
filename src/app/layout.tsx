import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// DEFINE METADATA FOR SOCIAL PREVIEWS
export const metadata: Metadata = {
  title: "FarmCaster",
  description: "The most vibrant onchain farming game. Plant seeds, earn XP, and climb the leaderboard.",
  metadataBase: new URL("https://farmcaster-six.vercel.app"),
  openGraph: {
    title: "FarmCaster",
    description: "Join the farm, plant seeds, and earn rewards on Farcaster!",
    url: "https://farmcaster-six.vercel.app",
    siteName: "FarmCaster",
    images: [
      {
        url: "/images/icon.png", // Uses the uploaded icon
        width: 1200,
        height: 630,
        alt: "FarmCaster Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmCaster",
    description: "Plant seeds & harvest rewards onchain! 🚜",
    images: ["/images/icon.png"], // Uses the uploaded icon
  },
  // Optional: Farcaster Frame Tags for better visibility
  other: {
    // Standard Mini App Tag (v2)
    "fc:frame": "vNext",
    "fc:frame:image": "https://farmcaster-six.vercel.app/images/icon.png",
    "fc:frame:button:1": "Play FarmCaster",
    "fc:frame:button:1:action": "link", // Action type 'link'
    // TARGET: The Deep Link that opens the app natively
    "fc:frame:button:1:target": "https://warpcast.com/~/miniapps/nso1qw0jxEyg/farmcaster",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
