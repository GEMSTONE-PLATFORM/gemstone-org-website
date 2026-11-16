import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import {
  assetConfig,
  briefingConfig,
  integrationConfig,
  navigationItems,
  siteConfig,
} from "@/config";
import { siteManifest } from "@/content/site-manifest";

const siteContent = siteManifest.content;

const sectionDirectory = join(process.cwd(), "src", "components", "sections");

function getSourceFiles(directory: string): readonly string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return getSourceFiles(path);

    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

function collectStrings(value: unknown): readonly string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (!value || typeof value !== "object") return [];

  return Object.values(value).flatMap(collectStrings);
}

function sourceByFile(): ReadonlyMap<string, string> {
  return new Map(
    getSourceFiles(sectionDirectory).map((filePath) => [filePath, readFileSync(filePath, "utf8")]),
  );
}

function relativePaths(paths: readonly string[]): readonly string[] {
  return paths.map((filePath) => relative(process.cwd(), filePath));
}

describe("section maintainability boundaries", () => {
  it("keeps approved public claims in typed content rather than section source", () => {
    const approvedClaims = [...new Set(collectStrings(siteContent))].filter(
      (value) => value.length >= 40,
    );
    const filesWithDuplicatedClaims = [...sourceByFile()].flatMap(([filePath, source]) =>
      approvedClaims.some((claim) => source.includes(claim)) ? [filePath] : [],
    );

    expect(relativePaths(filesWithDuplicatedClaims)).toEqual([]);
  });

  it("keeps configuration values, integration URLs, metadata, and assets out of sections", () => {
    const configuredValues = [
      siteConfig.title,
      siteConfig.description,
      siteConfig.favicon,
      briefingConfig.url,
      integrationConfig.microsoftFormUrl,
      ...Object.values(assetConfig),
    ].filter((value): value is string => Boolean(value?.trim()));
    const filesWithDuplicatedConfiguration = [...sourceByFile()].flatMap(([filePath, source]) =>
      configuredValues.some((value) => source.includes(value)) ? [filePath] : [],
    );

    expect(relativePaths(filesWithDuplicatedConfiguration)).toEqual([]);
  });

  it("keeps navigation targets, raw asset paths, external URLs, and raw colors centralized", () => {
    const forbiddenPatterns = [
      /href\s*=\s*\{?\s*["']#[\w-]+/u,
      /(?:https?:)?\/\/[^\s"'`]+/u,
      /\/(?:branding|images|documents)\/[\w./-]+/u,
      /process\.env\.NEXT_PUBLIC_/u,
      /#[\da-f]{3,8}\b/iu,
      /rgba?\s*\(/iu,
      /hsla?\s*\(/iu,
      /(?:bg|border|text|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/u,
    ] as const;
    const configuredNavigationTargets = navigationItems.map((item) => item.href);
    const violations = [...sourceByFile()].flatMap(([filePath, source]) => {
      const duplicatedTarget = configuredNavigationTargets.some((target) =>
        source.includes(target),
      );
      const hasForbiddenValue = forbiddenPatterns.some((pattern) => pattern.test(source));

      return duplicatedTarget || hasForbiddenValue ? [filePath] : [];
    });

    expect(relativePaths(violations)).toEqual([]);
  });
});
