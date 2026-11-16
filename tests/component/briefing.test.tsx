import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BriefingSection } from "@/components/sections/section-renderers";
import { MediaViewer } from "@/components/ui";
import { BRIEFING_URL_PLACEHOLDER } from "@/config";
import type { BriefingConfig } from "@/types";
const validConfig: BriefingConfig = {
  url: "https://example.com/gemstone-briefing.pdf",
  title: "GEMSTONE Briefing",
  description: "Review the current GEMSTONE briefing.",
  format: "pdf",
  allowDownload: true,
  allowOpenInNewTab: true,
  embed: true,
};
describe("BriefingSection and MediaViewer", () => {
  it("renders the configured PDF briefing", () => {
    render(<BriefingSection />);
    expect(screen.getByRole("heading", { name: "GEMSTONE Briefing" })).toBeInTheDocument();
    expect(screen.getByText("PDF document")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download Briefing" })).toHaveAttribute(
      "href",
      "/documents/gemstone-briefing.pdf",
    );
  });
  it("renders format, recovery actions, a responsive lazy frame, and loading state", () => {
    render(<MediaViewer config={validConfig} />);
    expect(screen.getByText("PDF document")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View Briefing.*opens in a new tab/i }),
    ).toHaveAttribute("href", validConfig.url);
    expect(screen.getByRole("link", { name: "Download Briefing" })).toHaveAttribute("download");
    expect(screen.getByRole("link", { name: "Download Briefing" })).not.toHaveAttribute("target");
    expect(
      screen.getByRole("link", { name: /Open in New Tab.*opens in a new tab/i }),
    ).toBeInTheDocument();
    const viewer = screen.getByTitle(validConfig.title);
    expect(viewer).toHaveAttribute("loading", "lazy");
    expect(viewer.closest(".aspect-\\[16\\/10\\]")).toBeInTheDocument();
    expect(screen.getAllByText("Loading embedded briefing.")).toHaveLength(1);
  });
  it("reports the loaded state after the browser loads the frame", () => {
    render(<MediaViewer config={validConfig} />);
    fireEvent.load(screen.getByTitle(validConfig.title));
    expect(screen.getByText("Embedded briefing loaded.")).toBeInTheDocument();
    expect(screen.getByTestId("briefing-viewer")).toHaveAttribute("data-embed-state", "loaded");
  });
  it("provides readable blocked recovery after an embed timeout", () => {
    vi.useFakeTimers();
    try {
      render(<MediaViewer config={validConfig} />);
      act(() => {
        vi.advanceTimersByTime(8000);
      });
      expect(screen.getByRole("status")).toHaveTextContent("Embedded briefing unavailable");
      expect(screen.getByText(/did not finish loading/i)).toBeInTheDocument();
      expect(
        screen.getAllByRole("link", { name: /View Briefing.*opens in a new tab/i }),
      ).not.toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });
  it("uses direct actions when embedding is disabled", () => {
    render(<MediaViewer config={{ ...validConfig, embed: false }} />);
    expect(screen.getByTestId("briefing-viewer")).toHaveAttribute("data-embed-state", "direct");
    expect(screen.queryByTitle(validConfig.title)).not.toBeInTheDocument();
    expect(screen.getByText("View or download the current briefing.")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Open in New Tab.*opens in a new tab/i }),
    ).not.toHaveLength(0);
  });
  it("provides a timeout fallback without making cross-origin policy claims", () => {
    vi.useFakeTimers();
    try {
      render(<MediaViewer config={validConfig} />);
      act(() => {
        vi.advanceTimersByTime(8000);
      });
      const viewer = screen.getByTestId("briefing-viewer");
      expect(viewer).toHaveAttribute("data-embed-state", "blocked");
      expect(viewer).toHaveAttribute("data-embed-failure", "timeout");
      expect(screen.getByRole("status")).toHaveTextContent("Embedded briefing unavailable");
      expect(screen.getByText(/did not finish loading/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/CSP|X-Frame-Options|cross-origin framing policy/i),
      ).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
  it("omits download and new-tab actions when disabled", () => {
    render(
      <MediaViewer config={{ ...validConfig, allowDownload: false, allowOpenInNewTab: false }} />,
    );
    expect(screen.queryByRole("link", { name: /Download Briefing/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Open in New Tab/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Briefing" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "View Briefing" })).not.toHaveAttribute("rel");
  });
  it("does not expose the placeholder as an iframe target", () => {
    render(<MediaViewer config={{ ...validConfig, url: ` ${BRIEFING_URL_PLACEHOLDER} ` }} />);
    expect(screen.queryByTitle(validConfig.title)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
