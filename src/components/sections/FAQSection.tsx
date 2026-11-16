import type { FAQItem } from "@/types";

import { siteManifest } from "@/content/site-manifest";
import { Accordion } from "@/components/ui/Accordion";

export interface FAQSectionProps {
  readonly items: readonly FAQItem[];
  readonly title?: string;
  readonly reducedMotion?: boolean;
}

/** Server-rendered FAQ structure with a progressively enhanced accordion. */
export function FAQSection({
  items,
  title = siteManifest.content.sectionTitles.faq,
  reducedMotion = false,
}: FAQSectionProps) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="gemstone-section min-h-[calc(100svh-5rem)]"
    >
      <div className="gemstone-container">
        <h2 id="faq-heading" className="gemstone-display text-gemstone-text">
          {title}
        </h2>
        <div className="mt-8">
          <Accordion
            items={items}
            reducedMotion={reducedMotion}
            ariaLabel="Frequently asked questions"
            className="w-full max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
