import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FarmCaster',
  description: 'Farcaster Farming Miniapp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center">
        {children}
      </body>
    </html>
  );
}
