import { expect, test, type Locator, type Page } from "@playwright/test";

const briefingUrl = "https://briefing.example.test/gemstone-briefing.pdf";
const formUrl = "https://forms.example.test/request-information";

async function holdConfiguredEmbedRequests(page: Page) {
  await page.route(briefingUrl, () => new Promise<void>(() => undefined));
  await page.route(formUrl, () => new Promise<void>(() => undefined));
}

async function openFixture(page: Page) {
  await holdConfiguredEmbedRequests(page);
  await page.goto("/integration-test", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("integration-fixture-ready")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
}

function expectSafeNewTabLink(link: Locator) {
  return expect(link).toHaveAttribute("rel", "noopener noreferrer");
}

test.describe("briefing and request-information integration flows", () => {
  test("omits iframes for blank and placeholder briefing/form configuration", async ({ page }) => {
    await openFixture(page);

    for (const fixture of [
      page.getByTestId("blank-briefing"),
      page.getByTestId("placeholder-briefing"),
      page.getByTestId("blank-form"),
      page.getByTestId("placeholder-form"),
    ]) {
      await expect(fixture.locator("iframe")).toHaveCount(0);
    }

    await expect(page.getByTestId("blank-briefing").getByRole("status")).toContainText(
      "Briefing not configured",
    );
    await expect(page.getByTestId("placeholder-briefing").getByRole("status")).toContainText(
      "Briefing not configured",
    );
    await expect(page.getByTestId("blank-form").getByRole("status")).toContainText(
      "Request Information form not connected",
    );
    await expect(page.getByTestId("placeholder-form").getByRole("status")).toContainText(
      "Request Information form not connected",
    );
    await expect(page.getByTestId("blank-form")).toContainText("Privacy notice placeholder");
    await expect(page.getByTestId("placeholder-form")).toContainText("Privacy notice placeholder");
  });

  test("renders configured external embeds lazily, preserves recovery links, and keeps form data external", async ({
    page,
  }) => {
    await openFixture(page);

    const briefing = page.getByTestId("configured-briefing").getByTestId("briefing-viewer");
    const form = page.getByTestId("configured-form").locator("[data-form-embed-state]");
    const briefingFrame = briefing.getByTitle("Configured GEMSTONE Briefing");
    const formFrame = form.getByTitle("Configured Request Information form");

    await expect(briefing).toHaveAttribute("data-embed-state", "loading");
    await expect(form).toHaveAttribute("data-form-embed-state", "idle");
    await expect(briefingFrame).toHaveAttribute("src", briefingUrl);
    await expect(formFrame).toHaveAttribute("src", formUrl);
    await expect(briefingFrame).toHaveAttribute("loading", "lazy");
    await expect(formFrame).toHaveAttribute("loading", "lazy");
    await expect(briefingFrame).toHaveAttribute("title", "Configured GEMSTONE Briefing");
    await expect(formFrame).toHaveAttribute("title", "Configured Request Information form");

    const briefingView = briefing.getByRole("link", {
      name: "View Briefing (opens in a new tab)",
    });
    const briefingDownload = briefing.getByRole("link", {
      name: "Download Briefing (opens in a new tab)",
    });
    const formRecovery = form.getByRole("link", {
      name: "Open Request Information Form (opens in a new tab)",
    });
    await expect(briefingView).toHaveAttribute("href", briefingUrl);
    await expect(briefingDownload).toHaveAttribute("href", briefingUrl);
    await expect(formRecovery).toHaveAttribute("href", formUrl);
    await expectSafeNewTabLink(briefingView);
    await expectSafeNewTabLink(briefingDownload);
    await expectSafeNewTabLink(formRecovery);

    await expect(form.locator("form, input, textarea, select, button")).toHaveCount(0);
    await expect(form).toContainText("Privacy notice placeholder");

    await briefingFrame.dispatchEvent("load");
    await formFrame.dispatchEvent("load");
    await expect(briefing).toHaveAttribute("data-embed-state", "loaded");
    await expect(form).toHaveAttribute("data-form-embed-state", "loaded");
    await expect(briefing).toContainText("Embedded briefing loaded.");
    await expect(form).toContainText("Form available");
  });

  test("provides blocked, unsupported, and timeout recovery without cross-origin policy claims", async ({
    page,
  }) => {
    await openFixture(page);

    const briefing = page.getByTestId("configured-briefing").getByTestId("briefing-viewer");
    const form = page.getByTestId("configured-form").locator("[data-form-embed-state]");
    await briefing.getByTitle("Configured GEMSTONE Briefing").dispatchEvent("error");
    await form.getByTitle("Configured Request Information form").dispatchEvent("error");

    await expect(briefing).toHaveAttribute("data-embed-state", "blocked");
    await expect(form).toHaveAttribute("data-form-embed-state", "blocked");
    await expect(briefing.getByRole("status")).toContainText("Embedded briefing unavailable");
    await expect(form.getByRole("status")).toContainText(
      "Request Information form unavailable here",
    );
    await expect(
      briefing.getByRole("link", { name: "View Briefing (opens in a new tab)" }).first(),
    ).toBeVisible();
    await expect(
      form
        .getByRole("link", { name: "Open Request Information Form (opens in a new tab)" })
        .first(),
    ).toBeVisible();
    await expect(briefing).not.toContainText(/CSP|X-Frame-Options|cross-origin framing policy/i);

    const unsupported = page.getByTestId("unsupported-briefing").getByTestId("briefing-viewer");
    await expect(unsupported).toHaveAttribute("data-embed-state", "unsupported");
    await expect(unsupported.locator("iframe")).toHaveCount(0);
    await expect(unsupported.getByRole("status")).toContainText(
      "Embedded briefing format unavailable",
    );
    await expect(
      unsupported.getByRole("link", { name: "Open in New Tab (opens in a new tab)" }).first(),
    ).toBeVisible();
  });

  test("recovers from configured embed timeouts with external actions", async ({ page }) => {
    await page.clock.install();
    await openFixture(page);

    await page.clock.fastForward(8_000);

    const briefing = page.getByTestId("configured-briefing").getByTestId("briefing-viewer");
    const form = page.getByTestId("configured-form").locator("[data-form-embed-state]");
    await expect(briefing).toHaveAttribute("data-embed-state", "blocked");
    await expect(briefing).toHaveAttribute("data-embed-failure", "timeout");
    await expect(form).toHaveAttribute("data-form-embed-state", "blocked");
    await expect(briefing).toContainText("did not finish loading");
    await expect(
      briefing.getByRole("link", { name: "View Briefing (opens in a new tab)" }).first(),
    ).toBeVisible();
    await expect(
      form
        .getByRole("link", { name: "Open Request Information Form (opens in a new tab)" })
        .first(),
    ).toBeVisible();
  });
});
