import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const approvedFaqItems = [
  {
    id: "what-is-gemstone",
    question: "What is GEMSTONE?",
    answer:
      "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
  },
  {
    id: "who-can-use-gemstone",
    question: "Who can use GEMSTONE?",
    answer: "Anyone in the Department of War plus industry, academic, and international partners.",
  },
  {
    id: "what-are-gemstones-capabilities",
    question: "What are GEMSTONE's capabilities?",
    answer:
      "Enables scalable adoption through connected environments\nProtects controlled proprietary data\nProvides marketplace integration for tools\nIncludes CI/CD-style data transformation",
  },
  {
    id: "what-makes-gemstone-different",
    question: "What makes GEMSTONE different?",
    answer:
      "Government ownership, open-source architecture, air-gap deployment support, advanced security layers, SDK extensibility, rapid application deployment, distributed simulation capability, and hardened development environments.",
  },
] as const;

test.describe("FAQSection integration", () => {
  test(
    "FAQSection renders approved content with linked, multi-open pointer and keyboard controls",
    { tag: "@a11y" },
    async ({ page }) => {
      await page.goto("/");

      const faq = page.locator("#faq");
      await expect(faq).toBeVisible();

      for (const item of approvedFaqItems) {
        const control = faq.getByRole("button", { name: item.question });
        const panel = faq.locator(`#faq-panel-${item.id}`);

        await expect(control).toHaveAttribute("id", `faq-control-${item.id}`);
        await expect(control).toHaveAttribute("aria-controls", `faq-panel-${item.id}`);
        await expect(control).toHaveAttribute("aria-expanded", "false");
        await expect(panel).toHaveAttribute("role", "region");
        await expect(panel).toHaveAttribute("aria-labelledby", `faq-control-${item.id}`);
        await expect(panel).toHaveAttribute("hidden", "");
        await expect(panel).toContainText(item.answer);
      }

      const first = faq.getByRole("button", { name: approvedFaqItems[0].question });
      const second = faq.getByRole("button", { name: approvedFaqItems[1].question });
      const firstPanel = faq.locator(`#faq-panel-${approvedFaqItems[0].id}`);
      const secondPanel = faq.locator(`#faq-panel-${approvedFaqItems[1].id}`);

      await first.hover();
      await expect(first).toHaveAttribute("aria-expanded", "false");
      await expect(firstPanel).toHaveAttribute("hidden", "");

      await first.click();
      await second.click();
      await expect(first).toHaveAttribute("aria-expanded", "true");
      await expect(second).toHaveAttribute("aria-expanded", "true");
      await expect(firstPanel).not.toHaveAttribute("hidden");
      await expect(secondPanel).not.toHaveAttribute("hidden");

      await first.focus();
      await expect(first).toBeFocused();
      await first.press("Enter");
      await expect(first).toHaveAttribute("aria-expanded", "false");
      await first.press(" ");
      await expect(first).toHaveAttribute("aria-expanded", "true");
      await expect(second).toHaveAttribute("aria-expanded", "true");

      const results = await new AxeBuilder({ page })
        .include("#faq")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    },
  );

  test(
    "FAQSection remains operable with reduced motion",
    { tag: "@a11y" },
    async ({ browser, baseURL }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();

      try {
        await page.goto(baseURL ?? "http://localhost:3000/");

        const accordion = page.getByTestId("faq-accordion");
        const question = page.getByRole("button", { name: approvedFaqItems[0].question });

        await expect(accordion).toHaveAttribute("data-reduced-motion", "true");
        await question.focus();
        await expect(question).toBeFocused();
        await question.press("Space");
        await expect(question).toHaveAttribute("aria-expanded", "true");
        await expect(page.locator(`#faq-panel-${approvedFaqItems[0].id}`)).toBeVisible();
      } finally {
        await context.close();
      }
    },
  );

  test(
    "FAQSection preserves approved static fallback markup without JavaScript",
    { tag: "@a11y" },
    async ({ browser, baseURL }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();

      try {
        await page.goto(baseURL ?? "http://localhost:3000/");

        const faq = page.locator("#faq");
        await expect(
          faq.getByRole("heading", { name: "Frequently Asked Questions" }),
        ).toBeVisible();

        for (const item of approvedFaqItems) {
          const control = faq.locator(`#faq-control-${item.id}`);
          const panel = faq.locator(`#faq-panel-${item.id}`);

          await expect(control).toHaveAttribute("aria-controls", `faq-panel-${item.id}`);
          await expect(panel).toHaveAttribute("aria-labelledby", `faq-control-${item.id}`);
          await expect(panel).toHaveAttribute("hidden", "");
          await expect(panel).toContainText(item.answer);
        }
      } finally {
        await context.close();
      }
    },
  );
});
