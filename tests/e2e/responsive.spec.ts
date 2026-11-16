import { expect, test } from "@playwright/test";
const supportedViewports = [
  { name: "mobile-small", width: 320, height: 720 },
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide-desktop", width: 1920, height: 1080 },
] as const;
test.describe("responsive, performance, and browser-support checks", () => {
  test("keeps the landing page contained and readable at every supported viewport", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    for (const viewport of supportedViewports) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator("#hero")).toBeVisible();
      await expect(page.locator("#architecture")).toBeVisible();
      const layout = await page.evaluate(() => ({
        bodyScrollWidth: document.body.scrollWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }));
      expect(layout.bodyScrollWidth, `${viewport.name} body overflow`).toBeLessThanOrEqual(
        layout.viewportWidth,
      );
      expect(layout.documentScrollWidth, `${viewport.name} document overflow`).toBeLessThanOrEqual(
        layout.viewportWidth,
      );
    }
  });
  test("keeps keyboard navigation and its visible focus indicator available on narrow screens", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuTrigger = page.getByRole("button", { name: "Open navigation menu" });
    await menuTrigger.focus();
    await expect(menuTrigger).toBeFocused();
    await expect(menuTrigger).toHaveCSS("outline-style", "solid");
    await menuTrigger.press("Enter");
    const mobileNavigation = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNavigation).toBeVisible();
    await expect(mobileNavigation.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(mobileNavigation).toBeHidden();
    await expect(menuTrigger).toBeFocused();
  });
  test("uses reduced-motion and observer-unavailable fallbacks without hiding content", async ({
    browser,
    baseURL,
  }) => {
    const reducedContext = await browser.newContext({ reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    try {
      await reducedPage.goto(baseURL ?? "http://localhost:3000/");
      await expect(reducedPage.getByTestId("faq-accordion")).toHaveAttribute(
        "data-reduced-motion",
        "true",
      );
      await expect(reducedPage.locator(".gemstone-network-path").first()).toHaveCSS(
        "animation-name",
        "none",
      );
      await expect(reducedPage.locator("[data-architecture-visual]")).toBeVisible();
      await expect(reducedPage.locator("[data-topology-explorer]")).toBeVisible();
    } finally {
      await reducedContext.close();
    }
    const observerFallbackContext = await browser.newContext();
    await observerFallbackContext.addInitScript(() => {
      Object.defineProperty(window, "IntersectionObserver", {
        configurable: true,
        value: undefined,
      });
    });
    const observerFallbackPage = await observerFallbackContext.newPage();
    try {
      await observerFallbackPage.goto(baseURL ?? "http://localhost:3000/");
      const navigation = observerFallbackPage.getByRole("navigation", {
        name: "Primary navigation",
      });
      await expect(navigation).toHaveAttribute("data-observer-state", "unavailable");
      await expect(navigation.getByRole("link", { name: "About" })).toHaveAttribute(
        "href",
        "#about",
      );
    } finally {
      await observerFallbackContext.close();
    }
  });
  test("bounds continuous visual work and defers optional external embeds", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("video, canvas")).toHaveCount(0);
    const embedAttributes = await page.locator("iframe").evaluateAll((frames) =>
      frames.map((frame) => ({
        loading: frame.getAttribute("loading"),
        src: frame.getAttribute("src"),
      })),
    );
    expect(embedAttributes.every((frame) => frame.loading === "lazy")).toBe(true);
    const animationNames = await page.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (animation): animation is CSSAnimation =>
            "animationName" in animation && animation.effect?.getTiming().iterations === Infinity,
        )
        .map((animation) => animation.animationName)
        .filter((name) => name.length > 0),
    );
    expect(
      animationNames.every((name) => name === "gemstone-breathe" || name === "gemstone-path-flow"),
    ).toBe(true);
    expect(animationNames.length).toBeGreaterThan(0);
    expect(animationNames.length).toBeLessThanOrEqual(12);
  });
});
