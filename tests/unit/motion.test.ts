import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { motionConfig } from "@/config";
import {
  clampMotionDuration,
  motionBounds,
  motionIntensities,
  resolveMotionConfig,
  resolveMotionMode,
} from "@/lib/motion";
import type { MotionConfig, MotionIntensity } from "@/types";

const configuredMotion = (intensity: MotionIntensity): MotionConfig => ({
  ...motionConfig,
  intensity,
});

describe("motion resolution", () => {
  it("uses standard motion as the centralized default", () => {
    expect(motionConfig.intensity).toBe("standard");
    expect(motionIntensities).toEqual(["reduced", "standard", "enhanced"]);
  });

  it.each(motionIntensities)(
    "preserves configured %s motion without a reduced-motion preference",
    (intensity) => {
      expect(resolveMotionMode(intensity, false)).toBe(intensity);
      expect(resolveMotionConfig(configuredMotion(intensity)).mode).toBe(intensity);
    },
  );

  it.each(motionIntensities)(
    "resolves configured %s to reduced when the visitor prefers reduced motion",
    (intensity) => {
      const resolved = resolveMotionConfig(configuredMotion(intensity), {
        prefersReducedMotion: true,
      });

      expect(resolveMotionMode(intensity, true)).toBe("reduced");
      expect(resolved.mode).toBe("reduced");
      expect(resolved.continuousBackgroundMotion).toBe(false);
      expect(resolved.sectionRevealDurationMs).toBe(0);
      expect(resolved.effects).toEqual({
        maxTranslatePx: 0,
        maxScaleDelta: 0,
        maxOpacityDelta: 0,
      });
    },
  );

  // **Validates: Requirements 14.1, 14.3, 14.4**
  it("Property 9: reduced-motion preference takes precedence for every motion configuration", () => {
    const motionConfigArbitrary = fc.record({
      intensity: fc.constantFrom(...motionIntensities),
      enableContinuousBackgroundMotion: fc.boolean(),
      disableContinuousMotionOnSmallScreens: fc.boolean(),
      sectionRevealDurationMs: fc.integer({ min: -5_000, max: 5_000 }),
    });
    const browserOptionsArbitrary = fc.record({
      prefersReducedMotion: fc.boolean(),
      isSmallScreen: fc.boolean(),
    });

    fc.assert(
      fc.property(motionConfigArbitrary, browserOptionsArbitrary, (config, options) => {
        const resolved = resolveMotionConfig(config, options);
        const expectedMode = options.prefersReducedMotion ? "reduced" : config.intensity;
        const expectedContinuousMotion =
          expectedMode !== "reduced" &&
          config.enableContinuousBackgroundMotion &&
          !(options.isSmallScreen && config.disableContinuousMotionOnSmallScreens);

        expect(resolved.mode).toBe(expectedMode);
        expect(resolved.continuousBackgroundMotion).toBe(expectedContinuousMotion);

        if (options.prefersReducedMotion) {
          expect(resolved.sectionRevealDurationMs).toBe(0);
          expect(resolved.effects).toEqual({
            maxTranslatePx: 0,
            maxScaleDelta: 0,
            maxOpacityDelta: 0,
          });
        }
      }),
    );
  });

  it.each([
    [false, true],
    [true, false],
  ] as const)(
    "applies the small-screen continuous-motion setting (disable=%s, expected=%s)",
    (disableOnSmallScreens, expectedContinuousMotion) => {
      const config = {
        ...motionConfig,
        intensity: "standard" as const,
        enableContinuousBackgroundMotion: true,
        disableContinuousMotionOnSmallScreens: disableOnSmallScreens,
      };

      expect(resolveMotionConfig(config, { isSmallScreen: true }).continuousBackgroundMotion).toBe(
        expectedContinuousMotion,
      );
      expect(resolveMotionConfig(config, { isSmallScreen: false }).continuousBackgroundMotion).toBe(
        true,
      );
    },
  );

  it("does not enable continuous motion when it is disabled globally", () => {
    const resolved = resolveMotionConfig(
      {
        ...motionConfig,
        enableContinuousBackgroundMotion: false,
      },
      { isSmallScreen: false },
    );

    expect(resolved.continuousBackgroundMotion).toBe(false);
  });

  it.each([
    ["reduced", 0, 0, 0, 0],
    ["standard", 320, 4, 0.02, 0.12],
    ["enhanced", 400, 8, 0.04, 0.2],
  ] as const)(
    "returns bounded duration and effects for %s motion",
    (intensity, duration, maxTranslatePx, maxScaleDelta, maxOpacityDelta) => {
      const resolved = resolveMotionConfig({
        ...motionConfig,
        intensity,
      });

      expect(resolved.sectionRevealDurationMs).toBe(duration);
      expect(resolved.sectionRevealDurationMs).toBeGreaterThanOrEqual(motionBounds.minDurationMs);
      expect(resolved.sectionRevealDurationMs).toBeLessThanOrEqual(motionBounds.maxDurationMs);
      expect(resolved.effects).toEqual({
        maxTranslatePx,
        maxScaleDelta,
        maxOpacityDelta,
      });
      expect(resolved.effects.maxTranslatePx).toBeLessThanOrEqual(motionBounds.maxTranslatePx);
      expect(resolved.effects.maxScaleDelta).toBeLessThanOrEqual(motionBounds.maxScaleDelta);
      expect(resolved.effects.maxOpacityDelta).toBeLessThanOrEqual(motionBounds.maxOpacityDelta);
    },
  );

  it("clamps configured reveal durations to the motion bounds", () => {
    expect(clampMotionDuration(-100)).toBe(motionBounds.minDurationMs);
    expect(clampMotionDuration(10_000)).toBe(motionBounds.maxDurationMs);
    expect(clampMotionDuration(Number.NaN)).toBe(320);
  });
});
