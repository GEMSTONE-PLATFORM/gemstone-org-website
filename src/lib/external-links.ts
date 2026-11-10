export interface ExternalLinkAttributes {
  readonly target?: "_blank";
  readonly rel?: string;
  readonly accessibleHint?: string;
}
/** Ensure links opened in a new browsing context cannot access the opener. */
export function safeExternalRel(rel?: string): string {
  return Array.from(
    new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), "noopener", "noreferrer"]),
  ).join(" ");
}
/**
 * Build the safe, accessible attributes shared by configurable external links.
 * The hint is rendered as visible or screen-reader text by the caller.
 */
export function externalLinkAttributes(newTab = false, rel?: string): ExternalLinkAttributes {
  if (!newTab) {
    return {};
  }
  return {
    target: "_blank",
    rel: safeExternalRel(rel),
    accessibleHint: "opens in a new tab",
  };
}
/** Return the accessible suffix for a new-tab link without adding duplicate text. */
export function newTabAccessibleHint(newTab: boolean): string {
  return newTab ? "opens in a new tab" : "";
}
