import { expect, test, type Page } from "@playwright/test";

async function expectNoEmptyOrMissingTargets(page: Page) {
  const invalidInteractions = await page.locator("a[href]").evaluateAll((links) =>
    links.flatMap((link) => {
      const anchor = link as HTMLAnchorElement;
      const href = anchor.getAttribute("href")?.trim() ?? "";
      const label =
        anchor.textContent?.trim() ||
        anchor.getAttribute("aria-label")?.trim() ||
        anchor.querySelector("img")?.getAttribute("alt")?.trim() ||
        "";

      if (!href || !label) return [`empty link: ${href || "missing href"}`];
      if (href.startsWith("#") && document.getElementById(href.slice(1)) === null) {
        return [`missing target: ${href}`];
      }

      return [];
    }),
  );

  expect(invalidInteractions).toEqual([]);
}

test.describe("fallback resilience", () => {
  test("preserves content and branding recovery when the laptop logo asset fails", async ({
    page,
  }) => {
    await page.route("**/branding/gemstone-logo-horizontal.svg", (route) => route.abort());
    await page.goto("/");

    const logoFallback = page.getByRole("img", { name: "GEMSTONE" });
    await expect(logoFallback).toHaveAttribute("data-logo-state", "fallback");
    await expect(logoFallback).toHaveText("GEMSTONE");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-visualization-mode=decorative]")).toBeVisible();
    await expect(page.locator("[data-architecture-visual]")).toBeVisible();
    await expectNoEmptyOrMissingTargets(page);
  });

  test("keeps understandable integration and architecture content without JavaScript", async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();

    try {
      await page.goto(baseURL ?? "http://localhost:3100/");

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByText("Briefing not configured")).toBeVisible();
      await expect(page.locator("[data-architecture-visual]")).toBeVisible();
      await expect(page.getByText("Modeling and Simulation Matrix")).toHaveCount(0);
      await expect(page.getByText("Architecture legend")).toHaveCount(0);
      await expectNoEmptyOrMissingTargets(page);

      const visibleText = await page.locator("body").innerText();
      expect(visibleText).not.toMatch(
        /GEMSTONE_BRIEFING_URL_GOES_HERE|MICROSOFT_FORM_URL|api[_-]?key|authorization|accreditation|\bATO\b/i,
      );
    } finally {
      await context.close();
    }
  });

  test("preserves interaction outcomes and decorative visuals with reduced motion", async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();

    try {
      await page.goto(baseURL ?? "http://localhost:3100/");

      const accordion = page.getByTestId("faq-accordion");
      await expect(accordion).toHaveAttribute("data-reduced-motion", "true");
      await expect(page.locator("[data-visualization-mode=decorative]")).toBeVisible();
      await expect(page.locator("[data-architecture-visual]")).toBeVisible();

      const question = page.getByRole("button", { name: "What is GEMSTONE?" });
      await question.press("Enter");
      await expect(question).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#faq-panel-what-is-gemstone")).toBeVisible();
      await expectNoEmptyOrMissingTargets(page);
    } finally {
      await context.close();
    }
  });
});
