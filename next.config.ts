import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable linting but with reasonable rules
  },
  typescript: {
    ignoreBuildErrors: false, // Keep TypeScript checks but allow warnings
  }
};

export default nextConfig;
