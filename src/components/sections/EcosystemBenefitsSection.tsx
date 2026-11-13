import type { AnalystBenefitItem, EcosystemContent } from "@/types";

import { Card, Icon } from "@/components/ui";

export interface EcosystemBenefitsSectionProps {
  readonly ecosystem: EcosystemContent;
  readonly benefits: readonly AnalystBenefitItem[];
}

/** Content that follows the architecture diagram without the retired M&S matrix. */
export function EcosystemBenefitsSection({ ecosystem, benefits }: EcosystemBenefitsSectionProps) {
  return (
    <div className="mt-12 grid gap-10 border-t border-gemstone-border/25 pt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <p className="gemstone-eyebrow">Connected ecosystem</p>
        <h3 id="ecosystem-heading" className="mt-3 text-3xl text-gemstone-text sm:text-4xl">
          {ecosystem.title}
        </h3>
        <p className="gemstone-body mt-5">{ecosystem.description}</p>
        <ul className="mt-5 space-y-3" aria-label="GEMSTONE ecosystem connections">
          {ecosystem.points.map((point) => (
            <li
              key={point}
              className="rounded-gemstone-sm border border-gemstone-border/25 bg-gemstone-surface/70 px-4 py-3 text-base text-gemstone-muted"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="gemstone-eyebrow">Mission advantage</p>
        <h3 className="mt-3 text-3xl text-gemstone-text sm:text-4xl">Benefits</h3>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2" aria-label="GEMSTONE benefits">
          {benefits.map((benefit) => (
            <li key={benefit.id}>
              <Card className="h-full p-5">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-gemstone-sm border border-gemstone-border/35 bg-gemstone-bg/60 text-gemstone-accent"
                  >
                    <Icon name={benefit.icon} size={22} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-lg text-gemstone-text">{benefit.title}</h4>
                    <p className="mt-2 text-sm text-gemstone-muted">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
