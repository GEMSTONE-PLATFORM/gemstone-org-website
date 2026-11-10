import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MatrixSection } from "@/components/sections/MatrixSection";
import { analystBenefits, ecosystemContent } from "@/content/site-content";
import type { ModelingSimulationMatrix } from "@/types";

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function listItemTexts(markup: string, label: string): string[] {
  const document = new DOMParser().parseFromString(markup, "text/html");
  const list = document.querySelector(`ul[aria-label="${label}"]`);

  expect(list).not.toBeNull();

  return Array.from(list?.children ?? [])
    .filter((child) => child.tagName === "LI")
    .map((item) => normalizeText(item.textContent ?? ""));
}

const identifierArbitrary = fc.integer({ min: 0, max: 999_999 }).map((value) => `${value}`);

const matrixArbitrary: fc.Arbitrary<ModelingSimulationMatrix> = fc
  .tuple(
    identifierArbitrary,
    identifierArbitrary,
    fc.uniqueArray(identifierArbitrary, { minLength: 1, maxLength: 4 }),
    fc.uniqueArray(identifierArbitrary, { minLength: 1, maxLength: 4 }),
  )
  .filter(([organizationId, environmentId, nodeIds, clientIds]) => {
    const allIds = [organizationId, environmentId, ...nodeIds, ...clientIds];
    return new Set(allIds).size === allIds.length;
  })
  .chain(([organizationId, environmentId, nodeIds, clientIds]) => {
    const entityIds = [organizationId, environmentId, ...nodeIds, ...clientIds];
    const relationshipArbitrary = fc
      .tuple(fc.constantFrom(...entityIds), fc.constantFrom(...entityIds))
      .chain(([from, to]) =>
        identifierArbitrary.map((id) => ({
          id: `relationship-${id}`,
          kind: "supports" as const,
          from,
          to,
          label: `supports relationship-${id}`,
        })),
      );
    const subscriptionArbitrary = fc.record({
      clientId: fc.constantFrom(...clientIds),
      nodeId: fc.constantFrom(...nodeIds),
    });

    return fc
      .record({
        subscriptions: fc.uniqueArray(subscriptionArbitrary, {
          maxLength: clientIds.length * nodeIds.length,
          selector: (subscription) => `${subscription.clientId}-${subscription.nodeId}`,
        }),
        relationships: fc.uniqueArray(relationshipArbitrary, {
          maxLength: 8,
          selector: (relationship) => relationship.id,
        }),
      })
      .map(({ subscriptions, relationships }) => ({
        description: "A generated multi-environment matrix.",
        organizations: [
          {
            id: organizationId,
            label: `Organization ${organizationId}`,
            description: `Organization ${organizationId} description.`,
            environmentIds: [environmentId],
          },
        ],
        environments: [
          {
            id: environmentId,
            organizationId,
            label: `Environment ${environmentId}`,
            description: `Environment ${environmentId} description.`,
          },
        ],
        nodes: nodeIds.map((id) => ({
          id,
          label: `Node ${id}`,
          description: `Node ${id} description.`,
        })),
        clients: clientIds.map((id) => ({
          id,
          label: `Client ${id}`,
          description: `Client ${id} description.`,
          organizationId,
          environmentId,
        })),
        subscriptions,
        relationships,
      }));
  });

describe("matrix relationship property", () => {
  /** Validates: Requirements 7.1, 7.2, 7.3, 7.6 */
  it("Property 11: valid matrix endpoints and relationships remain represented exactly once in accessible output", () => {
    fc.assert(
      fc.property(matrixArbitrary, (matrix) => {
        const entities = [
          ...matrix.organizations,
          ...matrix.environments,
          ...matrix.nodes,
          ...matrix.clients,
        ];
        const labelsById = new Map(entities.map((entity) => [entity.id, entity.label]));

        for (const relationship of matrix.relationships) {
          expect(labelsById.has(relationship.from)).toBe(true);
          expect(labelsById.has(relationship.to)).toBe(true);
        }
        for (const subscription of matrix.subscriptions) {
          expect(labelsById.has(subscription.clientId)).toBe(true);
          expect(labelsById.has(subscription.nodeId)).toBe(true);
        }

        const markup = renderToStaticMarkup(
          <MatrixSection
            matrix={matrix}
            ecosystem={ecosystemContent}
            analystBenefits={analystBenefits}
          />,
        );
        const subscriptionRows = listItemTexts(markup, "Client subscriptions to Nodes");
        const relationshipRows = listItemTexts(
          markup,
          "Modeling and Simulation Matrix shared connections",
        );

        expect(subscriptionRows).toEqual(
          matrix.subscriptions.map(
            (subscription) =>
              `${labelsById.get(subscription.clientId)} subscribes to one or more Nodes, including ${labelsById.get(subscription.nodeId)}`,
          ),
        );
        expect(relationshipRows).toEqual(
          matrix.relationships.map(
            (relationship) =>
              `${labelsById.get(relationship.from)} ${relationship.label} ${labelsById.get(relationship.to)}`,
          ),
        );
      }),
      { numRuns: 100 },
    );
  });
});
