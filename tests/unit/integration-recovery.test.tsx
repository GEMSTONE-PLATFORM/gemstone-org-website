import { act, fireEvent, render, screen } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it, vi } from "vitest";

import { MediaViewer, MicrosoftFormEmbed } from "@/components/ui";
import {
  BRIEFING_URL_PLACEHOLDER,
  MICROSOFT_FORM_URL_PLACEHOLDER,
} from "@/config/integration-config";
import type { BriefingConfig } from "@/types";

type ConfiguredFailure = "blocked" | "timeout" | "unsupported";
type MissingScenario =
  | {
      readonly integration: "briefing";
      readonly failure: "missing";
      readonly url: string | undefined;
    }
  | {
      readonly integration: "form";
      readonly failure: "missing";
      readonly url: string | undefined;
    };
type BriefingConfiguredScenario = {
  readonly integration: "briefing";
  readonly failure: ConfiguredFailure;
  readonly url: string;
  readonly allowDownload: boolean;
  readonly allowOpenInNewTab: boolean;
  readonly format: BriefingConfig["format"];
};
type FormConfiguredScenario = {
  readonly integration: "form";
  readonly failure: "blocked";
  readonly url: string;
};
type RecoveryScenario = MissingScenario | BriefingConfiguredScenario | FormConfiguredScenario;

const title = "GEMSTONE Request More Information form";
const privacyNotice = "Privacy notice placeholder";
const safeTokenArbitrary = fc
  .string({ minLength: 1, maxLength: 18 })
  .filter((value) => /^[a-z0-9]+$/i.test(value));
const validExternalUrlArbitrary = safeTokenArbitrary.map(
  (token) => `https://example-${token}.test/integrations/${token}`,
);
const whitespaceOnlyArbitrary = fc
  .array(fc.constantFrom(" ", "\t", "\n", "\r"), { minLength: 1, maxLength: 8 })
  .map((characters) => characters.join(""));

const missingScenarioArbitrary: fc.Arbitrary<RecoveryScenario> = fc.oneof(
  fc
    .oneof(
      fc.constant(undefined),
      fc.constant(""),
      whitespaceOnlyArbitrary,
      fc.constant(BRIEFING_URL_PLACEHOLDER),
    )
    .map((url) => ({ integration: "briefing" as const, failure: "missing" as const, url })),
  fc
    .oneof(
      fc.constant(undefined),
      fc.constant(""),
      whitespaceOnlyArbitrary,
      fc.constant(MICROSOFT_FORM_URL_PLACEHOLDER),
      fc.constant("MICROSOFT_FORM_URL_GOES_HERE"),
    )
    .map((url) => ({ integration: "form" as const, failure: "missing" as const, url })),
);

const configuredScenarioArbitrary: fc.Arbitrary<RecoveryScenario> = fc.oneof(
  fc
    .record({
      url: validExternalUrlArbitrary,
      allowDownload: fc.boolean(),
      allowOpenInNewTab: fc.boolean(),
      format: fc.constantFrom("pdf", "powerpoint", "unknown") as fc.Arbitrary<
        BriefingConfig["format"]
      >,
      failure: fc.constantFrom(
        "blocked",
        "timeout",
        "unsupported",
      ) as fc.Arbitrary<ConfiguredFailure>,
    })
    .map((scenario) => ({ ...scenario, integration: "briefing" as const })),
  fc
    .record({
      url: validExternalUrlArbitrary,
      failure: fc.constant("blocked" as const),
    })
    .map((scenario) => ({ ...scenario, integration: "form" as const })),
);

const recoveryScenarioArbitrary = fc.oneof(missingScenarioArbitrary, configuredScenarioArbitrary);

function expectSafeRecoveryDestination(links: readonly HTMLAnchorElement[], url: string) {
  expect(links.length).toBeGreaterThan(0);

  for (const link of links) {
    expect(link).toHaveAttribute("href", url);
    expect(new URL(link.href).protocol).toBe("https:");

    if (link.target === "_blank") {
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
    }
  }
}

function briefingConfig(
  scenario: Extract<RecoveryScenario, { integration: "briefing" }>,
): BriefingConfig {
  return {
    url: scenario.url ?? "",
    title: "GEMSTONE Briefing",
    description: "Review the current GEMSTONE briefing.",
    format: scenario.failure === "missing" ? "unknown" : scenario.format,
    allowDownload: scenario.failure === "missing" ? false : scenario.allowDownload,
    allowOpenInNewTab: scenario.failure === "missing" ? false : scenario.allowOpenInNewTab,
    embed: scenario.failure !== "unsupported",
  };
}

describe("integration recovery", () => {
  // **Validates: Requirements 10.3, 10.6, 11.4, 11.6**
  it("Property 11: configured integrations expose a recovery action after a modeled failure", () => {
    fc.assert(
      fc.property(recoveryScenarioArbitrary, (scenario) => {
        if (scenario.failure === "timeout") {
          vi.useFakeTimers();
        }

        const view =
          scenario.integration === "briefing"
            ? render(<MediaViewer config={briefingConfig(scenario)} />)
            : render(
                <MicrosoftFormEmbed
                  url={scenario.url}
                  title={title}
                  privacyNotice={privacyNotice}
                />,
              );

        try {
          if (scenario.failure === "missing") {
            const status = screen.getByRole("status");
            if (scenario.integration === "briefing") {
              expect(status).toHaveTextContent("Briefing not configured");
              expect(screen.queryByTitle("GEMSTONE Briefing")).not.toBeInTheDocument();
            } else {
              expect(status).toHaveTextContent(
                "Request Information form has not yet been connected.",
              );
              expect(screen.queryByTitle(title)).not.toBeInTheDocument();
            }
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
            return;
          }

          if (scenario.failure === "timeout") {
            act(() => {
              vi.advanceTimersByTime(8000);
            });
          } else if (scenario.failure === "blocked") {
            fireEvent.error(
              screen.getByTitle(scenario.integration === "briefing" ? "GEMSTONE Briefing" : title),
            );
          }

          if (scenario.integration === "briefing") {
            const viewer = screen.getByTestId("briefing-viewer");
            expect(viewer).toHaveAttribute(
              "data-embed-state",
              scenario.failure === "unsupported" ? "direct" : "blocked",
            );
            if (scenario.failure === "timeout") {
              expect(viewer).toHaveAttribute("data-embed-failure", "timeout");
            }
            expectSafeRecoveryDestination(
              screen.getAllByRole("link", { name: /View Briefing/i }),
              scenario.url,
            );
          } else {
            expect(
              screen.getByText("Request Information form unavailable here"),
            ).toBeInTheDocument();
            expect(
              screen
                .getByText("Request Information form unavailable here")
                .closest("[data-form-embed-state]"),
            ).toHaveAttribute("data-form-embed-state", "blocked");
            expectSafeRecoveryDestination(
              screen.getAllByRole("link", { name: /Open Request Information Form/i }),
              scenario.url,
            );
          }
        } finally {
          view.unmount();
          vi.useRealTimers();
        }
      }),
      { numRuns: 100 },
    );
  });
});
