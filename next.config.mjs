/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/FarmCaster",
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.alias = {
        ...config.resolve.alias,
        "@react-native-async-storage/async-storage": false,
    };
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
export default nextConfig;
