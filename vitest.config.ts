import {defaultExclude ,defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: ["testing/**/*.spec.ts"],
        coverage: {
            ...defaultExclude,
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            include: ["src/**/*.ts"],
            exclude: [
            "**/*.spec.ts",
            "**/node_modules/**",
            "src/config/**",
            "**/service/interface"      ]
        }
    }
});