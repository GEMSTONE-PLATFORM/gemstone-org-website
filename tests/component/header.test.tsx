import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "@/components/layout/Header";
import { getEnabledNavigationItems, resolveNavigationTarget } from "@/components/layout/Navigation";
import { navigationItems } from "@/config/navigation-config";
import { siteConfig } from "@/config/site-config";
import type { SiteSections } from "@/types";

const allSections: SiteSections = { ...siteConfig.sections };

function renderHeader(sections: SiteSections = allSections) {
  return render(<Header sections={sections} />);
}

describe("responsive header and navigation", () => {
  it("renders the configured logo and every enabled navigation target", () => {
    renderHeader();

    expect(screen.getByRole("img", { name: "GEMSTONE" })).toHaveAttribute(
      "src",
      "/branding/gemstone-logo-horizontal.svg",
    );

    const primaryNavigation = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const item of navigationItems) {
      expect(within(primaryNavigation).getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });

  it("filters disabled targets before rendering desktop or mobile links", () => {
    const sections = { ...allSections, briefing: false, requestInformation: false };
    renderHeader(sections);

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).not.toHaveTextContent(
      "Briefing",
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).not.toHaveTextContent(
      "Request Information",
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toHaveTextContent(
      "About",
    );
  });

  it("enters the mobile menu with focus and exposes its state relationship", async () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", "mobile-navigation");
    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
      hidden: true,
    });
    await waitFor(() =>
      expect(within(mobileNavigation).getByRole("link", { name: "About" })).toHaveFocus(),
    );
  });

  it("supports Enter and Space on the mobile menu control", () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });

    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(trigger, { key: " " });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveFocus();
    });
  });

  it("closes after a mobile link activation while preserving its anchor", async () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(trigger);

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
      hidden: true,
    });
    const architectureLink = within(mobileNavigation).getByRole("link", {
      name: "Architecture",
    });
    expect(architectureLink).toHaveAttribute("href", "#architecture");

    fireEvent.click(architectureLink);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  });

  it("keeps the header footprint stable while applying the configured scroll transition", () => {
    render(<Header scrollThreshold={10} />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("h-20");
    expect(header).toHaveAttribute("data-header-state", "hero");

    Object.defineProperty(window, "scrollY", { configurable: true, value: 20 });
    fireEvent.scroll(window);

    expect(header).toHaveClass("h-20");
    expect(header).toHaveAttribute("data-header-state", "scrolled");
    expect(header).toHaveAttribute("data-scroll-threshold", "10");
  });
});

describe("navigation target helpers", () => {
  it("resolves explicit and hash-derived internal targets only", () => {
    expect(resolveNavigationTarget(navigationItems[0])).toBe("about");
    expect(resolveNavigationTarget({ kind: "internal", label: "FAQ", href: "#faq" })).toBe("faq");
    expect(
      resolveNavigationTarget({
        kind: "external",
        label: "External",
        href: "https://example.com",
        external: true,
      }),
    ).toBeNull();
  });

  it("returns only links pointing at enabled sections", () => {
    const filtered = getEnabledNavigationItems(navigationItems, {
      ...allSections,
      faq: false,
    });

    expect(filtered.map((item) => item.label)).not.toContain("FAQ");
    expect(filtered.map((item) => item.label)).toContain("About");
  });
});
