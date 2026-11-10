import type { ReactNode } from "react";

import type { FallbackStateKind, ExternalLink as ExternalLinkModel } from "@/types";
import { cn } from "@/lib/utilities";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Icon } from "@/components/ui/Icon";

export interface StatusFallbackProps {
  readonly title: string;
  readonly message?: ReactNode;
  readonly explanation?: ReactNode;
  readonly recovery?: ReactNode;
  readonly recoveryLink?: ExternalLinkModel;
  readonly recoveryLinks?: readonly ExternalLinkModel[];
  readonly kind?: FallbackStateKind;
  readonly headingLevel?: 2 | 3 | 4;
  readonly className?: string;
}

const statusIcons: Record<FallbackStateKind, string> = {
  missing: "database",
  blocked: "shield",
  unsupported: "layers",
  unavailable: "network",
};

/** Fallback surface whose explanatory and recovery content is always supplied by its caller. */
export function StatusFallback({
  title,
  message,
  explanation,
  recovery,
  recoveryLink,
  recoveryLinks = [],
  kind = "unavailable",
  headingLevel = 3,
  className,
}: StatusFallbackProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div
      className={cn("gemstone-surface rounded-gemstone p-6", className)}
      data-status={kind}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <span className="mt-1 rounded-full border border-gemstone-border/40 bg-gemstone-surface-elevated p-2 text-gemstone-accent">
          <Icon name={statusIcons[kind]} size={20} />
        </span>
        <div className="min-w-0 space-y-3">
          <Heading className="font-display text-xl text-gemstone-text">{title}</Heading>
          {message ? <p className="text-gemstone-muted">{message}</p> : null}
          {explanation ? <div className="text-sm text-gemstone-muted">{explanation}</div> : null}
          {recoveryLink || recoveryLinks.length > 0 ? (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {[...(recoveryLink ? [recoveryLink] : []), ...recoveryLinks]
                .filter((link, index, links) => {
                  const href = link.href.trim();
                  return (
                    href.length > 0 &&
                    link.label.trim().length > 0 &&
                    links.findIndex(
                      (candidate) =>
                        candidate.href.trim() === href &&
                        candidate.label.trim() === link.label.trim(),
                    ) === index
                  );
                })
                .map((link) => (
                  <ExternalLink
                    key={`${link.label}-${link.href}`}
                    href={link.href.trim()}
                    newTab={link.newTab}
                  >
                    {link.label.trim()}
                  </ExternalLink>
                ))}
            </div>
          ) : null}
          {recovery ? <div>{recovery}</div> : null}
        </div>
      </div>
    </div>
  );
}
