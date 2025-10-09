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
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  // Increase body size limit for API routes (App Router)
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
