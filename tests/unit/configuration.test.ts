import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  assetConfig,
  briefingConfig,
  BRIEFING_URL_PLACEHOLDER,
  footerNavigationItems,
  integrationConfig,
  isConfiguredIntegrationUrl,
  motionConfig,
  navigationItems,
  navigationTargetIds,
  publicReleaseConfig,
  resolveConfiguredIntegrationUrl,
  seoConfig,
  siteConfig,
  siteSections,
} from "@/config";

function getSectionSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return getSectionSourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

describe("centralized site configuration", () => {
  it("defines the approved metadata and public-release defaults", () => {
    expect(seoConfig.title).toBe(
      "GEMSTONE | Government-Owned Digital Engineering and Modeling & Simulation Ecosystem",
    );
    expect(seoConfig.description).toContain(
      "GEMSTONE connects tools, data, compute, and secure digital environments",
    );
    expect(publicReleaseConfig).toEqual({
      enabled: true,
      statement: "Approved for Public Release. Distribution Unlimited.",
    });
    expect(siteConfig.publicReleaseStatement).toBe(publicReleaseConfig.statement);
  });

  it("keeps navigation target IDs unique and enabled", () => {
    expect(new Set(navigationTargetIds).size).toBe(navigationTargetIds.length);
    expect(navigationItems).toHaveLength(7);

    for (const targetId of navigationTargetIds) {
      expect(siteSections[targetId]).toBe(true);
    }

    expect(footerNavigationItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Contact", href: "#requestInformation" }),
      ]),
    );
  });

  it("keeps branding and motion behavior in configuration", () => {
    expect(assetConfig).toMatchObject({
      logo: "/branding/gemstone-logo.svg",
      horizontalLogo: "/branding/gemstone-logo-horizontal.svg",
      mark: "/branding/gemstone-mark.svg",
    });
    expect(motionConfig).toMatchObject({
      intensity: "standard",
      enableContinuousBackgroundMotion: true,
      disableContinuousMotionOnSmallScreens: true,
    });
  });

  it("treats missing, whitespace, and placeholder integration values as unavailable", () => {
    for (const value of [
      undefined,
      "",
      " \t\n",
      BRIEFING_URL_PLACEHOLDER,
      ` ${BRIEFING_URL_PLACEHOLDER} `,
    ]) {
      expect(resolveConfiguredIntegrationUrl(value, BRIEFING_URL_PLACEHOLDER)).toBeUndefined();
      expect(isConfiguredIntegrationUrl(value, BRIEFING_URL_PLACEHOLDER)).toBe(false);
    }

    expect(
      resolveConfiguredIntegrationUrl(
        " https://example.com/briefing.pdf ",
        BRIEFING_URL_PLACEHOLDER,
      ),
    ).toBe("https://example.com/briefing.pdf");
    expect(briefingConfig.url).toBe(BRIEFING_URL_PLACEHOLDER);
    expect(integrationConfig.briefing.url).toBe(briefingConfig.url);
  });

  it("does not duplicate centralized URLs or metadata in section components", () => {
    const sectionFiles = getSectionSourceFiles(
      join(process.cwd(), "src", "components", "sections"),
    );
    const centralizedValues = [
      seoConfig.title,
      seoConfig.description,
      briefingConfig.url,
      "NEXT_PUBLIC_MICROSOFT_FORM_URL",
    ];

    for (const file of sectionFiles) {
      const source = readFileSync(file, "utf8");
      for (const value of centralizedValues) {
        expect(source).not.toContain(value);
      }
    }
  });
});
