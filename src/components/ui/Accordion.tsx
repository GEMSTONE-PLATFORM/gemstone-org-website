"use client";

import { motion as Motion } from "framer-motion";
import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";

import { useMotionResolution } from "@/components/ui/MotionProvider";
import { createFAQState, setFAQReducedMotion, toggleAccordionItem } from "@/lib/faq-state";
import type { FAQItem } from "@/types";

export interface AccordionProps {
  readonly items: readonly FAQItem[];
  readonly ariaLabel?: string;
  readonly expandedIds?: readonly string[];
  /** Pass the resolved site motion mode when it is already available. */
  readonly reducedMotion?: boolean;
  readonly className?: string;
}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Progressive FAQ accordion enhancement. Native buttons provide pointer and keyboard
 * activation, while answer panels remain in the DOM as controlled regions.
 */
export function Accordion({
  items,
  ariaLabel = "Frequently asked questions",
  expandedIds,
  reducedMotion = false,
  className,
}: AccordionProps): ReactNode {
  const resolution = useMotionResolution();
  const [state, setState] = useState(() => createFAQState(items, { expandedIds, reducedMotion }));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);

    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  const motionReduced = reducedMotion || prefersReducedMotion || resolution.mode === "reduced";
  const disclosureTransition = {
    duration: motionReduced ? 0 : resolution.sectionRevealDurationMs / 1000,
  };

  useEffect(() => {
    setState((currentState) => setFAQReducedMotion(currentState, motionReduced));
  }, [motionReduced]);

  function toggleItem(id: string) {
    setState((currentState) => toggleAccordionItem(currentState, id));
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    toggleItem(id);
  }

  return (
    <div
      className={cx("gemstone-reading-width space-y-4", className)}
      role="group"
      aria-label={ariaLabel}
      data-testid="faq-accordion"
      data-motion={motionReduced ? "reduced" : resolution.mode}
      data-reduced-motion={state.reducedMotion ? "true" : "false"}
    >
      {state.items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-gemstone-lg border border-gemstone-border/35 bg-gemstone-surface-raised/80"
          data-accordion-item={item.id}
          data-expanded={item.expanded ? "true" : "false"}
        >
          <h3 className="m-0">
            <button
              id={item.controlId}
              type="button"
              className={cx(
                "gemstone-button-motion flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-gemstone-text",
                "transition-colors hover:bg-gemstone-surface-elevated",
                "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-gemstone-focus",
                "motion-reduce:transition-none sm:px-6",
              )}
              aria-controls={item.panelId}
              aria-expanded={item.expanded}
              onClick={() => toggleItem(item.id)}
              onKeyDown={(event) => handleQuestionKeyDown(event, item.id)}
            >
              <span>{item.question}</span>
              <Motion.span
                aria-hidden="true"
                className="shrink-0 text-2xl text-gemstone-accent"
                animate={{ rotate: item.expanded ? 180 : 0 }}
                transition={disclosureTransition}
              >
                {item.expanded ? "−" : "+"}
              </Motion.span>
            </button>
          </h3>

          <div
            id={item.panelId}
            role="region"
            aria-labelledby={item.controlId}
            aria-hidden={!item.visible}
            hidden={!item.visible}
            className={cx(
              "border-t border-gemstone-border/25 px-5 pb-5 pt-4 text-gemstone-muted sm:px-6",
              "transition-[opacity,content-visibility] duration-200 motion-reduce:transition-none",
            )}
            data-accordion-panel={item.id}
            data-visible={item.visible ? "true" : "false"}
          >
            <p className="gemstone-body whitespace-pre-line text-base">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
