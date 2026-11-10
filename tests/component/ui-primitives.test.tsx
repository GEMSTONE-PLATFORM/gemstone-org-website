import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionContainer } from "@/components/layout/SectionContainer";
import {
  Button,
  Card,
  ExternalLink,
  Icon,
  ResponsiveMedia,
  SectionHeading,
  StatusFallback,
  resolveIcon,
} from "@/components/ui";

describe("shared UI primitives", () => {
  it("keeps section landmarks and heading relationships explicit", () => {
    render(
      <SectionContainer id="architecture" headingId="architecture-title">
        <SectionHeading id="architecture-title" title="Architecture" />
        <p>Connected environments.</p>
      </SectionContainer>,
    );

    const section = screen.getByRole("region", { name: "Architecture" });
    expect(section).toHaveAttribute("id", "architecture");
    expect(section).toHaveAttribute("aria-labelledby", "architecture-title");
    expect(screen.getByRole("heading", { name: "Architecture", level: 2 })).toBeInTheDocument();
  });

  it("renders named native controls with practical touch targets and focus classes", () => {
    render(
      <>
        <Button>View details</Button>
        <Button href="#architecture" variant="secondary">
          Architecture
        </Button>
      </>,
    );

    const button = screen.getByRole("button", { name: "View details" });
    const link = screen.getByRole("link", { name: "Architecture" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("min-h-11", "min-w-11", "focus-visible:outline");
    expect(link).toHaveAttribute("href", "#architecture");
    expect(link).toHaveClass("min-h-11", "min-w-11", "focus-visible:outline");
  });

  it("protects new-tab links and exposes the behavior to assistive technology", () => {
    render(
      <ExternalLink href="https://example.com/briefing" newTab>
        Open briefing
      </ExternalLink>,
    );

    const link = screen.getByRole("link", { name: /Open briefing.*opens in a new tab/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps fallback and recovery content supplied by the caller", () => {
    render(
      <StatusFallback
        kind="blocked"
        title="Embedded view unavailable"
        message="Use the recovery action to continue."
        explanation={<span>Browser-observable status.</span>}
        recoveryLink={{
          kind: "external",
          label: "Open briefing",
          href: "https://example.com/briefing",
          external: true,
          newTab: true,
        }}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Embedded view unavailable");
    expect(
      screen.getByRole("link", { name: /Open briefing.*opens in a new tab/i }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a caller-owned media fallback when the source is absent", () => {
    render(
      <ResponsiveMedia
        src=""
        alt=""
        width={640}
        height={360}
        fallback={<p>Image unavailable.</p>}
      />,
    );

    expect(screen.getByText("Image unavailable.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("resolves known icons and safely falls back for unknown runtime values", () => {
    expect(resolveIcon("network")).toBe(resolveIcon("network"));
    expect(resolveIcon("unexpected-icon")).toBe(resolveIcon("sparkles"));

    render(<Icon name="unexpected-icon" label="Status" />);
    expect(screen.getByRole("img", { name: "Status" })).toBeInTheDocument();
  });

  it("renders cards as semantic articles by default without requiring hover", () => {
    render(
      <Card>
        <h3>Reusable content</h3>
        <p>Always-visible card content.</p>
      </Card>,
    );

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("Always-visible card content.")).toBeInTheDocument();
  });

  it("has no axe violations for the composed primitive surface", async () => {
    const { container } = render(
      <main>
        <SectionContainer id="ui-test" headingId="ui-test-title">
          <SectionHeading id="ui-test-title" title="Primitive test surface" />
          <Card as="div">
            <Button>Continue</Button>
            <ExternalLink href="https://example.com" newTab>
              External destination
            </ExternalLink>
          </Card>
        </SectionContainer>
      </main>,
    );

    const results = await axe.run(container, {
      runOnly: {
        type: "rule",
        values: [
          "aria-allowed-attr",
          "aria-roles",
          "aria-valid-attr",
          "button-name",
          "heading-order",
          "landmark-one-main",
          "link-name",
          "region",
        ],
      },
    });
    expect(results.violations).toEqual([]);
  });
});
