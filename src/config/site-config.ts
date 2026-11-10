import type { FooterConfig, MetadataConfig, SiteConfig, SiteSections } from "@/types";

import { assetConfig } from "@/config/asset-config";
import { footerNavigationItems, navigationItems } from "@/config/navigation-config";

export const publicReleaseConfig = {
  enabled: true,
  statement: "Approved for Public Release. Distribution Unlimited.",
} as const;

/** Approved defaults used by the Next.js Metadata API. */
export const seoConfig = {
  title: "GEMSTONE | Government-Owned Digital Engineering and Modeling & Simulation Ecosystem",
  description:
    "GEMSTONE connects tools, data, compute, and secure digital environments across government, industry, academic, and international partner organizations.",
  favicon: assetConfig.mark,
} as const satisfies MetadataConfig;

export const metadataConfig: MetadataConfig = seoConfig;

export const siteSections = {
  hero: true,
  about: true,
  whyGemstone: true,
  architecture: true,
  capabilities: true,
  differentiators: true,
  faq: true,
  briefing: true,
  requestInformation: true,
} as const satisfies SiteSections;

/** Optional destinations remain empty until approved public URLs are supplied. */
export const footerConfig = {
  showBackToTop: true,
} as const satisfies FooterConfig;

export const siteConfig = {
  ...seoConfig,
  siteName: "GEMSTONE",
  fullName: "Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem",
  publicReleaseStatement: publicReleaseConfig.statement,
  sections: siteSections,
  navigation: navigationItems,
  footer: footerConfig,
} as const satisfies SiteConfig;

export { footerNavigationItems };
