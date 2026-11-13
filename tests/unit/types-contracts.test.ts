import { describe, expect, it } from "vitest";

import type {
  ArchitectureContent,
  CapabilityItem,
  ContentLink,
  FAQItem,
  FeatureItem,
  FallbackState,
  InternalLink,
  MotionConfig,
  SiteConfig,
} from "@/types";

const validInternalLink = {
  kind: "internal",
  label: "Architecture",
  href: "#architecture",
} as const satisfies InternalLink;

const validExternalLink = {
  kind: "external",
  label: "Open briefing",
  href: "https://example.com/briefing",
  external: true,
  newTab: true,
} as const satisfies ContentLink;

const validFeature = {
  id: "controlled-collaboration",
  title: "Controlled Collaboration",
  description: "Approved description.",
  icon: "network",
} as const satisfies FeatureItem;

const validCapability = {
  ...validFeature,
  id: "scalable-adoption",
  title: "Scalable Adoption",
  category: "capability",
} as const satisfies CapabilityItem;

const validFaq = {
  id: "what-is-gemstone",
  question: "What is GEMSTONE?",
  answer: "An approved answer.",
} as const satisfies FAQItem;

const validArchitecture = {
  entities: [
    {
      id: "hub",
      kind: "hub",
      label: "Hub",
      description: "Enterprise services and connections.",
      x: 50,
      y: 50,
    },
  ],
  connections: [],
  distributedPrinciple: "Organizations retain their environments.",
} as const satisfies ArchitectureContent;

const validMotion = {
  intensity: "standard",
  enableContinuousBackgroundMotion: true,
  disableContinuousMotionOnSmallScreens: true,
  sectionRevealDurationMs: 320,
} as const satisfies MotionConfig;

const validSiteConfig = {
  siteName: "GEMSTONE",
  fullName: "Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem",
  title: "GEMSTONE",
  description: "Approved description.",
  publicReleaseStatement: "Approved for Public Release. Distribution Unlimited.",
  sections: {
    hero: true,
    about: true,
    whyGemstone: true,
    architecture: true,
    capabilities: true,
    differentiators: true,
    faq: true,
    briefing: true,
    requestInformation: true,
  },
  navigation: [validInternalLink, validExternalLink],
} as const satisfies SiteConfig;

const validFallback = {
  kind: "blocked",
  title: "Open the briefing externally",
  message: "The embedded viewer is unavailable.",
  recoveryLink: validExternalLink,
} as const satisfies FallbackState;

// These fixtures must remain rejected if a contract is loosened accidentally.
const invalidInternalLink: InternalLink = {
  kind: "internal",
  label: "Invalid",
  // @ts-expect-error Internal links must use same-page hash targets.
  href: "https://example.com",
};

// @ts-expect-error Motion intensity is a closed, three-value union.
const invalidMotion: MotionConfig = { ...validMotion, intensity: "fast" };

const invalidArchitecture: ArchitectureContent = {
  ...validArchitecture,
  entities: [
    {
      ...validArchitecture.entities[0],
      // @ts-expect-error Architecture entities must use Hub, Node, or Client kinds.
      kind: "service",
    },
  ],
};

const invalidFallback: FallbackState = {
  ...validFallback,
  // @ts-expect-error Fallback recovery actions must be external links.
  recoveryLink: validInternalLink,
};

// @ts-expect-error Readonly content arrays cannot be mutated by presentation code.
validArchitecture.entities.push(validArchitecture.entities[0]);

void invalidInternalLink;
void invalidMotion;
void invalidArchitecture;
void invalidFallback;
void validCapability;
void validFaq;

describe("shared TypeScript contracts", () => {
  it("accepts representative content and configuration fixtures", () => {
    expect(validSiteConfig.sections.architecture).toBe(true);
    expect(validArchitecture.entities[0]?.kind).toBe("hub");
    expect(validMotion.intensity).toBe("standard");
    expect(validFallback.recoveryLink?.external).toBe(true);
  });
});
