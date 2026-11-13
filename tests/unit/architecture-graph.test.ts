import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { architectureContent } from "@/content/site-content";
import {
  isValidArchitectureGraph,
  selectArchitectureEntity,
  validateArchitectureGraph,
} from "@/lib/architecture-graph";
import type { ArchitectureContent } from "@/types";

function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) {
      freezeDeep(nested);
    }
  }

  return value;
}

const disconnectedGraph = {
  entities: [
    {
      id: "hub",
      kind: "hub",
      label: "Hub",
      description: "Enterprise services and connections.",
      x: 50,
      y: 20,
    },
    {
      id: "unconnected-client",
      kind: "client",
      label: "Client",
      description: "A client with no current connection.",
      x: 50,
      y: 80,
    },
  ],
  connections: [],
  distributedPrinciple: "Organizations retain their environments.",
} as const satisfies ArchitectureContent;

const malformedGraph = {
  entities: [
    {
      id: "hub",
      kind: "hub",
      label: "Hub",
      description: "Enterprise services and connections.",
      x: 50,
      y: 20,
    },
    {
      id: "hub",
      kind: "service",
      label: "Invalid entity",
      description: "Invalid entity fixture.",
      x: 50,
      y: 50,
    },
  ],
  connections: [
    {
      from: "hub",
      to: "missing-node",
      label: "Unknown endpoint",
    },
  ],
  distributedPrinciple: "Organizations retain their environments.",
} as unknown as ArchitectureContent;

describe("architecture graph utilities", () => {
  it("accepts the approved architecture graph and each supported entity kind", () => {
    const result = validateArchitectureGraph(architectureContent);

    expect(result).toEqual({ valid: true, errors: [] });
    expect(isValidArchitectureGraph(architectureContent)).toBe(true);
  });

  it("accepts disconnected entities because connectivity is not a graph integrity requirement", () => {
    expect(validateArchitectureGraph(disconnectedGraph)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it("reports duplicate IDs, unsupported kinds, and unknown connection endpoints", () => {
    const result = validateArchitectureGraph(malformedGraph);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-entity-id", entityId: "hub" }),
        expect.objectContaining({ code: "invalid-entity-kind", entityId: "hub" }),
        expect.objectContaining({
          code: "invalid-connection-endpoint",
          connectionIndex: 0,
          endpoint: "to",
        }),
      ]),
    );
  });

  it("returns the matching entity and null for an unknown selection", () => {
    const selected = selectArchitectureEntity(architectureContent, "hub");

    expect(selected).toBe(architectureContent.entities[0]);
    expect(selectArchitectureEntity(architectureContent, "unknown-entity")).toBeNull();
  });

  it("does not mutate frozen graph content during validation or selection", () => {
    const graph = structuredClone(architectureContent) as ArchitectureContent;
    const snapshot = structuredClone(graph);
    freezeDeep(graph);

    expect(validateArchitectureGraph(graph)).toEqual({ valid: true, errors: [] });
    expect(selectArchitectureEntity(graph, "node-mission")).toBe(graph.entities[1]);
    expect(graph).toEqual(snapshot);
  });

  // **Validates: Requirements 6.1, 6.5, 6.8**
  it("Property 5: generated architecture graph endpoints and selections remain referentially valid", () => {
    const textArbitrary = fc.string({ minLength: 1, maxLength: 40 });
    const identifierArbitrary = fc
      .string({ minLength: 1, maxLength: 20 })
      .filter((value) => value.trim().length > 0);
    const entityKindArbitrary = fc.constantFrom("hub" as const, "node" as const, "client" as const);

    const architectureGraphArbitrary: fc.Arbitrary<ArchitectureContent> = fc
      .uniqueArray(identifierArbitrary, { minLength: 1, maxLength: 8 })
      .chain((entityIds) =>
        fc
          .array(entityKindArbitrary, {
            minLength: entityIds.length,
            maxLength: entityIds.length,
          })
          .chain((entityKinds) => {
            const entities = entityIds.map((id, index) => ({
              id,
              kind: entityKinds[index],
              label: id,
              description: `${id} description`,
              x: 50,
              y: 50,
            }));
            const connectionArbitrary = fc.record({
              from: fc.constantFrom(...entityIds),
              to: fc.constantFrom(...entityIds),
              label: textArbitrary,
            });

            return fc.record({
              entities: fc.constant(entities),
              connections: fc.array(connectionArbitrary, { maxLength: 12 }),
              distributedPrinciple: textArbitrary,
            });
          }),
      );

    fc.assert(
      fc.property(
        architectureGraphArbitrary.chain((graph) =>
          fc.record({
            graph: fc.constant(graph),
            selectionIds: fc.array(
              fc.oneof(
                fc.constantFrom(...graph.entities.map((entity) => entity.id)),
                identifierArbitrary,
              ),
              { maxLength: 12 },
            ),
          }),
        ),
        ({ graph, selectionIds }) => {
          const entityIds = new Set(graph.entities.map((entity) => entity.id));

          expect(validateArchitectureGraph(graph)).toEqual({ valid: true, errors: [] });
          for (const connection of graph.connections) {
            expect(entityIds.has(connection.from)).toBe(true);
            expect(entityIds.has(connection.to)).toBe(true);
          }

          for (const selectionId of selectionIds) {
            const selection = selectArchitectureEntity(graph, selectionId);
            expect(selection === null || entityIds.has(selection.id)).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
