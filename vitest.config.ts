import { defineConfig } from "vitest/config";

// Standalone config for unit tests. It deliberately does NOT load the app's Vite
// plugins (TanStack Start / Nitro) so pure modules like the reconciliation engine
// test in isolation, per PRD §10.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
});
