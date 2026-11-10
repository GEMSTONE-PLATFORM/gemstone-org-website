import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utilities";

type CardElement = "article" | "div";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  readonly as?: CardElement;
  readonly children: ReactNode;
}

/** Shared dark surface for content that should remain readable without hover. */
export function Card({ as = "article", className, children, ...props }: CardProps) {
  const Element = as;

  return (
    <Element
      {...props}
      className={cn(
        "gemstone-card-motion gemstone-surface-raised rounded-gemstone p-6 shadow-gemstone transition-colors",
        className,
      )}
    >
      {children}
    </Element>
  );
}
