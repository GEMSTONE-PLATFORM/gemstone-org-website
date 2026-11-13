import { readFileSync } from "node:fs";
import path from "node:path";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

const globalsCss = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
const tailwindConfig = readFileSync(path.join(process.cwd(), "tailwind.config.ts"), "utf8");
const pageSource = readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

describe("GEMSTONE visual foundation", () => {
  it("renders the foundation page with semantic token classes", () => {
    render(<HomePage />);

    expect(screen.getByRole("main")).toHaveClass("gemstone-page", "gemstone-atmosphere");
    expect(screen.getByRole("main")).toHaveClass("gemstone-atmosphere", "text-gemstone-text");
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("gemstone-display");
    expect(
      within(screen.getByRole("main")).getByText("GEMSTONE", {
        selector: "p.gemstone-eyebrow",
      }),
    ).toHaveClass("gemstone-eyebrow");
  });

  it("defines semantic focus, reduced-motion, and responsive selectors", () => {
    expect(globalsCss).toContain(":focus-visible");
    expect(globalsCss).toContain("--gemstone-focus-rgb");
    expect(globalsCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalsCss).toContain(".motion-reduced .gemstone-motion");
    expect(globalsCss).toContain("min-width: 320px");
    expect(globalsCss).toContain("@media (min-width: 1440px)");
    expect(globalsCss).toContain("overflow-x: clip");
  });

  it("maps Tailwind utilities to centralized tokens and keeps raw colors out of the page", () => {
    expect(tailwindConfig).toContain('bg: "rgb(var(--gemstone-bg-rgb) / <alpha-value>)"');
    expect(tailwindConfig).toContain('cyan: "rgb(var(--gemstone-cyan-rgb) / <alpha-value>)"');
    expect(tailwindConfig).toContain("gemstone-grid");
    expect(tailwindConfig).toContain("gemstone-network");
    expect(pageSource).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(pageSource).not.toMatch(/(?:bg|text|border)-(?:slate|gray|cyan|blue)-\d+/);
  });
});
