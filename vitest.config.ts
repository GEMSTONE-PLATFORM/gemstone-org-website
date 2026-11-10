import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**", "out/**"],
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    sequence: {
      concurrent: false,
      shuffle: false,
    },
    testTimeout: 60_000,
    hookTimeout: 15_000,
  },
});
