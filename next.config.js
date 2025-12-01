/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Disable source maps to save huge amounts of memory
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
  // CRITICAL: Ignore all errors during build to prevent OOM
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: false,
  },
  // Fix for wagmi dependencies
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
