import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/layout";
import { siteContent } from "@/content";
import type { SiteSections } from "@/types";

const enabledSections: SiteSections = {
  hero: true,
  about: true,
  whyGemstone: true,
  architecture: true,
  capabilities: true,
  differentiators: true,
  faq: true,
  briefing: true,
  requestInformation: true,
};

describe("Footer", () => {
  it("renders GEMSTONE identity, full name, approved links, and release statement", () => {
    render(<Footer enabledSections={enabledSections} />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("GEMSTONE")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Approved for Public Release. Distribution Unlimited."),
    ).toBeInTheDocument();

    for (const label of ["About", "Architecture", "Capabilities", "FAQ", "Briefing", "Contact"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "#requestInformation",
    );
  });

  it("omits footer links whose section targets are disabled", () => {
    render(
      <Footer
        navigation={siteContent.footer.navigation}
        enabledSections={{ ...enabledSections, about: false, requestInformation: false }}
        config={{ showBackToTop: false }}
      />,
    );

    expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Contact" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Architecture" })).toBeInTheDocument();
  });

  it("renders configured optional values and filters unsupported or empty values", () => {
    render(
      <Footer
        navigation={[]}
        organizationLogo="/branding/approved-logo.svg"
        config={{
          privacy: {
            kind: "external",
            label: "Configured but replaced by approved label",
            href: "https://example.com/privacy",
            external: true,
            newTab: true,
          },
          accessibility: {
            kind: "internal",
            label: "Configured but replaced by approved label",
            href: "#accessibility",
          },
          socialLinks: [
            {
              kind: "external",
              label: "GitHub",
              href: "https://github.com/example",
              external: true,
              newTab: true,
            },
            {
              kind: "external",
              label: "Discord",
              href: "https://discord.example",
              external: true,
              newTab: true,
            },
            {
              kind: "external",
              label: " ",
              href: "https://example.com/empty-label",
              external: true,
            },
            {
              kind: "external",
              label: "Empty destination",
              href: "  ",
              external: true,
            },
          ],
          copyright: "© GEMSTONE",
          showBackToTop: true,
        }}
        publicRelease={{ enabled: true, statement: "Approved release wording" }}
      />,
    );

    expect(screen.getByRole("img", { name: siteContent.footer.fullName })).toHaveAttribute(
      "src",
      "/branding/approved-logo.svg",
    );
    expect(screen.getByRole("link", { name: "Privacy (opens in a new tab)" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: "GitHub (opens in a new tab)" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: "Accessibility" })).toHaveAttribute(
      "href",
      "#accessibility",
    );
    expect(screen.getByText("© GEMSTONE")).toBeInTheDocument();
    expect(screen.getByText("Approved release wording")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to top" })).toHaveAttribute(
      "href",
      "#main-content",
    );

    expect(screen.queryByRole("link", { name: /Discord/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Empty destination/ })).not.toBeInTheDocument();
  });

  it("uses the failure-safe footprint for an optional organization logo", () => {
    render(<Footer navigation={[]} organizationLogo="/branding/missing-organization-logo.svg" />);

    const image = screen.getByRole("img", { name: siteContent.footer.fullName });
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("width", "240");
    expect(image).toHaveAttribute("height", "64");

    fireEvent.error(image);

    const fallback = screen.getByRole("img", { name: siteContent.footer.fullName });
    expect(fallback).toHaveAttribute("data-logo-state", "fallback");
    expect(fallback).toHaveStyle({ width: "240px", height: "64px" });
  });

  it("omits empty optional values and disabled release wording", () => {
    render(
      <Footer
        navigation={[]}
        organizationLogo="  "
        config={{
          privacy: {
            kind: "external",
            label: "Privacy",
            href: " ",
            external: true,
          },
          accessibility: {
            kind: "internal",
            label: "Accessibility",
            href: " " as `#${string}`,
          },
          socialLinks: [
            {
              kind: "external",
              label: "GitHub",
              href: " ",
              external: true,
            },
          ],
          copyright: " \t",
          showBackToTop: false,
        }}
        publicRelease={{ enabled: false, statement: "Disabled release wording" }}
      />,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Privacy" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Accessibility" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Back to top" })).not.toBeInTheDocument();
    expect(screen.queryByText("Disabled release wording")).not.toBeInTheDocument();
  });
});
