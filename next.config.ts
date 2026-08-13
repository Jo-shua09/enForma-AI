import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your Next.js configuration options go here.
  allowedDevOrigins: ["192.168.0.149"],
  experimental: {
    // This is the crucial part:
    staticFileGlobs: ["**/*.mp4"],
  },
  // The App Router is enabled by default in recent versions of Next.js.
  // No special configuration is needed in this file to enable it.
};

export default nextConfig;
