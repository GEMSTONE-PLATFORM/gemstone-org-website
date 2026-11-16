import axe from "axe-core";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";
import { siteManifest } from "@/content/site-manifest";

const architectureContent = siteManifest.content.architecture;
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
    expect(
      screen.getByTestId("architecture-diagram-root").querySelector('[role="status"]'),
    ).toHaveTextContent("Selected Hub GEMSTONE | HUB.");
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
    expect(
      screen.getByTestId("architecture-diagram-root").querySelector('[role="status"]'),
    ).toHaveTextContent("Architecture selection cleared.");
  });

  it("keeps the connected visual and entity controls at mobile and desktop widths", () => {
    const snapshots: string[] = [];

    for (const viewport of [viewportPresets.mobile, viewportPresets.desktop]) {
      const restoreViewport = setViewport(viewport);
      const { container, unmount } = render(<ArchitectureSection content={architectureContent} />);
      const visual = container.querySelector("[data-architecture-visual]");
      const controls = Array.from(
        container.querySelectorAll<HTMLButtonElement>("[data-architecture-diagram] button"),
      ).map((control) => control.getAttribute("aria-label"));

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

  it("places the expandable circular network after the M&S ecosystem and benefits", () => {
    const { container } = render(<ArchitectureSection content={architectureContent} />);
    const ecosystemHeading = screen.getByRole("heading", { name: "THE M&S ECOSYSTEM" });
    const browseHeading = screen.getByRole("heading", { name: "Browse the Network" });
    const topology = container.querySelector("[data-topology-explorer]");

    expect(topology).toBeInTheDocument();
    const hubCoordinates = Array.from(
      topology?.querySelectorAll<HTMLButtonElement>('[id^="topology-hub-"]') ?? [],
    ).map((hub) => `${hub.style.left}-${hub.style.top}`);
    expect(new Set(hubCoordinates).size).toBe(3);
    expect(
      new Set(hubCoordinates.map((coordinate) => coordinate.split("-")[1])).size,
    ).toBeGreaterThan(1);
    expect(
      ecosystemHeading.compareDocumentPosition(browseHeading) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    const addHub = screen.getByRole("button", { name: "Add Hub" });
    const addNode = screen.getByRole("button", { name: "Add Node to selected Hub" });
    const addClient = screen.getByRole("button", { name: "Add Client to selected Node" });
    expect(addNode).toBeDisabled();
    expect(addClient).toBeDisabled();

    fireEvent.click(addHub);
    expect(container.querySelectorAll('[id^="topology-hub-"]')).toHaveLength(4);
    expect(topology?.querySelectorAll("svg line")).toHaveLength(24);
    expect(addNode).toBeEnabled();

    fireEvent.click(addNode);
    expect(addClient).toBeEnabled();
    fireEvent.click(addClient);
    expect(topology).toHaveTextContent("Client 13");
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
