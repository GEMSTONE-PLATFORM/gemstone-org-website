import { fireEvent, render, screen } from "@testing-library/react";
import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/section-renderers";
import { BrandLogo, MediaViewer, MicrosoftFormEmbed, ResponsiveMedia } from "@/components/ui";
import {
  BRIEFING_URL_PLACEHOLDER,
  MICROSOFT_FORM_URL_PLACEHOLDER,
} from "@/config/integration-config";
import { heroContent } from "@/content/site-content";
import type { BriefingConfig } from "@/types";

type FallbackCondition =
  | "missing-logo"
  | "missing-image"
  | "unavailable-animation"
  | "unavailable-observer"
  | "missing-integrations"
  | "blocked-embeds"
  | "unsupported-document"
  | "no-javascript";

interface FallbackModel {
  readonly condition: FallbackCondition;
  readonly recoveryUrl?: string;
}

const formTitle = "GEMSTONE Request More Information form";
const privacyNotice = "Privacy notice placeholder";
const approvedHeroHeading =
  "Government-Owned Open Source for Digital Engineering and Modeling & Simulation";
const validExternalUrlArbitrary = fc
  .string({ minLength: 1, maxLength: 18 })
  .filter((value) => /^[a-z0-9]+$/i.test(value))
  .map((token) => `https://example-${token}.test/gemstone/${token}`);
const fallbackModelsArbitrary: fc.Arbitrary<readonly FallbackModel[]> =
  validExternalUrlArbitrary.map((recoveryUrl) => [
    { condition: "missing-logo" },
    { condition: "missing-image" },
    { condition: "unavailable-animation" },
    { condition: "unavailable-observer" },
    { condition: "missing-integrations" },
    { condition: "blocked-embeds", recoveryUrl },
    { condition: "unsupported-document", recoveryUrl },
    { condition: "no-javascript" },
  ]);

function briefingConfig(url: string, embed = true): BriefingConfig {
  return {
    url,
    title: "GEMSTONE Briefing",
    description: "Review the current GEMSTONE briefing.",
    format: "pdf",
    allowDownload: true,
    allowOpenInNewTab: true,
    embed,
  };
}

function expectRecoveryLink(name: RegExp, url: string) {
  const links = screen.getAllByRole("link", { name });
  expect(links.length).toBeGreaterThan(0);

  for (const link of links) {
    expect(link).toHaveAttribute("href", url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
}

function assertFallbackComprehension(model: FallbackModel) {
  switch (model.condition) {
    case "missing-logo": {
      const markup = renderToStaticMarkup(
        <BrandLogo src="" alt="GEMSTONE" width={220} height={48} />,
      );

      expect(markup).toContain('data-logo-state="fallback"');
      expect(markup).toContain('aria-label="GEMSTONE"');
      expect(markup).toContain("GEMSTONE");
      return;
    }

    case "missing-image": {
      const markup = renderToStaticMarkup(
        <ResponsiveMedia src="" alt="Optional architecture image" width={640} height={360} />,
      );

      expect(markup).toContain('data-media-state="fallback"');
      expect(markup).toContain("Image unavailable");
      expect(markup).toContain("The surrounding content remains available.");
      return;
    }

    case "unavailable-animation": {
      const markup = renderToStaticMarkup(<HeroSection content={heroContent} />);

      expect(markup).toContain('data-visualization-mode="decorative"');
      expect(markup).toContain(approvedHeroHeading.replace("&", "&amp;"));
      expect(markup).toContain(heroContent.description);
      expect(markup).toContain('href="#requestInformation"');
      expect(markup).toContain('href="#briefing"');
      expect(markup).not.toContain("Static ecosystem map");
      return;
    }

    case "unavailable-observer": {
      vi.stubGlobal("IntersectionObserver", undefined);
      const view = render(<Navigation />);

      try {
        expect(view.container.querySelector("[data-observer-state]")).toHaveAttribute(
          "data-observer-state",
          "unavailable",
        );
        expect(view.container.querySelector('a[href="#about"]')).toBeInTheDocument();
        expect(view.container.querySelector('a[href="#architecture"]')).toBeInTheDocument();
      } finally {
        view.unmount();
        vi.unstubAllGlobals();
      }
      return;
    }

    case "missing-integrations": {
      const markup = renderToStaticMarkup(
        <>
          <MediaViewer config={briefingConfig(` ${BRIEFING_URL_PLACEHOLDER} `)} />
          <MicrosoftFormEmbed
            url={` ${MICROSOFT_FORM_URL_PLACEHOLDER} `}
            title={formTitle}
            privacyNotice={privacyNotice}
          />
        </>,
      );

      expect(markup).toContain("Briefing not configured");
      expect(markup).toContain("A GEMSTONE briefing URL has not been configured.");
      expect(markup).toContain("Request Information form has not yet been connected.");
      expect(markup).not.toContain("<iframe");
      return;
    }

    case "blocked-embeds": {
      const recoveryUrl = model.recoveryUrl;
      expect(recoveryUrl).toBeDefined();
      if (!recoveryUrl) return;

      const briefing = render(<MediaViewer config={briefingConfig(recoveryUrl)} />);
      try {
        fireEvent.error(screen.getByTitle("GEMSTONE Briefing"));
        expect(screen.getByRole("status")).toHaveTextContent("Embedded briefing unavailable");
        expectRecoveryLink(/View Briefing.*opens in a new tab/i, recoveryUrl);
      } finally {
        briefing.unmount();
      }

      const form = render(
        <MicrosoftFormEmbed url={recoveryUrl} title={formTitle} privacyNotice={privacyNotice} />,
      );
      try {
        fireEvent.error(screen.getByTitle(formTitle));
        expect(screen.getByRole("status")).toHaveTextContent(
          "Request Information form unavailable here",
        );
        expectRecoveryLink(/Open Request Information Form.*opens in a new tab/i, recoveryUrl);
      } finally {
        form.unmount();
      }
      return;
    }

    case "unsupported-document": {
      const recoveryUrl = model.recoveryUrl;
      expect(recoveryUrl).toBeDefined();
      if (!recoveryUrl) return;

      const markup = renderToStaticMarkup(
        <MediaViewer config={briefingConfig(recoveryUrl, false)} />,
      );
      expect(markup).toContain('data-embed-state="unsupported"');
      expect(markup).toContain("Embedded briefing format unavailable");
      expect(markup).toContain("View Briefing");
      expect(markup).toContain(`href="${recoveryUrl}"`);
      return;
    }

    case "no-javascript": {
      const markup = renderToStaticMarkup(<HomePage />);

      expect(markup).toContain(approvedHeroHeading.replace("&", "&amp;"));
      expect(markup).toContain("What is GEMSTONE?");
      expect(markup).toContain('href="#architecture"');
      expect(markup).toContain("data-architecture-visual");
      expect(markup).toContain("Benefits");
      expect(markup).toContain("Briefing not configured");
      expect(markup).toContain("Request Information form has not yet been connected.");
      expect(markup).not.toContain("<iframe");
      expect(markup).not.toContain("<script");
    }
  }
}

describe("fallback comprehension", () => {
  /** Validates: Requirements 4.6, 6.9, 7.7, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7 */
  it("Property 15: every supported fallback model preserves explanatory static content and recovery actions", () => {
    fc.assert(
      fc.property(fallbackModelsArbitrary, (models) => {
        for (const model of models) {
          assertFallbackComprehension(model);
        }
      }),
      { numRuns: 100 },
    );
  });
});
