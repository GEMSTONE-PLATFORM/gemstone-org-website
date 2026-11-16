"use client";

import { useEffect, useMemo, useState } from "react";

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
  hub: "border-gemstone-cyan bg-gemstone-blue text-gemstone-text shadow-gemstone-glow",
  node: "border-gemstone-accent bg-gemstone-surface-elevated text-gemstone-text",
  client: "border-gemstone-muted bg-gemstone-surface-raised text-gemstone-text",
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

function createPositions(entities: readonly NetworkTopologyEntity[]): readonly PositionedEntity[] {
  const hubs = entitiesOfKind(entities, "hub");
  const positioned: PositionedEntity[] = [];

  hubs.forEach((hub, hubIndex) => {
    const zoneWidth = 90 / hubs.length;
    const zoneStart = 5 + hubIndex * zoneWidth;
    const hubX = zoneStart + zoneWidth / 2;
    positioned.push({ ...hub, x: hubX, y: 14 });

    const nodes = entities.filter((entity) => entity.kind === "node" && entity.parentId === hub.id);
    nodes.forEach((node, nodeIndex) => {
      const nodeX = zoneStart + (zoneWidth * (nodeIndex + 0.5)) / Math.max(nodes.length, 1);
      positioned.push({ ...node, x: nodeX, y: 48 });

      const clients = entities.filter(
        (entity) => entity.kind === "client" && entity.parentId === node.id,
      );
      clients.forEach((client, clientIndex) => {
        const clientCount = Math.max(clients.length, 1);
        const spread = Math.min(zoneWidth / Math.max(nodes.length, 1) / 3, 6);
        const clientX = nodeX + (clientIndex - (clientCount - 1) / 2) * spread;
        positioned.push({ ...client, x: clientX, y: 78 + (clientIndex % 2) * 12 });
      });
    });
  });

  return positioned;
}

function nextId(kind: ArchitectureEntityKind, entities: readonly NetworkTopologyEntity[]): string {
  return `${kind}-${entitiesOfKind(entities, kind).length + 1}`;
}

export interface TopologyExplorerProps {
  readonly content: NetworkTopologyContent;
}

/**
 * Browser-only network sandbox. It illustrates how the configured topology can
 * grow during a visit; new entities are intentionally not persisted to the static site.
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

  const positioned = useMemo(() => createPositions(entities), [entities]);
  const selected = entities.find((entity) => entity.id === selectedId) ?? null;
  const entityById = useMemo(
    () => new Map(positioned.map((entity) => [entity.id, entity])),
    [positioned],
  );

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
      label: `Hub ${entitiesOfKind(entities, "hub").length + 1}`,
    };
    const existingHubs = entitiesOfKind(entities, "hub");
    setEntities((current) => [...current, hub]);
    setConnections((current) => [
      ...current,
      ...existingHubs.map((existingHub) => ({ from: existingHub.id, to: id })),
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
    <div className="space-y-4" data-topology-explorer>
      <fieldset className="rounded-gemstone border border-gemstone-border/35 bg-gemstone-surface-raised/85 p-4">
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

      <div className="overflow-x-auto rounded-gemstone border border-gemstone-border/40 bg-gemstone-surface/95 p-4 sm:p-6">
        <div className="relative h-[38rem] min-w-[42rem]">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
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
                  className={peerConnection ? "text-gemstone-cyan" : "text-gemstone-blue"}
                  stroke="currentColor"
                  strokeWidth={peerConnection ? (related ? "2.4" : "1.6") : related ? "1.2" : "0.6"}
                  opacity={selectedId && !related ? 0.22 : peerConnection ? 0.95 : 0.78}
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
              className={`absolute min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-gemstone border px-3 py-2 text-center text-xs font-semibold shadow-gemstone transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-gemstone-focus ${nodeClass[entity.kind]} ${selectedId === entity.id ? "ring-2 ring-gemstone-text ring-offset-2 ring-offset-gemstone-bg" : ""}`}
              style={{ left: `${entity.x}%`, top: `${entity.y}%` }}
              onClick={() => selectEntity(entity)}
            >
              <span className="block text-[0.625rem] uppercase tracking-[0.14em] opacity-80">
                {kindLabels[entity.kind]}
              </span>
              <span className="mt-1 block">{entity.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gemstone-text-muted">
        Hubs connect to every other Hub. Nodes attach to one selected Hub. Clients attach to one
        selected Node.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
