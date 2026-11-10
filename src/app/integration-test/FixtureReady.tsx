"use client";

import { useEffect, useState } from "react";

/** Signals that the integration fixture's client components have hydrated. */
export function FixtureReady() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return <span data-testid="integration-fixture-ready" data-hydrated={hydrated} hidden />;
}
