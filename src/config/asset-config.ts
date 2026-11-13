import type { AssetConfig } from "@/types";

// Public assets use literal URLs, so they need the project-site path that is
// supplied at build time alongside Next.js's basePath configuration.
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath = configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/+$/, "");
export const publicAsset = (path: `/${string}`) => `${basePath}${path}`;

/**
 * Official branding paths are configuration values. The files are supplied or
 * replaced in public/branding without changing section implementations.
 */
export const assetConfig = {
  logo: publicAsset("/branding/gemstone-logo.svg"),
  horizontalLogo: publicAsset("/branding/gemstone-logo-horizontal.svg"),
  mark: publicAsset("/branding/gemstone-mark.svg"),
} as const satisfies AssetConfig;

/** Safe text-only references used when approved logo files are unavailable. */
export const brandingFallbackConfig = {
  wordmark: publicAsset("/branding/gemstone-wordmark-fallback.txt"),
  mark: publicAsset("/branding/gemstone-mark-fallback.txt"),
} as const;
