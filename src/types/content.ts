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
  readonly navigation: readonly ContentLink[];
  readonly privacyNotice: string;
  readonly publicReleaseStatement: string;
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

export interface MatrixOrganization {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly environmentIds: readonly string[];
}

export interface MatrixEnvironment {
  readonly id: string;
  readonly organizationId: string;
  readonly label: string;
  readonly description: string;
}

export interface MatrixNode {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly mission?: string;
}

export interface MatrixClient {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly organizationId?: string;
  readonly environmentId?: string;
}

export type MatrixRelationshipKind =
  | "subscribes-to"
  | "connects-to"
  | "supports";

export interface MatrixRelationship {
  readonly id: string;
  readonly kind: MatrixRelationshipKind;
  readonly from: string;
  readonly to: string;
  readonly label: string;
}

export interface MatrixSubscription {
  readonly clientId: string;
  readonly nodeId: string;
}

/** Typed model for the multi-environment Modeling and Simulation Matrix. */
export interface ModelingSimulationMatrix {
  readonly organizations: readonly MatrixOrganization[];
  readonly environments: readonly MatrixEnvironment[];
  readonly nodes: readonly MatrixNode[];
  readonly clients: readonly MatrixClient[];
  readonly subscriptions: readonly MatrixSubscription[];
  readonly relationships: readonly MatrixRelationship[];
  readonly description: string;
}

export type SiteContent = {
  readonly hero: HeroContent;
  readonly about: AboutContent;
  readonly problems: readonly string[];
  readonly whyGemstone: readonly FeatureItem[];
  readonly architecture: ArchitectureContent;
  readonly matrix: ModelingSimulationMatrix;
  readonly ecosystem: EcosystemContent;
  readonly analystBenefits: readonly AnalystBenefitItem[];
  readonly capabilities: readonly CapabilityItem[];
  readonly differentiators: readonly DifferentiatorItem[];
  readonly faq: readonly FAQItem[];
  readonly footer: FooterContent;
};
