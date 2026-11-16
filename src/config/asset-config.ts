import type { AssetConfig } from "@/types";
import { siteManifest } from "@/content/site-manifest";

// Public assets use literal URLs, so they need the project-site path that is
// supplied at build time alongside Next.js's basePath configuration.
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath = configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/+$/, "");
export const publicAsset = (path: string) => (path.trim() ? `${basePath}${path}` : "");

/**
 * Brand and optional section-image paths come from site-manifest.ts. Replacing
 * a file at the configured path and rebuilding updates the published site.
 */
export const assetConfig = {
  logo: publicAsset(siteManifest.assets.logo),
  horizontalLogo: publicAsset(siteManifest.assets.horizontalLogo),
  mark: publicAsset(siteManifest.assets.mark),
  heroBackground: publicAsset(siteManifest.assets.images.heroImage) || undefined,
  architectureImage: publicAsset(siteManifest.assets.images.architectureImage) || undefined,
  pageBackground: publicAsset(siteManifest.assets.images.pageBackground) || undefined,
} as const satisfies AssetConfig;
