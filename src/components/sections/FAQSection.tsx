import type { FAQItem } from "@/types";

import { Accordion } from "@/components/ui/Accordion";

export interface FAQSectionProps {
  readonly items: readonly FAQItem[];
  readonly reducedMotion?: boolean;
}

/** Server-rendered FAQ structure with a progressively enhanced accordion. */
export function FAQSection({ items, reducedMotion = false }: FAQSectionProps) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="gemstone-section">
      <div className="gemstone-container">
        <h2 id="faq-heading" className="gemstone-display text-gemstone-text">
          Frequently Asked Questions
        </h2>
        <div className="mt-8">
          <Accordion
            items={items}
            reducedMotion={reducedMotion}
            ariaLabel="Frequently asked questions"
          />
        </div>
      </div>
    </section>
  );
}
