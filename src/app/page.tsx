import { defaultPageComposition, renderEnabledSections } from "@/app/section-registry";
import { Footer, Header, SkipLink } from "@/components/layout";
import { MotionProvider } from "@/components/ui";
import { motionConfig } from "@/config";

export default function HomePage() {
  return (
    <MotionProvider config={motionConfig}>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        aria-label="GEMSTONE public website"
        className="gemstone-page gemstone-grid min-h-screen bg-gemstone-bg px-4 py-24 text-gemstone-text sm:px-6 lg:px-8"
      >
        {renderEnabledSections(defaultPageComposition)}
      </main>
      <Footer />
    </MotionProvider>
  );
}
