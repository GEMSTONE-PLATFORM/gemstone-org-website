import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import type { ArchitectureContent, ArchitectureEntityKind } from "@/types";

const distributedOwnershipStatement =
  "Organizations and Nodes retain their own environments and capabilities while participating in the broader ecosystem.";
const prohibitedCentralizationLabels =
  /central(?:ized)?\s+data\s+store|master\s+repository|all\s+data\s+(?:flows?\s+through|is\s+stored|stored)|central(?:ized)?\s+repository/i;

const identifierArbitrary = fc
  .string({ minLength: 1, maxLength: 12 })
  .filter((value) => /^[a-z][a-z0-9-]*$/.test(value));

function architectureContentArbitrary(): fc.Arbitrary<ArchitectureContent> {
  return fc.uniqueArray(identifierArbitrary, { minLength: 3, maxLength: 8 }).chain((entityIds) => {
    const entityKinds: readonly ArchitectureEntityKind[] = entityIds.map((_, index) => {
      if (index === 0) return "hub";
      if (index === 1) return "node";
      if (index === 2) return "client";
      return "node";
    });
    const entities = entityIds.map((id, index) => ({
      id,
      kind: entityKinds[index],
      label: id,
      description: `${id} architecture description`,
      x: 50,
      y: 50,
    }));

    const connectionArbitrary = fc.record({
      from: fc.constantFrom(...entityIds),
      to: fc.constantFrom(...entityIds),
      label: fc.constant("connects to"),
    });

    return fc.record({
      entities: fc.constant(entities),
      connections: fc.array(connectionArbitrary, { maxLength: 12 }),
      distributedPrinciple: fc.constant(distributedOwnershipStatement),
    });
  });
}

describe("architecture semantics", () => {
  // **Validates: Requirements 6.2, 6.3, 6.4, 6.6, 6.7, 7.6**
  it("Property 6: every valid architecture model preserves distributed semantics in accessible output", () => {
    fc.assert(
      fc.property(architectureContentArbitrary(), (content) => {
        const markup = renderToStaticMarkup(<ArchitectureSection content={content} />);
        const accessibleOutput = markup.replace(/<[^>]*>/g, " ");

        expect(accessibleOutput).toMatch(/\bHub\b/);
        expect(accessibleOutput).toMatch(/\bNode\b/);
        expect(accessibleOutput).toMatch(/\bClient\b/);
        expect(accessibleOutput).toContain(distributedOwnershipStatement);
        expect(accessibleOutput).not.toMatch(prohibitedCentralizationLabels);
      }),
      { numRuns: 100 },
    );
  });
});
