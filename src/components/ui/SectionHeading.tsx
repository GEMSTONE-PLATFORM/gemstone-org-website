import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utilities";

export interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  readonly title: string;
  readonly id?: string;
  readonly level?: 2 | 3 | 4;
  readonly eyebrow?: string;
  readonly description?: ReactNode;
}

/** Renders a consistent, explicitly related heading and optional explanation. */
export function SectionHeading({
  title,
  id,
  level = 2,
  eyebrow,
  description,
  className,
  ...props
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;

  return (
    <header className={cn("gemstone-reading-width space-y-4", className)} {...props}>
      {eyebrow ? <p className="gemstone-eyebrow">{eyebrow}</p> : null}
      <Heading id={id} className="font-display text-3xl text-gemstone-text sm:text-4xl">
        {title}
      </Heading>
      {description ? <div className="gemstone-body">{description}</div> : null}
    </header>
  );
}
