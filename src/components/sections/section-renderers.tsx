import type {
  AboutContent,
  BriefingConfig,
  CapabilityItem,
  ContentLink,
  FeatureItem,
  HeroContent,
  SiteSections,
} from "@/types";

import { briefingConfig } from "@/config/integration-config";
import {
  AnimatedSection,
  Card,
  ExternalLink,
  Icon,
  MediaViewer,
  MicrosoftFormEmbed,
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
  readonly enabledSections?: Pick<SiteSections, "briefing" | "requestInformation">;
}

export function HeroSection({ content, enabledSections }: HeroSectionProps) {
  const requestInformationEnabled = enabledSections?.requestInformation ?? true;
  const briefingEnabled = enabledSections?.briefing ?? true;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="gemstone-page gemstone-network relative overflow-hidden"
    >
      <AnimatedSection className="gemstone-container relative z-10 py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="gemstone-surface-raised gemstone-illumination rounded-[var(--gemstone-radius-lg)] p-6 sm:p-8 lg:col-span-2 lg:mx-auto lg:max-w-5xl lg:p-10 lg:text-center">
            <p className="gemstone-eyebrow mb-4">{content.eyebrow ?? "GEMSTONE"}</p>
            <h1
              id="hero-heading"
              className="gemstone-display text-gemstone-text lg:mx-auto lg:max-w-[18ch]"
            >
              {content.title}
            </h1>
            <p className="gemstone-body mt-6 lg:mx-auto">{content.description}</p>
            {(requestInformationEnabled || briefingEnabled) && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 lg:justify-center">
                {requestInformationEnabled ? <ContentLinkView link={content.primaryCta} /> : null}
                {briefingEnabled ? <ContentLinkView link={content.secondaryCta} /> : null}
              </div>
            )}
          </div>

          <div
            className="gemstone-hero-graphic relative col-span-full min-h-[18rem] overflow-hidden rounded-[var(--gemstone-radius-lg)] border border-gemstone-cyan/35 bg-gemstone-surface text-gemstone-cyan p-3 sm:min-h-[25rem] sm:p-6"
            aria-hidden="true"
            data-visualization-mode="decorative"
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1200 560"
              preserveAspectRatio="xMidYMid meet"
              focusable="false"
            >
              <defs>
                <filter id="hero-hub-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g fill="none" stroke="currentColor" className="text-gemstone-cyan">
                <path
                  d="M300 132L600 62L900 132Z"
                  strokeWidth="9"
                  opacity="0.2"
                  filter="url(#hero-hub-glow)"
                />
                <path d="M300 132L600 62L900 132Z" strokeWidth="3" opacity="0.95" />
              </g>
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gemstone-blue"
                opacity="0.92"
              >
                <path d="M300 150L260 270M300 150L340 270M600 80L560 270M600 80L640 270M900 150L860 270M900 150L940 270" />
              </g>
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gemstone-muted"
                opacity="0.72"
              >
                <path d="M260 290L260 400M260 290L260 490M340 290L340 400M340 290L340 490M560 290L560 400M560 290L560 490M640 290L640 400M640 290L640 490M860 290L860 400M860 290L860 490M940 290L940 400M940 290L940 490" />
              </g>
              <g className="text-gemstone-cyan" filter="url(#hero-hub-glow)">
                <circle
                  cx="300"
                  cy="150"
                  r="30"
                  fill="currentColor"
                  fillOpacity="0.24"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  cx="600"
                  cy="80"
                  r="30"
                  fill="currentColor"
                  fillOpacity="0.24"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  cx="900"
                  cy="150"
                  r="30"
                  fill="currentColor"
                  fillOpacity="0.24"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </g>
              <g className="text-gemstone-accent" fill="currentColor">
                <rect x="247" y="257" width="26" height="26" rx="5" />
                <rect x="327" y="257" width="26" height="26" rx="5" />
                <rect x="547" y="257" width="26" height="26" rx="5" />
                <rect x="627" y="257" width="26" height="26" rx="5" />
                <rect x="847" y="257" width="26" height="26" rx="5" />
                <rect x="927" y="257" width="26" height="26" rx="5" />
              </g>
              <g className="text-gemstone-text-muted" fill="currentColor">
                <circle cx="260" cy="400" r="9" />
                <circle cx="260" cy="490" r="9" />
                <circle cx="340" cy="400" r="9" />
                <circle cx="340" cy="490" r="9" />
                <circle cx="560" cy="400" r="9" />
                <circle cx="560" cy="490" r="9" />
                <circle cx="640" cy="400" r="9" />
                <circle cx="640" cy="490" r="9" />
                <circle cx="860" cy="400" r="9" />
                <circle cx="860" cy="490" r="9" />
                <circle cx="940" cy="400" r="9" />
                <circle cx="940" cy="490" r="9" />
              </g>
              <g
                fill="currentColor"
                className="text-gemstone-text"
                fontFamily="var(--gemstone-font-mono)"
                fontSize="15"
                fontWeight="700"
                letterSpacing="2"
              >
                <text x="265" y="155">
                  HUB A
                </text>
                <text x="565" y="85">
                  HUB B
                </text>
                <text x="865" y="155">
                  HUB C
                </text>
              </g>
              <g
                fill="currentColor"
                className="text-gemstone-accent"
                fontFamily="var(--gemstone-font-mono)"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1.5"
              >
                <text x="237" y="315">
                  NODE A1
                </text>
                <text x="317" y="315">
                  NODE A2
                </text>
                <text x="537" y="315">
                  NODE B1
                </text>
                <text x="617" y="315">
                  NODE B2
                </text>
                <text x="837" y="315">
                  NODE C1
                </text>
                <text x="917" y="315">
                  NODE C2
                </text>
              </g>
            </svg>
          </div>
        </div>
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

export function WhyGemstoneSection({ items }: { readonly items: readonly FeatureItem[] }) {
  return (
    <SectionFrame id="whyGemstone" title="Why GEMSTONE?">
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

export function CapabilitiesSection({ items }: { readonly items: readonly CapabilityItem[] }) {
  return (
    <SectionFrame id="capabilities" title="Capabilities">
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
  privacyNotice = "Privacy notice placeholder",
}: {
  readonly url?: string;
  readonly privacyNotice?: string;
}) {
  return (
    <SectionFrame id="requestInformation" title="Request More Information">
      <p className="gemstone-body">Connect with the GEMSTONE team to learn more.</p>
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
