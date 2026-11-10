import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { briefingConfig, siteConfig } from "@/config";
import { capabilities } from "@/content/capabilities";
import { differentiators } from "@/content/differentiators";
import { faqItems } from "@/content/faq";
import {
  analystBenefits,
  architectureContent,
  ecosystemContent,
  heroContent,
  problems,
  siteContent,
  whyGemstoneItems,
} from "@/content/site-content";
import type {
  CapabilityItem,
  ContentLink,
  DifferentiatorItem,
  FAQItem,
  FeatureItem,
  IconName,
} from "@/types";

const iconNames: readonly IconName[] = [
  "boxes",
  "database",
  "globe",
  "layers",
  "network",
  "refreshCw",
  "server",
  "shield",
  "sparkles",
  "workflow",
];

const textArbitrary = fc.string({ minLength: 1, maxLength: 80 });
const identifierArbitrary = fc
  .string({ minLength: 1, maxLength: 24 })
  .filter((value) => value.trim().length > 0 && !value.includes("#"));
const iconArbitrary = fc.constantFrom(...iconNames);

const featureArbitrary: fc.Arbitrary<FeatureItem> = fc.record({
  id: identifierArbitrary,
  title: textArbitrary,
  description: textArbitrary,
  icon: iconArbitrary,
});

const capabilityArbitrary: fc.Arbitrary<CapabilityItem> = fc.record({
  id: identifierArbitrary,
  title: textArbitrary,
  description: textArbitrary,
  icon: iconArbitrary,
  category: fc.option(textArbitrary, { nil: undefined }),
});

const differentiatorArbitrary: fc.Arbitrary<DifferentiatorItem> = fc.record({
  id: identifierArbitrary,
  title: textArbitrary,
  description: fc.option(textArbitrary, { nil: undefined }),
  icon: iconArbitrary,
  claimReviewRequired: fc.boolean(),
});

const faqArbitrary: fc.Arbitrary<FAQItem> = fc.record({
  id: identifierArbitrary,
  question: textArbitrary,
  answer: textArbitrary,
});

const internalLinkArbitrary: fc.Arbitrary<ContentLink> = fc.record({
  kind: fc.constant("internal" as const),
  label: textArbitrary,
  href: identifierArbitrary.map((target) => `#${target}` as `#${string}`),
  target: fc.option(identifierArbitrary, { nil: undefined }),
});

const externalLinkArbitrary: fc.Arbitrary<ContentLink> = fc.record({
  kind: fc.constant("external" as const),
  label: textArbitrary,
  href: textArbitrary.map((value) => `https://example.com/${encodeURIComponent(value)}`),
  external: fc.constant(true as const),
  newTab: fc.option(fc.boolean(), { nil: undefined }),
});

const navigationArbitrary = fc.array(fc.oneof(internalLinkArbitrary, externalLinkArbitrary), {
  maxLength: 12,
});

function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) {
      freezeDeep(nested);
    }
  }

  return value;
}

/**
 * This models the generic projection a section renderer performs at the source
 * boundary. It deliberately copies entries rather than changing the source
 * collection or its entries.
 */
function mapForPresentation<T extends object>(source: readonly T[]): readonly T[] {
  return source.map((entry) => ({ ...entry }));
}

function assertMappingDoesNotMutate<T extends object>(source: readonly T[]): void {
  const snapshot = structuredClone(source);
  const frozenSource = freezeDeep(source);
  const mapped = mapForPresentation(frozenSource);

  expect(source).toEqual(snapshot);
  expect(mapped).toEqual(snapshot);
  expect(mapped).not.toBe(source);
  source.forEach((entry, entryIndex) => {
    expect(mapped[entryIndex]).not.toBe(entry);
  });
}

function collectStrings(value: unknown, seen = new Set<object>()): readonly string[] {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  if (seen.has(value)) return [];

  seen.add(value);
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectStrings(entry, seen));
  }

  return Object.values(value).flatMap((entry) => collectStrings(entry, seen));
}

function renderPublicClaimsFromTypedSources(): readonly string[] {
  return [
    heroContent.title,
    heroContent.description,
    ...collectStrings(siteContent.about),
    ...problems,
    ...whyGemstoneItems.flatMap(({ title, description }) => [title, description]),
    ...architectureContent.entities.flatMap(({ label, description }) => [label, description]),
    ...architectureContent.connections.map(({ label }) => label),
    architectureContent.distributedPrinciple,
    ecosystemContent.title,
    ecosystemContent.description,
    ...ecosystemContent.points,
    ...analystBenefits.flatMap(({ title, description }) => [title, description]),
    ...capabilities.flatMap(({ title, description }) => [title, description]),
    ...(differentiators as readonly DifferentiatorItem[]).flatMap(({ title, description }) =>
      description ? [title, description] : [title],
    ),
    ...faqItems.flatMap(({ question, answer }) => [question, answer]),
    siteConfig.siteName,
    siteConfig.fullName,
    siteConfig.title,
    siteConfig.description,
    siteConfig.publicReleaseStatement,
    briefingConfig.title,
    briefingConfig.description,
  ];
}

const approvedRepositoryValues = new Set([
  ...collectStrings(siteContent),
  ...collectStrings(siteConfig),
  ...collectStrings(briefingConfig),
]);

describe("typed content source boundaries", () => {
  it("Property 3: generated content arrays map without mutating source arrays or entries", () => {
    fc.assert(
      fc.property(
        fc.record({
          capabilities: fc.array(capabilityArbitrary, { maxLength: 12 }),
          differentiators: fc.array(differentiatorArbitrary, { maxLength: 12 }),
          faqs: fc.array(faqArbitrary, { maxLength: 12 }),
          features: fc.array(featureArbitrary, { maxLength: 12 }),
          navigation: navigationArbitrary,
        }),
        ({
          capabilities: generatedCapabilities,
          differentiators: generatedDifferentiators,
          faqs,
          features,
          navigation,
        }) => {
          assertMappingDoesNotMutate(generatedCapabilities);
          assertMappingDoesNotMutate(generatedDifferentiators);
          assertMappingDoesNotMutate(faqs);
          assertMappingDoesNotMutate(features);
          assertMappingDoesNotMutate(navigation);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("Property 4: rendered public claims are values from typed repositories", () => {
    const renderedClaims = renderPublicClaimsFromTypedSources();

    fc.assert(
      fc.property(fc.constantFrom(...renderedClaims), (claim) => {
        expect(approvedRepositoryValues.has(claim)).toBe(true);
      }),
      { numRuns: 100 },
    );

    const unapprovedPresentationString = "Presentation-only claim not in the repositories";
    expect(approvedRepositoryValues.has(unapprovedPresentationString)).toBe(false);
    expect(renderedClaims).not.toContain(unapprovedPresentationString);
  });
});
