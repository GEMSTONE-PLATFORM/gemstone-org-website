import type { ContentLink, InternalLink, SectionId } from "@/types";

/**
 * Same-page navigation is kept in configuration so section components never
 * need to repeat anchor targets or navigation labels.
 */
export const navigationItems = [
  { kind: "internal", label: "About", href: "#about", target: "about" },
  {
    kind: "internal",
    label: "Architecture",
    href: "#architecture",
    target: "architecture",
  },
  {
    kind: "internal",
    label: "Capabilities",
    href: "#capabilities",
    target: "capabilities",
  },
  {
    kind: "internal",
    label: "Differentiators",
    href: "#differentiators",
    target: "differentiators",
  },
  { kind: "internal", label: "FAQ", href: "#faq", target: "faq" },
  { kind: "internal", label: "Briefing", href: "#briefing", target: "briefing" },
  {
    kind: "internal",
    label: "Request Information",
    href: "#requestInformation",
    target: "requestInformation",
  },
] as const satisfies readonly InternalLink[];

export const navigationTargetIds = navigationItems.map(
  (item) => item.target,
) as readonly SectionId[];

/**
 * Footer navigation includes the approved Contact mapping without adding a
 * standalone contact section or inventing contact details.
 */
export const footerNavigationItems = [
  ...navigationItems.filter((item) =>
    ["about", "architecture", "capabilities", "faq", "briefing"].includes(item.target),
  ),
  {
    kind: "internal",
    label: "Contact",
    href: "#requestInformation",
    target: "requestInformation",
  },
] as const satisfies readonly ContentLink[];
