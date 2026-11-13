import type { DifferentiatorItem } from "@/types";

import { SectionContainer } from "@/components/layout/SectionContainer";
import { AnimatedSection, Card, Icon, SectionHeading } from "@/components/ui";

export interface DifferentiatorsSectionProps {
  readonly items: readonly DifferentiatorItem[];
}

/** Renders approved differentiator claims from typed content. */
export function DifferentiatorsSection({ items }: DifferentiatorsSectionProps) {
  const headingId = "differentiators-heading";

  return (
    <SectionContainer id="differentiators" headingId={headingId}>
      <SectionHeading id={headingId} title="Differentiators" />
      <AnimatedSection className="mt-8">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Differentiator claims">
          {items.map((item) => (
            <li key={item.id}>
              <Card id={item.id} className="h-full">
                <div className="flex items-start gap-4">
                  <Icon name={item.icon} size={28} className="shrink-0 text-gemstone-accent" />
                  <div className="min-w-0">
                    <h3 className="text-xl">{item.title}</h3>
                    {item.description ? (
                      <p className="gemstone-body mt-3 text-base">{item.description}</p>
                    ) : null}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </AnimatedSection>
    </SectionContainer>
  );
}
