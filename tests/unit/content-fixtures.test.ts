import { describe, expect, it } from "vitest";

import type { DifferentiatorItem } from "@/types";
import { differentiators } from "@/content/differentiators";
import { faqItems } from "@/content/faq";
import { heroContent } from "@/content/site-content";

describe("approved content fixtures", () => {
  it("keeps the exact approved hero copy", () => {
    expect(heroContent.title).toBe(
      "Government-Owned Open Source for Digital Engineering and Modeling & Simulation",
    );
    expect(heroContent.description).toBe(
      "GEMSTONE empowers organizations to build, publish, discover, and integrate tools, data, and compute across secure environments.",
    );
  });

  it("keeps the approved FAQ questions and answers", () => {
    expect(faqItems).toEqual([
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
    ]);
  });

  it("contains every approved differentiator identifier", () => {
    expect(differentiators.map(({ id }) => id)).toEqual([
      "government-owned-open-source",
      "air-gap-deployment",
      "secure-libraries",
      "multiple-security-layers-il-7",
      "distribution-pipeline",
      "custom-applications-approved-within-minutes",
      "tailored-environments-in-one-day",
      "unified-plugin-system",
      "approved-hardened-python-libraries",
      "api-consumable-model-and-simulation-services",
      "software-development-kit",
      "distributed-simulation-enablement",
    ]);
  });

  it("keeps the approved differentiator claim wording reviewable", () => {
    const claimWording = (differentiators as readonly DifferentiatorItem[]).map(
      ({ title, description }) => [title, description],
    );

    expect(claimWording).toEqual([
      ["Government Owned Open Source", undefined],
      ["Air Gap Deployment", undefined],
      ["Secure Libraries for Application Development", undefined],
      ["Multiple Security Layers Including IL-7", undefined],
      ["Distribution Pipeline for New Capabilities", undefined],
      [
        "Custom Applications Approved Within Minutes",
        "Custom applications approved within 5 minutes",
      ],
      [
        "Development and Deployment of Tailored Environments in One Day",
        "Development and deployment of tailored environments in 1 day",
      ],
      ["Unified Plugin System", undefined],
      [
        "Approved and Hardened Python Libraries",
        "Approved & hardened Python libraries at IL 5 and above",
      ],
      [
        "Deploy Models and Simulations as API-Consumable Web Services",
        "Deploy models and simulations as API consumable web services",
      ],
      ["Software Development Kit", "Customization and expansion via software development kit"],
      ["Distributed Simulation Enablement", "Platform enables distributed simulations"],
    ]);
  });
});
