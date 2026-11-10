import type { ArchitectureContent, ArchitectureEntity, ArchitectureEntityKind } from "@/types";

const architectureEntityKinds: readonly ArchitectureEntityKind[] = ["hub", "node", "client"];

export type ArchitectureGraphValidationErrorCode =
  | "invalid-content"
  | "empty-entity-id"
  | "duplicate-entity-id"
  | "invalid-entity-kind"
  | "invalid-connection-endpoint";

export interface ArchitectureGraphValidationError {
  readonly code: ArchitectureGraphValidationErrorCode;
  readonly message: string;
  readonly entityId?: string;
  readonly connectionIndex?: number;
  readonly endpoint?: "from" | "to";
}

export interface ArchitectureGraphValidation {
  readonly valid: boolean;
  readonly errors: readonly ArchitectureGraphValidationError[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isArchitectureEntityKind(value: unknown): value is ArchitectureEntityKind {
  return (
    typeof value === "string" && architectureEntityKinds.includes(value as ArchitectureEntityKind)
  );
}

/**
 * Validates the structural integrity required by the architecture graph.
 *
 * Disconnected entities are valid. The graph only requires unique entity IDs,
 * supported entity kinds, and connections whose endpoints are declared IDs.
 * This function reads the graph and never mutates its content.
 */
export function validateArchitectureGraph(
  content: ArchitectureContent,
): ArchitectureGraphValidation {
  const errors: ArchitectureGraphValidationError[] = [];

  if (
    !isRecord(content) ||
    !Array.isArray(content.entities) ||
    !Array.isArray(content.connections)
  ) {
    return {
      valid: false,
      errors: [
        {
          code: "invalid-content",
          message: "Architecture content must contain entities and connections arrays.",
        },
      ],
    };
  }

  const entityIds = new Set<string>();

  content.entities.forEach((entity, entityIndex) => {
    if (!isRecord(entity) || typeof entity.id !== "string") {
      errors.push({
        code: "invalid-content",
        message: `Architecture entity at index ${entityIndex} must have a string ID.`,
      });
      return;
    }

    if (entity.id.trim().length === 0) {
      errors.push({
        code: "empty-entity-id",
        message: `Architecture entity at index ${entityIndex} must have a non-empty ID.`,
        entityId: entity.id,
      });
    } else if (entityIds.has(entity.id)) {
      errors.push({
        code: "duplicate-entity-id",
        message: `Architecture entity ID '${entity.id}' is declared more than once.`,
        entityId: entity.id,
      });
    } else {
      entityIds.add(entity.id);
    }

    if (!isArchitectureEntityKind(entity.kind)) {
      errors.push({
        code: "invalid-entity-kind",
        message: `Architecture entity '${entity.id}' must be a Hub, Node, or Client.`,
        entityId: entity.id,
      });
    }
  });

  content.connections.forEach((connection, connectionIndex) => {
    if (!isRecord(connection)) {
      errors.push({
        code: "invalid-connection-endpoint",
        message: `Architecture connection at index ${connectionIndex} must declare valid endpoints.`,
        connectionIndex,
      });
      return;
    }

    for (const endpoint of ["from", "to"] as const) {
      const endpointId = connection[endpoint];
      if (typeof endpointId !== "string" || !entityIds.has(endpointId)) {
        errors.push({
          code: "invalid-connection-endpoint",
          message: `Architecture connection at index ${connectionIndex} has an unknown ${endpoint} endpoint.`,
          connectionIndex,
          endpoint,
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/** Returns whether an architecture graph satisfies the graph integrity rules. */
export function isValidArchitectureGraph(content: ArchitectureContent): boolean {
  return validateArchitectureGraph(content).valid;
}

/**
 * Returns the selected entity from the current graph, or null for an unknown ID.
 * The returned entity is the source entry; no copy or content mutation occurs.
 */
export function selectArchitectureEntity(
  content: ArchitectureContent,
  entityId: string,
): ArchitectureEntity | null {
  if (!isRecord(content) || !Array.isArray(content.entities)) return null;

  return (
    content.entities.find(
      (entity): entity is ArchitectureEntity => isRecord(entity) && entity.id === entityId,
    ) ?? null
  );
}
