import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("accessibility smoke checks", () => {
  test(
    "the landing page exposes its primary landmark and heading",
    { tag: "@a11y" },
    async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

      const skipLink = page.getByRole("link", { name: "Skip to main content" });
      await expect(skipLink).toBeAttached();
      await skipLink.focus();
      await expect(skipLink).toBeFocused();
      await skipLink.press("Enter");
      await expect(page.getByRole("main")).toBeFocused();

      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

      expect(results.violations).toEqual([]);
    },
  );

  test(
    "checks HeroSection and AboutSection labels and approved copy",
    { tag: "@a11y" },
    async ({ page }) => {
      await page.goto("/");

      const hero = page.getByRole("region", {
        name: "Government-Owned Open Source for Digital Engineering and Modeling & Simulation",
      });
      const about = page.getByRole("region", { name: "What is GEMSTONE?" });

      await expect(hero).toBeVisible();
      await expect(about).toBeVisible();
      await expect(hero.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        hero.getByText(
          "GEMSTONE empowers organizations to build, publish, discover, and integrate tools, data, and compute across secure environments.",
        ),
      ).toBeVisible();
      await expect(
        about.getByText(
          "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
        ),
      ).toBeVisible();
      await expect(hero.getByRole("link", { name: "Request Information" })).toHaveAttribute(
        "href",
        "#requestInformation",
      );
      await expect(hero.getByRole("link", { name: "View Briefing" })).toHaveAttribute(
        "href",
        "#briefing",
      );
      await expect(hero.locator("[data-visualization-mode=decorative]")).toBeVisible();
      await expect(
        about.getByRole("list", { name: "GEMSTONE relationship elements" }),
      ).toBeVisible();

      const results = await new AxeBuilder({ page })
        .include(["#hero", "#about"])
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    },
  );

  test(
    "checks architecture keyboard controls, mobile network layout, and accessibility",
    { tag: "@a11y" },
    async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");

      const architecture = page.getByRole("region", { name: "Architecture" });
      const entityControls = architecture.locator("button[data-entity-id]");
      const detailPanel = architecture.locator("[data-architecture-detail]");

      await expect(architecture).toBeVisible();
      await expect(entityControls).toHaveCount(5);
      await expect(architecture.locator("[data-architecture-visual]")).toBeVisible();
      await expect(architecture.getByText("Architecture legend")).toHaveCount(0);
      await expect(architecture.getByText("Readable relationship list")).toHaveCount(0);

      const hub = architecture.getByRole("button", { name: "Hub: GEMSTONE | HUB" });
      await expect(hub).toHaveAttribute("aria-controls", "architecture-detail");
      await expect(hub).toHaveAttribute("aria-pressed", "false");
      await hub.focus();
      await hub.press("Enter");
      await expect(hub).toHaveAttribute("aria-pressed", "true");
      await expect(detailPanel).toContainText("Hub: GEMSTONE | HUB");
      await expect(detailPanel).toContainText("service and connection point");
      await hub.press("Escape");
      await expect(detailPanel.getByRole("heading")).toHaveText("Hub, Node, and Client");

      await expect(architecture.getByRole("heading", { name: "THE M&S ECOSYSTEM" })).toBeVisible();
      await expect(architecture.getByRole("heading", { name: "Benefits" })).toBeVisible();

      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(entityControls).toHaveCount(5);

      // Firefox completes this same page-level axe scan in accessibility-responsive.spec.ts.
      // Running a second, scoped scan after this interaction crashes its browser process.
      if (test.info().project.name !== "firefox") {
        const results = await new AxeBuilder({ page })
          .include(["#architecture"])
          .withTags(["wcag2a", "wcag2aa"])
          .disableRules(["color-contrast"])
          .analyze();

        expect(results.violations).toEqual([]);
      }
    },
  );

  test(
    "checks focusability, names, roles, values, and contrast rules",
    { tag: "@a11y" },
    async ({ page }) => {
      await page.setContent(`
        <html lang="en">
          <head>
            <title>Accessibility fixture</title>
            <style>
              html, body { background: #050b15; color: #f8fafc; }
              body { margin: 0; font: 16px Arial, sans-serif; }
              a { color: #7ee0ff; }
              button { background: #0f2137; border: 1px solid #7ee0ff; color: #f8fafc; padding: 0.5rem; }
            </style>
          </head>
          <body>
            <main id="main-content" aria-labelledby="page-title">
          <h1 id="page-title">Accessibility fixture</h1>
          <a href="#main-content" aria-label="Skip to main content">Skip to content</a>
          <button type="button" aria-expanded="false" aria-controls="details">Show details</button>
          <section id="details" role="region" aria-labelledby="details-title">
            <h2 id="details-title">Details</h2>
          </section>
            </main>
          </body>
        </html>
      `);

      const skipLink = page.getByRole("link", { name: "Skip to main content" });
      const toggle = page.getByRole("button", { name: "Show details" });

      await expect(skipLink).toBeVisible();
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toHaveAttribute("aria-controls", "details");
      await expect(page.getByRole("region", { name: "Details" })).toBeVisible();

      await skipLink.focus();
      await expect(skipLink).toBeFocused();
      await toggle.focus();
      await expect(toggle).toBeFocused();

      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

      expect(results.violations).toEqual([]);
      expect(results.incomplete.some(({ id }) => id === "color-contrast")).toBe(false);
    },
  );
});
