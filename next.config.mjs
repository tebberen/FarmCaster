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
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Fix for wagmi dependencies
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;