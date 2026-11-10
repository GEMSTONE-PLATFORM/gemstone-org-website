import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Button, StatusFallback } from "@/components/ui";

import {
  activateByKeyboard,
  assertStaticFallback,
  mockReducedMotion,
  setViewport,
  viewportPresets,
} from "../helpers/component-test-helpers";

describe("component test helpers", () => {
  it.each(Object.entries(viewportPresets))(
    "supports representative component interaction at %s viewport size",
    (_name, viewport) => {
      const restoreViewport = setViewport(viewport);

      try {
        let activated = false;
        render(
          <Button
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                activated = true;
              }
            }}
          >
            Activate control
          </Button>,
        );

        expect(window.innerWidth).toBe(viewport.width);
        expect(window.innerHeight).toBe(viewport.height);

        const control = screen.getByRole("button", { name: "Activate control" });
        control.focus();
        activateByKeyboard(control, "Enter");

        expect(document.activeElement).toBe(control);
        expect(activated).toBe(true);
      } finally {
        restoreViewport();
      }
    },
  );

  it("mocks reduced-motion preference and restores the browser API", () => {
    const originalMatchMedia = window.matchMedia;
    const restoreReducedMotion = mockReducedMotion(true);

    try {
      expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
      expect(window.matchMedia("(prefers-reduced-motion: no-preference)").matches).toBe(false);
    } finally {
      restoreReducedMotion();
    }

    expect(window.matchMedia).toBe(originalMatchMedia);
  });

  it("asserts fallback content in server-rendered markup and DOM output", () => {
    const markup = renderToStaticMarkup(
      <StatusFallback
        kind="missing"
        title="Briefing unavailable"
        message="The briefing is not connected."
      />,
    );

    assertStaticFallback(markup, {
      requiredText: ["Briefing unavailable", "The briefing is not connected."],
    });

    const { container } = render(
      <StatusFallback
        kind="blocked"
        title="Embedded view unavailable"
        message="Open the external briefing to continue."
      />,
    );

    assertStaticFallback(container, {
      requiredSelectors: ['[data-status="blocked"]'],
      requiredText: ["Embedded view unavailable"],
      forbiddenSelectors: ["iframe"],
    });
  });
});
