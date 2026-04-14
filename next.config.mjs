/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "arbooksellers.com", pathname: "/**" },
    ],
  },
  serverExternalPackages: ["mongoose", "sharp"],
};

export default nextConfig;
