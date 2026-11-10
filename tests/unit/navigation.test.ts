import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { sectionRegistry } from "@/app/section-registry";
import { getEnabledNavigationItems, resolveNavigationTarget } from "@/components/layout/Navigation";
import type { ContentLink, SectionId, SiteSections } from "@/types";

const sectionIds = sectionRegistry.map(({ id }) => id) as [SectionId, ...SectionId[]];
const sectionIdArbitrary = fc.constantFrom(...sectionIds);
const labelArbitrary = fc.string({ minLength: 1, maxLength: 32 });

const siteSectionsArbitrary: fc.Arbitrary<SiteSections> = fc.record({
  hero: fc.boolean(),
  about: fc.boolean(),
  whyGemstone: fc.boolean(),
  architecture: fc.boolean(),
  capabilities: fc.boolean(),
  differentiators: fc.boolean(),
  faq: fc.boolean(),
  briefing: fc.boolean(),
  requestInformation: fc.boolean(),
});

const internalLinkArbitrary: fc.Arbitrary<ContentLink> = fc
  .record({
    label: labelArbitrary,
    target: sectionIdArbitrary,
    includeExplicitTarget: fc.boolean(),
  })
  .map(({ label, target, includeExplicitTarget }) => ({
    kind: "internal" as const,
    label,
    href: `#${target}` as `#${string}`,
    ...(includeExplicitTarget ? { target } : {}),
  }));

const externalLinkArbitrary: fc.Arbitrary<ContentLink> = labelArbitrary.map((label) => ({
  kind: "external" as const,
  label,
  href: "https://example.com",
  external: true as const,
}));

const navigationArbitrary = fc.array(fc.oneof(internalLinkArbitrary, externalLinkArbitrary), {
  maxLength: 16,
});

describe("navigation integrity", () => {
  // **Validates: Requirements 3.2, 3.9, 12.2**
  it("Property 2: enabled navigation targets resolve uniquely", () => {
    fc.assert(
      fc.property(navigationArbitrary, siteSectionsArbitrary, (items, sections) => {
        const enabledItems = getEnabledNavigationItems(items, sections);
        const expectedItems = items.filter((item) => {
          const target = resolveNavigationTarget(item);
          return (
            item.kind === "internal" &&
            target !== null &&
            sectionRegistry.filter(({ id }) => id === target).length === 1 &&
            sections[target as keyof SiteSections]
          );
        });

        expect(enabledItems).toEqual(expectedItems);

        for (const item of enabledItems) {
          const target = resolveNavigationTarget(item);
          const matchingSections = sectionRegistry.filter(({ id }) => id === target);

          expect(matchingSections).toHaveLength(1);
          expect(sections[matchingSections[0].id]).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });
});
