import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local public folder images without optimization warnings
    domains: [],
  },
};

export default nextConfig;
