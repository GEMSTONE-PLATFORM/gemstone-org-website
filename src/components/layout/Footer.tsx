import type { ContentLink, ExternalLink, FooterContent, InternalLink } from "@/types";
import type { FooterConfig, SiteSections } from "@/types";

import { footerNavigationItems, publicReleaseConfig, siteConfig } from "@/config";
import { siteContent } from "@/content";
import { BrandLogo, ExternalLink as ExternalLinkPrimitive } from "@/components/ui";
import { cn } from "@/lib/utilities";

const approvedNavigationLabels = new Set([
  "About",
  "Architecture",
  "Capabilities",
  "FAQ",
  "Briefing",
  "Contact",
]);

const approvedSocialLabels = new Set([
  "Facebook",
  "GitHub",
  "LinkedIn",
  "Mastodon",
  "Twitter",
  "X",
  "YouTube",
]);

export interface FooterReleaseConfig {
  readonly enabled: boolean;
  readonly statement: string;
}

export interface FooterProps {
  readonly content?: FooterContent;
  readonly config?: FooterConfig;
  readonly navigation?: readonly ContentLink[];
  readonly enabledSections?: SiteSections;
  readonly organizationLogo?: string;
  readonly publicRelease?: FooterReleaseConfig;
}

function nonEmpty(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function resolveInternalTarget(link: InternalLink): string {
  const target = link.target?.trim() || link.href.trim().replace(/^#/, "");

  return target === "request-information" ? "requestInformation" : target;
}

/** Keep only approved, non-empty footer targets that point to enabled sections. */
export function filterFooterNavigation(
  links: readonly ContentLink[],
  enabledSections: SiteSections,
): ContentLink[] {
  const filteredLinks: ContentLink[] = [];

  for (const link of links) {
    if (!nonEmpty(link.label) || !approvedNavigationLabels.has(link.label.trim())) continue;

    if (link.kind === "external") {
      if (nonEmpty(link.href)) {
        filteredLinks.push({ ...link, label: link.label.trim(), href: link.href.trim() });
      }
      continue;
    }

    const target = resolveInternalTarget(link);
    if (target && enabledSections[target as keyof SiteSections]) {
      filteredLinks.push({ ...link, label: link.label.trim() });
    }
  }

  return filteredLinks;
}

/** Keep only optional social links with an approved label and usable destination. */
export function filterSocialLinks(links: readonly ExternalLink[] | undefined): ExternalLink[] {
  return (links ?? []).flatMap((link) => {
    const label = link.label.trim();
    const href = link.href.trim();

    if (!nonEmpty(label) || !approvedSocialLabels.has(label) || !nonEmpty(href)) return [];

    return [{ ...link, label, href }];
  });
}

function OptionalExternalLink({
  link,
  label,
}: {
  readonly link: ExternalLink;
  readonly label?: string;
}) {
  return (
    <ExternalLinkPrimitive href={link.href} newTab={link.newTab ?? true}>
      {label ?? link.label}
    </ExternalLinkPrimitive>
  );
}

/** Server-rendered footer with configuration-driven optional destinations and release wording. */
export function Footer({
  content = siteContent.footer,
  config = siteConfig.footer,
  navigation = footerNavigationItems,
  enabledSections = siteConfig.sections,
  organizationLogo = config?.organizationLogo,
  publicRelease = publicReleaseConfig,
}: FooterProps) {
  const footerNavigation = filterFooterNavigation(navigation, enabledSections);
  const socialLinks = filterSocialLinks(config?.socialLinks);
  const privacy = config?.privacy;
  const accessibility = config?.accessibility;
  const releaseStatement = publicRelease.statement.trim();
  const copyright = config?.copyright?.trim();
  const logo = organizationLogo?.trim();
  const hasPrivacy = privacy !== undefined && nonEmpty(privacy.href);
  const hasAccessibility =
    accessibility !== undefined && nonEmpty(accessibility.href) && nonEmpty(accessibility.label);

  return (
    <footer
      id="site-footer"
      aria-labelledby="site-footer-heading"
      className="border-t border-gemstone-border/30 bg-gemstone-surface/80"
    >
      <div className="gemstone-container py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="space-y-4">
            {logo ? (
              <BrandLogo
                src={logo}
                alt={content.fullName}
                width={240}
                height={64}
                className="h-auto max-h-16 w-auto object-contain"
              />
            ) : null}
            <p id="site-footer-heading" className="text-2xl text-gemstone-text">
              {content.siteName}
            </p>
            <p className="max-w-2xl text-sm text-gemstone-text-muted">{content.fullName}</p>
            {publicRelease.enabled && nonEmpty(releaseStatement) ? (
              <p className="text-sm font-semibold text-gemstone-accent">{releaseStatement}</p>
            ) : null}
          </div>

          {footerNavigation.length > 0 ? (
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
                {footerNavigation.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    {link.kind === "external" ? (
                      <OptionalExternalLink link={link} />
                    ) : (
                      <a
                        className={cn(
                          "inline-flex min-h-11 items-center rounded-gemstone-sm px-1 text-gemstone-accent underline decoration-gemstone-cyan/70 underline-offset-4 transition-colors hover:text-gemstone-text",
                          "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus",
                        )}
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>

        {hasPrivacy ||
        hasAccessibility ||
        socialLinks.length > 0 ||
        copyright ||
        config?.showBackToTop ? (
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gemstone-border/20 pt-6 text-sm">
            {hasPrivacy ? <OptionalExternalLink link={privacy} label="Privacy" /> : null}
            {hasAccessibility ? (
              <a
                className="inline-flex min-h-11 items-center rounded-gemstone-sm px-1 text-gemstone-accent underline decoration-gemstone-cyan/70 underline-offset-4 transition-colors hover:text-gemstone-text focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus"
                href={accessibility.href}
              >
                Accessibility
              </a>
            ) : null}
            {socialLinks.map((link) => (
              <OptionalExternalLink key={`${link.label}-${link.href}`} link={link} />
            ))}
            {copyright ? <span className="text-gemstone-text-subtle">{copyright}</span> : null}
            {config?.showBackToTop ? (
              <a
                className="ml-auto inline-flex min-h-11 items-center rounded-gemstone-sm px-1 text-gemstone-accent underline decoration-gemstone-cyan/70 underline-offset-4 transition-colors hover:text-gemstone-text focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus"
                href="#main-content"
              >
                Back to top
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
