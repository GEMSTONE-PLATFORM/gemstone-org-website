"use client";

import { useState, type ImgHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utilities";
import { FallbackComposition } from "@/components/ui/FallbackComposition";

export interface ResponsiveMediaSource {
  readonly srcSet: string;
  readonly media?: string;
  readonly type?: string;
}

export interface ResponsiveMediaProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "srcSet" | "children" | "alt" | "width" | "height"
> {
  readonly alt: string;
  /** Intrinsic dimensions reserve the image footprint before it loads or after it fails. */
  readonly width: number;
  readonly height: number;
  readonly sources?: readonly ResponsiveMediaSource[];
  readonly fallback?: ReactNode;
  readonly wrapperClassName?: string;
}

/** Responsive image primitive with explicit dimensions and an optional caller-owned fallback. */
export function ResponsiveMedia({
  sources = [],
  fallback,
  wrapperClassName,
  className,
  src,
  alt,
  width,
  height,
  sizes = "100vw",
  loading = "lazy",
  decoding = "async",
  ...props
}: ResponsiveMediaProps) {
  const [hasFailed, setHasFailed] = useState(typeof src !== "string" || src.trim().length === 0);
  const footprintStyle = { aspectRatio: `${width} / ${height}` };

  if (hasFailed) {
    return (
      <div
        className={cn(
          "gemstone-surface-raised gemstone-network min-h-32 overflow-hidden rounded-gemstone",
          wrapperClassName,
        )}
        style={footprintStyle}
        data-media-state="fallback"
      >
        {fallback ?? (
          <FallbackComposition
            kind="missing"
            title="Image unavailable"
            message="This visual is unavailable. The surrounding content remains available."
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-hidden rounded-gemstone", wrapperClassName)}
      style={footprintStyle}
      data-media-state="configured"
    >
      <picture className="block h-full w-full">
        {sources.map((source) => (
          <source key={`${source.media ?? "all"}-${source.srcSet}`} {...source} />
        ))}
        <img
          {...props}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          decoding={decoding}
          className={cn("h-auto w-full object-cover", className)}
          onError={() => setHasFailed(true)}
        />
      </picture>
    </div>
  );
}
