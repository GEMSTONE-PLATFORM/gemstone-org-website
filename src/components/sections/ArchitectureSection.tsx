import type { ArchitectureContent, AnalystBenefitItem, EcosystemContent } from "@/types";
import { EcosystemBenefitsSection } from "@/components/sections/EcosystemBenefitsSection";
import { siteManifest } from "@/content/site-manifest";
import { AnimatedSection, ArchitectureDiagram, ResponsiveMedia } from "@/components/ui";

export interface ArchitectureSectionProps {
  readonly content: ArchitectureContent;
  readonly title?: string;
  readonly introduction?: string;
  readonly visualImage?: string;
  readonly ecosystem?: EcosystemContent;
  readonly analystBenefits?: readonly AnalystBenefitItem[];
}

/** Server-rendered architecture explanation with a progressively enhanced graph. */
export function ArchitectureSection({
  content,
  title = siteManifest.content.sectionTitles.architecture,
  introduction = siteManifest.content.sectionTitles.architectureIntroduction,
  visualImage,
  ecosystem = siteManifest.content.ecosystem,
  analystBenefits = siteManifest.content.analystBenefits,
}: ArchitectureSectionProps) {
  return (
    <section id="architecture" aria-labelledby="architecture-heading" className="gemstone-section">
      <div className="gemstone-container">
        <AnimatedSection>
          <h2 id="architecture-heading" className="gemstone-display text-gemstone-text">
            {title}
          </h2>
          <div className="mt-8 space-y-6">
            <p className="gemstone-body">{introduction}</p>
            <p className="gemstone-body">{content.distributedPrinciple}</p>
            {visualImage ? (
              <ResponsiveMedia
                src={visualImage}
                alt="GEMSTONE Hub, Node, and Client architecture"
                width={1600}
                height={900}
                wrapperClassName="gemstone-surface"
              />
            ) : (
              <ArchitectureDiagram content={content} />
            )}
            <EcosystemBenefitsSection ecosystem={ecosystem} benefits={analystBenefits} />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
