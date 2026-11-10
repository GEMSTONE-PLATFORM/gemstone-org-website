import fc from "fast-check";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  defaultPageComposition,
  renderEnabledSections,
  sectionRegistry,
} from "@/app/section-registry";
import type { PageCompositionData } from "@/app/section-registry";
import type { SiteSections } from "@/types";

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

function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) {
      freezeDeep(nested);
    }
  }

  return value;
}

function compositionForSections(sections: SiteSections): PageCompositionData {
  const config = freezeDeep({
    ...structuredClone(defaultPageComposition.config),
    sections: freezeDeep(sections),
  });
  const content = freezeDeep(structuredClone(defaultPageComposition.content));

  return {
    ...defaultPageComposition,
    config,
    content,
  };
}

describe("section composition", () => {
  // **Validates: Requirements 2.8, 3.9**
  it("Property 1: enabled sections render once and disabled sections render zero times", () => {
    fc.assert(
      fc.property(siteSectionsArbitrary, (sections) => {
        const data = compositionForSections(sections);
        const configSnapshot = structuredClone(data.config);
        const contentSnapshot = structuredClone(data.content);
        const { container, unmount } = render(<>{renderEnabledSections(data)}</>);

        try {
          const renderedSections = Array.from(container.querySelectorAll("section[id]"));
          const renderedIds = renderedSections.map((section) => section.id);

          expect(renderedIds).toEqual(
            sectionRegistry.filter(({ id }) => sections[id]).map(({ id }) => id),
          );

          for (const { id } of sectionRegistry) {
            const occurrences = renderedSections.filter((section) => section.id === id);
            expect(occurrences).toHaveLength(sections[id] ? 1 : 0);
          }

          expect(data.config).toEqual(configSnapshot);
          expect(data.content).toEqual(contentSnapshot);
        } finally {
          unmount();
        }
      }),
      { numRuns: 100 },
    );
  });
});
