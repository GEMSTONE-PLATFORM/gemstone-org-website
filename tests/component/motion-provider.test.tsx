import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MotionProvider } from "@/components/ui/MotionProvider";
import type { MotionConfig } from "@/types";

const reducedConfig: MotionConfig = {
  intensity: "reduced",
  enableContinuousBackgroundMotion: true,
  disableContinuousMotionOnSmallScreens: true,
  sectionRevealDurationMs: 320,
};

describe("MotionProvider", () => {
  it("publishes the centralized reduced-motion policy while preserving child content", () => {
    render(
      <MotionProvider config={reducedConfig}>
        <p>Static GEMSTONE content</p>
      </MotionProvider>,
    );

    const scope = screen.getByText("Static GEMSTONE content").parentElement;
    expect(scope).toHaveAttribute("data-motion", "reduced");
    expect(scope).toHaveAttribute("data-continuous-motion", "disabled");
    expect(scope).toHaveClass("motion-reduced");
    expect(screen.getByText("Static GEMSTONE content")).toBeVisible();
  });
});
