import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CapabilitiesSection } from "@/components/sections/section-renderers";
import { capabilities } from "@/content/capabilities";
import type { CapabilityItem } from "@/types";

const fixtureCapability = {
  id: "fixture-capability",
  title: "Fixture Capability",
  description: "A capability added through the typed content array.",
  icon: "database",
  category: "capability",
} as const satisfies CapabilityItem;

describe("CapabilitiesSection", () => {
  it("renders every typed capability, including a newly added fixture item", () => {
    render(
      <main>
        <CapabilitiesSection items={[...capabilities, fixtureCapability]} />
      </main>,
    );

    expect(screen.getByRole("region", { name: "Capabilities" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(capabilities.length + 1);

    for (const item of [...capabilities, fixtureCapability]) {
      expect(screen.getByRole("heading", { name: item.title, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

  it("preserves the approved capability descriptions", () => {
    render(
      <main>
        <CapabilitiesSection items={capabilities} />
      </main>,
    );

    expect(
      screen.getByText(
        "Enables scalable adoption by allowing organizations to tailor and connect existing environments.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Supports protection of controlled proprietary data while keeping data inside organizational boundaries.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Provides a marketplace for integrating new or custom tools."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Includes built-in CI/CD-style data transformation across tools."),
    ).toBeInTheDocument();
  });

  it("keeps stable identifiers and non-color-only meaning in the rendered cards", () => {
    const { container } = render(<CapabilitiesSection items={capabilities} />);
    const section = container.querySelector("section#capabilities");

    expect(section).toHaveAttribute("aria-labelledby", "capabilities-heading");
    expect(section?.querySelector("#capabilities-heading")).toHaveTextContent("Capabilities");

    for (const item of capabilities) {
      const heading = screen.getByRole("heading", { name: item.title, level: 3 });
      const card = heading.closest("article");

      expect(heading).toHaveAttribute("id", `${item.id}-title`);
      expect(card).toHaveAttribute("aria-labelledby", `${item.id}-title`);
      expect(card?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(card).toHaveTextContent(item.title);
      expect(card).toHaveTextContent(item.description);
      expect(card?.className).not.toMatch(/group-hover|hover:.*hidden/);
    }
  });

  it("has no accessibility violations and does not rely on hover for meaning", async () => {
    const { container } = render(
      <main>
        <CapabilitiesSection items={[...capabilities, fixtureCapability]} />
      </main>,
    );

    const results = await axe.run(container, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"],
      },
    });

    expect(results.violations).toEqual([]);
    expect(screen.getByRole("heading", { name: fixtureCapability.title })).toBeVisible();
    expect(screen.getByText(fixtureCapability.description)).toBeVisible();
  });
});
