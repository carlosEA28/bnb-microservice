import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run both *.test.ts and *.spec.ts files
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "json", "html", "clover"],
      clean: true,
    },
  },
});
