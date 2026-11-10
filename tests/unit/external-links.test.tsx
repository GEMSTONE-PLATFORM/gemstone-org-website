import fc from "fast-check";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExternalLink, StatusFallback } from "@/components/ui";
import type { ExternalLink as ExternalLinkModel } from "@/types";

const linkLabelArbitrary = fc
  .array(fc.constantFrom(..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"), {
    minLength: 1,
    maxLength: 24,
  })
  .map((characters) => characters.join(""));

const optionalRelArbitrary = fc.option(
  fc
    .array(fc.constantFrom("nofollow", "ugc", "sponsored", "noopener"), {
      minLength: 1,
      maxLength: 4,
    })
    .map((tokens) => tokens.join(" ")),
  { nil: undefined },
);

const externalLinksArbitrary: fc.Arbitrary<readonly ExternalLinkModel[]> = fc.uniqueArray(
  fc.record({
    kind: fc.constant("external" as const),
    label: linkLabelArbitrary,
    href: fc.webUrl(),
    external: fc.constant(true as const),
    newTab: fc.constant(true as const),
  }),
  { minLength: 1, maxLength: 6, selector: (link) => link.label },
);

describe("new-tab external-link safety", () => {
  // **Validates: Requirements 10.8, 11.8, 16.8**
  it("Property 16: every rendered new-tab external link has safe attributes and an accessible indication", () => {
    fc.assert(
      fc.property(externalLinksArbitrary, optionalRelArbitrary, (links, rel) => {
        const { container, unmount } = render(
          <>
            {links.map((link) => (
              <ExternalLink key={link.label} href={link.href} newTab rel={rel}>
                {link.label}
              </ExternalLink>
            ))}
            <StatusFallback title="External recovery" recoveryLinks={links} />
          </>,
        );

        try {
          const newTabLinks = Array.from(
            container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'),
          );

          expect(newTabLinks).toHaveLength(links.length * 2);

          for (const link of newTabLinks) {
            expect(link.getAttribute("rel")?.split(/\s+/)).toEqual(
              expect.arrayContaining(["noopener", "noreferrer"]),
            );
            expect(link).toHaveAccessibleName(/opens in a new tab/i);
          }
        } finally {
          unmount();
        }
      }),
      { numRuns: 100 },
    );
  });
});
