import axe from "axe-core";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";
import { architectureContent } from "@/content/site-content";
import {
  assertStaticFallback,
  setViewport,
  viewportPresets,
} from "../helpers/component-test-helpers";
import type { ArchitectureContent } from "@/types";

const emptyArchitecture: ArchitectureContent = {
  entities: [],
  connections: [],
  distributedPrinciple:
    "Organizations and Nodes retain their own environments and capabilities while participating in the broader ecosystem.",
};

describe("ArchitectureSection", () => {
  it("renders labeled Hub, Node, and Client entities with a legend and readable relationships", () => {
    render(<ArchitectureSection content={architectureContent} />);

    expect(screen.getByRole("region", { name: "Architecture" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Architecture legend" })).toHaveTextContent("Hub");
    expect(screen.getByRole("list", { name: "Architecture legend" })).toHaveTextContent("Node");
    expect(screen.getByRole("list", { name: "Architecture legend" })).toHaveTextContent("Client");
    expect(
      screen.getByRole("list", { name: "Hub, Node, and Client relationships" }),
    ).toHaveTextContent("connect directly");
    expect(screen.getAllByRole("button", { name: /Hub: GEMSTONE \| HUB/ })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /Node: GEMSTONE \| Node/ })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /Client: GEMSTONE \| Client/ })).toHaveLength(2);
  });

  it("updates the detail panel and emphasizes related connections on pointer activation", () => {
    render(<ArchitectureSection content={architectureContent} />);
    const hub = screen.getByRole("button", { name: "Hub: GEMSTONE | HUB" });

    fireEvent.click(hub);

    expect(screen.getByRole("heading", { name: "Hub: GEMSTONE | HUB" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent("service and connection point");
    expect(document.querySelectorAll('[data-connection-id][data-selected="true"]')).toHaveLength(4);
    expect(screen.getByRole("status")).toHaveTextContent("Selected Hub GEMSTONE | HUB.");
  });

  it("supports focus, Enter, Space, and Escape for entity selection", () => {
    render(<ArchitectureSection content={architectureContent} />);
    const node = screen.getAllByRole("button", { name: /Node: GEMSTONE \| Node/ })[0];
    const client = screen.getAllByRole("button", { name: /Client: GEMSTONE \| Client/ })[0];

    fireEvent.focus(node);
    expect(screen.getByRole("heading", { name: /Node: GEMSTONE \| Node/ })).toBeInTheDocument();

    fireEvent.keyDown(node, { key: "Enter" });
    expect(node).toHaveAttribute("aria-pressed", "true");

    fireEvent.keyDown(client, { key: " " });
    expect(client).toHaveAttribute("aria-pressed", "true");
    expect(node).toHaveAttribute("aria-pressed", "false");

    fireEvent.keyDown(client, { key: "Escape" });
    expect(screen.getByRole("heading", { name: "Hub, Node, and Client" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Architecture selection cleared.");
  });

  it("preserves equivalent entity labels, relationships, and static fallback content on mobile and desktop", () => {
    const snapshots: string[] = [];

    for (const viewport of [viewportPresets.mobile, viewportPresets.desktop]) {
      const restoreViewport = setViewport(viewport);
      const { container, unmount } = render(<ArchitectureSection content={architectureContent} />);

      const entityLabels = screen
        .getAllByRole("button")
        .map((control) => control.getAttribute("aria-label"));
      const legend = screen.getByRole("list", { name: "Architecture legend" }).textContent;
      const relationships = screen.getByRole("list", {
        name: "Hub, Node, and Client relationships",
      }).textContent;

      expect(screen.getByTestId("architecture-diagram-root")).toHaveAttribute(
        "data-motion",
        "standard",
      );
      expect(entityLabels).toEqual([
        "Hub: GEMSTONE | HUB",
        "Node: GEMSTONE | Node",
        "Node: GEMSTONE | Node",
        "Client: GEMSTONE | Client",
        "Client: GEMSTONE | Client",
      ]);
      expect(legend).toContain("Hub");
      expect(legend).toContain("Node");
      expect(legend).toContain("Client");
      expect(relationships).toContain("connect directly");
      assertStaticFallback(container, {
        requiredSelectors: ["[data-architecture-fallback]"],
        requiredText: [
          "Readable relationship list",
          "Organizations and Nodes retain their own environments and capabilities",
        ],
      });

      snapshots.push(JSON.stringify({ entityLabels, legend, relationships }));
      unmount();
      restoreViewport();
    }

    expect(snapshots[0]).toBe(snapshots[1]);
  });

  it("keeps reduced-motion and non-rendering fallback states readable", () => {
    const { rerender } = render(
      <ArchitectureDiagram content={architectureContent} reducedMotion />,
    );
    expect(screen.getByTestId("architecture-diagram-root")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(screen.getByRole("list", { name: "Architecture legend" })).toHaveTextContent("Hub");
    expect(
      screen.getByRole("list", { name: "Hub, Node, and Client relationships" }),
    ).toHaveTextContent("connect directly");

    rerender(<ArchitectureDiagram content={emptyArchitecture} reducedMotion />);
    expect(screen.getByTestId("architecture-diagram-root")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(screen.getByText(/No relationship data is configured/)).toBeInTheDocument();
    expect(screen.getByText(/entity descriptions remain available/)).toBeInTheDocument();
  });

  it("preserves the architecture explanation and distributed semantics before hydration", () => {
    const markup = renderToStaticMarkup(<ArchitectureSection content={architectureContent} />);

    expect(markup).toContain("Hub");
    expect(markup).toContain("Node");
    expect(markup).toContain("Client");
    expect(markup).toContain(
      "Organizations and Nodes retain their own environments and capabilities",
    );
    expect(markup).not.toMatch(/central data store|master repository|all data flows through here/i);
  });

  it("has no axe violations for the architecture region", async () => {
    const { container } = render(<ArchitectureSection content={architectureContent} />);
    const region = container.querySelector("#architecture");
    expect(region).toBeInTheDocument();

    const results = await axe.run(region as HTMLElement, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    });

    expect(results.violations).toEqual([]);
  });
});
