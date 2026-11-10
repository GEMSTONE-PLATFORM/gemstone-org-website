import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utilities";

export interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  /** Stable anchor used by navigation and skip-to-content interactions. */
  readonly id: string;
  /** ID of the section heading, when the section has a visible heading. */
  readonly headingId?: string;
  readonly children: ReactNode;
}

/** Provides the shared section landmark, width, spacing, and anchor behavior. */
export function SectionContainer({
  id,
  headingId,
  className,
  children,
  ...props
}: SectionContainerProps) {
  return (
    <section
      {...props}
      id={id}
      aria-labelledby={headingId}
      className={cn("gemstone-section", className)}
    >
      <div className="gemstone-container">{children}</div>
    </section>
  );
}
