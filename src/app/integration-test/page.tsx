import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  BRIEFING_URL_PLACEHOLDER,
  MICROSOFT_FORM_URL_PLACEHOLDER,
} from "@/config/integration-config";
import { FixtureReady } from "@/app/integration-test/FixtureReady";
import { MediaViewer, MicrosoftFormEmbed } from "@/components/ui";
import type { BriefingConfig } from "@/types";

const briefingUrl = "https://briefing.example.test/gemstone-briefing.pdf";
const formUrl = "https://forms.example.test/request-information";
const blankUrl = " \t\n ";

const configuredBriefing: BriefingConfig = {
  url: briefingUrl,
  title: "Configured GEMSTONE Briefing",
  description: "A controlled configured briefing for browser integration tests.",
  format: "pdf",
  allowDownload: true,
  allowOpenInNewTab: true,
  embed: true,
};

function IntegrationFixture({
  label,
  children,
}: Readonly<{
  label: string;
  children: ReactNode;
}>) {
  return (
    <section aria-label={label} className="space-y-4 border-b border-gemstone-border/30 py-8">
      <h2 className="text-xl font-semibold text-gemstone-text">{label}</h2>
      {children}
    </section>
  );
}

/**
 * Development-only browser test fixture for real integration components.
 * Production exports render this route as not found.
 */
export default function IntegrationTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12" aria-label="Integration test fixture">
      <h1 className="text-3xl font-bold text-gemstone-text">Integration test fixture</h1>
      <FixtureReady />

      <IntegrationFixture label="Configured briefing">
        <div data-testid="configured-briefing">
          <MediaViewer config={configuredBriefing} />
        </div>
      </IntegrationFixture>

      <IntegrationFixture label="Unsupported briefing">
        <div data-testid="unsupported-briefing">
          <MediaViewer config={{ ...configuredBriefing, embed: false }} />
        </div>
      </IntegrationFixture>

      <IntegrationFixture label="Blank briefing configuration">
        <div data-testid="blank-briefing">
          <MediaViewer config={{ ...configuredBriefing, url: blankUrl }} />
        </div>
      </IntegrationFixture>

      <IntegrationFixture label="Placeholder briefing configuration">
        <div data-testid="placeholder-briefing">
          <MediaViewer config={{ ...configuredBriefing, url: ` ${BRIEFING_URL_PLACEHOLDER} ` }} />
        </div>
      </IntegrationFixture>

      <IntegrationFixture label="Configured request information form">
        <div data-testid="configured-form">
          <MicrosoftFormEmbed
            url={formUrl}
            title="Configured Request Information form"
            privacyNotice="Privacy notice placeholder"
          />
        </div>
      </IntegrationFixture>

      <IntegrationFixture label="Blank request information form configuration">
        <div data-testid="blank-form">
          <MicrosoftFormEmbed
            url={blankUrl}
            title="Blank Request Information form"
            privacyNotice="Privacy notice placeholder"
          />
        </div>
      </IntegrationFixture>

      <IntegrationFixture label="Placeholder request information form configuration">
        <div data-testid="placeholder-form">
          <MicrosoftFormEmbed
            url={` ${MICROSOFT_FORM_URL_PLACEHOLDER} `}
            title="Placeholder Request Information form"
            privacyNotice="Privacy notice placeholder"
          />
        </div>
      </IntegrationFixture>
    </main>
  );
}
