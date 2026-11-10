import type { ModelingSimulationMatrix } from "@/types";

/** Approved Modeling and Simulation Matrix model. */
export const modelingSimulationMatrix = {
  description:
    "The Modeling and Simulation Matrix is a multi-environment system within an organization enabled by the GEMSTONE Platform.",
  organizations: [
    {
      id: "participating-organizations",
      label: "Participating organizations",
      description:
        "Participating organizations can securely subscribe, exchange data, and share information.",
      environmentIds: ["organizational-environments"],
    },
  ],
  environments: [
    {
      id: "organizational-environments",
      organizationId: "participating-organizations",
      label: "Multiple environments within an organization",
      description:
        "Organizations can connect existing environments without requiring one environment to replace all others.",
    },
  ],
  nodes: [
    {
      id: "mission-specific-node",
      label: "Mission-specific Node",
      description: "A Node tailored to meet specific mission M&S/DE needs and objectives.",
      mission: "Specific mission M&S/DE needs and objectives",
    },
    {
      id: "community-specific-node",
      label: "Community-specific Node",
      description: "A Node that supports a different community or mission within the matrix.",
      mission: "Different communities or missions",
    },
  ],
  clients: [
    {
      id: "matrix-clients",
      label: "Clients",
      description:
        "Clients contain users, tools, data, compute, models, or simulations and can subscribe to one or more Nodes.",
      organizationId: "participating-organizations",
      environmentId: "organizational-environments",
    },
  ],
  subscriptions: [
    {
      clientId: "matrix-clients",
      nodeId: "mission-specific-node",
    },
    {
      clientId: "matrix-clients",
      nodeId: "community-specific-node",
    },
  ],
  relationships: [
    {
      id: "organization-retains-environments",
      kind: "supports",
      from: "participating-organizations",
      to: "organizational-environments",
      label: "retains its own environments and capabilities across",
    },
    {
      id: "environments-support-mission-node",
      kind: "supports",
      from: "organizational-environments",
      to: "mission-specific-node",
      label: "supports different communities or missions through",
    },
    {
      id: "environments-support-community-node",
      kind: "supports",
      from: "organizational-environments",
      to: "community-specific-node",
      label: "supports different communities or missions through",
    },
  ],
} as const satisfies ModelingSimulationMatrix;

export const matrixContent = modelingSimulationMatrix;
