import axe from "axe-core";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FAQSection } from "@/components/sections/FAQSection";
import { siteManifest } from "@/content/site-manifest";

const faqItems = siteManifest.content.faq;
import { assertStaticFallback } from "../helpers/component-test-helpers";

const firstItem = faqItems[0];
const secondItem = faqItems[1];

describe("FAQSection and Accordion", () => {
  it("renders every approved typed FAQ item with a stable control and answer-panel relationship", () => {
    render(<FAQSection items={faqItems} />);

    expect(screen.getByRole("region", { name: "Frequently Asked Questions" })).toHaveClass(
      "min-h-[calc(100svh-5rem)]",
    );
    expect(screen.getByTestId("faq-accordion")).toHaveClass("w-full", "max-w-none");

    for (const item of faqItems) {
      const question = screen.getByRole("button", { name: item.question });
      const panelId = `faq-panel-${item.id}`;
      const panel = document.getElementById(panelId);

      expect(question).toHaveAttribute("id", `faq-control-${item.id}`);
      expect(question).toHaveAttribute("aria-controls", panelId);
      expect(question).toHaveAttribute("aria-expanded", "false");
      expect(panel).toHaveAttribute("role", "region");
      expect(panel).toHaveAttribute("aria-labelledby", `faq-control-${item.id}`);
      expect(panel).toHaveAttribute("aria-hidden", "true");
      expect(panel).toHaveAttribute("hidden", "");
      expect(panel?.textContent).toBe(item.answer);
    }
  });

  it("uses pointer activation without revealing answers on hover and keeps multiple answers open", () => {
    render(<FAQSection items={faqItems} />);

    const firstQuestion = screen.getByRole("button", { name: firstItem.question });
    const secondQuestion = screen.getByRole("button", { name: secondItem.question });
    const firstPanel = document.getElementById(`faq-panel-${firstItem.id}`);
    const secondPanel = document.getElementById(`faq-panel-${secondItem.id}`);

    fireEvent.mouseEnter(firstQuestion);
    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    expect(firstPanel).toHaveAttribute("hidden", "");

    fireEvent.click(firstQuestion);
    fireEvent.click(secondQuestion);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    expect(firstPanel).toHaveAttribute("aria-hidden", "false");
    expect(firstPanel).not.toHaveAttribute("hidden");
    expect(secondPanel).toHaveAttribute("aria-hidden", "false");
    expect(secondPanel).not.toHaveAttribute("hidden");

    fireEvent.click(firstQuestion);
    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    expect(firstPanel).toHaveAttribute("hidden", "");
    expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
  });

  it("supports focused Enter and Space activation with visible focus styling", () => {
    render(<FAQSection items={faqItems} />);
    const question = screen.getByRole("button", { name: firstItem.question });

    question.focus();
    expect(document.activeElement).toBe(question);
    expect(question.className).toContain("focus-visible:outline");

    fireEvent.keyDown(question, { key: "Enter" });
    expect(question).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(question, { key: " " });
    expect(question).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps every approved question, answer, and controlled-panel relationship in static fallback markup", () => {
    const markup = renderToStaticMarkup(<FAQSection items={faqItems} />);
    const root = document.createElement("div");
    root.innerHTML = markup;

    assertStaticFallback(root, {
      requiredText: faqItems.flatMap((item) => [item.question, item.answer]),
      requiredSelectors: faqItems.flatMap((item) => [
        `#faq-control-${item.id}`,
        `#faq-panel-${item.id}`,
      ]),
    });

    for (const item of faqItems) {
      const control = root.querySelector(`#faq-control-${item.id}`);
      const panel = root.querySelector(`#faq-panel-${item.id}`);

      expect(control).toHaveAttribute("aria-controls", `faq-panel-${item.id}`);
      expect(panel).toHaveAttribute("aria-labelledby", `faq-control-${item.id}`);
      expect(panel).toHaveAttribute("hidden", "");
      expect(panel?.textContent).toBe(item.answer);
    }
  });

  it("keeps expansion correct and animation-independent when reduced motion is active", () => {
    render(<FAQSection items={faqItems} reducedMotion />);
    const accordion = screen.getByTestId("faq-accordion");
    const question = screen.getByRole("button", { name: firstItem.question });

    expect(accordion).toHaveAttribute("data-motion", "reduced");
    expect(accordion).toHaveAttribute("data-reduced-motion", "true");

    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: firstItem.question })).toBeVisible();
  });

  it("has no axe violations for the FAQ region", async () => {
    const { container } = render(<FAQSection items={faqItems} />);
    const region = container.querySelector("#faq");
    expect(region).toBeInTheDocument();

    const results = await axe.run(region as HTMLElement, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    });

    expect(results.violations).toEqual([]);
  });
});
