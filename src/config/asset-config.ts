import type { AssetConfig } from "@/types";

/**
 * Official branding paths are configuration values. The files are supplied or
 * replaced in public/branding without changing section implementations.
 */
export const assetConfig = {
  logo: "/branding/gemstone-logo.svg",
  horizontalLogo: "/branding/gemstone-logo-horizontal.svg",
  mark: "/branding/gemstone-mark.svg",
} as const satisfies AssetConfig;

/** Safe text-only references used when approved logo files are unavailable. */
export const brandingFallbackConfig = {
  wordmark: "/branding/gemstone-wordmark-fallback.txt",
  mark: "/branding/gemstone-mark-fallback.txt",
} as const;
