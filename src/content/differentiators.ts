import type { DifferentiatorItem } from "@/types";

/**
 * Approved public differentiators. Every item is marked for public-claim review
 * before release so presentation code cannot hide the claim source.
 */
export const differentiators = [
  {
    id: "government-owned-open-source",
    title: "Government Owned Open Source",
    icon: "globe",
    claimReviewRequired: true,
  },
  {
    id: "air-gap-deployment",
    title: "Air Gap Deployment",
    icon: "server",
    claimReviewRequired: true,
  },
  {
    id: "secure-libraries",
    title: "Secure Libraries for Application Development",
    icon: "shield",
    claimReviewRequired: true,
  },
  {
    id: "multiple-security-layers-il-7",
    title: "Multiple Security Layers Including IL-7",
    icon: "layers",
    claimReviewRequired: true,
  },
  {
    id: "distribution-pipeline",
    title: "Distribution Pipeline for New Capabilities",
    icon: "workflow",
    claimReviewRequired: true,
  },
  {
    id: "custom-applications-approved-within-minutes",
    title: "Custom Applications Approved Within Minutes",
    description: "Custom applications approved within 5 minutes",
    icon: "sparkles",
    claimReviewRequired: true,
  },
  {
    id: "tailored-environments-in-one-day",
    title: "Development and Deployment of Tailored Environments in One Day",
    description: "Development and deployment of tailored environments in 1 day",
    icon: "layers",
    claimReviewRequired: true,
  },
  {
    id: "unified-plugin-system",
    title: "Unified Plugin System",
    icon: "boxes",
    claimReviewRequired: true,
  },
  {
    id: "approved-hardened-python-libraries",
    title: "Approved and Hardened Python Libraries",
    description: "Approved & hardened Python libraries at IL 5 and above",
    icon: "database",
    claimReviewRequired: true,
  },
  {
    id: "api-consumable-model-and-simulation-services",
    title: "Deploy Models and Simulations as API-Consumable Web Services",
    description: "Deploy models and simulations as API consumable web services",
    icon: "network",
    claimReviewRequired: true,
  },
  {
    id: "software-development-kit",
    title: "Software Development Kit",
    description: "Customization and expansion via software development kit",
    icon: "sparkles",
    claimReviewRequired: true,
  },
  {
    id: "distributed-simulation-enablement",
    title: "Distributed Simulation Enablement",
    description: "Platform enables distributed simulations",
    icon: "globe",
    claimReviewRequired: true,
  },
] as const satisfies readonly DifferentiatorItem[];

export const differentiatorItems = differentiators;
