import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MatrixSection } from "@/components/sections/MatrixSection";
import { analystBenefits, ecosystemContent } from "@/content/site-content";
import { modelingSimulationMatrix } from "@/content/matrix";
import {
  assertStaticFallback,
  setViewport,
  viewportPresets,
} from "../helpers/component-test-helpers";
describe("MatrixSection", () => {
  it("renders the typed organizations, environments, Nodes, Clients, and subscriptions", () => {
    render(
      <main>
        <MatrixSection
          matrix={modelingSimulationMatrix}
          ecosystem={ecosystemContent}
          analystBenefits={analystBenefits}
        />
      </main>,
    );
    expect(screen.getByText("Modeling and Simulation Matrix")).toBeVisible();
    expect(
      screen.getByText(
        "The Modeling and Simulation Matrix is a multi-environment system within an organization enabled by the GEMSTONE Platform.",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("list", {
        name: "Organizations in the Modeling and Simulation Matrix",
      }),
    ).toHaveTextContent("Participating organizations");
    expect(
      screen.getByRole("list", {
        name: "Environments in the Modeling and Simulation Matrix",
      }),
    ).toHaveTextContent("Multiple environments within an organization");
    expect(
      screen.getByRole("list", { name: "Nodes in the Modeling and Simulation Matrix" }),
    ).toHaveTextContent("Mission-specific Node");
    expect(
      screen.getByRole("list", { name: "Clients in the Modeling and Simulation Matrix" }),
    ).toHaveTextContent("Clients");
    expect(screen.getByRole("list", { name: "Client subscriptions to Nodes" })).toHaveTextContent(
      "subscribes to one or more Nodes",
    );
  });
  it("presents ecosystem connections and every approved analyst benefit", () => {
    render(
      <main>
        <MatrixSection
          matrix={modelingSimulationMatrix}
          ecosystem={ecosystemContent}
          analystBenefits={analystBenefits}
        />
      </main>,
    );
    const ecosystemList = screen.getByRole("list", { name: "GEMSTONE ecosystem connections" });
    for (const point of ecosystemContent.points) {
      expect(ecosystemList).toHaveTextContent(point);
    }
    for (const benefit of analystBenefits) {
      expect(screen.getByRole("heading", { name: benefit.title, level: 4 })).toBeVisible();
      expect(screen.getByText(benefit.description)).toBeVisible();
    }
    expect(screen.getByRole("list", { name: "GEMSTONE ecosystem connections" })).toHaveTextContent(
      /securely subscribe|exchange data|share information/i,
    );
    expect(screen.getByRole("list", { name: "GEMSTONE ecosystem connections" })).toHaveTextContent(
      /digital supply chains/i,
    );
    expect(screen.getByRole("heading", { name: "THE M&S ECOSYSTEM" })).toBeVisible();
  });
  it("keeps equivalent labeled entities, relationships, and fallback content at mobile and desktop widths", () => {
    const snapshots: string[] = [];

    for (const viewport of [viewportPresets.mobile, viewportPresets.desktop]) {
      const restoreViewport = setViewport(viewport);
      const { container, unmount } = render(
        <main>
          <MatrixSection
            matrix={modelingSimulationMatrix}
            ecosystem={ecosystemContent}
            analystBenefits={analystBenefits}
          />
        </main>,
      );

      const entityLists = ["Organizations", "Environments", "Nodes", "Clients"].map(
        (label) =>
          screen.getByRole("list", {
            name: `${label} in the Modeling and Simulation Matrix`,
          }).textContent,
      );
      const subscriptions = screen.getByRole("list", {
        name: "Client subscriptions to Nodes",
      }).textContent;
      const sharedConnections = screen.getByRole("list", {
        name: "Modeling and Simulation Matrix shared connections",
      }).textContent;

      expect(container.querySelector("[data-matrix-section]")).toHaveAttribute(
        "data-visualization-mode",
        "static",
      );
      expect(entityLists).toEqual([
        expect.stringContaining("Participating organizations"),
        expect.stringContaining("Multiple environments within an organization"),
        expect.stringContaining("Mission-specific Node"),
        expect.stringContaining("Clients"),
      ]);
      expect(subscriptions).toContain("subscribes to one or more Nodes");
      expect(sharedConnections).toContain("retains its own environments and capabilities");
      assertStaticFallback(container, {
        requiredSelectors: ["[data-matrix-fallback]"],
        requiredText: [
          "Modeling and Simulation Matrix",
          "securely subscribe, exchange data, and share information",
          "Approved analyst benefits",
        ],
      });

      snapshots.push(JSON.stringify({ entityLists, subscriptions, sharedConnections }));
      unmount();
      restoreViewport();
    }

    expect(snapshots[0]).toBe(snapshots[1]);
  });

  it("keeps the matrix and distributed ecosystem explanation in static readable HTML", () => {
    const markup = renderToStaticMarkup(
      <MatrixSection
        matrix={modelingSimulationMatrix}
        ecosystem={ecosystemContent}
        analystBenefits={analystBenefits}
      />,
    );
    expect(markup).toMatch(/multiple environments/i);
    expect(markup).toMatch(/mission-specific Node/i);
    expect(markup).toContain("subscribes to one or more Nodes");
    expect(markup).toContain("securely subscribe");
    expect(markup).toContain("exchange data");
    expect(markup).toContain("share information");
    expect(markup).toContain("digital supply chains");
    expect(markup).toContain("meshes across government and industry");
    expect(markup).toContain("cloud, HPC, and on-premises environments");
    expect(markup).toContain("data-matrix-fallback");
    expect(markup).not.toMatch(/one environment replaces all others|all data flows through/i);
  });
  it("has no axe violations for the static matrix presentation", async () => {
    const { container } = render(
      <main>
        <MatrixSection
          matrix={modelingSimulationMatrix}
          ecosystem={ecosystemContent}
          analystBenefits={analystBenefits}
        />
      </main>,
    );
    const results = await axe.run(container, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    });
    expect(results.violations).toEqual([]);
  });
});
