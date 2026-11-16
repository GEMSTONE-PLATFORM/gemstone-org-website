import type { CSSProperties } from "react";

import { defaultPageComposition, renderEnabledSections } from "@/app/section-registry";
import { Footer, Header, SkipLink } from "@/components/layout";
import { MotionProvider } from "@/components/ui";
import { motionConfig } from "@/config";

export default function HomePage() {
  const pageBackground = defaultPageComposition.assets.pageBackground;
  const pageBackgroundStyle = pageBackground
    ? ({ "--gemstone-page-background": `url("${pageBackground}")` } as CSSProperties)
    : undefined;

  return (
    <MotionProvider config={motionConfig}>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        aria-label="GEMSTONE public website"
        className="gemstone-page gemstone-atmosphere min-h-screen px-4 py-24 text-gemstone-text sm:px-6 lg:px-8"
        data-page-background={pageBackground ? "configured" : "generated"}
        style={pageBackgroundStyle}
      >
        {renderEnabledSections(defaultPageComposition)}
      </main>
      <Footer />
    </MotionProvider>
  );
}
