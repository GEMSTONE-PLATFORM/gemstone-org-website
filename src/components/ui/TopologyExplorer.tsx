"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import type {
  ArchitectureEntityKind,
  NetworkTopologyConnection,
  NetworkTopologyContent,
  NetworkTopologyEntity,
} from "@/types";

const kindLabels: Record<ArchitectureEntityKind, string> = {
  hub: "Hub",
  node: "Node",
  client: "Client",
};

const nodeClass: Record<ArchitectureEntityKind, string> = {
  hub: "size-24 border-gemstone-cyan bg-gemstone-blue text-gemstone-text shadow-gemstone-glow",
  node: "size-20 border-gemstone-accent bg-gemstone-surface-elevated text-gemstone-text",
  client: "size-16 border-gemstone-muted bg-gemstone-surface-raised text-gemstone-text",
};

interface PositionedEntity extends NetworkTopologyEntity {
  readonly x: number;
  readonly y: number;
}

function entitiesOfKind(
  entities: readonly NetworkTopologyEntity[],
  kind: ArchitectureEntityKind,
): readonly NetworkTopologyEntity[] {
  return entities.filter((entity) => entity.kind === kind);
}

function pointOnEllipse(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  angleDegrees: number,
) {
  const angle = (angleDegrees * Math.PI) / 180;
  return {
    x: centerX + Math.cos(angle) * radiusX,
    y: centerY + Math.sin(angle) * radiusY,
  };
}

function fanAngle(index: number, count: number, centerAngle: number, spread: number): number {
  if (count <= 1) return centerAngle;
  return centerAngle - spread / 2 + (spread * index) / (count - 1);
}

/** Deterministic radial layout used by both configured and visitor-added entities. */
export function createTopologyPositions(
  entities: readonly NetworkTopologyEntity[],
): readonly PositionedEntity[] {
  const hubs = entitiesOfKind(entities, "hub");
  const positioned: PositionedEntity[] = [];
  const hubAngles = new Map<string, number>();
  const hubPositions = new Map<string, { x: number; y: number }>();
  const nodeAngles = new Map<string, number>();
  const nodePositions = new Map<string, { x: number; y: number }>();

  hubs.forEach((hub, hubIndex) => {
    const angle = -90 + (360 * hubIndex) / Math.max(hubs.length, 1);
    const point = pointOnEllipse(50, 50, 19, 16, angle);
    hubAngles.set(hub.id, angle);
    hubPositions.set(hub.id, point);
    positioned.push({ ...hub, ...point });
  });

  hubs.forEach((hub) => {
    const hubPoint = hubPositions.get(hub.id);
    const hubAngle = hubAngles.get(hub.id);
    if (!hubPoint || hubAngle === undefined) return;

    const nodes = entities.filter((entity) => entity.kind === "node" && entity.parentId === hub.id);
    nodes.forEach((node, nodeIndex) => {
      const angle = fanAngle(nodeIndex, nodes.length, hubAngle, Math.min(110, 38 * nodes.length));
      const point = pointOnEllipse(hubPoint.x, hubPoint.y, 16, 14, angle);
      nodeAngles.set(node.id, angle);
      nodePositions.set(node.id, point);
      positioned.push({ ...node, ...point });
    });
  });

  entitiesOfKind(entities, "node").forEach((node) => {
    const nodePoint = nodePositions.get(node.id);
    const nodeAngle = nodeAngles.get(node.id);
    if (!nodePoint || nodeAngle === undefined) return;

    const clients = entities.filter(
      (entity) => entity.kind === "client" && entity.parentId === node.id,
    );
    clients.forEach((client, clientIndex) => {
      const angle = fanAngle(
        clientIndex,
        clients.length,
        nodeAngle,
        Math.min(100, 42 * clients.length),
      );
      const point = pointOnEllipse(nodePoint.x, nodePoint.y, 10, 9, angle);
      positioned.push({ ...client, ...point });
    });
  });

  return positioned;
}

function nextId(kind: ArchitectureEntityKind, entities: readonly NetworkTopologyEntity[]): string {
  const usedIds = new Set(entities.map((entity) => entity.id));
  let candidate = entitiesOfKind(entities, kind).length + 1;
  while (usedIds.has(`${kind}-${candidate}`)) candidate += 1;
  return `${kind}-${candidate}`;
}

export interface TopologyExplorerProps {
  readonly content: NetworkTopologyContent;
}

/**
 * Browser-only network sandbox. It preserves the configured graph while allowing
 * visitors to explore a larger radial topology during the current page visit.
 */
export function TopologyExplorer({ content }: TopologyExplorerProps) {
  const [entities, setEntities] = useState<readonly NetworkTopologyEntity[]>(content.entities);
  const [connections, setConnections] = useState<readonly NetworkTopologyConnection[]>(
    content.connections,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState(
    "Select a Hub to add a Node, or select a Node to add a Client.",
  );

  const positioned = useMemo(() => createTopologyPositions(entities), [entities]);
  const selected = entities.find((entity) => entity.id === selectedId) ?? null;
  const hubs = entitiesOfKind(entities, "hub");
  const entityById = useMemo(
    () => new Map(positioned.map((entity) => [entity.id, entity])),
    [positioned],
  );
  const canvasSizeRem = Math.max(52, 42 + hubs.length * 5);
  const canvasStyle = {
    width: `${canvasSizeRem}rem`,
    height: `${canvasSizeRem}rem`,
  } satisfies CSSProperties;

  useEffect(() => {
    if (!selectedId) return;
    document.getElementById(`topology-${selectedId}`)?.focus();
  }, [selectedId]);

  function selectEntity(entity: NetworkTopologyEntity) {
    setSelectedId(entity.id);
    setAnnouncement(`Selected ${kindLabels[entity.kind]} ${entity.label}.`);
  }

  function addHub() {
    const id = nextId("hub", entities);
    const hub: NetworkTopologyEntity = {
      id,
      kind: "hub",
      label: `Hub ${hubs.length + 1}`,
    };
    setEntities((current) => [...current, hub]);
    setConnections((current) => [
      ...current,
      ...hubs.map((existingHub) => ({ from: existingHub.id, to: id })),
    ]);
    setSelectedId(id);
    setAnnouncement(`Added ${hub.label}. It is connected to every existing Hub.`);
  }

  function addNode() {
    if (selected?.kind !== "hub") return;
    const id = nextId("node", entities);
    const node: NetworkTopologyEntity = {
      id,
      kind: "node",
      label: `Node ${entitiesOfKind(entities, "node").length + 1}`,
      parentId: selected.id,
    };
    setEntities((current) => [...current, node]);
    setConnections((current) => [...current, { from: selected.id, to: id }]);
    setSelectedId(id);
    setAnnouncement(`Added ${node.label} to ${selected.label}.`);
  }

  function addClient() {
    if (selected?.kind !== "node") return;
    const id = nextId("client", entities);
    const client: NetworkTopologyEntity = {
      id,
      kind: "client",
      label: `Client ${entitiesOfKind(entities, "client").length + 1}`,
      parentId: selected.id,
    };
    setEntities((current) => [...current, client]);
    setConnections((current) => [...current, { from: selected.id, to: id }]);
    setSelectedId(id);
    setAnnouncement(`Added ${client.label} to ${selected.label}.`);
  }

  function resetTopology() {
    setEntities(content.entities);
    setConnections(content.connections);
    setSelectedId(null);
    setAnnouncement("Restored the configured network topology.");
  }

  return (
    <div className="space-y-5" data-topology-explorer>
      <fieldset className="rounded-gemstone border border-gemstone-border/35 bg-gemstone-surface-raised/85 p-4 sm:p-5">
        <legend className="px-2 font-display text-base text-gemstone-text">Grow the network</legend>
        <p className="text-sm text-gemstone-text-muted">
          Build an example topology in this browser. Changes reset when the page reloads.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="gemstone-button-motion rounded-gemstone border border-gemstone-cyan bg-gemstone-blue px-4 py-2 text-sm font-semibold text-gemstone-text"
            onClick={addHub}
          >
            Add Hub
          </button>
          <button
            type="button"
            className="gemstone-button-motion rounded-gemstone border border-gemstone-accent/70 bg-gemstone-surface-elevated px-4 py-2 text-sm font-semibold text-gemstone-text disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selected?.kind !== "hub"}
            onClick={addNode}
          >
            Add Node to selected Hub
          </button>
          <button
            type="button"
            className="gemstone-button-motion rounded-gemstone border border-gemstone-muted/70 bg-gemstone-surface-raised px-4 py-2 text-sm font-semibold text-gemstone-text disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selected?.kind !== "node"}
            onClick={addClient}
          >
            Add Client to selected Node
          </button>
          <button
            type="button"
            className="gemstone-button-motion rounded-gemstone px-4 py-2 text-sm font-semibold text-gemstone-accent underline"
            onClick={resetTopology}
          >
            Reset example
          </button>
        </div>
      </fieldset>

      <div className="topology-viewport overflow-auto rounded-gemstone-lg border border-gemstone-border/45 bg-gemstone-surface/95">
        <div className="topology-canvas relative mx-auto" style={canvasStyle}>
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gemstone-cyan/15 shadow-[0_0_8rem_rgb(var(--gemstone-cyan-rgb)/0.12)]" />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {connections.map((connection) => {
              const from = entityById.get(connection.from);
              const to = entityById.get(connection.to);
              if (!from || !to) return null;
              const peerConnection = from.kind === "hub" && to.kind === "hub";
              const related = selectedId === from.id || selectedId === to.id;
              return (
                <line
                  key={`${connection.from}-${connection.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={peerConnection ? "text-gemstone-cyan" : "text-gemstone-accent"}
                  stroke="currentColor"
                  strokeWidth={peerConnection ? (related ? "1.5" : "1") : related ? "0.8" : "0.38"}
                  opacity={selectedId && !related ? 0.18 : peerConnection ? 0.95 : 0.62}
                />
              );
            })}
          </svg>
          {positioned.map((entity) => (
            <button
              key={entity.id}
              id={`topology-${entity.id}`}
              type="button"
              aria-pressed={selectedId === entity.id}
              data-topology-kind={entity.kind}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border p-2 text-center text-xs font-semibold shadow-gemstone transition-[background-color,border-color,box-shadow,transform] hover:scale-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-gemstone-focus motion-reduce:transition-none ${nodeClass[entity.kind]} ${selectedId === entity.id ? "ring-2 ring-gemstone-text ring-offset-2 ring-offset-gemstone-bg" : ""}`}
              style={{ left: `${entity.x}%`, top: `${entity.y}%` }}
              onClick={() => selectEntity(entity)}
            >
              <span className="block text-[0.625rem] uppercase tracking-[0.14em] opacity-80">
                {kindLabels[entity.kind]}
              </span>
              <span className="mt-1 block leading-tight">{entity.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gemstone-text-muted">
        Hubs connect to every other Hub. Nodes attach to one selected Hub. Clients attach to one
        selected Node. The web expands as you add entities.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
