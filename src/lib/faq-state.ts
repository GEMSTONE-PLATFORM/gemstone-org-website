import type { FAQItem } from "@/types";

export interface FAQItemState extends FAQItem {
  /** Stable ID used by the question control. */
  readonly controlId: string;
  /** Stable ID used by the controlled answer panel. */
  readonly panelId: string;
  /** Whether the question is currently expanded. */
  readonly expanded: boolean;
  /** Whether the answer panel is visible. Kept in sync with `expanded`. */
  readonly visible: boolean;
}

export interface FAQState {
  readonly items: readonly FAQItemState[];
  readonly expandedIds: readonly string[];
  /** Reduced motion changes presentation only, never expansion behavior. */
  readonly reducedMotion: boolean;
}

export interface FAQStateOptions {
  readonly expandedIds?: readonly string[];
  readonly reducedMotion?: boolean;
}

function controlIdFor(itemId: string): string {
  return `faq-control-${itemId}`;
}

function panelIdFor(itemId: string): string {
  return `faq-panel-${itemId}`;
}

function createItemState(item: FAQItem, expanded: boolean): FAQItemState {
  return {
    ...item,
    controlId: controlIdFor(item.id),
    panelId: panelIdFor(item.id),
    expanded,
    visible: expanded,
  };
}

function expandedIdsFor(items: readonly FAQItemState[]): readonly string[] {
  return items.filter((item) => item.expanded).map((item) => item.id);
}

/**
 * Creates immutable FAQ interaction state from the independent content array.
 * Unknown initial expanded IDs are ignored so state only refers to rendered items.
 */
export function createFAQState(items: readonly FAQItem[], options: FAQStateOptions = {}): FAQState {
  const requestedExpandedIds = new Set(options.expandedIds ?? []);
  const stateItems = items.map((item) => createItemState(item, requestedExpandedIds.has(item.id)));

  return {
    items: stateItems,
    expandedIds: expandedIdsFor(stateItems),
    reducedMotion: options.reducedMotion ?? false,
  };
}

/**
 * Toggles one rendered FAQ item without mutating content or state.
 * Unknown IDs are a no-op and return the original state reference.
 */
export function toggleAccordionItem(state: FAQState, id: string): FAQState {
  const itemIndex = state.items.findIndex((item) => item.id === id);
  if (itemIndex === -1) return state;

  const currentItem = state.items[itemIndex];
  const expanded = !currentItem.expanded;
  const nextItems = state.items.map((item, index) =>
    index === itemIndex ? { ...item, expanded, visible: expanded } : item,
  );

  return {
    ...state,
    items: nextItems,
    expandedIds: expandedIdsFor(nextItems),
  };
}

/**
 * Updates reduced-motion presentation state without changing FAQ expansion or answers.
 */
export function setFAQReducedMotion(state: FAQState, reducedMotion: boolean): FAQState {
  if (state.reducedMotion === reducedMotion) return state;

  return {
    ...state,
    reducedMotion,
  };
}
