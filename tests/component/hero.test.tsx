import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";
import { HeroSection } from "@/components/sections/section-renderers";
import { heroContent } from "@/content/site-content";

describe("HeroSection", () => {
  it("renders the approved headline, subheadline, and enabled CTA destinations", () => {
    render(
      <HeroSection
        content={heroContent}
        enabledSections={{ briefing: true, requestInformation: true }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Government-Owned Open Source for Digital Engineering and Modeling & Simulation",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "GEMSTONE empowers organizations to build, publish, discover, and integrate tools, data, and compute across secure environments.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Request Information" })).toHaveAttribute(
      "href",
      "#requestInformation",
    );
    expect(screen.getByRole("link", { name: "View Briefing" })).toHaveAttribute(
      "href",
      "#briefing",
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("keeps the composed landing page to one page-level h1", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: heroContent.title,
      }),
    ).toBeVisible();
  });

  it("represents the ecosystem as readable labels with decorative paths hidden", () => {
    render(<HeroSection content={heroContent} />);

    for (const label of [
      "Organizations",
      "Environments",
      "Nodes",
      "Tools",
      "Data",
      "Compute",
      "Models",
      "Simulations",
      "Users",
      "Hub services",
    ]) {
      expect(screen.getByText(label, { selector: "li" })).toBeInTheDocument();
    }

    expect(screen.getByText("Static ecosystem map")).toBeVisible();
    expect(screen.getByRole("figure", { name: /Connected ecosystem/ })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "GEMSTONE ecosystem labels" })).toBeInTheDocument();
    expect(screen.getByRole("figure")).toHaveAttribute("data-visualization-mode", "static");
    expect(screen.queryAllByRole("img", { hidden: true })).toHaveLength(0);
    expect(document.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
  });

  it("keeps the approved explanation available before hydration", () => {
    const markup = renderToStaticMarkup(<HeroSection content={heroContent} />);

    expect(markup).toContain(
      "Government-Owned Open Source for Digital Engineering and Modeling &amp; Simulation",
    );
    expect(markup).toContain(heroContent.description);
    expect(markup).toContain('href="#requestInformation"');
    expect(markup).toContain('href="#briefing"');
    expect(markup).toContain("Organizations");
    expect(markup).toContain("Hub services");
    expect(markup).not.toContain("<script");
  });

  it("does not make ecosystem explanations hover-only", () => {
    render(<HeroSection content={heroContent} />);

    const hero = screen.getByRole("region", { name: heroContent.title });
    expect(screen.getByText(heroContent.description)).toBeVisible();
    for (const label of [
      "Organizations",
      "Environments",
      "Nodes",
      "Tools",
      "Data",
      "Compute",
      "Models",
      "Simulations",
      "Users",
      "Hub services",
    ]) {
      const labelElement = screen.getByText(label, { selector: "li" });
      expect(labelElement).toBeVisible();
      expect(labelElement.closest('[aria-hidden="true"]')).not.toBeInTheDocument();
    }
    expect(hero.querySelector('[class*="hover:hidden"], [class*="group-hover:hidden"]')).toBeNull();
  });

  it("omits CTA links whose destination sections are disabled", () => {
    render(
      <HeroSection
        content={heroContent}
        enabledSections={{ briefing: false, requestInformation: true }}
      />,
    );

    expect(screen.getByRole("link", { name: "Request Information" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "View Briefing" })).not.toBeInTheDocument();
  });

  it("keeps the static visualization and copy available in reduced-motion mode", () => {
    render(<HeroSection content={heroContent} />);

    const hero = screen.getByRole("region", { name: heroContent.title });
    expect(hero).toHaveAttribute("data-visualization-mode", "static");
    const motionLayer = hero.querySelector(".gemstone-motion");
    expect(motionLayer).toBeInTheDocument();
    expect(motionLayer).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Static ecosystem map")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Request Information" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Briefing" })).toBeInTheDocument();
  });
});
