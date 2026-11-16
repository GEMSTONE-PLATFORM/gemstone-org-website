import axe from "axe-core";
import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DifferentiatorsSection } from "@/components/sections/DifferentiatorsSection";
import { siteManifest } from "@/content/site-manifest";

const differentiators = siteManifest.content.differentiators;
import type { DifferentiatorItem } from "@/types";

const approvedDifferentiators: readonly DifferentiatorItem[] = differentiators;

describe("DifferentiatorsSection", () => {
  it("renders every approved differentiator from the claims array", () => {
    const { container } = render(<DifferentiatorsSection items={approvedDifferentiators} />);

    expect(container.querySelectorAll("article")).toHaveLength(approvedDifferentiators.length);

    for (const item of approvedDifferentiators) {
      const card = document.getElementById(item.id);
      expect(card).toBeInTheDocument();
      expect(
        within(card as HTMLElement).getByRole("heading", {
          name: item.title,
          level: 3,
        }),
      ).toBeInTheDocument();

      if (item.description) {
        expect(within(card as HTMLElement).getByText(item.description)).toBeInTheDocument();
      }
    }
  });

  it("preserves exact approved wording and omits internal claim-review labels", () => {
    const { container } = render(<DifferentiatorsSection items={differentiators} />);
    const section = container.querySelector("section#differentiators");

    expect(section).toHaveAttribute("aria-labelledby", "differentiators-heading");
    expect(section?.querySelector("#differentiators-heading")).toHaveTextContent("Differentiators");
    expect(container).not.toHaveTextContent("Claim review required");

    for (const item of approvedDifferentiators) {
      const card = document.getElementById(item.id);
      expect(card).toHaveAttribute("id", item.id);
      expect(
        within(card as HTMLElement).getByRole("heading", { name: item.title }),
      ).toHaveTextContent(item.title);
    }
  });

  it("keeps claim meaning available in text and does not depend on hover or color", () => {
    const { container } = render(<DifferentiatorsSection items={differentiators} />);
    const cards = container.querySelectorAll("article");

    for (const card of cards) {
      expect(card.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(card.textContent).not.toContain("Claim review required");
      expect(card.className).not.toMatch(/group-hover|hover:.*hidden/);
    }
  });

  it("renders an added claim through the typed array without a presentation branch", () => {
    const fixture = {
      id: "fixture-differentiator",
      title: "Fixture Differentiator",
      description: "A claim supplied through the typed differentiator array.",
      icon: "sparkles",
      claimReviewRequired: true,
    } as const satisfies DifferentiatorItem;

    const { container } = render(<DifferentiatorsSection items={[...differentiators, fixture]} />);
    const card = container.querySelector("#fixture-differentiator");

    expect(card).toBeInTheDocument();
    expect(
      within(card as HTMLElement).getByRole("heading", { name: fixture.title }),
    ).toBeInTheDocument();
    expect(card).toHaveTextContent(fixture.description);
    expect(card).not.toHaveTextContent("Claim review required");
  });

  it("has no axe violations for every approved claim card", async () => {
    const { container } = render(<DifferentiatorsSection items={differentiators} />);
    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });

    expect(results.violations).toEqual([]);
  });
});
