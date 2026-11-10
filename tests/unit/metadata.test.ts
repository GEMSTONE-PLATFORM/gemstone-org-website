import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { assetConfig, siteConfig } from "@/config";
import { buildMetadata } from "@/lib/metadata";

describe("buildMetadata", () => {
  it("maps approved title, description, and available brand configuration", () => {
    expect(buildMetadata(siteConfig, assetConfig)).toEqual({
      title: siteConfig.title,
      description: siteConfig.description,
      icons: { icon: assetConfig.mark },
    });
  });

  it("emits configured canonical and Open Graph image metadata", () => {
    const metadata = buildMetadata(
      {
        ...siteConfig,
        canonicalUrl: "https://gemstone.example.gov/",
        openGraphImage: "/images/approved-open-graph.png",
        favicon: "/branding/approved-favicon.svg",
      },
      assetConfig,
    );

    expect(metadata).toMatchObject({
      title: siteConfig.title,
      description: siteConfig.description,
      alternates: { canonical: "https://gemstone.example.gov/" },
      openGraph: { images: [{ url: "/images/approved-open-graph.png" }] },
      icons: { icon: "/branding/approved-favicon.svg" },
    });
  });

  it("omits optional metadata when configuration is absent or blank", () => {
    const metadata = buildMetadata(
      {
        ...siteConfig,
        canonicalUrl: "  ",
        openGraphImage: "\t",
        favicon: "",
      },
      {
        ...assetConfig,
        mark: " ",
        openGraphImage: "",
      },
    );

    expect(metadata).toEqual({
      title: siteConfig.title,
      description: siteConfig.description,
    });
  });
});

const approvedTextArbitrary = fc
  .string({ minLength: 1, maxLength: 80 })
  .filter((value) => value.trim().length > 0);
const approvedAssetPathArbitrary = approvedTextArbitrary.map(
  (value) => `/approved/${encodeURIComponent(value)}.svg`,
);
const approvedOpenGraphPathArbitrary = approvedTextArbitrary.map(
  (value) => `/approved/${encodeURIComponent(value)}.png`,
);
const approvedCanonicalUrlArbitrary = approvedTextArbitrary.map(
  (value) => `https://gemstone.example.gov/${encodeURIComponent(value)}`,
);

describe("buildMetadata property coverage", () => {
  // **Validates: Requirements 17.1, 17.4, 17.5, 17.6, 17.7**
  it("Property 14: metadata mirrors approved configuration", () => {
    fc.assert(
      fc.property(
        fc.record({
          title: approvedTextArbitrary,
          description: approvedTextArbitrary,
          canonicalUrl: fc.option(approvedCanonicalUrlArbitrary, { nil: undefined }),
          openGraphImage: fc.option(approvedOpenGraphPathArbitrary, { nil: undefined }),
          favicon: fc.option(approvedAssetPathArbitrary, { nil: undefined }),
          assetOpenGraphImage: fc.option(approvedOpenGraphPathArbitrary, { nil: undefined }),
          assetMark: fc.oneof(approvedAssetPathArbitrary, fc.constant(" ")),
        }),
        ({
          title,
          description,
          canonicalUrl,
          openGraphImage,
          favicon,
          assetOpenGraphImage,
          assetMark,
        }) => {
          const metadata = buildMetadata(
            {
              ...siteConfig,
              title,
              description,
              canonicalUrl,
              openGraphImage,
              favicon,
            },
            {
              ...assetConfig,
              mark: assetMark,
              openGraphImage: assetOpenGraphImage,
            },
          );
          const expectedOpenGraphImage = openGraphImage ?? assetOpenGraphImage;
          const expectedFavicon = favicon ?? (assetMark.trim() || undefined);

          expect(metadata.title).toBe(title);
          expect(metadata.description).toBe(description);

          if (canonicalUrl) {
            expect(metadata.alternates).toEqual({ canonical: canonicalUrl });
          } else {
            expect(metadata).not.toHaveProperty("alternates");
          }

          if (expectedOpenGraphImage) {
            expect(metadata.openGraph).toEqual({
              images: [{ url: expectedOpenGraphImage }],
            });
          } else {
            expect(metadata).not.toHaveProperty("openGraph");
          }

          if (expectedFavicon) {
            expect(metadata.icons).toEqual({ icon: expectedFavicon });
          } else {
            expect(metadata).not.toHaveProperty("icons");
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
