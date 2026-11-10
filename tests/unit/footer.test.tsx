import fc from "fast-check";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/layout";
import type { ExternalLink, FooterConfig, InternalLink } from "@/types";

const approvedSocialLabels = new Set([
  "Facebook",
  "GitHub",
  "LinkedIn",
  "Mastodon",
  "Twitter",
  "X",
  "YouTube",
]);

const optionalDestinationArbitrary = fc.oneof(
  fc.constant(""),
  fc.constant(" "),
  fc.constant("\t\n"),
  fc.constant("https://example.com/optional"),
);

const optionalLogoArbitrary = fc.oneof(
  fc.constant(undefined),
  fc.constant(""),
  fc.constant(" "),
  fc.constant("\t\n"),
  fc.constant("/branding/organization-logo.svg"),
);

const optionalCopyrightArbitrary = fc.oneof(
  fc.constant(undefined),
  fc.constant(""),
  fc.constant(" "),
  fc.constant("\t\n"),
  fc.constant("© GEMSTONE"),
);

const optionalPrivacyArbitrary: fc.Arbitrary<ExternalLink | undefined> = fc.oneof(
  fc.constant(undefined),
  fc.record({
    kind: fc.constant("external" as const),
    label: fc.constantFrom("Privacy", "Configured privacy"),
    href: optionalDestinationArbitrary,
    external: fc.constant(true as const),
    newTab: fc.option(fc.boolean(), { nil: undefined }),
  }),
);

const optionalAccessibilityArbitrary: fc.Arbitrary<InternalLink | undefined> = fc.oneof(
  fc.constant(undefined),
  fc.record({
    kind: fc.constant("internal" as const),
    label: fc.constantFrom("", " ", "Accessibility", "Configured accessibility"),
    href: optionalDestinationArbitrary.map((value) => value as `#${string}`),
  }),
);

const socialLinkArbitrary: fc.Arbitrary<ExternalLink> = fc.record({
  kind: fc.constant("external" as const),
  label: fc.constantFrom("Facebook", "GitHub", "Discord", " "),
  href: optionalDestinationArbitrary,
  external: fc.constant(true as const),
  newTab: fc.option(fc.boolean(), { nil: undefined }),
});

const footerConfigArbitrary: fc.Arbitrary<FooterConfig> = fc.record({
  privacy: optionalPrivacyArbitrary,
  accessibility: optionalAccessibilityArbitrary,
  organizationLogo: optionalLogoArbitrary,
  socialLinks: fc.uniqueArray(socialLinkArbitrary, {
    maxLength: 6,
    selector: (link) => `${link.label}-${link.href}`,
  }),
  copyright: optionalCopyrightArbitrary,
  showBackToTop: fc.boolean(),
});

function hasNonEmptyValue(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

describe("footer optional-value filtering", () => {
  // **Validates: Requirements 12.4, 12.5**
  it("Property 13: optional footer values do not create empty links", () => {
    fc.assert(
      fc.property(footerConfigArbitrary, (config) => {
        const expectedHrefs: string[] = [];

        if (config.privacy && hasNonEmptyValue(config.privacy.href)) {
          expectedHrefs.push(config.privacy.href);
        }

        if (
          config.accessibility &&
          hasNonEmptyValue(config.accessibility.href) &&
          hasNonEmptyValue(config.accessibility.label)
        ) {
          expectedHrefs.push(config.accessibility.href);
        }

        for (const link of config.socialLinks ?? []) {
          if (approvedSocialLabels.has(link.label.trim()) && hasNonEmptyValue(link.href)) {
            expectedHrefs.push(link.href.trim());
          }
        }

        if (config.showBackToTop) expectedHrefs.push("#main-content");

        const { container, unmount } = render(<Footer navigation={[]} config={config} />);

        try {
          const footer = container.querySelector("footer");
          expect(footer).not.toBeNull();

          const renderedLinks = Array.from(footer?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
          const renderedHrefs = renderedLinks.map((link) => link.getAttribute("href"));

          expect(renderedHrefs.sort()).toEqual(expectedHrefs.sort());
          expect(renderedLinks.every((link) => link.textContent?.trim())).toBe(true);
          expect(
            renderedLinks.every((link) => hasNonEmptyValue(link.getAttribute("href") ?? undefined)),
          ).toBe(true);

          const image = footer?.querySelector("img");
          if (hasNonEmptyValue(config.organizationLogo)) {
            expect(image).toBeInTheDocument();
          } else {
            expect(image).not.toBeInTheDocument();
          }

          const copyright = config.copyright?.trim();
          if (hasNonEmptyValue(copyright)) {
            expect(footer?.textContent).toContain(copyright);
          } else {
            expect(footer?.textContent).not.toContain("© GEMSTONE");
          }
        } finally {
          unmount();
        }
      }),
      { numRuns: 100 },
    );
  });
});
