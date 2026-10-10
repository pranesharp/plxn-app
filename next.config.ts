import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a fully static site in ./out — deploy that folder to Netlify.
  output: "export",
  // The app uses plain <img> tags, so skip next/image optimization (required for export).
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
