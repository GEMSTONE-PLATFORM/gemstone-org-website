import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

const sectionIds = [
  "hero",
  "about",
  "whyGemstone",
  "architecture",
  "capabilities",
  "differentiators",
  "faq",
  "briefing",
  "requestInformation",
] as const;

describe("HomePage", () => {
  it("renders a server-rendered skip link and stable main landmark", () => {
    render(<HomePage />);

    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    const main = screen.getByRole("main", { name: "GEMSTONE public website" });

    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");

    skipLink.focus();
    expect(skipLink).toHaveFocus();
    main.focus();
    expect(main).toHaveFocus();
  });

  it("renders one page heading and a labeled heading for every enabled section", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    const sections = screen.getAllByRole("region");
    expect(sections).toHaveLength(sectionIds.length);

    const ids = sections.map((section) => section.id);
    expect(new Set(ids).size).toBe(sectionIds.length);
    expect(ids).toEqual(sectionIds);

    for (const section of sections) {
      const headingId = section.getAttribute("aria-labelledby");
      expect(headingId).toBeTruthy();
      expect(document.getElementById(headingId as string)).toBeInTheDocument();
      expect(section.querySelector(`#${headingId}`)).toBeInTheDocument();
      expect(section.querySelector("h1, h2")).toHaveAttribute("id", headingId);
    }
  });

  it("preserves the complete page structure in server-rendered HTML", () => {
    const markup = renderToStaticMarkup(<HomePage />);

    expect(markup).toContain('<a class="gemstone-skip-link" href="#main-content">');
    expect(markup).toContain('id="main-content"');
    expect(markup).toContain('tabindex="-1"');
    expect(markup).toContain("Skip to main content");
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(
      "Government-Owned Open Source Software Defined Platform for Digital Workloads",
    );
    expect(markup).toContain('href="#requestInformation"');

    const renderedIds = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(renderedIds).size).toBe(renderedIds.length);

    let previousIndex = -1;
    for (const sectionId of sectionIds) {
      const index = markup.indexOf(`id=\"${sectionId}\"`);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it("has no axe violations in the composed page shell", async () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();

    const results = await axe.run(main as HTMLElement, {
      iframes: false,
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });

    expect(results.violations).toEqual([]);
  });
});
