export type IconName =
  | "boxes"
  | "database"
  | "globe"
  | "layers"
  | "network"
  | "refreshCw"
  | "server"
  | "shield"
  | "sparkles"
  | "workflow";

/** Same-page anchor links are kept separate from links to another origin. */
export interface InternalLink {
  readonly kind: "internal";
  readonly label: string;
  readonly href: `#${string}`;
  readonly target?: string;
  readonly external?: false;
}

export interface ExternalLink {
  readonly kind: "external";
  readonly label: string;
  readonly href: string;
  readonly external: true;
  readonly newTab?: boolean;
}

export type ContentLink = InternalLink | ExternalLink;

export interface NetworkTopologyEntity {
  readonly id: string;
  readonly kind: ArchitectureEntityKind;
  readonly label: string;
  readonly parentId?: string;
}

export interface NetworkTopologyConnection {
  readonly from: string;
  readonly to: string;
}

export interface NetworkTopologyContent {
  readonly entities: readonly NetworkTopologyEntity[];
  readonly connections: readonly NetworkTopologyConnection[];
}

export interface HeroContent {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta: ContentLink;
  readonly secondaryCta: ContentLink;
}

export interface AboutContent {
  readonly title: string;
  readonly description: string;
  readonly relationshipLabels: readonly string[];
  readonly relationshipDescription: string;
  readonly distributedNote: string;
}

export interface EcosystemContent {
  readonly title: string;
  readonly description: string;
  readonly points: readonly string[];
}

export interface FooterContent {
  readonly siteName: string;
  readonly fullName: string;
  readonly privacyNotice: string;
}

export interface FeatureItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

export interface CapabilityItem extends FeatureItem {
  readonly category?: string;
}

export interface DifferentiatorItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly icon: IconName;
  readonly claimReviewRequired: boolean;
}

export interface FAQItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export type AnalystBenefitItem = FeatureItem;

export type ArchitectureEntityKind = "hub" | "node" | "client";

export interface ArchitectureEntity {
  readonly id: string;
  readonly kind: ArchitectureEntityKind;
  readonly label: string;
  readonly description: string;
  readonly x: number;
  readonly y: number;
}

export interface ArchitectureConnection {
  readonly from: string;
  readonly to: string;
  readonly label: string;
}

export interface ArchitectureContent {
  readonly entities: readonly ArchitectureEntity[];
  readonly connections: readonly ArchitectureConnection[];
  readonly distributedPrinciple: string;
}

export interface SectionTitles {
  readonly whyGemstone: string;
  readonly architecture: string;
  readonly architectureIntroduction: string;
  readonly browseNetwork: string;
  readonly capabilities: string;
  readonly differentiators: string;
  readonly faq: string;
  readonly briefing: string;
  readonly requestInformation: string;
  readonly requestInformationDescription: string;
}

export type SiteContent = {
  readonly sectionTitles: SectionTitles;
  readonly hero: HeroContent;
  readonly about: AboutContent;
  readonly whyGemstone: readonly FeatureItem[];
  readonly architecture: ArchitectureContent;
  readonly networkTopology: NetworkTopologyContent;
  readonly ecosystem: EcosystemContent;
  readonly analystBenefits: readonly AnalystBenefitItem[];
  readonly capabilities: readonly CapabilityItem[];
  readonly differentiators: readonly DifferentiatorItem[];
  readonly faq: readonly FAQItem[];
  readonly footer: FooterContent;
};
