"use client";

import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";

import { useMotionResolution } from "@/components/ui/MotionProvider";
import { isValidArchitectureGraph, selectArchitectureEntity } from "@/lib/architecture-graph";
import type {
  ArchitectureConnection,
  ArchitectureContent,
  ArchitectureEntity,
  ArchitectureEntityKind,
} from "@/types";

export interface ArchitectureDiagramProps {
  readonly content: ArchitectureContent;
  readonly reducedMotion?: boolean;
}

const kindLabels: Record<ArchitectureEntityKind, string> = {
  hub: "Hub",
  node: "Node",
  client: "Client",
};

const kindDescriptions: Record<ArchitectureEntityKind, string> = {
  hub: "An enterprise service point that connects with peer Hubs and provides services to assigned Nodes.",
  node: "A mission-specific backbone assigned to one Hub, with tailored services and infrastructure for its community.",
  client:
    "A user-facing service or resource assigned to one Node for its required services, tools, data, or compute.",
};

const controlClasses: Record<ArchitectureEntityKind, string> = {
  hub: "border-gemstone-cyan/90 bg-gemstone-blue/75 text-gemstone-cyan shadow-gemstone-glow hover:border-gemstone-text hover:bg-gemstone-blue",
  node: "border-gemstone-blue bg-gemstone-blue/40 text-gemstone-accent hover:border-gemstone-accent hover:bg-gemstone-blue/65",
  client:
    "border-gemstone-muted/65 bg-gemstone-surface-raised/95 text-gemstone-text hover:border-gemstone-accent hover:bg-gemstone-surface-elevated",
};

function getKindLabel(kind: ArchitectureEntityKind) {
  return kindLabels[kind];
}

function getEntity(content: ArchitectureContent, entityId: string) {
  return selectArchitectureEntity(content, entityId);
}

function connectionKey(connection: ArchitectureConnection, index: number) {
  return `${connection.from}-${connection.to}-${index}`;
}

function isConnectionSelected(connection: ArchitectureConnection, selectedEntityId: string | null) {
  return Boolean(
    selectedEntityId &&
    (connection.from === selectedEntityId || connection.to === selectedEntityId),
  );
}

function EntityControl({
  entity,
  selected,
  onActivate,
  onFocus,
  onHover,
}: {
  readonly entity: ArchitectureEntity;
  readonly selected: boolean;
  readonly onActivate: (entity: ArchitectureEntity) => void;
  readonly onFocus: (entity: ArchitectureEntity) => void;
  readonly onHover: (entity: ArchitectureEntity) => void;
}) {
  const kind = getKindLabel(entity.kind);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate(entity);
    }
  }

  const positionStyle = {
    left: `${entity.x}%`,
    top: `${entity.y}%`,
  } satisfies CSSProperties;

  const sizeClass = entity.kind === "hub" ? "w-40" : entity.kind === "node" ? "w-24" : "w-20";

  return (
    <button
      type="button"
      className={`group absolute min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-gemstone border px-2 py-2 text-center shadow-gemstone transition-[border-color,box-shadow,background-color] motion-reduce:transition-none ${sizeClass} ${
        selected
          ? "border-gemstone-text bg-gemstone-surface-elevated shadow-gemstone-glow"
          : controlClasses[entity.kind]
      }`}
      style={positionStyle}
      aria-label={`${kind}: ${entity.label}`}
      aria-pressed={selected}
      aria-controls="architecture-detail"
      data-entity-id={entity.id}
      data-entity-kind={entity.kind}
      data-selected={selected ? "true" : "false"}
      onClick={() => onActivate(entity)}
      onFocus={() => onFocus(entity)}
      onMouseEnter={() => onHover(entity)}
      onKeyDown={handleKeyDown}
    >
      <span className="block text-[0.625rem] font-bold uppercase tracking-[0.12em]">{kind}</span>
      <span className="mt-1 hidden text-xs font-semibold md:block">{entity.label}</span>
      <span className="mt-1 block text-[0.625rem] font-semibold md:hidden">
        {entity.mobileLabel ?? entity.label}
      </span>
    </button>
  );
}

/**
 * Interactive hierarchy map. Three peer Hubs form a prominent mesh, while each
 * Node attaches to one Hub and every Client attaches to one Node.
 */
export function ArchitectureDiagram({ content, reducedMotion = false }: ArchitectureDiagramProps) {
  const motion = useMotionResolution();
  const motionReduced = reducedMotion || motion.mode === "reduced";
  const continuousPathMotion = !motionReduced && motion.continuousBackgroundMotion;
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [focusedEntityId, setFocusedEntityId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState(
    "Select a Hub, Node, or Client to view its architecture detail.",
  );
  const graphIsValid = isValidArchitectureGraph(content);

  const selectedEntity = useMemo(
    () => (selectedEntityId ? getEntity(content, selectedEntityId) : null),
    [content, selectedEntityId],
  );
  const focusedEntity = useMemo(
    () => (focusedEntityId ? getEntity(content, focusedEntityId) : null),
    [content, focusedEntityId],
  );
  const detailEntity = selectedEntity ?? focusedEntity;

  function activateEntity(entity: ArchitectureEntity) {
    setSelectedEntityId(entity.id);
    setFocusedEntityId(entity.id);
    setAnnouncement(`Selected ${getKindLabel(entity.kind)} ${entity.label}.`);
  }

  function focusEntity(entity: ArchitectureEntity) {
    setFocusedEntityId(entity.id);
    setAnnouncement(`Focused ${getKindLabel(entity.kind)} ${entity.label}.`);
  }

  function hoverEntity(entity: ArchitectureEntity) {
    setFocusedEntityId(entity.id);
  }

  function handleDiagramKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setSelectedEntityId(null);
      setFocusedEntityId(null);
      setAnnouncement("Architecture selection cleared.");
    }
  }

  return (
    <div
      className="space-y-8"
      data-architecture-diagram
      data-testid="architecture-diagram-root"
      data-motion={motionReduced ? "reduced" : motion.mode}
      data-continuous-motion={continuousPathMotion ? "enabled" : "disabled"}
      data-reduced-motion={motionReduced ? "true" : "false"}
      onKeyDown={handleDiagramKeyDown}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)] xl:items-start">
        <div>
          <div
            className="gemstone-surface overflow-x-auto rounded-gemstone-lg p-4 sm:p-6"
            data-architecture-visual
            aria-label="Three connected GEMSTONE Hubs with assigned Nodes and Clients"
          >
            <div className="relative h-[44rem] min-w-[42rem] md:min-w-0">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                focusable="false"
                aria-hidden="true"
              >
                <defs>
                  <filter id="hub-connection-glow" x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {graphIsValid
                  ? content.connections.map((connection, index) => {
                      const from = getEntity(content, connection.from);
                      const to = getEntity(content, connection.to);
                      if (!from || !to) return null;

                      const selected = isConnectionSelected(connection, selectedEntityId);
                      const faded = Boolean(selectedEntityId && !selected);
                      const key = connectionKey(connection, index);
                      const isInterHub = connection.kind === "inter-hub";

                      if (isInterHub) {
                        return (
                          <g
                            key={key}
                            data-connection-id={key}
                            data-connection-kind="inter-hub"
                            data-selected={selected ? "true" : "false"}
                          >
                            <line
                              x1={from.x}
                              y1={from.y}
                              x2={to.x}
                              y2={to.y}
                              stroke="currentColor"
                              strokeWidth="3.2"
                              opacity={faded ? 0.16 : 0.32}
                              className="text-gemstone-cyan"
                              filter="url(#hub-connection-glow)"
                            />
                            <line
                              x1={from.x}
                              y1={from.y}
                              x2={to.x}
                              y2={to.y}
                              stroke="currentColor"
                              strokeWidth={selected ? "1.8" : "1.15"}
                              opacity={faded ? 0.36 : 1}
                              className="text-gemstone-cyan"
                            />
                          </g>
                        );
                      }

                      return (
                        <line
                          key={key}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="currentColor"
                          strokeWidth={selected ? "1.15" : "0.55"}
                          opacity={faded ? 0.2 : 0.82}
                          className="gemstone-network-path text-gemstone-blue/90"
                          data-connection-id={key}
                          data-connection-kind={connection.kind ?? "hierarchy"}
                          data-selected={selected ? "true" : "false"}
                        />
                      );
                    })
                  : null}
              </svg>

              <div className="relative z-10 h-full">
                {content.entities.map((entity) => (
                  <EntityControl
                    key={entity.id}
                    entity={entity}
                    selected={selectedEntityId === entity.id}
                    onActivate={activateEntity}
                    onFocus={focusEntity}
                    onHover={hoverEntity}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="gemstone-body mt-3 text-sm">
            Select an entity with a pointer, Enter, or Space. Hub-to-Hub links are brighter to show
            peer connectivity. On smaller screens, swipe horizontally to explore the complete map.
          </p>
        </div>

        <aside
          id="architecture-detail"
          className="gemstone-surface-raised rounded-gemstone-lg p-5 sm:p-6"
          aria-labelledby="architecture-detail-heading"
          aria-live="polite"
          aria-atomic="true"
          data-architecture-detail
        >
          <p className="gemstone-eyebrow">Selected detail</p>
          <h3 id="architecture-detail-heading" className="mt-2 text-2xl text-gemstone-text">
            {detailEntity
              ? `${getKindLabel(detailEntity.kind)}: ${detailEntity.label}`
              : "Hub, Node, and Client"}
          </h3>
          {detailEntity ? (
            <>
              <p className="gemstone-body mt-4 text-base">{kindDescriptions[detailEntity.kind]}</p>
              <p className="gemstone-body mt-4 text-base">{detailEntity.description}</p>
            </>
          ) : (
            <p className="gemstone-body mt-4 text-base">
              Three connected Hubs provide peer connectivity. Each Node connects to one Hub, and
              each Client connects to one Node. Organizations and Nodes retain their own
              environments and capabilities while participating in the broader ecosystem or
              instantiate new environments on compute that meets the mission needs.
            </p>
          )}
        </aside>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
