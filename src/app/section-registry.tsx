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
import { siteContent } from "@/content";
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
    render: ({ config, content }) => (
      <HeroSection content={content.hero} enabledSections={config.sections} />
    ),
  },
  { id: "about", render: ({ content }) => <AboutSection content={content.about} /> },
  {
    id: "whyGemstone",
    render: ({ content }) => <WhyGemstoneSection items={content.whyGemstone} />,
  },
  {
    id: "architecture",
    render: ({ content }) => (
      <ArchitectureSection
        content={content.architecture}
        matrix={content.matrix}
        ecosystem={content.ecosystem}
        analystBenefits={content.analystBenefits}
      />
    ),
  },
  {
    id: "capabilities",
    render: ({ content }) => <CapabilitiesSection items={content.capabilities} />,
  },
  {
    id: "differentiators",
    render: ({ content }) => <DifferentiatorsSection items={content.differentiators} />,
  },
  { id: "faq", render: ({ content }) => <FAQSection items={content.faq} /> },
  {
    id: "briefing",
    render: ({ integrations }) => <BriefingSection config={integrations.briefing} />,
  },
  {
    id: "requestInformation",
    render: ({ integrations, content }) => (
      <RequestInformationSection
        url={integrations.microsoftFormUrl}
        privacyNotice={content.footer.privacyNotice}
      />
    ),
  },
] as const;

export function renderEnabledSections(data: PageCompositionData): ReactNode[] {
  return sectionRegistry
    .filter(({ id }) => data.config.sections[id])
    .map(({ id, render }) => <Fragment key={id}>{render(data)}</Fragment>);
}

export const defaultPageComposition: PageCompositionData = {
  config: siteConfig,
  content: siteContent,
  assets: assetConfig,
  integrations: integrationConfig,
  motion: motionConfig,
};
