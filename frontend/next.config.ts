import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;