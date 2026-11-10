import type { FAQItem } from "@/types";

/** Approved FAQ questions and answers, kept independent from accordion logic. */
export const faqItems = [
  {
    id: "what-is-gemstone",
    question: "What is GEMSTONE?",
    answer:
      "GEMSTONE is a Government-Owned Open Source technology platform that empowers users of new or existing environments to build, publish, discover, and integrate tools, data, and compute across organizations.",
  },
  {
    id: "who-can-use-gemstone",
    question: "Who can use GEMSTONE?",
    answer: "Anyone in the Department of War plus industry, academic, and international partners.",
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
] as const satisfies readonly FAQItem[];

export const faqs = faqItems;
