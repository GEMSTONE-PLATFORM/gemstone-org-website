import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { AboutSection } from "@/components/sections/section-renderers";
import { aboutContent } from "@/content/site-content";

import { mockReducedMotion } from "../helpers/component-test-helpers";

afterEach(() => {
  document.documentElement.removeAttribute("data-motion");
});

describe("AboutSection", () => {
  it.each([
    ["animation enabled", false],
    ["reduced motion", true],
  ] as const)("keeps the relationship content available with %s", async (_mode, reduced) => {
    const restoreReducedMotion = mockReducedMotion(reduced);

    try {
      const { container } = render(<AboutSection content={aboutContent} />);
      const section = screen.getByRole("region", { name: "What is GEMSTONE?" });
      const relationshipList = screen.getByRole("list", {
        name: "GEMSTONE relationship elements",
      });

      expect(section).toContainElement(screen.getByText(aboutContent.description));
      expect(
        screen.getByText(
          "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
        ),
      ).toBeVisible();
      expect(section).toContainElement(screen.getByText(aboutContent.relationshipDescription));
      expect(section).toContainElement(screen.getByText(aboutContent.distributedNote));
      expect(relationshipList).toBeInTheDocument();
      for (const label of aboutContent.relationshipLabels) {
        const labelElement = screen.getByText(label, { selector: "li" });
        expect(labelElement).toBeVisible();
        expect(labelElement.closest('[aria-hidden="true"]')).not.toBeInTheDocument();
      }

      const visual = container.querySelector(".gemstone-about-visual");
      expect(visual).toHaveAttribute("aria-hidden", "true");
      expect(visual).toHaveClass("gemstone-motion");

      const results = await axe.run(container, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      });
      expect(results.violations).toEqual([]);
    } finally {
      restoreReducedMotion();
    }
  });

  it("preserves the definition and labeled relationship representation in static HTML", () => {
    const markup = renderToStaticMarkup(<AboutSection content={aboutContent} />);

    expect(markup).toContain(aboutContent.description);
    expect(markup).toContain(
      "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
    );
    expect(markup).toContain(aboutContent.relationshipDescription);
    expect(markup).toContain(aboutContent.distributedNote);
    for (const label of aboutContent.relationshipLabels) {
      expect(markup).toContain(`<li`);
      expect(markup).toContain(label);
    }
    expect(markup).toContain('aria-label="GEMSTONE relationship elements"');
    expect(markup).not.toContain("<script");
  });

  it("does not make the definition or relationships hover-only", () => {
    render(<AboutSection content={aboutContent} />);

    expect(screen.getByText(aboutContent.description)).toBeVisible();
    expect(screen.getByText(aboutContent.relationshipDescription)).toBeVisible();
    expect(screen.getByText(aboutContent.distributedNote)).toBeVisible();
    for (const label of aboutContent.relationshipLabels) {
      const labelElement = screen.getByText(label, { selector: "li" });
      expect(labelElement).toBeVisible();
      expect(labelElement.closest('[aria-hidden="true"]')).not.toBeInTheDocument();
    }
  });
});
