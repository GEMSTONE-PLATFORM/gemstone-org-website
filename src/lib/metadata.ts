import type { Metadata } from "next";

import type { AssetConfig, SiteConfig } from "@/types";

function configuredValue(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

/**
 * Maps approved site and asset configuration into Next.js metadata.
 * Components do not contribute metadata or marketing copy to this result.
 */
export function buildMetadata(config: SiteConfig, assets: AssetConfig): Metadata {
  const canonicalUrl = configuredValue(config.canonicalUrl);
  const openGraphImage =
    configuredValue(config.openGraphImage) ?? configuredValue(assets.openGraphImage);
  const favicon = configuredValue(config.favicon) ?? configuredValue(assets.mark);

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
  };

  if (canonicalUrl) {
    metadata.alternates = { canonical: canonicalUrl };
  }

  if (openGraphImage) {
    metadata.openGraph = {
      images: [{ url: openGraphImage }],
    };
  }

  if (favicon) {
    metadata.icons = { icon: favicon };
  }

  return metadata;
}
