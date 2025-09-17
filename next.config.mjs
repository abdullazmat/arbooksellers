/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: ["mongoose"],
  // Remove invalid api config - this is for Pages Router, not App Router
};

export default nextConfig;
