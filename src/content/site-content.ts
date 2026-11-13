import type {
  AboutContent,
  ArchitectureContent,
  ContentLink,
  EcosystemContent,
  FeatureItem,
  FooterContent,
  HeroContent,
  SiteContent,
} from "@/types";

import { capabilities } from "@/content/capabilities";
import { differentiators } from "@/content/differentiators";
import { faqItems } from "@/content/faq";

const internalLink = (label: string, href: `#${string}`): ContentLink => ({
  kind: "internal",
  label,
  href,
});

export const heroContent = {
  title: "Government-Owned Open Source for Digital Engineering and Modeling & Simulation",
  description:
    "GEMSTONE empowers organizations to build, publish, discover, and integrate tools, data, and compute across secure environments.",
  primaryCta: internalLink("Request Information", "#requestInformation"),
  secondaryCta: internalLink("View Briefing", "#briefing"),
} as const satisfies HeroContent;

export const aboutContent = {
  title: "What is GEMSTONE?",
  description:
    "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
  relationshipLabels: ["Organizations", "Tools", "Data", "Compute", "GEMSTONE"],
  relationshipDescription:
    "GEMSTONE connects Organizations, Tools, Data, and Compute across existing environments.",
  distributedNote:
    "Organizations retain their own environments and capabilities while participating in the broader ecosystem.",
} as const satisfies AboutContent;

export const problems = [
  "Limits adoption by forcing into one environment",
  "Proprietary data hard to share across boundaries",
  "Slow to integrate new or proprietary tools",
  "Data transfer between tools is difficult and often depends on third party software",
] as const;

export const whyGemstoneItems = [
  {
    id: "bring-your-own-environment",
    title: "Bring Your Own Environment",
    description:
      "Organizations can connect and enhance existing environments instead of replacing them.",
    icon: "network",
  },
  {
    id: "controlled-collaboration",
    title: "Controlled Collaboration",
    description: "Share information securely across organizations and network boundaries.",
    icon: "globe",
  },
  {
    id: "security-first",
    title: "Security First",
    description:
      "Multiple layers of security support operations across classified and unclassified environments.",
    icon: "shield",
  },
  {
    id: "reuse-instead-of-rebuild",
    title: "Reuse Instead of Rebuild",
    description: "Promote discoverability and reuse of tools, services, and data.",
    icon: "refreshCw",
  },
] as const satisfies readonly FeatureItem[];

export const architectureContent = {
  entities: [
    {
      id: "hub",
      kind: "hub",
      label: "GEMSTONE | HUB",
      description:
        "Centralized essential M&S services to streamline operations, lower costs, and connect organizations across the M&S ecosystem.",
      x: 50,
      y: 18,
    },
    {
      id: "node-mission",
      kind: "node",
      label: "GEMSTONE | Node",
      description:
        "Tailorable M&S backbones that provide mission-specific services and connect directly to the GEMSTONE Hub, with each community shaping its required services and infrastructure.",
      x: 25,
      y: 54,
    },
    {
      id: "node-community",
      kind: "node",
      label: "GEMSTONE | Node",
      description:
        "Tailorable M&S backbones that provide mission-specific services and connect directly to the GEMSTONE Hub, with each community shaping its required services and infrastructure.",
      x: 75,
      y: 54,
    },
    {
      id: "client-user",
      kind: "client",
      label: "GEMSTONE | Client",
      description:
        "Tools and compute needed to create or consume digital artifacts and connect directly to a GEMSTONE Node for required services.",
      x: 25,
      y: 86,
    },
    {
      id: "client-community",
      kind: "client",
      label: "GEMSTONE | Client",
      description:
        "Tools and compute needed to create or consume digital artifacts and connect directly to a GEMSTONE Node for required services.",
      x: 75,
      y: 86,
    },
  ],
  connections: [
    {
      from: "hub",
      to: "node-mission",
      label: "connect directly to the GEMSTONE Hub",
    },
    {
      from: "hub",
      to: "node-community",
      label: "connect directly to the GEMSTONE Hub",
    },
    {
      from: "node-mission",
      to: "client-user",
      label: "connect directly to a GEMSTONE Node for required services",
    },
    {
      from: "node-community",
      to: "client-community",
      label: "connect directly to a GEMSTONE Node for required services",
    },
  ],
  distributedPrinciple:
    "Organizations and Nodes retain their own environments and capabilities while participating in the broader ecosystem or instantiate new environments on compute that meets the mission needs",
} as const satisfies ArchitectureContent;

export const ecosystemContent = {
  title: "THE M&S ECOSYSTEM",
  description: "GEMSTONE enables a networked ecosystem that meshes across government and industry.",
  points: [
    "Participating organizations can securely subscribe, exchange data, and share information.",
    "These shared connections support digital supply chains across government and industry.",
    "The ecosystem grows organically as more organizations leverage the digital backbone.",
  ],
} as const satisfies EcosystemContent;

export const analystBenefits = [
  {
    id: "cross-organization-data-discovery",
    title: "Cross-organization data discovery",
    description:
      "Discover data across organizations through the distributed Hub-Node-Client architecture.",
    icon: "database",
  },
  {
    id: "digital-command-and-control",
    title: "Digital Command and Control",
    description:
      "Empower analysts to build automations, digital threads, and mini-apps without becoming software developers.",
    icon: "network",
  },
  {
    id: "app-marketplace",
    title: "App Marketplace",
    description: "Discover and integrate new or custom tools through an App Marketplace.",
    icon: "boxes",
  },
  {
    id: "hardened-package-and-library-repos",
    title: "Hardened package and library repositories",
    description: "Use hardened package and library repositories for data science and analytics.",
    icon: "shield",
  },
  {
    id: "scalable-compute-access",
    title: "Scalable compute",
    description: "Scale compute across cloud, HPC, and on-premises environments.",
    icon: "server",
  },
] as const satisfies readonly FeatureItem[];

export const publicReleaseStatement = "Approved for Public Release. Distribution Unlimited.";
export const privacyNotice = "Privacy notice placeholder";

export const footerContent = {
  siteName: "GEMSTONE",
  fullName: "Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem",
  navigation: [
    internalLink("About", "#about"),
    internalLink("Architecture", "#architecture"),
    internalLink("Capabilities", "#capabilities"),
    internalLink("FAQ", "#faq"),
    internalLink("Briefing", "#briefing"),
    internalLink("Contact", "#request-information"),
  ],
  privacyNotice,
  publicReleaseStatement,
} as const satisfies FooterContent;

export const siteContent = {
  hero: heroContent,
  about: aboutContent,
  problems,
  whyGemstone: whyGemstoneItems,
  architecture: architectureContent,
  ecosystem: ecosystemContent,
  analystBenefits,
  capabilities,
  differentiators,
  faq: faqItems,
  footer: footerContent,
} as const satisfies SiteContent;
