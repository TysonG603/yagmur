import type { NextConfig } from "next";

const ngrokOrigins = [
  "*.ngrok-free.app",
  "*.ngrok-free.dev",
  "*.ngrok.app",
  "*.ngrok.io",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ngrokOrigins,
  experimental: {
    serverActions: {
      allowedOrigins: ngrokOrigins,
    },
  },
};

export default nextConfig;
