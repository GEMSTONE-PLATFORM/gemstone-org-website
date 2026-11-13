import axe from "axe-core";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";
import { architectureContent } from "@/content/site-content";
import { setViewport, viewportPresets } from "../helpers/component-test-helpers";
import type { ArchitectureContent } from "@/types";

const emptyArchitecture: ArchitectureContent = {
  entities: [],
  connections: [],
  distributedPrinciple:
    "Organizations and Nodes retain their own environments and capabilities while participating in the broader ecosystem.",
};

describe("ArchitectureSection", () => {
  it("renders the Hub, Node, and Client controls without legacy legend or relationship panels", () => {
    const { container } = render(<ArchitectureSection content={architectureContent} />);

    expect(screen.getByRole("region", { name: "Architecture" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Hub: GEMSTONE \| HUB/ })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /Node: GEMSTONE \| Node/ })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /Client: GEMSTONE \| Client/ })).toHaveLength(2);
    expect(container.querySelector("[data-architecture-visual]")).toBeInTheDocument();
    expect(screen.queryByText("Architecture legend")).not.toBeInTheDocument();
    expect(screen.queryByText("Readable relationship list")).not.toBeInTheDocument();
  });

  it("updates the detail panel and emphasizes related connections on pointer activation", () => {
    render(<ArchitectureSection content={architectureContent} />);
    const hub = screen.getByRole("button", { name: "Hub: GEMSTONE | HUB" });

    fireEvent.click(hub);

    expect(screen.getByRole("heading", { name: "Hub: GEMSTONE | HUB" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent("service and connection point");
    expect(document.querySelectorAll('[data-connection-id][data-selected="true"]')).toHaveLength(2);
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

  it("keeps the connected visual and entity controls at mobile and desktop widths", () => {
    const snapshots: string[] = [];

    for (const viewport of [viewportPresets.mobile, viewportPresets.desktop]) {
      const restoreViewport = setViewport(viewport);
      const { container, unmount } = render(<ArchitectureSection content={architectureContent} />);
      const visual = container.querySelector("[data-architecture-visual]");
      const controls = screen
        .getAllByRole("button")
        .map((control) => control.getAttribute("aria-label"));

      expect(visual).toBeInTheDocument();
      expect(controls).toEqual([
        "Hub: GEMSTONE | HUB",
        "Node: GEMSTONE | Node",
        "Node: GEMSTONE | Node",
        "Client: GEMSTONE | Client",
        "Client: GEMSTONE | Client",
      ]);
      expect(container.querySelector("[data-architecture-fallback]")).not.toBeInTheDocument();
      snapshots.push(JSON.stringify(controls));
      unmount();
      restoreViewport();
    }

    expect(snapshots[0]).toBe(snapshots[1]);
  });

  it("keeps reduced-motion and empty states readable", () => {
    const { rerender } = render(
      <ArchitectureDiagram content={architectureContent} reducedMotion />,
    );
    expect(screen.getByTestId("architecture-diagram-root")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(screen.getAllByRole("button")).toHaveLength(5);

    rerender(<ArchitectureDiagram content={emptyArchitecture} reducedMotion />);
    expect(screen.getByTestId("architecture-diagram-root")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Hub, Node, and Client" })).toBeInTheDocument();
  });

  it("preserves the architecture explanation and distributed semantics before hydration", () => {
    const markup = renderToStaticMarkup(<ArchitectureSection content={architectureContent} />);

    expect(markup).toContain("Hub");
    expect(markup).toContain("Node");
    expect(markup).toContain("Client");
    expect(markup).toContain(
      "Organizations and Nodes retain their own environments and capabilities",
    );
    expect(markup).not.toContain("Modeling and Simulation Matrix");
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
