import type {
  ArchitectureContent,
  ContentLink,
  ExternalLink,
  InternalLink,
} from "@/types/content";

export type SectionId =
  | "hero"
  | "about"
  | "whyGemstone"
  | "architecture"
  | "capabilities"
  | "differentiators"
  | "faq"
  | "briefing"
  | "requestInformation";

export interface SiteSections {
  readonly hero: boolean;
  readonly about: boolean;
  readonly whyGemstone: boolean;
  readonly architecture: boolean;
  readonly capabilities: boolean;
  readonly differentiators: boolean;
  readonly faq: boolean;
  readonly briefing: boolean;
  readonly requestInformation: boolean;
}

export interface MetadataConfig {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl?: string;
  readonly openGraphImage?: string;
  readonly favicon?: string;
}

export type SiteMetadata = MetadataConfig;

export interface FooterConfig {
  readonly privacy?: ExternalLink;
  readonly accessibility?: InternalLink;
  readonly organizationLogo?: string;
  readonly socialLinks?: readonly ExternalLink[];
  readonly copyright?: string;
  readonly showBackToTop?: boolean;
}

export interface SiteConfig extends MetadataConfig {
  readonly siteName: string;
  readonly fullName: string;
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl?: string;
  readonly publicReleaseStatement: string;
  readonly sections: SiteSections;
  readonly navigation: readonly ContentLink[];
  readonly footer?: FooterConfig;
}

export interface AssetConfig {
  readonly logo: string;
  readonly horizontalLogo: string;
  readonly mark: string;
  readonly heroBackground?: string;
  readonly openGraphImage?: string;
}

export type BriefingFormat = "pdf" | "powerpoint" | "unknown";

export interface BriefingConfig {
  readonly url: string;
  readonly title: string;
  readonly description: string;
  readonly format: BriefingFormat;
  readonly allowDownload: boolean;
  readonly allowOpenInNewTab: boolean;
  readonly embed: boolean;
}

export interface MicrosoftFormConfig {
  readonly url?: string;
  readonly title: string;
  readonly privacyNotice?: string;
}

export interface ArchitectureDiagramProps {
  readonly content: ArchitectureContent;
  readonly reducedMotion?: boolean;
}

export interface ArchitectureDiagramState {
  readonly selectedEntityId: string | null;
  readonly focusedEntityId: string | null;
}

export interface MediaViewerProps {
  readonly config: BriefingConfig;
}

export interface MicrosoftFormEmbedProps {
  readonly url?: string;
  readonly title: string;
  readonly privacyNotice?: string;
}

export interface IntegrationConfig {
  readonly briefing: BriefingConfig;
  readonly microsoftFormUrl?: string;
  readonly microsoftForm?: MicrosoftFormConfig;
}

export type MotionIntensity = "reduced" | "standard" | "enhanced";

export interface MotionConfig {
  readonly intensity: MotionIntensity;
  readonly enableContinuousBackgroundMotion: boolean;
  readonly disableContinuousMotionOnSmallScreens: boolean;
  readonly sectionRevealDurationMs: number;
}

export type EmbedState =
  | "missing"
  | "idle"
  | "loading"
  | "loaded"
  | "blocked"
  | "unsupported";

export type FallbackStateKind = "missing" | "blocked" | "unsupported" | "unavailable";

export interface FallbackState {
  readonly kind: FallbackStateKind;
  readonly title: string;
  readonly message: string;
  readonly recoveryLink?: ExternalLink;
}
