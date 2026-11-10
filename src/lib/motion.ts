import type { MotionConfig, MotionIntensity } from "@/types";

/** The supported motion modes for configuration and browser preference resolution. */
export const motionIntensities = [
  "reduced",
  "standard",
  "enhanced",
] as const satisfies readonly MotionIntensity[];

/** The default reveal duration used when a configuration value is not finite. */
export const DEFAULT_SECTION_REVEAL_DURATION_MS = 320;

/** Hard limits keep repeated motion inexpensive and prevent unbounded effects. */
export const motionBounds = {
  minDurationMs: 0,
  maxDurationMs: 600,
  maxTranslatePx: 8,
  maxScaleDelta: 0.04,
  maxOpacityDelta: 0.2,
} as const;

export interface MotionEffectBudget {
  readonly maxTranslatePx: number;
  readonly maxScaleDelta: number;
  readonly maxOpacityDelta: number;
}

export interface MotionResolution {
  readonly mode: MotionIntensity;
  readonly prefersReducedMotion: boolean;
  readonly isSmallScreen: boolean;
  readonly continuousBackgroundMotion: boolean;
  readonly sectionRevealDurationMs: number;
  readonly effects: MotionEffectBudget;
}

export interface MotionResolutionOptions {
  readonly prefersReducedMotion?: boolean;
  readonly isSmallScreen?: boolean;
}

const effectBudgets: Record<MotionIntensity, MotionEffectBudget> = {
  reduced: {
    maxTranslatePx: 0,
    maxScaleDelta: 0,
    maxOpacityDelta: 0,
  },
  standard: {
    maxTranslatePx: 4,
    maxScaleDelta: 0.02,
    maxOpacityDelta: 0.12,
  },
  enhanced: {
    maxTranslatePx: motionBounds.maxTranslatePx,
    maxScaleDelta: motionBounds.maxScaleDelta,
    maxOpacityDelta: motionBounds.maxOpacityDelta,
  },
};

/** Resolve the configured intensity, giving the visitor's reduced-motion preference precedence. */
export function resolveMotionMode(
  configured: MotionIntensity,
  prefersReducedMotion: boolean,
): MotionIntensity {
  if (prefersReducedMotion) return "reduced";
  return configured;
}

/** Keep a duration inside the finite, low-cost motion budget. */
export function clampMotionDuration(durationMs: number): number {
  const finiteDuration = Number.isFinite(durationMs)
    ? durationMs
    : DEFAULT_SECTION_REVEAL_DURATION_MS;
  return Math.min(motionBounds.maxDurationMs, Math.max(motionBounds.minDurationMs, finiteDuration));
}

/**
 * Resolve browser preferences and viewport behavior without accessing browser APIs.
 * The returned values are safe to pass to motion components and CSS custom properties.
 */
export function resolveMotionConfig(
  config: MotionConfig,
  options: MotionResolutionOptions = {},
): MotionResolution {
  const prefersReducedMotion = options.prefersReducedMotion ?? false;
  const isSmallScreen = options.isSmallScreen ?? false;
  const mode = resolveMotionMode(config.intensity, prefersReducedMotion);
  const continuousBackgroundMotion =
    mode !== "reduced" &&
    config.enableContinuousBackgroundMotion &&
    !(isSmallScreen && config.disableContinuousMotionOnSmallScreens);
  const intensityDurationScale = mode === "enhanced" ? 1.25 : 1;
  const sectionRevealDurationMs =
    mode === "reduced"
      ? motionBounds.minDurationMs
      : clampMotionDuration(config.sectionRevealDurationMs * intensityDurationScale);
  return {
    mode,
    prefersReducedMotion,
    isSmallScreen,
    continuousBackgroundMotion,
    sectionRevealDurationMs,
    effects: effectBudgets[mode],
  };
}
