import { siteManifest } from "@/content/site-manifest";
import type { BriefingConfig, IntegrationConfig } from "@/types";
import { resolveConfiguredUrl, resolveIntegrationUrl } from "@/lib/integration-state";
export const BRIEFING_URL_PLACEHOLDER = "GEMSTONE_BRIEFING_URL_GOES_HERE";
export const MICROSOFT_FORM_URL_PLACEHOLDER = "MICROSOFT_FORM_URL";
/**
 * External URLs are considered configured only when they contain a usable,
 * non-placeholder value. Trimming here prevents whitespace-only build input
 * from becoming an iframe target.
 */
export function resolveConfiguredIntegrationUrl(
  url: string | null | undefined,
  placeholder: string | readonly string[],
): string | undefined {
  return resolveConfiguredUrl(url, placeholder);
}
export function isConfiguredIntegrationUrl(
  url: string | null | undefined,
  placeholder: string | readonly string[],
): url is string {
  return resolveConfiguredIntegrationUrl(url, placeholder) !== undefined;
}
/**
 * Replace this placeholder when an approved briefing is available. For a deck
 * in public/documents, import publicAsset from asset-config and use
 * publicAsset("/documents/gemstone-briefing-YYYY-MM.pptx").
 */
const briefingUrl = BRIEFING_URL_PLACEHOLDER;
export const briefingConfig = {
  url: briefingUrl,
  title: siteManifest.content.sectionTitles.briefing,
  description: "Review the current GEMSTONE briefing.",
  format: "unknown",
  allowDownload: true,
  allowOpenInNewTab: true,
  embed: true,
} as const satisfies BriefingConfig;
export const integrationConfig = {
  briefing: briefingConfig,
  microsoftFormUrl: resolveConfiguredIntegrationUrl(
    process.env.NEXT_PUBLIC_MICROSOFT_FORM_URL,
    MICROSOFT_FORM_URL_PLACEHOLDER,
  ),
} as const satisfies IntegrationConfig;
/** Resolve the centralized briefing value without exposing a placeholder target. */
export function resolveBriefingIntegration() {
  return resolveIntegrationUrl(briefingConfig.url, BRIEFING_URL_PLACEHOLDER);
}
/** Resolve the build-time Microsoft Forms value without exposing a placeholder target. */
export function resolveMicrosoftFormIntegration() {
  return resolveIntegrationUrl(integrationConfig.microsoftFormUrl, MICROSOFT_FORM_URL_PLACEHOLDER);
}
