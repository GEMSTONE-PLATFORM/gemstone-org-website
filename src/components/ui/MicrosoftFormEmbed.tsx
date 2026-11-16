"use client";

import { useState } from "react";

import { MICROSOFT_FORM_URL_PLACEHOLDER } from "@/config/integration-config";
import { resolveIntegrationUrl, transitionEmbedState } from "@/lib/integration-state";
import type { EmbedState, ExternalLink as ExternalLinkModel } from "@/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FallbackComposition } from "@/components/ui/FallbackComposition";

export interface MicrosoftFormEmbedProps {
  readonly url?: string;
  readonly title: string;
  readonly privacyNotice?: string;
}

const DEFAULT_PRIVACY_NOTICE = "Privacy notice placeholder";
const FORM_URL_PLACEHOLDERS = [
  MICROSOFT_FORM_URL_PLACEHOLDER,
  "MICROSOFT_FORM_URL_GOES_HERE",
] as const;
const MICROSOFT_FORMS_HOSTS = new Set([
  "forms.office.com",
  "forms.microsoft.com",
  "forms.cloud.microsoft",
]);

/** Convert a public Microsoft Forms link into its embeddable form without changing its identity. */
export function resolveMicrosoftFormsEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (MICROSOFT_FORMS_HOSTS.has(parsed.hostname.toLowerCase())) {
      parsed.searchParams.set("embed", "true");
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}

/** Progressive Microsoft Forms boundary that never reads or stores form fields. */
export function MicrosoftFormEmbed({
  url: configuredUrl,
  title,
  privacyNotice,
}: MicrosoftFormEmbedProps) {
  const resolution = resolveIntegrationUrl(configuredUrl, FORM_URL_PLACEHOLDERS);
  const publicUrl = resolution.url;
  const embedUrl = publicUrl ? resolveMicrosoftFormsEmbedUrl(publicUrl) : undefined;
  const resolvedPrivacyNotice = privacyNotice?.trim() || DEFAULT_PRIVACY_NOTICE;
  const [state, setState] = useState<EmbedState>(() => (embedUrl ? "loading" : "missing"));

  if (!publicUrl || !embedUrl) {
    return (
      <div className="space-y-5">
        <FallbackComposition
          kind="missing"
          title="Request Information form not connected"
          message="Request Information form has not yet been connected."
        />
        <p className="text-sm text-gemstone-muted">{resolvedPrivacyNotice}</p>
      </div>
    );
  }

  const recoveryLink: ExternalLinkModel = {
    kind: "external",
    label: "Open Request Information Form",
    href: publicUrl,
    external: true,
    newTab: true,
  };
  const handleEmbedError = () => setState("blocked");

  return (
    <div className="space-y-5" data-form-embed-state={state}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <ExternalLink href={recoveryLink.href} newTab>
          {recoveryLink.label}
        </ExternalLink>
        <span className="text-sm text-gemstone-muted" aria-live="polite">
          {state === "loaded" ? "Form available" : "Loading form"}
        </span>
      </div>

      {state === "blocked" || state === "unsupported" ? (
        <FallbackComposition
          kind={state === "unsupported" ? "unsupported" : "blocked"}
          title="Request Information form unavailable here"
          message="Open the external Request Information Form to continue."
          explanation="The browser did not provide usable embedded form content."
          recoveryLinks={[recoveryLink]}
        />
      ) : (
        <div className="relative h-[75svh] min-h-[44rem] max-h-[70rem] w-full overflow-hidden rounded-gemstone border border-gemstone-border/30 bg-white">
          <p className="sr-only" aria-live="polite">
            {state === "loaded"
              ? "Request Information form loaded."
              : "Loading Request Information form."}
          </p>
          <iframe
            title={title}
            src={embedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0 bg-white"
            onLoad={() =>
              setState((current) =>
                transitionEmbedState(transitionEmbedState(current, "load"), "loaded"),
              )
            }
            onError={handleEmbedError}
            onErrorCapture={handleEmbedError}
          />
        </div>
      )}

      <p className="text-sm text-gemstone-muted">{resolvedPrivacyNotice}</p>
    </div>
  );
}
