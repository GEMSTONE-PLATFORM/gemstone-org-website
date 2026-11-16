import { Fragment, type ReactNode } from "react";

import { assetConfig, integrationConfig, motionConfig, siteConfig } from "@/config";
import {
  AboutSection,
  ArchitectureSection,
  BriefingSection,
  CapabilitiesSection,
  FAQSection,
  HeroSection,
  RequestInformationSection,
  WhyGemstoneSection,
} from "@/components/sections/section-renderers";
import { siteManifest } from "@/content/site-manifest";
import { DifferentiatorsSection } from "@/components/sections/DifferentiatorsSection";
import type {
  AssetConfig,
  IntegrationConfig,
  MotionConfig,
  SectionId,
  SiteConfig,
  SiteContent,
} from "@/types";

export interface PageCompositionData {
  readonly config: SiteConfig;
  readonly content: SiteContent;
  readonly assets: AssetConfig;
  readonly integrations: IntegrationConfig;
  readonly motion: MotionConfig;
}

export type SectionRenderer = (data: PageCompositionData) => ReactNode;

export interface SectionRegistryEntry {
  readonly id: SectionId;
  readonly render: SectionRenderer;
}

/**
 * The public page order is defined once here. Visibility is evaluated from the
 * typed configuration at render time, so disabled sections remain registered.
 */
export const sectionRegistry: readonly SectionRegistryEntry[] = [
  {
    id: "hero",
    render: ({ config, content, assets }) => (
      <HeroSection
        content={content.hero}
        visualImage={assets.heroBackground}
        enabledSections={config.sections}
      />
    ),
  },
  { id: "about", render: ({ content }) => <AboutSection content={content.about} /> },
  {
    id: "whyGemstone",
    render: ({ content }) => (
      <WhyGemstoneSection items={content.whyGemstone} title={content.sectionTitles.whyGemstone} />
    ),
  },
  {
    id: "architecture",
    render: ({ content, assets }) => (
      <ArchitectureSection
        content={content.architecture}
        title={content.sectionTitles.architecture}
        introduction={content.sectionTitles.architectureIntroduction}
        visualImage={assets.architectureImage}
        ecosystem={content.ecosystem}
        analystBenefits={content.analystBenefits}
      />
    ),
  },
  {
    id: "capabilities",
    render: ({ content }) => (
      <CapabilitiesSection
        items={content.capabilities}
        title={content.sectionTitles.capabilities}
      />
    ),
  },
  {
    id: "differentiators",
    render: ({ content }) => (
      <DifferentiatorsSection
        items={content.differentiators}
        title={content.sectionTitles.differentiators}
      />
    ),
  },
  {
    id: "briefing",
    render: ({ integrations }) => <BriefingSection config={integrations.briefing} />,
  },
  {
    id: "requestInformation",
    render: ({ integrations, content }) => (
      <RequestInformationSection
        url={integrations.microsoftFormUrl}
        title={content.sectionTitles.requestInformation}
        description={content.sectionTitles.requestInformationDescription}
        privacyNotice={content.footer.privacyNotice}
      />
    ),
  },
  {
    id: "faq",
    render: ({ content }) => <FAQSection items={content.faq} title={content.sectionTitles.faq} />,
  },
] as const;

export function renderEnabledSections(data: PageCompositionData): ReactNode[] {
  return sectionRegistry
    .filter(({ id }) => data.config.sections[id])
    .map(({ id, render }) => <Fragment key={id}>{render(data)}</Fragment>);
}

export const defaultPageComposition: PageCompositionData = {
  config: siteConfig,
  content: siteManifest.content,
  assets: assetConfig,
  integrations: integrationConfig,
  motion: motionConfig,
};
