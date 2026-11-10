import type { NextConfig } from "next";

// GitHub Pages project sites are served beneath /<repository-name>. The
// workflow supplies that path at build time; local builds continue at /.
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath = configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // The site is deployed as a static asset bundle without a Node.js server.
  output: "export",
  ...(basePath ? { basePath } : {}),
  // Static hosting cannot use Next.js's runtime image optimizer.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
