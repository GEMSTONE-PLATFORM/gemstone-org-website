import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RequestInformationSection } from "@/components/sections/section-renderers";
import { MicrosoftFormEmbed } from "@/components/ui";
describe("RequestInformationSection", () => {
  it("renders the approved heading and subtitle", () => {
    render(<RequestInformationSection url={undefined} />);
    expect(screen.getByRole("heading", { name: "Request More Information" })).toBeInTheDocument();
    expect(screen.getByText("Connect with the GEMSTONE team to learn more.")).toBeInTheDocument();
  });
  it.each([undefined, "", " \t\n", " MICROSOFT_FORM_URL ", " MICROSOFT_FORM_URL_GOES_HERE "])(
    "does not render an iframe for missing or placeholder URL %j",
    (url) => {
      render(
        <MicrosoftFormEmbed
          url={url}
          title="GEMSTONE Request More Information form"
          privacyNotice="Privacy notice placeholder"
        />,
      );
      expect(screen.queryByTitle("GEMSTONE Request More Information form")).not.toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent(
        "Request Information form has not yet been connected.",
      );
      expect(screen.getByText("Privacy notice placeholder")).toBeInTheDocument();
    },
  );
  it("renders a configured form with responsive lazy iframe attributes and safe fallback", () => {
    render(
      <MicrosoftFormEmbed
        url=" https://forms.example.test/request "
        title="GEMSTONE Request More Information form"
        privacyNotice="Privacy notice placeholder"
      />,
    );
    const iframe = screen.getByTitle("GEMSTONE Request More Information form");
    expect(iframe).toHaveAttribute("src", "https://forms.example.test/request");
    expect(iframe).toHaveAttribute("loading", "lazy");
    expect(iframe).toHaveClass("absolute", "inset-0", "h-full", "w-full");
    expect(iframe).not.toHaveAttribute("style");
    expect(
      screen.getByRole("link", { name: /Open Request Information Form.*opens in a new tab/i }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("uses the privacy placeholder when configured privacy copy is blank", () => {
    render(
      <MicrosoftFormEmbed
        url="https://forms.example.test/request"
        title="GEMSTONE Request More Information form"
        privacyNotice="  "
      />,
    );
    expect(screen.getByText("Privacy notice placeholder")).toBeInTheDocument();
  });
  it("shows the external fallback after the embedded form times out", () => {
    vi.useFakeTimers();
    try {
      render(
        <MicrosoftFormEmbed
          url="https://forms.example.test/request"
          title="GEMSTONE Request More Information form"
          privacyNotice="Privacy notice placeholder"
        />,
      );
      act(() => {
        vi.advanceTimersByTime(8000);
      });
      expect(screen.getByRole("status")).toHaveTextContent(
        "Request Information form unavailable here",
      );
      expect(
        screen.getAllByRole("link", {
          name: /Open Request Information Form.*opens in a new tab/i,
        }),
      ).not.toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
