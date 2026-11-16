import type {
  AboutContent,
  BriefingConfig,
  CapabilityItem,
  ContentLink,
  FeatureItem,
  HeroContent,
  SiteSections,
} from "@/types";

import { siteManifest } from "@/content/site-manifest";
import { briefingConfig } from "@/config/integration-config";
import {
  AnimatedSection,
  BrandLogo,
  Card,
  ExternalLink,
  Icon,
  MediaViewer,
  MicrosoftFormEmbed,
  ResponsiveMedia,
} from "@/components/ui";

type SectionId =
  | "hero"
  | "about"
  | "whyGemstone"
  | "architecture"
  | "capabilities"
  | "differentiators"
  | "faq"
  | "briefing"
  | "requestInformation";

interface SectionFrameProps {
  readonly id: SectionId;
  readonly title: string;
  readonly children: React.ReactNode;
}

function SectionFrame({ id, title, children }: SectionFrameProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="gemstone-section">
      <div className="gemstone-container">
        <AnimatedSection>
          <h2 id={`${id}-heading`} className="gemstone-display text-gemstone-text">
            {title}
          </h2>
          <div className="mt-8">{children}</div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ContentLinkView({ link }: { readonly link: ContentLink }) {
  const className = "gemstone-button-motion gemstone-link";

  if (link.kind === "external") {
    return (
      <ExternalLink href={link.href} newTab={link.newTab} className={className}>
        {link.label}
      </ExternalLink>
    );
  }

  return (
    <a className={className} href={link.href}>
      {link.label}
    </a>
  );
}

interface HeroSectionProps {
  readonly content: HeroContent;
  readonly logoSrc?: string;
  readonly visualImage?: string;
  readonly enabledSections?: Pick<SiteSections, "briefing" | "requestInformation">;
}

export function HeroSection({
  content,
  logoSrc = siteManifest.assets.logo,
  visualImage,
  enabledSections,
}: HeroSectionProps) {
  const requestInformationEnabled = enabledSections?.requestInformation ?? true;
  const briefingEnabled = enabledSections?.briefing ?? true;

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <AnimatedSection className="gemstone-container relative py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="gemstone-surface-raised gemstone-hero-panel gemstone-illumination rounded-[var(--gemstone-radius-lg)] p-6 sm:p-8 lg:col-span-2 lg:mx-auto lg:max-w-5xl lg:p-10 lg:text-center">
            <BrandLogo
              src={logoSrc}
              alt="GEMSTONE logo"
              width={640}
              height={651}
              priority
              className="mx-auto mb-8 h-64 w-auto object-contain sm:h-72 lg:h-96"
            />
            <h1 id="hero-heading" className="sr-only">
              {content.title}
            </h1>
            <p className="gemstone-body gemstone-hero-description mt-6 lg:mx-auto">
              {content.description}
            </p>
            {(requestInformationEnabled || briefingEnabled) && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 lg:justify-center">
                {requestInformationEnabled ? <ContentLinkView link={content.primaryCta} /> : null}
                {briefingEnabled ? <ContentLinkView link={content.secondaryCta} /> : null}
              </div>
            )}
          </div>
        </div>
        {visualImage ? (
          <ResponsiveMedia
            src={visualImage}
            alt="GEMSTONE ecosystem network"
            width={1600}
            height={900}
            wrapperClassName="gemstone-hero-graphic mt-10"
          />
        ) : null}
      </AnimatedSection>
    </section>
  );
}

export function AboutSection({ content }: { readonly content: AboutContent }) {
  return (
    <SectionFrame id="about" title={content.title}>
      <div className="space-y-10">
        <div>
          <p className="gemstone-body">{content.description}</p>
          <p className="gemstone-body mt-6 text-base">{content.distributedNote}</p>
        </div>

        <div aria-labelledby="about-relationships-heading">
          <h3 id="about-relationships-heading" className="text-2xl text-gemstone-text">
            {content.relationshipDescription}
          </h3>
          <ul
            aria-label="GEMSTONE relationship elements"
            className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            {content.relationshipLabels.map((label) => (
              <li
                key={label}
                className="gemstone-surface rounded-[var(--gemstone-radius-md)] px-4 py-4 text-center text-base font-semibold text-gemstone-text"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionFrame>
  );
}

function WhyGemstoneFeatureList({ items }: { readonly items: readonly FeatureItem[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2" aria-label="Why GEMSTONE benefits">
      {items.map((item) => {
        const titleId = `${item.id}-title`;

        return (
          <li key={item.id} className="min-w-0">
            <Card
              tabIndex={0}
              aria-labelledby={titleId}
              className="group h-full transition-[border-color,box-shadow] duration-200 hover:border-gemstone-cyan/45 hover:shadow-gemstone-glow focus-visible:border-gemstone-cyan/60 focus-visible:shadow-gemstone-glow"
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-gemstone-sm border border-gemstone-border/35 bg-gemstone-bg/60 text-gemstone-accent"
                >
                  <Icon name={item.icon} size={24} strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <h3 id={titleId} className="text-xl sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="gemstone-body mt-3 text-base">{item.description}</p>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export function WhyGemstoneSection({
  items,
  title = siteManifest.content.sectionTitles.whyGemstone,
}: {
  readonly items: readonly FeatureItem[];
  readonly title?: string;
}) {
  return (
    <SectionFrame id="whyGemstone" title={title}>
      <WhyGemstoneFeatureList items={items} />
    </SectionFrame>
  );
}

export { ArchitectureSection } from "@/components/sections/ArchitectureSection";

function CapabilityList({ items }: { readonly items: readonly CapabilityItem[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2" aria-label="GEMSTONE capabilities">
      {items.map((item) => {
        const titleId = `${item.id}-title`;

        return (
          <li key={item.id} className="min-w-0">
            <Card
              aria-labelledby={titleId}
              className="group h-full transition-[border-color,box-shadow] duration-200 hover:border-gemstone-cyan/45 hover:shadow-gemstone-glow focus-within:border-gemstone-cyan/60 focus-within:shadow-gemstone-glow"
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-gemstone-sm border border-gemstone-border/35 bg-gemstone-bg/60 text-gemstone-accent"
                >
                  <Icon name={item.icon} size={24} strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <h3 id={titleId} className="text-xl sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="gemstone-body mt-3 text-base">{item.description}</p>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export function CapabilitiesSection({
  items,
  title = siteManifest.content.sectionTitles.capabilities,
}: {
  readonly items: readonly CapabilityItem[];
  readonly title?: string;
}) {
  return (
    <SectionFrame id="capabilities" title={title}>
      <CapabilityList items={items} />
    </SectionFrame>
  );
}

export function BriefingSection({ config = briefingConfig }: { readonly config?: BriefingConfig }) {
  return (
    <SectionFrame id="briefing" title={config.title}>
      <p className="gemstone-body">{config.description}</p>
      <div className="mt-6">
        <MediaViewer config={config} />
      </div>
    </SectionFrame>
  );
}

export function RequestInformationSection({
  url,
  title = siteManifest.content.sectionTitles.requestInformation,
  description = siteManifest.content.sectionTitles.requestInformationDescription,
  privacyNotice = "Privacy notice placeholder",
}: {
  readonly url?: string;
  readonly title?: string;
  readonly description?: string;
  readonly privacyNotice?: string;
}) {
  return (
    <SectionFrame id="requestInformation" title={title}>
      <p className="gemstone-body">{description}</p>
      <div className="mt-6">
        <MicrosoftFormEmbed
          url={url}
          title="GEMSTONE Request More Information form"
          privacyNotice={privacyNotice}
        />
      </div>
    </SectionFrame>
  );
}

export { DifferentiatorsSection } from "@/components/sections/DifferentiatorsSection";
export { FAQSection } from "@/components/sections/FAQSection";
