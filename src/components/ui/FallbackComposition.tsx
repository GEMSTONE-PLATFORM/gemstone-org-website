import type { ReactNode } from "react";

import type { ExternalLink as ExternalLinkModel, FallbackStateKind } from "@/types";
import { StatusFallback } from "@/components/ui/StatusFallback";

export interface FallbackCompositionProps {
  readonly kind: FallbackStateKind;
  readonly title: string;
  readonly message: ReactNode;
  readonly explanation?: ReactNode;
  readonly recoveryLinks?: readonly ExternalLinkModel[];
  readonly className?: string;
  readonly headingLevel?: 2 | 3 | 4;
}

/**
 * Shared failure surface for optional assets, browser capabilities, and external integrations.
 * Callers own the approved copy and recovery destinations; this component only composes them.
 */
export function FallbackComposition({
  kind,
  title,
  message,
  explanation,
  recoveryLinks,
  className,
  headingLevel = 3,
}: FallbackCompositionProps) {
  return (
    <StatusFallback
      kind={kind}
      title={title}
      message={message}
      explanation={explanation}
      recoveryLinks={recoveryLinks}
      headingLevel={headingLevel}
      className={className}
    />
  );
}
