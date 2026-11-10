"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { useMotionResolution } from "@/components/ui/MotionProvider";
import { cn } from "@/lib/utilities";

export interface AnimatedSectionProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Adds one viewport-triggered entrance cue without hiding server-rendered content.
 * Browsers without IntersectionObserver retain the same static, readable content.
 */
export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  const reference = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const motion = useMotionResolution();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !reference.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(reference.current);
    return () => observer.disconnect();
  }, []);

  const reveal = motion.mode !== "reduced" && inView;

  return (
    <div
      ref={reference}
      className={cn("gemstone-section-reveal", className)}
      data-motion-reveal={reveal ? "active" : "static"}
      data-motion={motion.mode}
    >
      {children}
    </div>
  );
}
