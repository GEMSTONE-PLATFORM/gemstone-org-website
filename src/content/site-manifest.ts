import type {
  AboutContent,
  ArchitectureContent,
  CapabilityItem,
  ContentLink,
  DifferentiatorItem,
  EcosystemContent,
  FAQItem,
  FeatureItem,
  FooterContent,
  HeroContent,
  SiteContent,
} from "@/types";

const internalLink = (label: string, href: `#${string}`): ContentLink => ({
  kind: "internal",
  label,
  href,
});

/**
 * The single build-time source for published website wording and optional image files.
 * Edit this file, replace a referenced file in public/, then run `npm run build`.
 */
export const siteManifest = {
  assets: {
    logo: "/branding/gemstone-logo.svg",
    horizontalLogo: "/branding/gemstone-logo-horizontal.svg",
    mark: "/branding/gemstone-mark.svg",
    images: {
      /** Leave blank to keep the CSS background. Set a public /images/... path to use a supplied image. */
      pageBackground: "",
      /** Leave blank to show only the configured GEMSTONE logo and Hero text. */
      heroImage: "",
      /** A future architecture image can be placed here without changing a component. */
      architectureImage: "",
    },
    documents: {
      /** Same-site PDF used for the briefing viewer and direct download. */
      briefingPdf: "/documents/gemstone-briefing.pdf",
    },
  },
  content: {
    sectionTitles: {
      whyGemstone: "Why GEMSTONE?",
      architecture: "Architecture",
      architectureIntroduction:
        "GEMSTONE connects organizations and communities through a Hub, mission-specific Nodes, and user-facing Clients. The Hub provides enterprise-level services and connections; Nodes provide tailorable services and infrastructure; Clients connect users, tools, data, compute, models, and simulations to one or more Nodes.",
      browseNetwork: "Browse the Network",
      capabilities: "Capabilities",
      differentiators: "Differentiators",
      faq: "Frequently Asked Questions",
      briefing: "GEMSTONE Briefing",
      requestInformation: "Request More Information",
      requestInformationDescription: "Connect with the GEMSTONE team to learn more.",
    },
    hero: {
      title: "Government-Owned Open Source Software Defined Platform for Digital Workloads",
      description:
        "GEMSTONE empowers organizations to build, publish, discover, and integrate tools, data, and compute across secure environments.",
      primaryCta: internalLink("Request Information", "#requestInformation"),
      secondaryCta: internalLink("View Briefing", "#briefing"),
    } as const satisfies HeroContent,
    networkTopology: {
      entities: [
        { id: "hub-a", kind: "hub", label: "Hub A" },
        { id: "hub-b", kind: "hub", label: "Hub B" },
        { id: "hub-c", kind: "hub", label: "Hub C" },
        { id: "node-a1", kind: "node", label: "Node A1", parentId: "hub-a" },
        { id: "node-a2", kind: "node", label: "Node A2", parentId: "hub-a" },
        { id: "node-b1", kind: "node", label: "Node B1", parentId: "hub-b" },
        { id: "node-b2", kind: "node", label: "Node B2", parentId: "hub-b" },
        { id: "node-c1", kind: "node", label: "Node C1", parentId: "hub-c" },
        { id: "node-c2", kind: "node", label: "Node C2", parentId: "hub-c" },
        { id: "client-a1a", kind: "client", label: "Client A1A", parentId: "node-a1" },
        { id: "client-a1b", kind: "client", label: "Client A1B", parentId: "node-a1" },
        { id: "client-a2a", kind: "client", label: "Client A2A", parentId: "node-a2" },
        { id: "client-a2b", kind: "client", label: "Client A2B", parentId: "node-a2" },
        { id: "client-b1a", kind: "client", label: "Client B1A", parentId: "node-b1" },
        { id: "client-b1b", kind: "client", label: "Client B1B", parentId: "node-b1" },
        { id: "client-b2a", kind: "client", label: "Client B2A", parentId: "node-b2" },
        { id: "client-b2b", kind: "client", label: "Client B2B", parentId: "node-b2" },
        { id: "client-c1a", kind: "client", label: "Client C1A", parentId: "node-c1" },
        { id: "client-c1b", kind: "client", label: "Client C1B", parentId: "node-c1" },
        { id: "client-c2a", kind: "client", label: "Client C2A", parentId: "node-c2" },
        { id: "client-c2b", kind: "client", label: "Client C2B", parentId: "node-c2" },
      ],
      connections: [
        { from: "hub-a", to: "hub-b" },
        { from: "hub-b", to: "hub-c" },
        { from: "hub-c", to: "hub-a" },
        { from: "hub-a", to: "node-a1" },
        { from: "hub-a", to: "node-a2" },
        { from: "hub-b", to: "node-b1" },
        { from: "hub-b", to: "node-b2" },
        { from: "hub-c", to: "node-c1" },
        { from: "hub-c", to: "node-c2" },
        { from: "node-a1", to: "client-a1a" },
        { from: "node-a1", to: "client-a1b" },
        { from: "node-a2", to: "client-a2a" },
        { from: "node-a2", to: "client-a2b" },
        { from: "node-b1", to: "client-b1a" },
        { from: "node-b1", to: "client-b1b" },
        { from: "node-b2", to: "client-b2a" },
        { from: "node-b2", to: "client-b2b" },
        { from: "node-c1", to: "client-c1a" },
        { from: "node-c1", to: "client-c1b" },
        { from: "node-c2", to: "client-c2a" },
        { from: "node-c2", to: "client-c2b" },
      ],
    },
    about: {
      title: "What is GEMSTONE?",
      description:
        "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
      relationshipLabels: ["Organizations", "Tools", "Data", "Compute", "GEMSTONE"],
      relationshipDescription:
        "GEMSTONE connects Organizations, Tools, Data, and Compute across existing environments.",
      distributedNote:
        "Organizations retain their own environments and capabilities while participating in the broader ecosystem.",
    } as const satisfies AboutContent,
    whyGemstone: [
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
    ] as const satisfies readonly FeatureItem[],
    architecture: {
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
        { from: "hub", to: "node-mission", label: "connect directly to the GEMSTONE Hub" },
        { from: "hub", to: "node-community", label: "connect directly to the GEMSTONE Hub" },
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
    } as const satisfies ArchitectureContent,
    ecosystem: {
      title: "THE M&S ECOSYSTEM",
      description:
        "GEMSTONE enables a networked ecosystem that meshes across government and industry.",
      points: [
        "Participating organizations can securely subscribe, exchange data, and share information.",
        "These shared connections support digital supply chains across government and industry.",
        "The ecosystem grows organically as more organizations leverage the digital backbone.",
      ],
    } as const satisfies EcosystemContent,
    analystBenefits: [
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
        description:
          "Use hardened package and library repositories for data science and analytics.",
        icon: "shield",
      },
      {
        id: "scalable-compute-access",
        title: "Scalable compute",
        description: "Scale compute across cloud, HPC, and on-premises environments.",
        icon: "server",
      },
    ] as const satisfies readonly FeatureItem[],
    capabilities: [
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
    ] as const satisfies readonly CapabilityItem[],
    differentiators: [
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
    ] as const satisfies readonly DifferentiatorItem[],
    faq: [
      {
        id: "what-is-gemstone",
        question: "What is GEMSTONE?",
        answer:
          "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
      },
      {
        id: "who-can-use-gemstone",
        question: "Who can use GEMSTONE?",
        answer:
          "Anyone in the Department of War plus industry, academic, and international partners.",
      },
      {
        id: "what-are-gemstones-capabilities",
        question: "What are GEMSTONE's capabilities?",
        answer:
          "Enables scalable adoption through connected environments\nProtects controlled proprietary data\nProvides marketplace integration for tools\nIncludes CI/CD-style data transformation",
      },
      {
        id: "what-makes-gemstone-different",
        question: "What makes GEMSTONE different?",
        answer:
          "Government ownership, open-source architecture, air-gap deployment support, advanced security layers, SDK extensibility, rapid application deployment, distributed simulation capability, and hardened development environments.",
      },
    ] as const satisfies readonly FAQItem[],
    footer: {
      siteName: "GEMSTONE",
      fullName:
        "Government Enterprise Modeling and Simulation Trusted Operations Networked Ecosystem",
      privacyNotice: "Privacy notice placeholder",
    } as const satisfies FooterContent,
  } as const satisfies SiteContent,
} as const;
