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
      id: "hub-alpha",
      kind: "hub",
      label: "GEMSTONE Hub Alpha",
      mobileLabel: "H-ALPHA",
      description:
        "An enterprise service hub that connects directly with the other GEMSTONE Hubs and provides services to its assigned Nodes.",
      x: 16,
      y: 15,
    },
    {
      id: "hub-bravo",
      kind: "hub",
      label: "GEMSTONE Hub Bravo",
      mobileLabel: "H-BRAVO",
      description:
        "An enterprise service hub that connects directly with the other GEMSTONE Hubs and provides services to its assigned Nodes.",
      x: 50,
      y: 7,
    },
    {
      id: "hub-charlie",
      kind: "hub",
      label: "GEMSTONE Hub Charlie",
      mobileLabel: "H-CHARLIE",
      description:
        "An enterprise service hub that connects directly with the other GEMSTONE Hubs and provides services to its assigned Nodes.",
      x: 84,
      y: 15,
    },
    {
      id: "node-alpha-1",
      kind: "node",
      label: "Node Alpha 1",
      mobileLabel: "N-A1",
      description:
        "A mission-specific backbone connected only to Hub Alpha, with services and infrastructure tailored to its community.",
      x: 10,
      y: 42,
    },
    {
      id: "node-alpha-2",
      kind: "node",
      label: "Node Alpha 2",
      mobileLabel: "N-A2",
      description:
        "A mission-specific backbone connected only to Hub Alpha, with services and infrastructure tailored to its community.",
      x: 25,
      y: 42,
    },
    {
      id: "node-bravo-1",
      kind: "node",
      label: "Node Bravo 1",
      mobileLabel: "N-B1",
      description:
        "A mission-specific backbone connected only to Hub Bravo, with services and infrastructure tailored to its community.",
      x: 43,
      y: 42,
    },
    {
      id: "node-bravo-2",
      kind: "node",
      label: "Node Bravo 2",
      mobileLabel: "N-B2",
      description:
        "A mission-specific backbone connected only to Hub Bravo, with services and infrastructure tailored to its community.",
      x: 57,
      y: 42,
    },
    {
      id: "node-charlie-1",
      kind: "node",
      label: "Node Charlie 1",
      mobileLabel: "N-C1",
      description:
        "A mission-specific backbone connected only to Hub Charlie, with services and infrastructure tailored to its community.",
      x: 75,
      y: 42,
    },
    {
      id: "node-charlie-2",
      kind: "node",
      label: "Node Charlie 2",
      mobileLabel: "N-C2",
      description:
        "A mission-specific backbone connected only to Hub Charlie, with services and infrastructure tailored to its community.",
      x: 90,
      y: 42,
    },
    {
      id: "client-alpha-1a",
      kind: "client",
      label: "Client Alpha 1A",
      mobileLabel: "C-A1A",
      description:
        "A user-facing service or resource connected only to Node Alpha 1 for its required services.",
      x: 10,
      y: 66,
    },
    {
      id: "client-alpha-1b",
      kind: "client",
      label: "Client Alpha 1B",
      mobileLabel: "C-A1B",
      description:
        "A user-facing service or resource connected only to Node Alpha 1 for its required services.",
      x: 10,
      y: 88,
    },
    {
      id: "client-alpha-2a",
      kind: "client",
      label: "Client Alpha 2A",
      mobileLabel: "C-A2A",
      description:
        "A user-facing service or resource connected only to Node Alpha 2 for its required services.",
      x: 25,
      y: 66,
    },
    {
      id: "client-alpha-2b",
      kind: "client",
      label: "Client Alpha 2B",
      mobileLabel: "C-A2B",
      description:
        "A user-facing service or resource connected only to Node Alpha 2 for its required services.",
      x: 25,
      y: 88,
    },
    {
      id: "client-bravo-1a",
      kind: "client",
      label: "Client Bravo 1A",
      mobileLabel: "C-B1A",
      description:
        "A user-facing service or resource connected only to Node Bravo 1 for its required services.",
      x: 43,
      y: 66,
    },
    {
      id: "client-bravo-1b",
      kind: "client",
      label: "Client Bravo 1B",
      mobileLabel: "C-B1B",
      description:
        "A user-facing service or resource connected only to Node Bravo 1 for its required services.",
      x: 43,
      y: 88,
    },
    {
      id: "client-bravo-2a",
      kind: "client",
      label: "Client Bravo 2A",
      mobileLabel: "C-B2A",
      description:
        "A user-facing service or resource connected only to Node Bravo 2 for its required services.",
      x: 57,
      y: 66,
    },
    {
      id: "client-bravo-2b",
      kind: "client",
      label: "Client Bravo 2B",
      mobileLabel: "C-B2B",
      description:
        "A user-facing service or resource connected only to Node Bravo 2 for its required services.",
      x: 57,
      y: 88,
    },
    {
      id: "client-charlie-1a",
      kind: "client",
      label: "Client Charlie 1A",
      mobileLabel: "C-C1A",
      description:
        "A user-facing service or resource connected only to Node Charlie 1 for its required services.",
      x: 75,
      y: 66,
    },
    {
      id: "client-charlie-1b",
      kind: "client",
      label: "Client Charlie 1B",
      mobileLabel: "C-C1B",
      description:
        "A user-facing service or resource connected only to Node Charlie 1 for its required services.",
      x: 75,
      y: 88,
    },
    {
      id: "client-charlie-2a",
      kind: "client",
      label: "Client Charlie 2A",
      mobileLabel: "C-C2A",
      description:
        "A user-facing service or resource connected only to Node Charlie 2 for its required services.",
      x: 90,
      y: 66,
    },
    {
      id: "client-charlie-2b",
      kind: "client",
      label: "Client Charlie 2B",
      mobileLabel: "C-C2B",
      description:
        "A user-facing service or resource connected only to Node Charlie 2 for its required services.",
      x: 90,
      y: 88,
    },
  ],
  connections: [
    { from: "hub-alpha", to: "hub-bravo", label: "peer Hub connection", kind: "inter-hub" },
    { from: "hub-alpha", to: "hub-charlie", label: "peer Hub connection", kind: "inter-hub" },
    { from: "hub-bravo", to: "hub-charlie", label: "peer Hub connection", kind: "inter-hub" },
    { from: "hub-alpha", to: "node-alpha-1", label: "provides services to", kind: "hub-node" },
    { from: "hub-alpha", to: "node-alpha-2", label: "provides services to", kind: "hub-node" },
    { from: "hub-bravo", to: "node-bravo-1", label: "provides services to", kind: "hub-node" },
    { from: "hub-bravo", to: "node-bravo-2", label: "provides services to", kind: "hub-node" },
    { from: "hub-charlie", to: "node-charlie-1", label: "provides services to", kind: "hub-node" },
    { from: "hub-charlie", to: "node-charlie-2", label: "provides services to", kind: "hub-node" },
    { from: "node-alpha-1", to: "client-alpha-1a", label: "supports", kind: "node-client" },
    { from: "node-alpha-1", to: "client-alpha-1b", label: "supports", kind: "node-client" },
    { from: "node-alpha-2", to: "client-alpha-2a", label: "supports", kind: "node-client" },
    { from: "node-alpha-2", to: "client-alpha-2b", label: "supports", kind: "node-client" },
    { from: "node-bravo-1", to: "client-bravo-1a", label: "supports", kind: "node-client" },
    { from: "node-bravo-1", to: "client-bravo-1b", label: "supports", kind: "node-client" },
    { from: "node-bravo-2", to: "client-bravo-2a", label: "supports", kind: "node-client" },
    { from: "node-bravo-2", to: "client-bravo-2b", label: "supports", kind: "node-client" },
    { from: "node-charlie-1", to: "client-charlie-1a", label: "supports", kind: "node-client" },
    { from: "node-charlie-1", to: "client-charlie-1b", label: "supports", kind: "node-client" },
    { from: "node-charlie-2", to: "client-charlie-2a", label: "supports", kind: "node-client" },
    { from: "node-charlie-2", to: "client-charlie-2b", label: "supports", kind: "node-client" },
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
