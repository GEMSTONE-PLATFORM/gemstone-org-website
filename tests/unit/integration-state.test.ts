import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { BRIEFING_URL_PLACEHOLDER, MICROSOFT_FORM_URL_PLACEHOLDER } from "@/config";
import {
  externalLinkAttributes,
  newTabAccessibleHint,
  safeExternalRel,
} from "@/lib/external-links";
import {
  hasIframeTarget,
  resolveConfiguredUrl,
  resolveIntegrationState,
  resolveIntegrationUrl,
  transitionEmbedState,
} from "@/lib/integration-state";
describe("integration URL and state helpers", () => {
  it("treats absent, blank, whitespace, and exact placeholders as missing", () => {
    const missingValues = [undefined, null, "", " \t\n", BRIEFING_URL_PLACEHOLDER];
    for (const value of missingValues) {
      expect(resolveConfiguredUrl(value, BRIEFING_URL_PLACEHOLDER)).toBeUndefined();
      expect(resolveIntegrationState(value, BRIEFING_URL_PLACEHOLDER)).toBe("missing");
      expect(resolveIntegrationUrl(value, BRIEFING_URL_PLACEHOLDER)).not.toHaveProperty(
        "iframeSrc",
      );
    }
    expect(
      resolveConfiguredUrl(` ${BRIEFING_URL_PLACEHOLDER} `, BRIEFING_URL_PLACEHOLDER),
    ).toBeUndefined();
    expect(
      resolveConfiguredUrl(" https://example.com/briefing.pdf ", BRIEFING_URL_PLACEHOLDER),
    ).toBe("https://example.com/briefing.pdf");
    expect(
      resolveConfiguredUrl("MICROSOFT_FORM_URL_GOES_HERE", [
        MICROSOFT_FORM_URL_PLACEHOLDER,
        "MICROSOFT_FORM_URL_GOES_HERE",
      ]),
    ).toBeUndefined();
  });
  // **Validates: Requirements 10.1, 10.2, 11.2, 11.3, 18.3, 18.4**
  it("Property 10: missing integration configuration is non-embeddable", () => {
    const whitespaceOnlyArbitrary = fc
      .array(fc.constantFrom(" ", "\t", "\n", "\r"), { minLength: 1, maxLength: 12 })
      .map((characters) => characters.join(""));
    const emptyValueArbitrary = fc.oneof(
      fc.constant(undefined),
      fc.constant(null),
      fc.constant(""),
      whitespaceOnlyArbitrary,
    );
    const missingIntegrationArbitrary = fc.oneof(
      emptyValueArbitrary.map((url) => ({ url, placeholder: BRIEFING_URL_PLACEHOLDER })),
      emptyValueArbitrary.map((url) => ({ url, placeholder: MICROSOFT_FORM_URL_PLACEHOLDER })),
      fc.constant({ url: BRIEFING_URL_PLACEHOLDER, placeholder: BRIEFING_URL_PLACEHOLDER }),
      fc.constant({
        url: MICROSOFT_FORM_URL_PLACEHOLDER,
        placeholder: MICROSOFT_FORM_URL_PLACEHOLDER,
      }),
    );

    fc.assert(
      fc.property(missingIntegrationArbitrary, ({ url, placeholder }) => {
        const resolution = resolveIntegrationUrl(url, placeholder);

        expect(resolution.state).toBe("missing");
        expect(resolution.iframeSrc).toBeUndefined();
        expect(resolution).not.toHaveProperty("iframeSrc");
        expect(hasIframeTarget(resolution)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it("returns an iframe target only for configured URLs", () => {
    const missing = resolveIntegrationUrl("  ", MICROSOFT_FORM_URL_PLACEHOLDER);
    const configured = resolveIntegrationUrl(
      " https://forms.example.test/request ",
      MICROSOFT_FORM_URL_PLACEHOLDER,
    );
    expect(missing).toEqual({ state: "missing" });
    expect(hasIframeTarget(missing)).toBe(false);
    expect(configured).toEqual({
      state: "idle",
      url: "https://forms.example.test/request",
      iframeSrc: "https://forms.example.test/request",
    });
    expect(hasIframeTarget(configured)).toBe(true);
  });
  it("transitions through browser-observable embed states", () => {
    expect(transitionEmbedState("missing", "load")).toBe("missing");
    expect(transitionEmbedState("idle", "load")).toBe("loading");
    expect(transitionEmbedState("loading", "loaded")).toBe("loaded");
    expect(transitionEmbedState("loading", "blocked")).toBe("blocked");
    expect(transitionEmbedState("loading", "unsupported")).toBe("unsupported");
    for (const state of ["loaded", "blocked", "unsupported"] as const) {
      expect(transitionEmbedState(state, "load")).toBe(state);
      expect(transitionEmbedState(state, "reset")).toBe("idle");
    }
    expect(transitionEmbedState("missing", "reset")).toBe("missing");
    expect(transitionEmbedState("loading", "reset")).toBe("idle");
  });
});
describe("external-link helpers", () => {
  it("always adds opener protection without discarding existing rel tokens", () => {
    expect(safeExternalRel()).toBe("noopener noreferrer");
    expect(safeExternalRel("nofollow noopener")).toBe("nofollow noopener noreferrer");
  });
  it("returns safe new-tab attributes and an accessible indication", () => {
    expect(externalLinkAttributes(true)).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
      accessibleHint: "opens in a new tab",
    });
    expect(externalLinkAttributes(false)).toEqual({});
    expect(newTabAccessibleHint(true)).toBe("opens in a new tab");
    expect(newTabAccessibleHint(false)).toBe("");
  });
});
