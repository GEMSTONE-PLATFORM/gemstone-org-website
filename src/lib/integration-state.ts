import type { EmbedState } from "@/types";
/** A configured integration can begin loading only when this value is present. */
export interface IntegrationUrlResolution {
  readonly state: "missing" | "idle";
  readonly url?: string;
  readonly iframeSrc?: string;
}
export type EmbedStateEvent = "load" | "loaded" | "blocked" | "unsupported" | "reset";
/**
 * Normalize build-time integration input without turning placeholders into
 * browser request targets. Placeholder matching is deliberately exact after
 * surrounding whitespace is removed.
 */
export function resolveConfiguredUrl(
  url: string | null | undefined,
  placeholder: string | readonly string[],
): string | undefined {
  const normalizedUrl = typeof url === "string" ? url.trim() : undefined;
  const placeholders = Array.isArray(placeholder) ? placeholder : [placeholder];
  if (
    !normalizedUrl ||
    placeholders.some((value) => typeof value === "string" && normalizedUrl === value.trim())
  ) {
    return undefined;
  }
  return normalizedUrl;
}
/** Resolve URL configuration to the only states valid before browser loading. */
export function resolveIntegrationUrl(
  url: string | null | undefined,
  placeholder: string | readonly string[],
): IntegrationUrlResolution {
  const configuredUrl = resolveConfiguredUrl(url, placeholder);
  if (!configuredUrl) {
    return { state: "missing" };
  }
  return {
    state: "idle",
    url: configuredUrl,
    iframeSrc: configuredUrl,
  };
}
/**
 * Resolve the initial integration state. Loading and failure states are
 * produced only by explicit browser events, never by URL parsing.
 */
export function resolveIntegrationState(
  url: string | null | undefined,
  placeholder: string | readonly string[],
): "missing" | "idle" {
  return resolveIntegrationUrl(url, placeholder).state;
}
/** Apply a browser-observable embed event without side effects or mutation. */
export function transitionEmbedState(state: EmbedState, event: EmbedStateEvent): EmbedState {
  if (event === "reset") {
    return state === "missing" ? "missing" : "idle";
  }
  if (state === "missing") {
    return "missing";
  }
  if (event === "load" && state === "idle") {
    return "loading";
  }
  if (state !== "loading") {
    return state;
  }
  switch (event) {
    case "loaded":
      return "loaded";
    case "blocked":
      return "blocked";
    case "unsupported":
      return "unsupported";
    default:
      return state;
  }
}
/** Whether the current state may render an iframe request target. */
export function hasIframeTarget(
  resolution: IntegrationUrlResolution,
): resolution is IntegrationUrlResolution & { readonly iframeSrc: string } {
  return resolution.state !== "missing" && Boolean(resolution.iframeSrc);
}
