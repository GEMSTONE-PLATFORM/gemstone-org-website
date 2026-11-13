"use client";

import { useEffect, useState } from "react";

import { BrandLogo, useMotionResolution } from "@/components/ui";
import { Navigation, type NavigationProps } from "@/components/layout/Navigation";
import { assetConfig, headerConfig, siteConfig } from "@/config";
import { cn } from "@/lib/utilities";

export interface HeaderProps extends NavigationProps {
  readonly scrollThreshold?: number;
}

/** Sticky site header with an opaque, readable footprint across visual states. */
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
        "gemstone-header-motion sticky top-0 z-50 h-20 border-b border-gemstone-border/30 bg-gemstone-bg shadow-gemstone",
        isScrolled && "border-gemstone-cyan/45 shadow-gemstone-glow",
      )}
      data-header-state={isScrolled ? "scrolled" : "hero"}
      data-motion={motion.mode}
      data-scroll-threshold={scrollThreshold}
    >
      <div className="gemstone-container flex h-20 items-center justify-between gap-4 sm:gap-6">
        <a
          href="#hero"
          aria-label={`${siteConfig.siteName} home`}
          className="inline-flex min-h-11 items-center rounded-gemstone-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus"
        >
          <BrandLogo
            src={assetConfig.mark}
            alt=""
            width={48}
            height={48}
            priority
            className="size-9 object-contain sm:hidden"
          />
          <BrandLogo
            src={assetConfig.horizontalLogo}
            alt="GEMSTONE"
            width={220}
            height={48}
            priority
            className="hidden h-10 w-auto max-w-[13.75rem] object-contain sm:block"
          />
        </a>
        <Navigation {...navigationProps} />
      </div>
    </header>
  );
}
