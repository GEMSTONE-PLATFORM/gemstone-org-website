import type { MotionConfig } from "@/types";

/** Global motion defaults. Browser preferences are resolved by motion utilities. */
export const motionConfig = {
  intensity: "standard",
  enableContinuousBackgroundMotion: true,
  disableContinuousMotionOnSmallScreens: true,
  sectionRevealDurationMs: 320,
} as const satisfies MotionConfig;
