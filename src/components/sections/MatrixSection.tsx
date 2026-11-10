import type {
  AnalystBenefitItem,
  EcosystemContent,
  MatrixClient,
  MatrixEnvironment,
  MatrixNode,
  MatrixOrganization,
  ModelingSimulationMatrix,
} from "@/types";

import { Card, Icon } from "@/components/ui";

interface MatrixEntityListProps {
  readonly label: string;
  readonly items: readonly (MatrixOrganization | MatrixEnvironment | MatrixNode | MatrixClient)[];
}

function MatrixEntityList({ label, items }: MatrixEntityListProps) {
  return (
    <div className="min-w-0">
      <h4 className="text-lg text-gemstone-text">{label}</h4>
      <ul className="mt-3 space-y-3" aria-label={`${label} in the Modeling and Simulation Matrix`}>
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-gemstone-sm border border-gemstone-border/25 bg-gemstone-bg/35 p-4"
          >
            <p className="font-semibold text-gemstone-text">{item.label}</p>
            <p className="mt-1 text-sm text-gemstone-muted">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function matrixIdentityLabel(matrix: ModelingSimulationMatrix, id: string) {
  const entries = [
    ...matrix.organizations,
    ...matrix.environments,
    ...matrix.nodes,
    ...matrix.clients,
  ];

  return entries.find((entry) => entry.id === id)?.label ?? id;
}

function benefitIcon(item: AnalystBenefitItem) {
  return <Icon name={item.icon} size={22} strokeWidth={1.75} />;
}

export interface MatrixSectionProps {
  readonly matrix: ModelingSimulationMatrix;
  readonly ecosystem: EcosystemContent;
  readonly analystBenefits: readonly AnalystBenefitItem[];
}

/**
 * Server-rendered matrix and ecosystem presentation. The cards and relationship lists are the
 * readable fallback as well as the visual treatment, so the explanation does not depend on an
 * interactive graph, animation, or client-side hydration.
 */
export function MatrixSection({ matrix, ecosystem, analystBenefits }: MatrixSectionProps) {
  return (
    <div
      id="matrix"
      aria-labelledby="matrix-heading"
      className="mt-12 scroll-mt-24 border-t border-gemstone-border/25 pt-12"
      data-matrix-section
      data-visualization-mode="static"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div>
          <p className="gemstone-eyebrow">Distributed participation model</p>
          <h3 id="matrix-heading" className="mt-3 text-3xl text-gemstone-text sm:text-4xl">
            Modeling and Simulation Matrix
          </h3>
          <p className="gemstone-body mt-5">{matrix.description}</p>
          <p className="gemstone-body mt-5 text-base">
            Organizations retain distinct environments. Mission-specific Nodes support different
            communities or missions, and Clients can subscribe to one or more Nodes according to
            their needs.
          </p>
        </div>

        <div
          className="gemstone-surface rounded-gemstone-lg p-5 sm:p-6"
          aria-label="Static Modeling and Simulation Matrix visualization"
          data-matrix-visualization
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <MatrixEntityList label="Organizations" items={matrix.organizations} />
            <MatrixEntityList label="Environments" items={matrix.environments} />
            <MatrixEntityList label="Nodes" items={matrix.nodes} />
            <MatrixEntityList label="Clients" items={matrix.clients} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="gemstone-surface-raised rounded-gemstone-lg p-5 sm:p-6">
          <h4 className="text-xl text-gemstone-text">Client subscriptions</h4>
          <p className="gemstone-body mt-2 text-sm">
            These labeled relationships preserve the matrix explanation when a visual graph is
            unavailable.
          </p>
          <ul
            className="mt-4 space-y-3"
            aria-label="Client subscriptions to Nodes"
            data-matrix-fallback
          >
            {matrix.subscriptions.map((subscription) => (
              <li
                key={`${subscription.clientId}-${subscription.nodeId}`}
                className="rounded-gemstone-sm border border-gemstone-border/25 bg-gemstone-bg/35 px-4 py-3 text-sm text-gemstone-muted"
              >
                <span className="font-semibold text-gemstone-text">
                  {matrixIdentityLabel(matrix, subscription.clientId)}
                </span>{" "}
                subscribes to one or more Nodes, including{" "}
                <span className="font-semibold text-gemstone-text">
                  {matrixIdentityLabel(matrix, subscription.nodeId)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="gemstone-surface-raised rounded-gemstone-lg p-5 sm:p-6">
          <h4 className="text-xl text-gemstone-text">Shared connections</h4>
          <ul
            className="mt-4 space-y-3"
            aria-label="Modeling and Simulation Matrix shared connections"
          >
            {matrix.relationships.map((relationship) => (
              <li
                key={relationship.id}
                className="rounded-gemstone-sm border border-gemstone-border/25 bg-gemstone-bg/35 px-4 py-3 text-sm text-gemstone-muted"
              >
                <span className="font-semibold text-gemstone-text">
                  {matrixIdentityLabel(matrix, relationship.from)}
                </span>{" "}
                {relationship.label}{" "}
                <span className="font-semibold text-gemstone-text">
                  {matrixIdentityLabel(matrix, relationship.to)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="gemstone-eyebrow">Connected ecosystem</p>
          <h3 id="ecosystem-heading" className="mt-3 text-3xl text-gemstone-text sm:text-4xl">
            {ecosystem.title}
          </h3>
          <p className="gemstone-body mt-5">{ecosystem.description}</p>
          <ul className="mt-5 space-y-3" aria-label="GEMSTONE ecosystem connections">
            {ecosystem.points.map((point) => (
              <li
                key={point}
                className="rounded-gemstone-sm border border-gemstone-border/25 bg-gemstone-surface/70 px-4 py-3 text-base text-gemstone-muted"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-3xl text-gemstone-text sm:text-4xl">Approved analyst benefits</h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2" aria-label="Approved analyst benefits">
            {analystBenefits.map((benefit) => (
              <li key={benefit.id}>
                <Card className="h-full p-5">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-gemstone-sm border border-gemstone-border/35 bg-gemstone-bg/60 text-gemstone-accent"
                    >
                      {benefitIcon(benefit)}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-lg text-gemstone-text">{benefit.title}</h4>
                      <p className="mt-2 text-sm text-gemstone-muted">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
