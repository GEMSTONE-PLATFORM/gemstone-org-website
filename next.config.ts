import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is deployed as a static asset bundle without a Node.js server.
  output: "export",
  // Static hosting cannot use Next.js's runtime image optimizer.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
