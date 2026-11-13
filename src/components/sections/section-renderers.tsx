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
      className="gemstone-page gemstone-grid gemstone-network relative overflow-hidden"
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
                <linearGradient id="hero-core" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="currentColor" />
                  <stop offset="1" stopColor="currentColor" />
                </linearGradient>
                <linearGradient id="hero-trace" x1="0" x2="1">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="0.5" stopColor="currentColor" stopOpacity="0.9" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
                <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g fill="none" stroke="url(#hero-trace)" strokeWidth="2">
                <path d="M600 280L250 130M600 280L950 130M600 280L170 410M600 280L1030 410" />
                <path
                  d="M250 130L170 410M950 130L1030 410M250 130L950 130M170 410L1030 410"
                  opacity="0.48"
                />
                <path d="M600 42V518M65 280H1135" opacity="0.25" />
              </g>
              <g fill="none" stroke="currentColor" strokeOpacity="0.28">
                <circle cx="600" cy="280" r="120" />
                <circle cx="600" cy="280" r="150" />
                <circle cx="600" cy="280" r="190" strokeDasharray="8 14" />
              </g>
              <g filter="url(#hero-glow)">
                <circle
                  cx="600"
                  cy="280"
                  r="56"
                  fill="url(#hero-core)"
                  fillOpacity="0.24"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path d="M570 280h60M600 250v60" stroke="currentColor" strokeWidth="3" />
                <circle cx="250" cy="130" r="14" fill="currentColor" />
                <circle cx="950" cy="130" r="14" fill="currentColor" />
                <circle cx="170" cy="410" r="14" fill="currentColor" />
                <circle cx="1030" cy="410" r="14" fill="currentColor" />
              </g>
              <g
                fill="currentColor"
                fontFamily="monospace"
                fontSize="18"
                fontWeight="700"
                letterSpacing="4"
              >
                <text x="540" y="350">
                  GEMSTONE
                </text>
                <text x="174" y="92">
                  NODE 01
                </text>
                <text x="874" y="92">
                  NODE 02
                </text>
                <text x="80" y="466">
                  CLIENT 01
                </text>
                <text x="944" y="466">
                  CLIENT 02
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
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)] lg:gap-16">
        <div>
          <p className="gemstone-body">{content.description}</p>
          <p className="gemstone-body mt-6 text-base">{content.distributedNote}</p>
        </div>

        <div
          className="gemstone-about-visual gemstone-motion relative min-h-[19rem] overflow-hidden rounded-[var(--gemstone-radius-lg)] p-4 sm:min-h-[22rem] sm:p-8"
          aria-hidden="true"
        >
          <svg
            className="absolute inset-0 h-full w-full text-gemstone-cyan/50"
            viewBox="0 0 640 360"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path className="gemstone-about-path" d="M320 180 L110 82 M320 180 L530 82" />
            <path className="gemstone-about-path" d="M320 180 L110 278 M320 180 L530 278" />
            <circle cx="320" cy="180" r="56" />
            <circle cx="110" cy="82" r="5" />
            <circle cx="530" cy="82" r="5" />
            <circle cx="110" cy="278" r="5" />
            <circle cx="530" cy="278" r="5" />
          </svg>
          <div className="relative grid h-full grid-cols-2 gap-3 sm:gap-6">
            {content.relationshipLabels.slice(0, 4).map((label) => (
              <span
                key={label}
                className="gemstone-surface-raised flex min-h-16 items-center justify-center rounded-[var(--gemstone-radius-md)] px-3 py-3 text-center text-sm font-semibold text-gemstone-text shadow-[var(--gemstone-shadow-glow)] sm:min-h-20 sm:text-base"
              >
                {label}
              </span>
            ))}
            <span className="gemstone-illumination gemstone-surface-raised col-span-2 row-start-2 flex min-h-20 items-center justify-center self-center justify-self-center rounded-full px-7 py-5 text-center text-sm font-bold uppercase tracking-[0.18em] text-gemstone-text sm:min-h-28 sm:px-10 sm:text-base">
              {content.relationshipLabels[4] ?? "GEMSTONE"}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2" aria-labelledby="about-relationships-heading">
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
