import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "320px", width: 320, height: 720, navigation: "mobile" },
  { name: "375px", width: 375, height: 812, navigation: "mobile" },
  { name: "768px", width: 768, height: 1024, navigation: "mobile" },
  { name: "1024px", width: 1024, height: 900, navigation: "desktop" },
  { name: "1440px", width: 1440, height: 900, navigation: "desktop" },
  { name: "1920px", width: 1920, height: 1080, navigation: "desktop" },
] as const;

test.describe("accessibility and responsive reflow matrix", () => {
  for (const viewport of viewports) {
    test(
      `preserves semantic content, reflow containment, and axe checks at ${viewport.name}`,
      { tag: "@a11y" },
      async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto("/");

        await expect(page.getByRole("banner")).toBeVisible();
        await expect(page.getByRole("main", { name: "GEMSTONE public website" })).toBeVisible();
        await expect(page.getByRole("contentinfo")).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(page.locator("main section")).toHaveCount(9);

        const dimensions = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
        }));
        expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.clientWidth);
        expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.clientWidth);

        const mobileMenu = page.getByRole("button", { name: "Open navigation menu" });
        const desktopNavigation = page.getByRole("navigation", { name: "Primary navigation" });
        if (viewport.navigation === "mobile") {
          await expect(mobileMenu).toBeVisible();
          await expect(desktopNavigation).toBeHidden();
        } else {
          await expect(mobileMenu).toBeHidden();
          await expect(desktopNavigation).toBeVisible();
        }

        const iframes = page.locator("iframe");
        await expect(page.locator("iframe[title]")).toHaveCount(await iframes.count());

        const newTabLinks = page.locator('a[target="_blank"]');
        for (const link of await newTabLinks.all()) {
          await expect(link).toHaveAttribute("aria-label", /opens in a new tab/i);
        }

        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
        expect(results.violations).toEqual([]);
      },
    );
  }

  test(
    "supports keyboard navigation, visible focus, mobile-menu focus return, FAQ, and architecture controls",
    { tag: "@a11y" },
    async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");

      const skipLink = page.getByRole("link", { name: "Skip to main content" });
      await skipLink.focus();
      await expect(skipLink).toBeFocused();
      await skipLink.press("Enter");
      await expect(page.getByRole("main")).toBeFocused();

      const menuButton = page.locator('[aria-controls="mobile-navigation"]');
      await menuButton.focus();
      await expect(menuButton).toBeFocused();
      await menuButton.press("Enter");

      const mobileNavigation = page.getByRole("navigation", { name: "Mobile navigation" });
      const firstMobileLink = mobileNavigation.getByRole("link", { name: "About" });
      await expect(menuButton).toHaveAccessibleName("Close navigation menu");
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");
      await expect(firstMobileLink).toBeFocused();
      await firstMobileLink.press("Escape");
      await expect(menuButton).toHaveAccessibleName("Open navigation menu");
      await expect(menuButton).toHaveAttribute("aria-expanded", "false");
      await expect(menuButton).toBeFocused();

      const faqControl = page.getByRole("button", { name: "What is GEMSTONE?" });
      await faqControl.focus();
      await expect(faqControl).toBeFocused();
      await faqControl.press("Space");
      await expect(faqControl).toHaveAttribute("aria-expanded", "true");

      const architectureControl = page.getByRole("button", { name: "Hub: GEMSTONE | HUB" });
      const architectureDetail = page.locator("[data-architecture-detail]");
      await architectureControl.focus();
      await expect(architectureControl).toBeFocused();
      await architectureControl.press("Enter");
      await expect(architectureControl).toHaveAttribute("aria-pressed", "true");
      await expect(architectureDetail).toContainText("Hub: GEMSTONE | HUB");
      await architectureControl.press("Escape");
      await expect(architectureDetail.getByRole("heading")).toHaveText("Hub, Node, and Client");
    },
  );

  test(
    "honors reduced motion while preserving readable, keyboard-operable content",
    { tag: "@a11y" },
    async ({ browser, baseURL }) => {
      const context = await browser.newContext({
        reducedMotion: "reduce",
        viewport: { width: 375, height: 812 },
      });
      const page = await context.newPage();

      try {
        await page.goto(baseURL ?? "http://localhost:3000/");

        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByRole("link", { name: "Request Information" })).toBeVisible();
        await expect(page.getByRole("button", { name: "What is GEMSTONE?" })).toBeVisible();
        await expect(page.locator("[data-architecture-visual]")).toBeVisible();
        const motionAnimationNames = await page
          .locator(".gemstone-motion")
          .evaluateAll((elements) =>
            elements.map((element) => getComputedStyle(element).animationName),
          );
        expect(motionAnimationNames.every((animationName) => animationName === "none")).toBe(true);
      } finally {
        await context.close();
      }
    },
  );

  test(
    "preserves landmarks, headings, static explanations, and integration fallbacks without JavaScript",
    { tag: "@a11y" },
    async ({ browser, baseURL }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 375, height: 812 },
      });
      const page = await context.newPage();

      try {
        await page.goto(baseURL ?? "http://localhost:3000/");

        await expect(page.getByRole("main", { name: "GEMSTONE public website" })).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(page.locator("[data-architecture-visual]")).toBeVisible();
        await expect(page.getByText("Briefing not configured")).toBeVisible();
        await expect(page.getByText("Request Information form not connected")).toBeVisible();
        await expect(page.locator("iframe")).toHaveCount(0);
      } finally {
        await context.close();
      }
    },
  );
});
