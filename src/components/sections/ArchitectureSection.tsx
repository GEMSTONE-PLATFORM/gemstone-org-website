import type { ArchitectureContent, AnalystBenefitItem, EcosystemContent } from "@/types";
import { EcosystemBenefitsSection } from "@/components/sections/EcosystemBenefitsSection";
import {
  analystBenefits as defaultAnalystBenefits,
  ecosystemContent as defaultEcosystemContent,
} from "@/content/site-content";
import { AnimatedSection, ArchitectureDiagram } from "@/components/ui";

export interface ArchitectureSectionProps {
  readonly content: ArchitectureContent;
  readonly ecosystem?: EcosystemContent;
  readonly analystBenefits?: readonly AnalystBenefitItem[];
}

/** Server-rendered architecture explanation with a progressively enhanced graph. */
export function ArchitectureSection({
  content,
  ecosystem = defaultEcosystemContent,
  analystBenefits = defaultAnalystBenefits,
}: ArchitectureSectionProps) {
  return (
    <section id="architecture" aria-labelledby="architecture-heading" className="gemstone-section">
      <div className="gemstone-container">
        <AnimatedSection>
          <h2 id="architecture-heading" className="gemstone-display text-gemstone-text">
            Architecture
          </h2>
          <div className="mt-8 space-y-6">
            <p className="gemstone-body">
              GEMSTONE connects organizations and communities through a Hub, mission-specific Nodes,
              and user-facing Clients. The Hub provides enterprise-level services and connections;
              Nodes provide tailorable services and infrastructure; Clients connect users, tools,
              data, compute, models, and simulations to one or more Nodes.
            </p>
            <p className="gemstone-body">{content.distributedPrinciple}</p>
            <ArchitectureDiagram content={content} />
            <EcosystemBenefitsSection ecosystem={ecosystem} benefits={analystBenefits} />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
