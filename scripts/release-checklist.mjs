import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const repositoryRoot = process.cwd();
const packageJsonPath = join(repositoryRoot, "package.json");
const outputDirectory = join(repositoryRoot, "out");
const sourceDirectory = join(repositoryRoot, "src");

function fail(message) {
  throw new Error(`Release checklist failed: ${message}`);
}

function readText(filePath) {
  return readFileSync(filePath, "utf8");
}

function collectFiles(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(filePath) : [filePath];
  });
}

function requireScript(packageJson, scriptName) {
  if (!packageJson.scripts?.[scriptName]) {
    fail(`required package script \"${scriptName}\" is missing.`);
  }
}

function runPackageScript(scriptName, label) {
  console.log(`\n[${label}] npm run ${scriptName}`);
  const isWindows = process.platform === "win32";
  const result = spawnSync(
    isWindows ? "cmd.exe" : "npm",
    isWindows ? ["/d", "/s", "/c", `npm run ${scriptName}`] : ["run", scriptName],
    {
      cwd: repositoryRoot,
      env: { ...process.env, CI: "1" },
      stdio: "inherit",
    },
  );

  if (result.error) {
    fail(`could not start ${label}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`${label} exited with status ${result.status ?? "unknown"}.`);
  }
}

function inspectStaticExport() {
  console.log("\n[Static export inspection] Checking release artifact and static-only boundaries");

  const indexPath = join(outputDirectory, "index.html");
  if (!existsSync(indexPath)) {
    fail("out/index.html is missing. Run the production static build before inspection.");
  }

  const exportedFiles = collectFiles(outputDirectory);
  if (!exportedFiles.some((filePath) => /[\\/]_next[\\/].+\.js$/u.test(filePath))) {
    fail("the static export contains no Next.js JavaScript asset.");
  }
  if (!exportedFiles.some((filePath) => /[\\/]_next[\\/].+\.css$/u.test(filePath))) {
    fail("the static export contains no CSS asset.");
  }

  const html = readText(indexPath);
  const requiredMarkup = [
    'id="main-content"',
    'id="hero"',
    'id="architecture"',
    'id="capabilities"',
    'id="faq"',
    'id="briefing"',
    'id="requestInformation"',
    "Government-Owned Open Source for Digital Engineering and Modeling &amp; Simulation",
    "What is GEMSTONE?",
    "data-architecture-visual",
    'data-visualization-mode="decorative"',
    "Briefing not configured",
    "Request Information form not connected",
    "Approved for Public Release. Distribution Unlimited.",
    "GEMSTONE | Government-Owned Digital Engineering and Modeling &amp; Simulation Ecosystem",
  ];

  for (const value of requiredMarkup) {
    if (!html.includes(value)) {
      fail(`the static export is missing required markup: ${value}`);
    }
  }

  const anchorTags = html.match(/<a\b[^>]*>/giu) ?? [];
  for (const anchorTag of anchorTags) {
    const href = anchorTag.match(/\bhref="([^"]*)"/iu)?.[1]?.trim() ?? "";
    if (!href) {
      fail(`the static export contains an anchor with an empty href: ${anchorTag}`);
    }

    if (href.startsWith("#") && !html.includes(`id="${href.slice(1)}"`)) {
      fail(`the static export contains an internal link without a target: ${href}`);
    }

    if (/\btarget="_blank"/iu.test(anchorTag)) {
      const rel = anchorTag.match(/\brel="([^"]*)"/iu)?.[1]?.split(/\s+/u) ?? [];
      if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
        fail(`the static export has an unsafe new-tab link: ${anchorTag}`);
      }
    }
  }

  const forbiddenPublicClaimPatterns = [
    /\bATO\b/iu,
    /\baccreditation\b/iu,
    /\bcertification\b/iu,
    /\bclassified[-\s]network\b/iu,
    /\bcommercial endorsement\b/iu,
    /\bsponsorship\b/iu,
    /\bpartnership\b/iu,
    /\bguaranteed availability\b/iu,
    /\bguaranteed performance\b/iu,
  ];
  const forbiddenClaim = forbiddenPublicClaimPatterns.find((pattern) => pattern.test(html));
  if (forbiddenClaim) {
    fail(`the static export contains an unsupported public-claim pattern: ${forbiddenClaim}`);
  }

  const applicationFiles = collectFiles(sourceDirectory);
  const runtimeRouteFiles = applicationFiles.filter((filePath) =>
    /[\\/]app[\\/].+[\\/]route\.(?:ts|tsx|js|jsx)$/u.test(filePath),
  );
  if (runtimeRouteFiles.length > 0) {
    fail(
      `static export cannot include route handlers: ${runtimeRouteFiles.map((path) => relative(repositoryRoot, path)).join(", ")}`,
    );
  }

  const forbiddenRuntimePattern =
    /["']next\/(?:headers|cookies)["']|["']use server["']|\bgetServerSideProps\b|\bgetInitialProps\b|\bserver action\b/iu;
  const runtimeDependencies = applicationFiles.filter(
    (filePath) =>
      /\.(?:ts|tsx|js|jsx)$/u.test(filePath) && forbiddenRuntimePattern.test(readText(filePath)),
  );
  if (runtimeDependencies.length > 0) {
    fail(
      `static export contains runtime-only application code: ${runtimeDependencies
        .map((path) => relative(repositoryRoot, path))
        .join(", ")}`,
    );
  }

  const nextConfigPath = join(repositoryRoot, "next.config.ts");
  if (!existsSync(nextConfigPath) || !/output:\s*["']export["']/u.test(readText(nextConfigPath))) {
    fail('next.config.ts must declare output: "export".');
  }

  console.log("Static export inspection passed.");
}

function main() {
  if (process.argv.includes("--inspect-static-export")) {
    inspectStaticExport();
    return;
  }

  if (!existsSync(packageJsonPath)) {
    fail("package.json is missing.");
  }

  const packageJson = JSON.parse(readText(packageJsonPath));
  const requiredScripts = [
    "lint",
    "typecheck",
    "format:check",
    "test:unit",
    "test:component",
    "test:a11y",
    "test:e2e:release",
    "build",
    "release:inspect",
  ];
  requiredScripts.forEach((scriptName) => requireScript(packageJson, scriptName));

  console.log("GEMSTONE release validation checklist");
  runPackageScript("lint", "Lint");
  runPackageScript("typecheck", "TypeScript validation");
  runPackageScript("format:check", "Formatting check");
  runPackageScript("test:unit", "Unit and property tests (including maintainability checks)");
  runPackageScript("test:component", "Component tests");
  runPackageScript("test:a11y", "Axe accessibility and keyboard checks");
  runPackageScript(
    "test:e2e:release",
    "Playwright integration, responsive, fallback, and export checks",
  );
  runPackageScript("build", "Production static build");
  runPackageScript("release:inspect", "Static export inspection");

  console.log(
    "\nRelease validation passed. Manual release-owner reviews remain required before publication.",
  );
}

try {
  main();
} catch (error) {
  console.error(`\n${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
