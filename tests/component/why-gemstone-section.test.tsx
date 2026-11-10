import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhyGemstoneSection } from "@/components/sections/section-renderers";
import { whyGemstoneItems } from "@/content/site-content";

describe("WhyGemstoneSection", () => {
  it("renders every approved benefit from the typed content array", () => {
    render(<WhyGemstoneSection items={whyGemstoneItems} />);

    expect(screen.getByRole("region", { name: "Why GEMSTONE?" })).toBeInTheDocument();

    for (const item of whyGemstoneItems) {
      const card = screen.getByRole("article", { name: item.title });

      expect(card).toHaveAttribute("tabindex", "0");
      expect(card).toHaveTextContent(item.title);
      expect(card).toHaveTextContent(item.description);
      expect(card.querySelector("svg")).toBeInTheDocument();
    }
  });

  it("keeps each benefit card keyboard focusable without relying on hover", () => {
    render(<WhyGemstoneSection items={whyGemstoneItems} />);

    for (const item of whyGemstoneItems) {
      const card = screen.getByRole("article", { name: item.title });

      card.focus();

      expect(card).toHaveFocus();
      expect(card).toHaveClass("focus-visible:shadow-gemstone-glow");
      expect(card).toHaveTextContent(item.description);
    }
  });

  it("keeps approved wording, item identifiers, and icon meaning available without hover", () => {
    const { container } = render(<WhyGemstoneSection items={whyGemstoneItems} />);

    const section = container.querySelector("section#whyGemstone");
    expect(section).toHaveAttribute("aria-labelledby", "whyGemstone-heading");
    expect(section?.querySelector("#whyGemstone-heading")).toHaveTextContent("Why GEMSTONE?");

    for (const item of whyGemstoneItems) {
      const card = screen.getByRole("article", { name: item.title });
      const title = card.querySelector(`#${item.id}-title`);
      const icon = card.querySelector("svg");

      expect(card).toHaveAttribute("aria-labelledby", `${item.id}-title`);
      expect(title).toHaveTextContent(item.title);
      expect(card).toHaveTextContent(item.description);
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(card.className).not.toMatch(/group-hover|hover:.*hidden/);
    }
  });

  it("renders an added benefit through the typed array without item-specific markup", () => {
    const fixture = {
      id: "fixture-benefit",
      title: "Fixture Benefit",
      description: "A benefit supplied through the typed content array.",
      icon: "boxes",
    } as const;

    render(<WhyGemstoneSection items={[...whyGemstoneItems, fixture]} />);

    const card = screen.getByRole("article", { name: fixture.title });
    expect(card).toHaveTextContent(fixture.description);
    expect(card).toHaveAttribute("aria-labelledby", "fixture-benefit-title");
    expect(card.querySelector("#fixture-benefit-title")).toHaveTextContent(fixture.title);
  });

  it("has no axe violations for benefit names, structure, and focusable cards", async () => {
    const { container } = render(
      <main>
        <WhyGemstoneSection items={whyGemstoneItems} />
      </main>,
    );

    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });

    expect(results.violations).toEqual([]);
  });
});
