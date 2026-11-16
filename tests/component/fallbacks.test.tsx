import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import { defaultPageComposition, renderEnabledSections } from "@/app/section-registry";
import { Footer, Navigation } from "@/components/layout";
import {
  BriefingSection,
  RequestInformationSection,
} from "@/components/sections/section-renderers";
import {
  BrandLogo,
  FallbackComposition,
  MediaViewer,
  MicrosoftFormEmbed,
  ResponsiveMedia,
} from "@/components/ui";
import { BRIEFING_URL_PLACEHOLDER } from "@/config";
import type { BriefingConfig } from "@/types";

const briefingConfig: BriefingConfig = {
  url: "https://example.com/gemstone-briefing.pdf",
  title: "GEMSTONE Briefing",
  description: "Review the current GEMSTONE briefing.",
  format: "pdf",
  allowDownload: true,
  allowOpenInNewTab: true,
  embed: true,
};

describe("shared fallback composition", () => {
  it("keeps the logo footprint and accessible branding when the image fails", () => {
    render(<BrandLogo src="/branding/missing-logo.svg" alt="GEMSTONE" width={220} height={48} />);

    const image = screen.getByRole("img", { name: "GEMSTONE" });
    expect(image).toHaveAttribute("width", "220");
    expect(image).toHaveAttribute("height", "48");
    expect(image).toHaveAttribute("sizes", "220px");
    expect(image).toHaveAttribute("loading", "lazy");

    fireEvent.error(image);

    const fallback = screen.getByRole("img", { name: "GEMSTONE" });
    expect(fallback).toHaveAttribute("data-logo-state", "fallback");
    expect(fallback).toHaveTextContent("GEMSTONE");
    expect(fallback).toHaveStyle({ width: "220px", height: "48px" });
  });

  it("loads a critical header logo eagerly without changing its intrinsic dimensions", () => {
    render(
      <BrandLogo
        src="/branding/gemstone-logo-horizontal.svg"
        alt="GEMSTONE"
        width={220}
        height={48}
        priority
      />,
    );

    const image = screen.getByRole("img", { name: "GEMSTONE" });
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
    expect(image).toHaveAttribute("width", "220");
    expect(image).toHaveAttribute("height", "48");
    expect(image).toHaveAttribute("sizes", "220px");
  });

  it("preserves a responsive image footprint after a source failure", () => {
    const { container } = render(
      <ResponsiveMedia
        src="/images/architecture/optional.webp"
        alt="Optional architecture image"
        width={640}
        height={360}
        sizes="(max-width: 640px) 100vw, 640px"
        sources={[
          {
            srcSet: "/images/architecture/optional.webp",
            media: "(min-width: 768px)",
            type: "image/webp",
          },
        ]}
      />,
    );

    const image = screen.getByRole("img", { name: "Optional architecture image" });
    expect(image).toHaveAttribute("width", "640");
    expect(image).toHaveAttribute("height", "360");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
    expect(image).toHaveAttribute("sizes", "(max-width: 640px) 100vw, 640px");
    expect(container.querySelector("source")).toHaveAttribute("media", "(min-width: 768px)");

    fireEvent.error(image);

    const fallback = screen.getByRole("status");
    expect(fallback).toHaveTextContent("Image unavailable");
    expect(container.querySelector('[data-media-state="fallback"]')).toHaveStyle({
      aspectRatio: "640 / 360",
    });
    expect(
      screen.queryByRole("img", { name: "Optional architecture image" }),
    ).not.toBeInTheDocument();
  });

  it("keeps a readable static fallback when an optional image is missing", () => {
    render(<ResponsiveMedia src="" alt="Optional architecture image" width={640} height={360} />);

    expect(screen.getByRole("status")).toHaveTextContent("Image unavailable");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("omits the briefing iframe for missing configuration", () => {
    render(<MediaViewer config={{ ...briefingConfig, url: ` ${BRIEFING_URL_PLACEHOLDER} ` }} />);

    expect(screen.getByRole("status")).toHaveTextContent("Briefing not configured");
    expect(screen.queryByTitle("GEMSTONE Briefing")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("keeps external briefing recovery actions when embedded viewing fails", () => {
    vi.useFakeTimers();
    try {
      render(<MediaViewer config={briefingConfig} />);
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(screen.getByRole("status")).toHaveTextContent("Embedded briefing unavailable");
      expect(
        screen.getAllByRole("link", { name: /View Briefing.*opens in a new tab/i }),
      ).not.toHaveLength(0);
      expect(
        screen.getAllByRole("link", { name: /Download Briefing.*opens in a new tab/i }),
      ).not.toHaveLength(0);
      expect(screen.getAllByRole("link")[0]).toHaveAttribute("rel", "noopener noreferrer");
    } finally {
      vi.useRealTimers();
    }
  });

  it("omits the form iframe and explains an unconnected form", () => {
    render(
      <MicrosoftFormEmbed
        url="MICROSOFT_FORM_URL_GOES_HERE"
        title="GEMSTONE Request More Information form"
        privacyNotice="Privacy notice placeholder"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Request Information form has not yet been connected.",
    );
    expect(screen.queryByTitle("GEMSTONE Request More Information form")).not.toBeInTheDocument();
  });

  it("keeps configured form recovery available when embedding fails", () => {
    vi.useFakeTimers();
    try {
      render(
        <MicrosoftFormEmbed
          url="https://forms.example.com/request"
          title="GEMSTONE Request More Information form"
          privacyNotice="Privacy notice placeholder"
        />,
      );
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      expect(screen.getByRole("status")).toHaveTextContent(
        "Request Information form unavailable here",
      );
      const recovery = screen.getAllByRole("link", {
        name: /Open Request Information Form.*opens in a new tab/i,
      });
      expect(recovery.length).toBeGreaterThan(0);
      expect(recovery[0]).toHaveAttribute("rel", "noopener noreferrer");
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not emit empty recovery links", () => {
    render(
      <FallbackComposition
        kind="blocked"
        title="Optional view unavailable"
        message="Use another available action."
        recoveryLinks={[
          { kind: "external", label: " ", href: " ", external: true, newTab: true },
          {
            kind: "external",
            label: "Open recovery",
            href: "https://example.com/recovery",
            external: true,
            newTab: true,
          },
        ]}
      />,
    );

    expect(screen.queryByRole("link", { name: /^\s*$/ })).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Open recovery.*opens in a new tab/i }),
    ).toBeInTheDocument();
  });

  it("keeps the landing page fallback content in server-rendered HTML", () => {
    const markup = renderToStaticMarkup(<HomePage />);

    expect(markup).toContain("Briefing not configured");
    expect(markup).toContain("Request Information form has not yet been connected.");
    expect(markup).toContain('data-topology-explorer="true"');
    expect(markup).toContain("Benefits");
    expect(markup).toContain('href="#architecture"');
    expect(markup).not.toContain('src=""');
    expect(markup).not.toContain("<script");
  });

  it("keeps configured external integrations usable in server markup", () => {
    const configuredFormUrl = "https://forms.example.com/gemstone-request";
    const markup = renderToStaticMarkup(
      <>
        <BriefingSection config={briefingConfig} />
        <RequestInformationSection url={configuredFormUrl} />
      </>,
    );

    expect(markup).toContain(`src="${briefingConfig.url}"`);
    expect(markup).toContain(`src="${configuredFormUrl}"`);
    expect(markup).toContain("View Briefing");
    expect(markup).toContain("Open Request Information Form");
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
    expect(markup).not.toContain('src=""');
    expect(markup).not.toMatch(
      /GEMSTONE_BRIEFING_URL_GOES_HERE|MICROSOFT_FORM_URL|api[_-]?key|authorization|accreditation|\bATO\b/i,
    );
  });

  it("omits disabled section targets while retaining understandable enabled fallback content", () => {
    const sections = {
      ...defaultPageComposition.config.sections,
      briefing: false,
      requestInformation: false,
    };
    const composition = {
      ...defaultPageComposition,
      config: { ...defaultPageComposition.config, sections },
    };
    const { container } = render(
      <>
        <Navigation sections={sections} />
        <main id="main-content" aria-label="GEMSTONE public website">
          {renderEnabledSections(composition)}
        </main>
        <Footer enabledSections={sections} />
      </>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(container.querySelector("#briefing")).not.toBeInTheDocument();
    expect(container.querySelector("#requestInformation")).not.toBeInTheDocument();
    expect(container.querySelector('[href="#briefing"]')).not.toBeInTheDocument();
    expect(container.querySelector('[href="#requestInformation"]')).not.toBeInTheDocument();
    expect(container.querySelector("[data-architecture-visual]")).toBeInTheDocument();

    for (const link of container.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const href = link.getAttribute("href")?.trim();
      expect(href).toBeTruthy();
      expect(link.textContent?.trim()).toBeTruthy();

      if (href?.startsWith("#")) {
        expect(container.querySelectorAll(`[id="${href.slice(1)}"]`)).toHaveLength(1);
      }
    }
  });
});
