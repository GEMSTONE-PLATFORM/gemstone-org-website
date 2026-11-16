import type {
  AnalystBenefitItem,
  ArchitectureContent,
  EcosystemContent,
  NetworkTopologyContent,
} from "@/types";
import { EcosystemBenefitsSection } from "@/components/sections/EcosystemBenefitsSection";
import { siteManifest } from "@/content/site-manifest";
import {
  AnimatedSection,
  ArchitectureDiagram,
  ResponsiveMedia,
  TopologyExplorer,
} from "@/components/ui";

export interface ArchitectureSectionProps {
  readonly content: ArchitectureContent;
  readonly title?: string;
  readonly introduction?: string;
  readonly visualImage?: string;
  readonly topology?: NetworkTopologyContent;
  readonly browseNetworkTitle?: string;
  readonly ecosystem?: EcosystemContent;
  readonly analystBenefits?: readonly AnalystBenefitItem[];
}

/** Server-rendered architecture explanation with a progressively enhanced graph. */
export function ArchitectureSection({
  content,
  title = siteManifest.content.sectionTitles.architecture,
  introduction = siteManifest.content.sectionTitles.architectureIntroduction,
  visualImage,
  topology = siteManifest.content.networkTopology,
  browseNetworkTitle = siteManifest.content.sectionTitles.browseNetwork,
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
            <div
              className="mt-12 border-t border-gemstone-border/30 pt-12"
              aria-labelledby="browse-network-heading"
            >
              <p className="gemstone-eyebrow">Interactive topology</p>
              <h3
                id="browse-network-heading"
                className="mt-3 text-3xl text-gemstone-text sm:text-4xl"
              >
                {browseNetworkTitle}
              </h3>
              <p className="gemstone-body mt-5">
                Explore how peer Hubs, mission Nodes, and Clients form an interconnected ecosystem.
              </p>
              <div className="mt-8">
                <TopologyExplorer content={topology} />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
