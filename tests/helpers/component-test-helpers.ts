export interface ViewportSize {
  readonly width: number;
  readonly height: number;
}

export const viewportPresets = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1440, height: 900 },
} as const satisfies Record<string, ViewportSize>;

/** Set the browser dimensions used by responsive components and return a restore function. */
export function setViewport(viewport: ViewportSize): () => void {
  const previousWidth = window.innerWidth;
  const previousHeight = window.innerHeight;

  setWindowDimension("innerWidth", viewport.width);
  setWindowDimension("innerHeight", viewport.height);
  window.dispatchEvent(new Event("resize"));

  return () => {
    setWindowDimension("innerWidth", previousWidth);
    setWindowDimension("innerHeight", previousHeight);
    window.dispatchEvent(new Event("resize"));
  };
}

function setWindowDimension(name: "innerWidth" | "innerHeight", value: number): void {
  Object.defineProperty(window, name, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

/** Mock prefers-reduced-motion without coupling tests to a browser or test framework API. */
export function mockReducedMotion(reduced: boolean): () => void {
  const previousMatchMedia = window.matchMedia;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => createMediaQueryList(query, reduced),
  });

  return () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: previousMatchMedia,
    });
  };
}

function createMediaQueryList(query: string, reduced: boolean): MediaQueryList {
  const matches = reduced && query === "(prefers-reduced-motion: reduce)";
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  return {
    matches,
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === "function") {
        listeners.add(listener as (event: MediaQueryListEvent) => void);
      }
    },
    removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === "function") {
        listeners.delete(listener as (event: MediaQueryListEvent) => void);
      }
    },
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    dispatchEvent: (event: Event) => {
      listeners.forEach((listener) => listener(event as MediaQueryListEvent));
      return true;
    },
  };
}

export type KeyboardActivationKey = "Enter" | " ";

/** Dispatch the keyboard sequence used by custom controls while preserving native semantics. */
export function activateByKeyboard(
  element: HTMLElement,
  key: KeyboardActivationKey = "Enter",
): readonly [KeyboardEvent, KeyboardEvent] {
  if (!element) {
    throw new Error("activateByKeyboard requires a focusable element.");
  }

  const code = key === " " ? "Space" : "Enter";
  const keyDown = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    code,
    key,
  });
  const keyUp = new KeyboardEvent("keyup", {
    bubbles: true,
    cancelable: true,
    code,
    key,
  });

  element.dispatchEvent(keyDown);
  element.dispatchEvent(keyUp);
  return [keyDown, keyUp];
}

export interface StaticFallbackAssertions {
  readonly requiredText?: readonly string[];
  readonly requiredSelectors?: readonly string[];
  readonly forbiddenSelectors?: readonly string[];
}

/** Assert static HTML retains required fallback content without requiring React or a browser runner. */
export function assertStaticFallback(
  root: ParentNode | string,
  assertions: StaticFallbackAssertions,
): void {
  const markup = typeof root === "string" ? root : (root.textContent ?? "");

  for (const text of assertions.requiredText ?? []) {
    if (!markup.includes(text)) {
      throw new Error(`Static fallback is missing required text: ${text}`);
    }
  }

  if (typeof root === "string") {
    if ((assertions.requiredSelectors?.length ?? 0) > 0) {
      throw new Error("Selector assertions require a DOM root, not an HTML string.");
    }
    if ((assertions.forbiddenSelectors?.length ?? 0) > 0) {
      throw new Error("Selector assertions require a DOM root, not an HTML string.");
    }
    return;
  }

  for (const selector of assertions.requiredSelectors ?? []) {
    if (!root.querySelector(selector)) {
      throw new Error(`Static fallback is missing required selector: ${selector}`);
    }
  }

  for (const selector of assertions.forbiddenSelectors ?? []) {
    if (root.querySelector(selector)) {
      throw new Error(`Static fallback contains forbidden selector: ${selector}`);
    }
  }
}
