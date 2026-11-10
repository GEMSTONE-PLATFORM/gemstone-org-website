import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn, safeExternalRel } from "@/lib/utilities";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
};

type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    readonly href: string;
  };

type ButtonControlProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    readonly href?: undefined;
  };

export type ButtonProps = ButtonLinkProps | ButtonControlProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gemstone-cyan text-gemstone-bg shadow-gemstone-glow hover:bg-gemstone-accent",
  secondary:
    "border border-gemstone-border/50 bg-gemstone-surface-raised text-gemstone-text hover:border-gemstone-cyan/70 hover:bg-gemstone-surface-elevated",
  quiet:
    "bg-transparent text-gemstone-accent hover:bg-gemstone-surface-raised hover:text-gemstone-text",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-base sm:text-lg",
};

/** A semantic native button or anchor with a consistent visible focus target. */
export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", className, ...elementProps } = props;
  const classes = cn(
    "gemstone-button-motion inline-flex min-w-11 items-center justify-center gap-2 rounded-gemstone-sm font-semibold no-underline transition-colors",
    "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { rel, target, ...anchorProps } = elementProps as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "href"
    >;

    return (
      <a
        {...anchorProps}
        href={props.href}
        target={target}
        rel={target === "_blank" ? safeExternalRel(rel) : rel}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...(elementProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
      type={(elementProps as ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"}
    >
      {children}
    </button>
  );
}
