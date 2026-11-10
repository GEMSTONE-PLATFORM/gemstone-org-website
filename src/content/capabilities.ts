import type { CapabilityItem } from "@/types";

/** Approved GEMSTONE capabilities. Public claims remain editable data. */
export const capabilities = [
  {
    id: "scalable-adoption",
    title: "Scalable Adoption",
    description:
      "Enables scalable adoption by allowing organizations to tailor and connect existing environments.",
    icon: "network",
    category: "capability",
  },
  {
    id: "controlled-proprietary-data",
    title: "Controlled Proprietary Data",
    description:
      "Supports protection of controlled proprietary data while keeping data inside organizational boundaries.",
    icon: "shield",
    category: "capability",
  },
  {
    id: "marketplace-integration",
    title: "Marketplace Integration",
    description: "Provides a marketplace for integrating new or custom tools.",
    icon: "boxes",
    category: "capability",
  },
  {
    id: "data-transformation",
    title: "Data Transformation",
    description: "Includes built-in CI/CD-style data transformation across tools.",
    icon: "workflow",
    category: "capability",
  },
] as const satisfies readonly CapabilityItem[];

export const capabilityItems = capabilities;
