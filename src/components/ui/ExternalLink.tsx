import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import { cn, safeExternalRel } from "@/lib/utilities";

export interface ExternalLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "className" | "target"
> {
  readonly children: ReactNode;
  readonly newTab?: boolean;
  readonly className?: string;
}

/** External destination link with an explicit new-tab indication and opener protection. */
export function ExternalLink({
  children,
  href,
  newTab = false,
  rel,
  className,
  ...props
}: ExternalLinkProps) {
  const accessibleName =
    newTab && typeof children === "string" ? `${children} (opens in a new tab)` : undefined;

  return (
    <a
      {...props}
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? safeExternalRel(rel) : rel}
      aria-label={accessibleName}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-gemstone-sm px-1 text-gemstone-accent underline decoration-gemstone-cyan/70 underline-offset-4 transition-colors hover:text-gemstone-text",
        "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus",
        className,
      )}
    >
      <span>{children}</span>
      {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
      <ExternalLinkIcon aria-hidden="true" className="size-4 shrink-0" />
    </a>
  );
}
