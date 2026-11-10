"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { motionConfig as defaultMotionConfig } from "@/config/motion-config";
import { resolveMotionConfig, type MotionResolution } from "@/lib/motion";
import type { MotionConfig } from "@/types";

const MotionResolutionContext = createContext<MotionResolution>(
  resolveMotionConfig(defaultMotionConfig),
);

export interface MotionProviderProps {
  readonly config?: MotionConfig;
  readonly children: ReactNode;
}

function getBrowserMotionState() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return { prefersReducedMotion: false, isSmallScreen: false };
  }

  return {
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    isSmallScreen: window.matchMedia("(max-width: 767px)").matches,
  };
}

/**
 * Resolves visitor preferences and small-screen policy once for all motion client islands.
 * The wrapper also exposes the result to CSS so non-JavaScript content keeps its static layout.
 */
export function MotionProvider({ config = defaultMotionConfig, children }: MotionProviderProps) {
  const [browserState, setBrowserState] = useState(getBrowserMotionState);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreenQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setBrowserState(getBrowserMotionState());

    update();
    reducedQuery.addEventListener?.("change", update);
    smallScreenQuery.addEventListener?.("change", update);

    return () => {
      reducedQuery.removeEventListener?.("change", update);
      smallScreenQuery.removeEventListener?.("change", update);
    };
  }, []);

  const resolution = useMemo(
    () => resolveMotionConfig(config, browserState),
    [browserState, config],
  );
  const style = {
    "--gemstone-motion-duration": `${resolution.sectionRevealDurationMs}ms`,
    "--gemstone-motion-translate": `${resolution.effects.maxTranslatePx}px`,
  } as CSSProperties;

  return (
    <MotionResolutionContext.Provider value={resolution}>
      <div
        data-motion={resolution.mode}
        data-continuous-motion={resolution.continuousBackgroundMotion ? "enabled" : "disabled"}
        data-small-screen={resolution.isSmallScreen ? "true" : "false"}
        className={resolution.mode === "reduced" ? "motion-reduced" : undefined}
        style={style}
      >
        {children}
      </div>
    </MotionResolutionContext.Provider>
  );
}

/** Returns the centrally resolved motion policy for an isolated client component. */
export function useMotionResolution(): MotionResolution {
  return useContext(MotionResolutionContext);
}
