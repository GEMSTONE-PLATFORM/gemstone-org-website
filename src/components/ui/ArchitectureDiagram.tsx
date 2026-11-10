"use client";

import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";

import { useMotionResolution } from "@/components/ui/MotionProvider";
import { selectArchitectureEntity, isValidArchitectureGraph } from "@/lib/architecture-graph";
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
  hub: "A service and connection point providing enterprise-level services and connections for organizations and communities.",
  node: "A tailorable mission-specific, team-specific, or community-specific backbone containing services and infrastructure.",
  client:
    "A user-facing service or resource containing users, tools, data, compute, models, or simulations that connects to one or more Nodes.",
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

  return (
    <button
      type="button"
      className={`group min-h-11 w-full rounded-gemstone border px-4 py-3 text-left shadow-gemstone transition-[border-color,box-shadow,background-color] motion-reduce:transition-none md:absolute md:w-[11rem] md:-translate-x-1/2 md:-translate-y-1/2 ${
        selected
          ? "border-gemstone-cyan bg-gemstone-surface-elevated shadow-gemstone-glow"
          : "border-gemstone-border/35 bg-gemstone-surface-raised/95 hover:border-gemstone-cyan/70 hover:bg-gemstone-surface-elevated"
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
      <span className="block font-mono text-xs font-bold uppercase tracking-[0.16em] text-gemstone-accent">
        {kind}
      </span>
      <span className="mt-1 block text-sm font-semibold text-gemstone-text">{entity.label}</span>
    </button>
  );
}

/**
 * Progressive architecture graph enhancement. The semantic entity and relationship lists are
 * rendered alongside the SVG so the explanation remains available without client interaction.
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] lg:items-start">
        <div>
          <div
            className="gemstone-surface relative overflow-hidden rounded-gemstone-lg p-4 sm:p-6"
            data-architecture-visual
            aria-label="Responsive Hub, Node, and Client architecture visualization"
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full text-gemstone-cyan/45"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              focusable="false"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="architecture-connection" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.18" />
                </linearGradient>
              </defs>
              {graphIsValid
                ? content.connections.map((connection, index) => {
                    const from = getEntity(content, connection.from);
                    const to = getEntity(content, connection.to);
                    if (!from || !to) return null;
                    const selected = isConnectionSelected(connection, selectedEntityId);

                    return (
                      <line
                        key={connectionKey(connection, index)}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={selected ? "currentColor" : "url(#architecture-connection)"}
                        strokeWidth={selected ? "1.2" : "0.65"}
                        strokeDasharray={selected ? undefined : "1.6 1.4"}
                        opacity={selectedEntityId && !selected ? 0.28 : 0.9}
                        className="gemstone-network-path"
                        data-connection-id={connectionKey(connection, index)}
                        data-selected={selected ? "true" : "false"}
                      />
                    );
                  })
                : null}
            </svg>

            <div className="relative z-10 grid gap-3 md:min-h-[28rem] md:block">
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
          <p className="gemstone-body mt-3 text-sm">
            Select an entity with a pointer, Enter, or Space. Connection emphasis follows the
            selected entity.
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
              Choose a labeled entity to inspect its role and related connections. Organizations and
              Nodes retain their own environments and capabilities while participating in the
              broader ecosystem.
            </p>
          )}
        </aside>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <div className="gemstone-surface rounded-gemstone-lg p-5 sm:p-6">
          <h3 className="text-xl text-gemstone-text">Architecture legend</h3>
          <ul className="mt-4 space-y-3" aria-label="Architecture legend">
            {(Object.keys(kindLabels) as ArchitectureEntityKind[]).map((kind) => (
              <li key={kind} className="flex items-start gap-3 text-sm text-gemstone-muted">
                <span
                  className="mt-1 size-3 shrink-0 rounded-full border-2 border-gemstone-cyan"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-gemstone-text">{kindLabels[kind]}</strong>:{" "}
                  {kindDescriptions[kind]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="gemstone-surface rounded-gemstone-lg p-5 sm:p-6" data-architecture-fallback>
          <h3 className="text-xl text-gemstone-text">Readable relationship list</h3>
          <p className="gemstone-body mt-2 text-sm">
            This labeled list preserves the architecture explanation when the visual graph or its
            interaction is unavailable.
          </p>
          <ol className="mt-4 space-y-3" aria-label="Hub, Node, and Client relationships">
            {content.connections.length > 0 ? (
              content.connections.map((connection, index) => {
                const from = getEntity(content, connection.from);
                const to = getEntity(content, connection.to);
                if (!from || !to) return null;
                const selected = isConnectionSelected(connection, selectedEntityId);

                return (
                  <li
                    key={connectionKey(connection, index)}
                    className={`rounded-gemstone-sm border px-4 py-3 text-sm text-gemstone-muted transition-colors motion-reduce:transition-none ${
                      selected
                        ? "border-gemstone-cyan bg-gemstone-surface-elevated text-gemstone-text"
                        : "border-gemstone-border/20 bg-gemstone-bg/30"
                    }`}
                    data-connection-id={connectionKey(connection, index)}
                    data-selected={selected ? "true" : "false"}
                  >
                    <span className="font-semibold text-gemstone-text">{from.label}</span>{" "}
                    <span>{connection.label}</span>{" "}
                    <span className="font-semibold text-gemstone-text">{to.label}</span>
                  </li>
                );
              })
            ) : (
              <li className="text-sm text-gemstone-muted">
                No relationship data is configured. The entity descriptions remain available above.
              </li>
            )}
          </ol>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
