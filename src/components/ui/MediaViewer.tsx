"use client";
import { useEffect, useState } from "react";
import { BRIEFING_URL_PLACEHOLDER } from "@/config/integration-config";
import { resolveIntegrationUrl, transitionEmbedState } from "@/lib/integration-state";
import type { BriefingConfig, EmbedState, ExternalLink as ExternalLinkModel } from "@/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FallbackComposition } from "@/components/ui/FallbackComposition";
export interface MediaViewerProps {
  readonly config: BriefingConfig;
}
const EMBED_TIMEOUT_MS = 8000;
type EmbedFailureReason = "timeout" | "browser";
type RecoveryLink = ExternalLinkModel & { readonly download?: boolean };
function formatLabel(format: BriefingConfig["format"]): string {
  switch (format) {
    case "pdf":
      return "PDF document";
    case "powerpoint":
      return "PowerPoint presentation";
    default:
      return "Document format not specified";
  }
}
function recoveryLinks(config: BriefingConfig, url: string): RecoveryLink[] {
  const links: RecoveryLink[] = [
    {
      kind: "external",
      label: "View Briefing",
      href: url,
      external: true,
      newTab: config.allowOpenInNewTab,
    },
  ];
  if (config.allowDownload) {
    links.push({
      kind: "external",
      label: "Download Briefing",
      href: url,
      external: true,
      newTab: config.allowOpenInNewTab,
      download: true,
    });
  }
  if (config.allowOpenInNewTab) {
    links.push({
      kind: "external",
      label: "Open in New Tab",
      href: url,
      external: true,
      newTab: true,
    });
  }
  return links;
}
function viewerStatus(state: EmbedState): string {
  switch (state) {
    case "loading":
      return "Loading embedded briefing.";
    case "loaded":
      return "Embedded briefing loaded.";
    case "idle":
      return "Embedded briefing is ready to load.";
    default:
      return "External briefing viewing is available.";
  }
}
/**
 * Progressive briefing viewer. External actions and missing-state copy are rendered
 * with the section, while the iframe remains an optional lazy enhancement.
 */
export function MediaViewer({ config }: MediaViewerProps) {
  const resolution = resolveIntegrationUrl(config.url, BRIEFING_URL_PLACEHOLDER);
  const url = resolution.url;
  const [state, setState] = useState<EmbedState>(() => {
    if (!url) return "missing";
    return config.embed ? "loading" : "unsupported";
  });
  const [failureReason, setFailureReason] = useState<EmbedFailureReason | undefined>();
  useEffect(() => {
    if (!url || !config.embed || (state !== "idle" && state !== "loading")) return;
    const timeout = window.setTimeout(() => {
      setFailureReason("timeout");
      setState((current) => (current === "idle" || current === "loading" ? "blocked" : current));
    }, EMBED_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [config.embed, state, url]);
  if (!url) {
    return (
      <FallbackComposition
        kind="missing"
        title="Briefing not configured"
        message="A GEMSTONE briefing URL has not been configured."
      />
    );
  }
  const links = recoveryLinks(config, url);
  const isFallback = state === "blocked" || state === "unsupported";
  const handleEmbedError = () => {
    setFailureReason("browser");
    setState("blocked");
  };
  const fallbackTitle =
    state === "unsupported"
      ? "Embedded briefing format unavailable"
      : "Embedded briefing unavailable";
  const fallbackExplanation =
    failureReason === "timeout"
      ? "The embedded view did not finish loading. Use the external briefing actions to continue."
      : "The browser did not provide a usable embedded document view. Use the external briefing actions to continue.";
  return (
    <div
      className="space-y-5"
      data-testid="briefing-viewer"
      data-embed-state={state}
      data-embed-failure={failureReason}
      aria-busy={state === "idle" || state === "loading"}
    >
      <div className="flex flex-wrap items-center gap-3 text-sm text-gemstone-muted">
        <span
          className="rounded-full border border-gemstone-border/40 px-3 py-1"
          aria-label={`Briefing format: ${formatLabel(config.format)}`}
        >
          {formatLabel(config.format)}
        </span>
        <span aria-live="polite">{viewerStatus(state)}</span>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Briefing actions">
        {links.map((link) => (
          <ExternalLink
            key={link.label}
            href={link.href}
            newTab={link.newTab}
            download={link.download}
          >
            {link.label}
          </ExternalLink>
        ))}
      </div>
      {isFallback ? (
        <FallbackComposition
          kind={state === "unsupported" ? "unsupported" : "blocked"}
          title={fallbackTitle}
          message="The briefing remains available through the external viewing actions."
          explanation={fallbackExplanation}
          recoveryLinks={links}
        />
      ) : config.embed ? (
        <div className="overflow-hidden rounded-gemstone border border-gemstone-border/30 bg-gemstone-surface">
          <div className="aspect-[16/10] min-h-[20rem] w-full sm:min-h-[28rem] lg:min-h-[34rem]">
            <iframe
              title={config.title}
              src={url}
              loading="lazy"
              className="block h-full min-h-[20rem] w-full border-0 sm:min-h-[28rem] lg:min-h-[34rem]"
              onLoad={() => {
                setState((current) => {
                  const loadingState = transitionEmbedState(current, "load");
                  return transitionEmbedState(loadingState, "loaded");
                });
              }}
              onError={handleEmbedError}
              onErrorCapture={handleEmbedError}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
