import { readFileSync } from "node:fs";
import { join } from "node:path";

import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  defaultPageComposition,
  renderEnabledSections,
  sectionRegistry,
  type PageCompositionData,
} from "@/app/section-registry";
import { BrandLogo } from "@/components/ui";
import {
  BriefingSection,
  CapabilitiesSection,
  RequestInformationSection,
} from "@/components/sections/section-renderers";
import { assetConfig, integrationConfig, siteConfig } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import type { CapabilityItem, SiteSections } from "@/types";

const stylesheet = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");
const tokenName = "--gemstone-cyan-rgb";
const safeTokenArbitrary = fc
  .array(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789"), {
    minLength: 6,
    maxLength: 16,
  })
  .map((characters) => characters.join(""));
const distinctTokenPairArbitrary = fc
  .tuple(safeTokenArbitrary, safeTokenArbitrary)
  .filter(([before, after]) => before !== after);
const rgbValueArbitrary = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
  )
  .map((channels) => channels.join(" "));

type IsolationChange =
  | { readonly kind: "content"; readonly token: string }
  | { readonly kind: "design-token"; readonly value: string }
  | { readonly kind: "section"; readonly id: keyof SiteSections }
  | { readonly kind: "logo"; readonly before: string; readonly after: string }
  | { readonly kind: "briefing"; readonly before: string; readonly after: string }
  | { readonly kind: "microsoft-form"; readonly before: string; readonly after: string }
  | { readonly kind: "metadata"; readonly before: string; readonly after: string };

const isolationChangeArbitrary: fc.Arbitrary<IsolationChange> = fc.oneof(
  safeTokenArbitrary.map((token) => ({ kind: "content" as const, token })),
  rgbValueArbitrary
    .filter((value) => value !== getTokenValue(stylesheet, tokenName))
    .map((value) => ({ kind: "design-token" as const, value })),
  fc
    .constantFrom(...sectionRegistry.map(({ id }) => id))
    .map((id) => ({ kind: "section" as const, id })),
  distinctTokenPairArbitrary.map(([before, after]) => ({
    kind: "logo" as const,
    before: `/branding/${before}.svg`,
    after: `/branding/${after}.svg`,
  })),
  distinctTokenPairArbitrary.map(([before, after]) => ({
    kind: "briefing" as const,
    before: `https://briefing-${before}.example.test/${before}`,
    after: `https://briefing-${after}.example.test/${after}`,
  })),
  distinctTokenPairArbitrary.map(([before, after]) => ({
    kind: "microsoft-form" as const,
    before: `https://forms-${before}.example.test/${before}`,
    after: `https://forms-${after}.example.test/${after}`,
  })),
  distinctTokenPairArbitrary.map(([before, after]) => ({
    kind: "metadata" as const,
    before: `Approved metadata ${before}`,
    after: `Approved metadata ${after}`,
  })),
);

function getTokenValue(source: string, name: string): string {
  const match = source.match(new RegExp(`${escapeRegExp(name)}:\\s*([^;]+);`));
  if (!match) throw new Error(`Missing centralized design token: ${name}`);

  return match[1].trim();
}

function withTokenValue(source: string, name: string, value: string): string {
  return source.replace(new RegExp(`(${escapeRegExp(name)}:\\s*)[^;]+;`), `$1${value};`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) {
      freezeDeep(nested);
    }
  }

  return value;
}

function composition(): PageCompositionData {
  return freezeDeep(structuredClone(defaultPageComposition));
}

function staticSections(data: PageCompositionData): Map<string, string> {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(<>{renderEnabledSections(data)}</>);

  return new Map(
    Array.from(container.querySelectorAll("section[id]")).map((section) => [
      section.id,
      section.outerHTML,
    ]),
  );
}

function withoutManagedUrl(markup: string, url: string): string {
  return markup.split(url).join("__MANAGED_URL__");
}

function affectedSectionIds(id: keyof SiteSections): readonly string[] {
  return id === "briefing" || id === "requestInformation" ? [id, "hero"] : [id];
}

function assertUnrelatedSectionsUnchanged(
  before: ReadonlyMap<string, string>,
  after: ReadonlyMap<string, string>,
  affectedIds: readonly string[],
): void {
  for (const { id } of sectionRegistry) {
    if (affectedIds.includes(id)) continue;
    expect(after.get(id)).toBe(before.get(id));
  }
}

describe("configuration isolation", () => {
  /** Validates: Requirements 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 10.1, 11.2 */
  it("Property 16: a single managed change updates only its configured presentation boundary", () => {
    fc.assert(
      fc.property(isolationChangeArbitrary, (change) => {
        switch (change.kind) {
          case "content": {
            const item: CapabilityItem = {
              id: `configuration-isolation-${change.token}`,
              title: `Approved capability ${change.token}`,
              description: `Approved capability description ${change.token}`,
              icon: "layers",
              category: "capability",
            };
            const source = freezeDeep([...defaultPageComposition.content.capabilities, item]);
            const snapshot = structuredClone(source);
            const baseline = renderToStaticMarkup(
              <CapabilitiesSection items={defaultPageComposition.content.capabilities} />,
            );
            const updated = renderToStaticMarkup(<CapabilitiesSection items={source} />);

            expect(updated).not.toBe(baseline);
            expect(updated).toContain(item.title);
            expect(updated).toContain(item.description);
            expect(baseline).not.toContain(change.token);
            expect(updated.split(item.title).length - 1).toBe(1);
            expect(updated.split(item.description).length - 1).toBe(1);
            expect(source).toEqual(snapshot);
            return;
          }

          case "design-token": {
            const before = getTokenValue(stylesheet, tokenName);
            const updatedStylesheet = withTokenValue(stylesheet, tokenName, change.value);
            const unrelatedMarkup = renderToStaticMarkup(
              <CapabilitiesSection items={defaultPageComposition.content.capabilities} />,
            );

            expect(getTokenValue(updatedStylesheet, tokenName)).toBe(change.value);
            expect(withTokenValue(updatedStylesheet, tokenName, before)).toBe(stylesheet);
            expect(
              renderToStaticMarkup(
                <CapabilitiesSection items={defaultPageComposition.content.capabilities} />,
              ),
            ).toBe(unrelatedMarkup);
            return;
          }

          case "section": {
            const before = composition();
            const after = freezeDeep({
              ...structuredClone(before),
              config: {
                ...structuredClone(before.config),
                sections: {
                  ...structuredClone(before.config.sections),
                  [change.id]: false,
                },
              },
            });
            const beforeSnapshot = structuredClone(before);
            const afterSnapshot = structuredClone(after);
            const beforeSections = staticSections(before);
            const afterSections = staticSections(after);

            expect(beforeSections.has(change.id)).toBe(true);
            expect(afterSections.has(change.id)).toBe(false);
            assertUnrelatedSectionsUnchanged(
              beforeSections,
              afterSections,
              affectedSectionIds(change.id),
            );
            expect(before).toEqual(beforeSnapshot);
            expect(after).toEqual(afterSnapshot);
            return;
          }

          case "logo": {
            const before = renderToStaticMarkup(
              <BrandLogo src={change.before} alt="GEMSTONE" width={220} height={48} />,
            );
            const after = renderToStaticMarkup(
              <BrandLogo src={change.after} alt="GEMSTONE" width={220} height={48} />,
            );

            expect(before).toContain(`src="${change.before}"`);
            expect(after).toContain(`src="${change.after}"`);
            expect(after).not.toContain(change.before);
            expect(withoutManagedUrl(before, change.before)).toBe(
              withoutManagedUrl(after, change.after),
            );
            return;
          }

          case "briefing": {
            const baselineConfig = {
              ...integrationConfig.briefing,
              url: change.before,
              title: "Configured briefing",
            };
            const updatedConfig = { ...baselineConfig, url: change.after };
            const before = renderToStaticMarkup(<BriefingSection config={baselineConfig} />);
            const after = renderToStaticMarkup(<BriefingSection config={updatedConfig} />);

            expect(before).toContain(change.before);
            expect(after).toContain(change.after);
            expect(after).not.toContain(change.before);
            expect(withoutManagedUrl(before, change.before)).toBe(
              withoutManagedUrl(after, change.after),
            );
            return;
          }

          case "microsoft-form": {
            const before = renderToStaticMarkup(
              <RequestInformationSection url={change.before} privacyNotice="Privacy notice" />,
            );
            const after = renderToStaticMarkup(
              <RequestInformationSection url={change.after} privacyNotice="Privacy notice" />,
            );

            expect(before).toContain(change.before);
            expect(after).toContain(change.after);
            expect(after).not.toContain(change.before);
            expect(withoutManagedUrl(before, change.before)).toBe(
              withoutManagedUrl(after, change.after),
            );
            return;
          }

          case "metadata": {
            const before = buildMetadata({ ...siteConfig, title: change.before }, assetConfig);
            const after = buildMetadata({ ...siteConfig, title: change.after }, assetConfig);
            const sections = staticSections(composition());

            expect(before.title).toBe(change.before);
            expect(after.title).toBe(change.after);
            expect(after.title).not.toBe(before.title);
            expect(sections.get("hero")).toContain(
              defaultPageComposition.content.hero.title.replace("&", "&amp;"),
            );
            return;
          }
        }
      }),
      { numRuns: 100 },
    );
  });
});
