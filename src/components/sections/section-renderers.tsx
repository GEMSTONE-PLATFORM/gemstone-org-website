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
import { Card, Icon, MediaViewer, MicrosoftFormEmbed, AnimatedSection } from "@/components/ui";

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
  const externalProps =
    link.kind === "external" && link.newTab
      ? { target: "_blank", rel: "noopener noreferrer" }
      : undefined;

  return (
    <a className="gemstone-button-motion gemstone-link" href={link.href} {...externalProps}>
      {link.label}
    </a>
  );
}

const ecosystemLabels = [
  "Organizations",
  "Environments",
  "Nodes",
  "Tools",
  "Data",
  "Compute",
  "Models",
  "Simulations",
  "Users",
  "Hub services",
] as const;

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
      data-visualization-mode="static"
      className="gemstone-page gemstone-grid gemstone-network relative overflow-hidden"
    >
      <div
        className="gemstone-motion pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 1200 760"
          preserveAspectRatio="none"
          focusable="false"
          aria-hidden="true"
        >
          <path
            d="M0 120C180 40 250 240 430 170S700 70 860 210s220 40 340-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="gemstone-network-path text-gemstone-cyan/30"
          />
          <path
            d="M-20 530c150-140 270-60 390-160s250-130 390-40 270 20 460-80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="gemstone-network-path text-gemstone-blue/30"
          />
          <path
            d="M220 0c40 170 150 230 310 250s260 20 450-140"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="gemstone-network-path text-gemstone-accent/20"
          />
        </svg>
      </div>

      <AnimatedSection className="gemstone-container relative z-10 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="gemstone-surface-raised gemstone-illumination rounded-[var(--gemstone-radius-lg)] p-6 sm:p-8 lg:p-10">
            <p className="gemstone-eyebrow mb-4">{content.eyebrow ?? "GEMSTONE"}</p>
            <h1 id="hero-heading" className="gemstone-display text-gemstone-text">
              {content.title}
            </h1>
            <p className="gemstone-body mt-6">{content.description}</p>
            {(requestInformationEnabled || briefingEnabled) && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                {requestInformationEnabled ? <ContentLinkView link={content.primaryCta} /> : null}
                {briefingEnabled ? <ContentLinkView link={content.secondaryCta} /> : null}
              </div>
            )}
          </div>

          <figure
            className="relative min-h-[26rem] overflow-hidden rounded-[var(--gemstone-radius-lg)] border border-gemstone-border/30 bg-gemstone-surface/60 p-4 sm:min-h-[32rem] sm:p-6"
            aria-labelledby="hero-network-title"
            data-visualization-mode="static"
            data-image-fallback="static"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <svg
                className="h-full w-full text-gemstone-cyan/40"
                viewBox="0 0 640 520"
                preserveAspectRatio="none"
                focusable="false"
                aria-hidden="true"
              >
                <path
                  d="M320 72L150 190L320 260L492 190L320 72Z"
                  fill="none"
                  stroke="currentColor"
                />
                <path
                  d="M150 190L112 390M492 190L528 390M320 260L320 432"
                  fill="none"
                  stroke="currentColor"
                />
                <path d="M112 390L320 432L528 390" fill="none" stroke="currentColor" />
                <circle cx="320" cy="72" r="11" fill="currentColor" />
                <circle cx="150" cy="190" r="8" fill="currentColor" />
                <circle cx="492" cy="190" r="8" fill="currentColor" />
                <circle cx="112" cy="390" r="7" fill="currentColor" />
                <circle cx="320" cy="432" r="7" fill="currentColor" />
                <circle cx="528" cy="390" r="7" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <figcaption id="hero-network-title">
                <p className="gemstone-eyebrow">Connected ecosystem</p>
                <p className="mt-2 text-lg font-semibold text-gemstone-text">
                  Static ecosystem map
                </p>
                <p className="gemstone-body mt-2 text-sm">
                  A readable view of the organizations, environments, and services that GEMSTONE
                  connects.
                </p>
              </figcaption>
              <ul
                aria-label="GEMSTONE ecosystem labels"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {ecosystemLabels.map((label) => (
                  <li
                    key={label}
                    className="rounded-[var(--gemstone-radius-sm)] border border-gemstone-border/30 bg-gemstone-bg/80 px-3 py-3 text-sm font-semibold text-gemstone-text shadow-gemstone"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </figure>
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
