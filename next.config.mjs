/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@coinbase/onchainkit'],
  webpack: (config) => {
    // 1. Ignore node-specific modules (pino-pretty, lokijs, etc.)
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // 2. Fix for modules trying to import 'fs', 'net', 'tls'
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // 3. CRITICAL: Ignore React Native Async Storage to fix the build error
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
};

export default nextConfig;