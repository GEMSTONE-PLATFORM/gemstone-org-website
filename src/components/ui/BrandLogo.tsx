"use client";

/* eslint-disable @next/next/no-img-element -- the static logo must bypass runtime image optimization. */
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utilities";

export interface BrandLogoProps {
  readonly src: string;
  readonly alt?: string;
  readonly width: number;
  readonly height: number;
  readonly className?: string;
  readonly priority?: boolean;
}

/** Official logo with a text-only fallback that keeps the configured footprint stable. */
export function BrandLogo({
  src,
  alt = "GEMSTONE",
  width,
  height,
  className,
  priority = false,
}: BrandLogoProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      setHasFailed(true);
    }
  }, [src]);

  if (hasFailed || src.trim().length === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-gemstone-sm border border-gemstone-border/40 bg-gemstone-surface-raised px-3 text-center font-display text-lg font-bold tracking-[0.16em] text-gemstone-text",
          className,
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
        data-logo-state="fallback"
      >
        {alt}
      </span>
    );
  }

  return (
    <img
      src={src}
      ref={imageRef}
      alt={alt}
      width={width}
      height={height}
      sizes={`${width}px`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      className={className}
      onError={() => setHasFailed(true)}
      onErrorCapture={() => setHasFailed(true)}
      data-logo-state="configured"
    />
  );
}
