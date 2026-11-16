import { fireEvent, render, screen } from "@testing-library/react";
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

  it("renders an expandable network topology with the requested Hub, Node, and Client workflow", () => {
    const { container } = render(<HeroSection content={heroContent} />);

    expect(screen.getByRole("group", { name: "Grow the network" })).toBeInTheDocument();
    const addHub = screen.getByRole("button", { name: "Add Hub" });
    const addNode = screen.getByRole("button", { name: "Add Node to selected Hub" });
    const addClient = screen.getByRole("button", { name: "Add Client to selected Node" });
    expect(addNode).toBeDisabled();
    expect(addClient).toBeDisabled();

    fireEvent.click(addHub);
    expect(container.querySelectorAll('[id^="topology-hub-"]')).toHaveLength(4);
    expect(container.querySelectorAll("svg line")).toHaveLength(24);
    expect(addNode).toBeEnabled();

    fireEvent.click(addNode);
    expect(addClient).toBeEnabled();
    fireEvent.click(addClient);
    expect(screen.getByText("Client 13")).toBeInTheDocument();
  });

  it("keeps approved copy and CTA targets in static HTML", () => {
    const markup = renderToStaticMarkup(<HeroSection content={heroContent} />);

    expect(markup).toContain(
      "Government-Owned Open Source for Digital Engineering and Modeling &amp; Simulation",
    );
    expect(markup).toContain(heroContent.description);
    expect(markup).toContain('href="#requestInformation"');
    expect(markup).toContain('href="#briefing"');
    expect(markup).toContain('data-topology-explorer="true"');
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
