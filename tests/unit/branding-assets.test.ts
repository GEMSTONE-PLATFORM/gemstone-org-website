import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { assetConfig, brandingFallbackConfig } from "@/config/asset-config";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoot = join(repositoryRoot, "src");
const brandingRoot = join(repositoryRoot, "public", "branding");

function getSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return getSourceFiles(entryPath);
    return /\.(?:ts|tsx|js|jsx|css)$/.test(entry.name) ? [entryPath] : [];
  });
}

describe("branding and reference-asset boundaries", () => {
  it("keeps official asset locations and safe fallbacks in one configuration", () => {
    expect(assetConfig.logo).toBe("/branding/gemstone-logo.svg");
    expect(assetConfig.horizontalLogo).toBe("/branding/gemstone-logo-horizontal.svg");
    expect(assetConfig.mark).toBe("/branding/gemstone-mark.svg");
    expect(brandingFallbackConfig.wordmark).toBe("/branding/gemstone-wordmark-fallback.txt");
    expect(brandingFallbackConfig.mark).toBe("/branding/gemstone-mark-fallback.txt");

    expect(readFileSync(join(brandingRoot, "gemstone-wordmark-fallback.txt"), "utf8")).toBe(
      "GEMSTONE\n",
    );
    expect(readFileSync(join(brandingRoot, "gemstone-mark-fallback.txt"), "utf8")).toBe("G\n");
  });

  it("documents the reserved logo locations without creating logo artwork", () => {
    const brandingReadme = readFileSync(join(brandingRoot, "README.md"), "utf8");

    expect(brandingReadme).toContain("gemstone-logo.svg");
    expect(brandingReadme).toContain("gemstone-logo-horizontal.svg");
    expect(brandingReadme).toContain("gemstone-mark.svg");
    expect(brandingReadme).toContain("does not recreate, redraw, recolor");
  });

  it("keeps the source deck out of component imports and hard-coded branding paths", () => {
    const sourceFiles = getSourceFiles(sourceRoot);
    const sourceText = sourceFiles.map((filePath) => readFileSync(filePath, "utf8"));
    const sourceFilesWithDeckReference = sourceFiles.filter((filePath, index) =>
      /GEMSTONEInfo\.pptx|initial-images/i.test(sourceText[index] ?? ""),
    );
    const sourceFilesWithHardCodedBrandingPath = sourceFiles.filter(
      (filePath, index) =>
        filePath !== join(sourceRoot, "config", "asset-config.ts") &&
        /["'`]\/branding\//.test(sourceText[index] ?? ""),
    );

    expect(
      sourceFilesWithDeckReference.map((filePath) => relative(repositoryRoot, filePath)),
    ).toEqual([]);
    expect(
      sourceFilesWithHardCodedBrandingPath.map((filePath) => relative(repositoryRoot, filePath)),
    ).toEqual([]);
    expect(statSync(join(repositoryRoot, "initial-images", "GEMSTONEInfo.pptx")).isFile()).toBe(
      true,
    );
  });
});
