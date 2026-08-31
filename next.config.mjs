/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' 'unsafe-eval'",
              "connect-src 'self' https://vault.petra.app https://*.farcaster.xyz https://*.warpcast.com https://rpc.monad.xyz https://rpc.hyperliquid.xyz/evm",
              "frame-src 'self' https://vault.petra.app https://*.farcaster.xyz https://*.warpcast.com",
              "img-src 'self' blob: data: https:",
              "font-src 'self' https: data:",
              "style-src 'self' 'unsafe-inline'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
