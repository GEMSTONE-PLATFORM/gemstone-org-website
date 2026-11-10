import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { createFAQState, setFAQReducedMotion, toggleAccordionItem } from "@/lib/faq-state";
import type { FAQItem } from "@/types";

const items: readonly FAQItem[] = [
  {
    id: "what-is-gemstone",
    question: "What is GEMSTONE?",
    answer: "GEMSTONE is a government-owned open-source technology platform.",
  },
  {
    id: "who-can-use-gemstone",
    question: "Who can use GEMSTONE?",
    answer: "Organizations can connect existing environments through GEMSTONE.",
  },
];

describe("FAQ state transitions", () => {
  it("opens a known item and synchronizes expansion, relationships, and visibility", () => {
    const initialState = createFAQState(items);
    const nextState = toggleAccordionItem(initialState, "what-is-gemstone");
    const item = nextState.items[0];

    expect(item).toMatchObject({
      id: "what-is-gemstone",
      answer: items[0].answer,
      controlId: "faq-control-what-is-gemstone",
      panelId: "faq-panel-what-is-gemstone",
      expanded: true,
      visible: true,
    });
    expect(nextState.expandedIds).toEqual(["what-is-gemstone"]);
    expect(nextState.items[1].expanded).toBe(false);
  });

  it("keeps multiple known items open and closes only the toggled item", () => {
    const firstOpen = toggleAccordionItem(createFAQState(items), "what-is-gemstone");
    const bothOpen = toggleAccordionItem(firstOpen, "who-can-use-gemstone");
    const secondClosed = toggleAccordionItem(bothOpen, "what-is-gemstone");

    expect(bothOpen.expandedIds).toEqual(["what-is-gemstone", "who-can-use-gemstone"]);
    expect(secondClosed.expandedIds).toEqual(["who-can-use-gemstone"]);
    expect(secondClosed.items[0].visible).toBe(false);
    expect(secondClosed.items[1].visible).toBe(true);
  });

  it("toggles the same known item repeatedly without changing its answer", () => {
    const initialState = createFAQState(items);
    const opened = toggleAccordionItem(initialState, "what-is-gemstone");
    const closed = toggleAccordionItem(opened, "what-is-gemstone");
    const reopened = toggleAccordionItem(closed, "what-is-gemstone");

    expect(closed.items[0]).toMatchObject({
      answer: items[0].answer,
      expanded: false,
      visible: false,
    });
    expect(reopened.items[0]).toMatchObject({
      answer: items[0].answer,
      expanded: true,
      visible: true,
    });
  });

  it("does not mutate or replace state for an unknown ID", () => {
    const initialState = createFAQState(items, {
      expandedIds: ["what-is-gemstone"],
    });
    const snapshot = structuredClone(initialState);
    const nextState = toggleAccordionItem(initialState, "missing-item");

    expect(nextState).toBe(initialState);
    expect(nextState).toEqual(snapshot);
  });

  it("preserves expansion behavior and answers when reduced motion is active", () => {
    const initialState = createFAQState(items, { reducedMotion: true });
    const opened = toggleAccordionItem(initialState, "who-can-use-gemstone");
    const unchangedMotion = setFAQReducedMotion(opened, true);
    const standardMotion = setFAQReducedMotion(unchangedMotion, false);

    expect(opened.reducedMotion).toBe(true);
    expect(unchangedMotion).toBe(opened);
    expect(standardMotion.reducedMotion).toBe(false);
    expect(standardMotion.items[1]).toMatchObject({
      answer: items[1].answer,
      expanded: true,
      visible: true,
    });
  });
});

const faqIdArbitrary = fc
  .string({ minLength: 1, maxLength: 24 })
  .filter((value) => value.trim().length > 0 && !value.includes("#"));
const faqTextArbitrary = fc.string({ minLength: 1, maxLength: 80 });
const faqItemArbitrary: fc.Arbitrary<FAQItem> = fc.record({
  id: faqIdArbitrary,
  question: faqTextArbitrary,
  answer: faqTextArbitrary,
});

function assertFAQStateSynchronized(state: ReturnType<typeof createFAQState>): void {
  expect(state.expandedIds).toEqual(
    state.items.filter((item) => item.expanded).map((item) => item.id),
  );

  state.items.forEach((item) => {
    expect(item.controlId).toBe(`faq-control-${item.id}`);
    expect(item.panelId).toBe(`faq-panel-${item.id}`);
    expect(item.visible).toBe(item.expanded);
  });
}

describe("FAQ state synchronization property", () => {
  /** Validates: Requirements 9.2, 9.3, 9.5 */
  it("Property 8: only known toggles change state and all FAQ relationships stay synchronized", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(faqItemArbitrary, {
          maxLength: 12,
          selector: (item) => item.id,
        }),
        fc.array(faqIdArbitrary, { maxLength: 40 }),
        (faqItems, toggleIds) => {
          const ids = faqItems.map((item) => item.id);
          let state = createFAQState(faqItems);

          assertFAQStateSynchronized(state);

          toggleIds.forEach((toggleId) => {
            const previousState = state;
            const previousItems = previousState.items.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
              controlId: item.controlId,
              panelId: item.panelId,
              expanded: item.expanded,
              visible: item.visible,
            }));
            const known = ids.includes(toggleId);

            state = toggleAccordionItem(previousState, toggleId);
            assertFAQStateSynchronized(state);

            if (!known) {
              expect(state).toBe(previousState);
              expect(state.items).toEqual(previousItems);
              return;
            }

            state.items.forEach((item, index) => {
              const previousItem = previousItems[index];
              expect(item).toMatchObject({
                id: previousItem.id,
                question: previousItem.question,
                answer: previousItem.answer,
                controlId: previousItem.controlId,
                panelId: previousItem.panelId,
              });

              if (item.id === toggleId) {
                expect(item.expanded).toBe(!previousItem.expanded);
                expect(item.visible).toBe(!previousItem.visible);
              } else {
                expect(item.expanded).toBe(previousItem.expanded);
                expect(item.visible).toBe(previousItem.visible);
              }
            });
          });
        },
      ),
      { numRuns: 100 },
    );
  });
});
