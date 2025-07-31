import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['395z4m7f-8080.asse.devtunnels.ms'],
  },
};

export default nextConfig;
