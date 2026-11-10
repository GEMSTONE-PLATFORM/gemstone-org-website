"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { navigationItems as defaultNavigationItems } from "@/config/navigation-config";
import { siteConfig } from "@/config/site-config";
import type { ContentLink, SiteSections } from "@/types";
import { cn } from "@/lib/utilities";

export interface NavigationProps {
  readonly items?: readonly ContentLink[];
  readonly sections?: SiteSections;
}

export function resolveNavigationTarget(link: ContentLink): string | null {
  if (link.kind !== "internal") return null;
  const target = link.target?.trim() || link.href.replace(/^#/, "").trim();
  return target || null;
}

export function getEnabledNavigationItems(
  items: readonly ContentLink[],
  sections: SiteSections,
): readonly ContentLink[] {
  return items.filter((link) => {
    const target = resolveNavigationTarget(link);
    return target !== null && Boolean(sections[target as keyof SiteSections]);
  });
}

function getInitialActiveTarget(items: readonly ContentLink[]): string | null {
  if (typeof window !== "undefined") {
    const hashTarget = window.location.hash.replace(/^#/, "");
    if (hashTarget && items.some((item) => resolveNavigationTarget(item) === hashTarget)) {
      return hashTarget;
    }
  }

  return resolveNavigationTarget(items[0]) ?? null;
}

function isActivationKey(event: React.KeyboardEvent<HTMLButtonElement>): boolean {
  return event.key === "Enter" || event.key === " ";
}

export function Navigation({
  items = defaultNavigationItems,
  sections = siteConfig.sections,
}: NavigationProps) {
  const enabledItems = useMemo(() => getEnabledNavigationItems(items, sections), [items, sections]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [observerAvailable, setObserverAvailable] = useState(true);
  const [activeTarget, setActiveTarget] = useState(() => getInitialActiveTarget(enabledItems));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  const closeMobileMenu = useCallback((returnFocus = true) => {
    setMobileOpen(false);
    if (returnFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((isOpen) => !isOpen);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const firstLink = mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileMenu, mobileOpen]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setObserverAvailable(false);
      return;
    }

    setObserverAvailable(true);
    const sectionsByTarget = enabledItems
      .map((item) => resolveNavigationTarget(item))
      .filter((target): target is string => target !== null)
      .map((target) => document.getElementById(target))
      .filter((section): section is HTMLElement => section !== null);

    if (sectionsByTarget.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry) setActiveTarget(visibleEntry.target.id);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0, 0.25, 0.5, 1] },
    );

    sectionsByTarget.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabledItems]);

  const renderLinks = (variant: "desktop" | "mobile") =>
    enabledItems.map((link) => {
      const target = resolveNavigationTarget(link);
      if (!target) return null;

      return (
        <li key={`${variant}-${target}`}>
          <a
            id={`${variant}-navigation-link-${target}`}
            href={link.href}
            aria-current={activeTarget === target ? "location" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-gemstone-sm px-3 py-2 text-sm font-semibold no-underline transition-colors",
              "text-gemstone-muted hover:bg-gemstone-surface-raised hover:text-gemstone-text",
              "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gemstone-focus",
              activeTarget === target && "bg-gemstone-surface-raised text-gemstone-accent",
              variant === "mobile" && "w-full justify-start px-4 text-base",
            )}
            onClick={() => {
              if (variant === "mobile") closeMobileMenu();
            }}
          >
            {link.label}
          </a>
        </li>
      );
    });

  return (
    <div className="relative">
      <nav
        aria-label="Primary navigation"
        data-observer-state={observerAvailable ? "available" : "unavailable"}
        className="hidden items-center lg:flex"
      >
        <ul className="flex items-center gap-1">{renderLinks("desktop")}</ul>
      </nav>

      <button
        ref={triggerRef}
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-gemstone-sm border border-gemstone-border/40 bg-gemstone-surface/70 px-3 text-sm font-semibold text-gemstone-text lg:hidden"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
        onClick={toggleMobileMenu}
        onKeyDown={(event) => {
          if (isActivationKey(event)) {
            event.preventDefault();
            toggleMobileMenu();
          }
        }}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {mobileOpen ? "×" : "☰"}
        </span>
        <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
      </button>

      <nav
        ref={mobileMenuRef}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!mobileOpen}
        className="absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-gemstone border border-gemstone-border/40 bg-gemstone-surface/95 p-3 shadow-gemstone backdrop-blur-md lg:hidden"
      >
        <ul className="grid gap-1">{renderLinks("mobile")}</ul>
      </nav>
    </div>
  );
}
