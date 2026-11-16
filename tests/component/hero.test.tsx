import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";
import { HeroSection } from "@/components/sections/section-renderers";
import { siteManifest } from "@/content/site-manifest";

const heroContent = siteManifest.content.hero;

describe("HeroSection", () => {
  it("renders the approved headline, subheadline, and enabled CTA destinations", () => {
    render(
      <HeroSection
        content={heroContent}
        enabledSections={{ briefing: true, requestInformation: true }}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: heroContent.title })).toBeInTheDocument();
    expect(screen.getByText(heroContent.description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Request Information" })).toHaveAttribute(
      "href",
      "#requestInformation",
    );
    expect(screen.getByRole("link", { name: "View Briefing" })).toHaveAttribute(
      "href",
      "#briefing",
    );
  });

  it("keeps the composed landing page to one page-level h1", () => {
    render(<HomePage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: heroContent.title })).toBeVisible();
  });

  it("renders the existing configured logo above the smaller Hero title", () => {
    const { container } = render(
      <HeroSection content={heroContent} logoSrc="/branding/gemstone-logo.svg" />,
    );

    const logo = screen.getByRole("img", { name: "GEMSTONE logo" });
    const title = screen.getByRole("heading", { level: 1, name: heroContent.title });
    expect(logo).toHaveAttribute("src", "/branding/gemstone-logo.svg");
    expect(title).toHaveClass("sr-only");
    expect(container.querySelector("[data-topology-explorer]")).not.toBeInTheDocument();
  });

  it("keeps approved copy and CTA targets in static HTML", () => {
    const markup = renderToStaticMarkup(<HeroSection content={heroContent} />);

    expect(markup).toContain(
      "Government-Owned Open Source Software Defined Platform for Digital Workloads",
    );
    expect(markup).toContain(heroContent.description);
    expect(markup).toContain('href="#requestInformation"');
    expect(markup).toContain('href="#briefing"');
    expect(markup).toContain('src="/branding/gemstone-logo.svg"');
    expect(markup).toContain('class="sr-only"');
    expect(markup).not.toContain("data-topology-explorer");
    expect(markup).not.toContain("Static ecosystem map");
    expect(markup).not.toContain("Hub services");
    expect(markup).not.toContain("<script");
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
});
