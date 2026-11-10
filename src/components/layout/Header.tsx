"use client";

import { useEffect, useState } from "react";

import { BrandLogo, useMotionResolution } from "@/components/ui";

import { assetConfig, headerConfig, siteConfig } from "@/config";
import { cn } from "@/lib/utilities";

import { Navigation, type NavigationProps } from "@/components/layout/Navigation";

export interface HeaderProps extends NavigationProps {
  readonly scrollThreshold?: number;
}

/** Sticky site header with a fixed footprint across its visual states. */
export function Header({
  scrollThreshold = headerConfig.scrollTransitionThreshold,
  ...navigationProps
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const motion = useMotionResolution();

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > scrollThreshold);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, [scrollThreshold]);

  return (
    <header
      className={cn(
        "gemstone-header-motion sticky top-0 z-50 h-20 border-b border-transparent transition-colors duration-300",
        isScrolled &&
          "border-gemstone-border/30 bg-gemstone-bg/90 shadow-gemstone backdrop-blur-md",
      )}
      data-header-state={isScrolled ? "scrolled" : "hero"}
      data-motion={motion.mode}
      data-scroll-threshold={scrollThreshold}
    >
      <div className="gemstone-container flex h-20 items-center justify-between gap-6">
        <a
          href="#hero"
          aria-label={`${siteConfig.siteName} home`}
          className="inline-flex min-h-11 items-center rounded-gemstone-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus"
        >
          <BrandLogo
            src={assetConfig.horizontalLogo}
            alt="GEMSTONE"
            width={220}
            height={48}
            priority
            className="h-10 w-auto max-w-[13.75rem] object-contain"
          />
        </a>
        <Navigation {...navigationProps} />
      </div>
    </header>
  );
}
