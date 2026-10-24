import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "vite-plus/test/browser-playwright";
import { defineConfig } from "vite-plus";
import type { UserConfig } from "vite-plus";

// The canvas, custom elements and layout need a real browser, so every test
// project runs in a headless Chromium. Vitest names the instances in place,
// so each project gets its own copy.
function browser() {
    return {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: "chromium" as const }],
    };
}

function entryFileName(chunk: { name?: string }, format: string): string {
    if (chunk.name?.endsWith(".d")) return "index.d.ts";
    return format === "umd" ? "bb.js" : "bb.es.js";
}

const config: UserConfig = {
    fmt: {
        tabWidth: 4,
        printWidth: 80,
        trailingComma: "all",
        ignorePatterns: ["build/**", "coverage/**", "storybook-static/**"],
    },
    lint: {
        ignorePatterns: ["build/**", "coverage/**", "storybook-static/**"],
        jsPlugins: [
            { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
        ],
        rules: { "vite-plus/prefer-vite-plus-imports": "error" },
        options: { typeAware: true, typeCheck: true },
    },

    // Library build configuration (tsdown via `vp pack`)
    pack: {
        entry: ["index.ts"],
        format: ["esm", "umd"],
        globalName: "bb",
        outDir: "build",
        sourcemap: true,
        minify: true,
        platform: "browser",
        dts: { generator: "oxc" },
        // Lit is bundled into both builds, so a <script> tag or a plain CDN
        // import works without an import map. The types still import it.
        deps: {
            alwaysBundle: [/^lit(-html|-element)?(\/|$)/, /^@lit\//],
            onlyBundle: false,
            dts: { alwaysBundle: [] },
        },
        outputOptions: (options, format) => {
            options.entryFileNames = (chunk) =>
                entryFileName(chunk, String(format));
            return options;
        },
    },

    // Pre-bundle Lit up front, so the first test run does not reload.
    optimizeDeps: { include: ["lit", "lit/decorators.js"] },

    // Test configuration
    test: {
        coverage: {
            provider: "v8",
            // json-summary feeds the coverage badge, json feeds fallow.
            reporter: ["text", "html", "json-summary", "json"],
            include: ["src/**/*.ts", "index.ts"],
            exclude: ["src/stories/**", "**/*.d.ts"],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
        projects: [
            {
                extends: true,
                test: {
                    name: "unit",
                    include: ["tests/**/*.test.ts"],
                    browser: browser(),
                },
            },
            {
                extends: true,
                // Runs every story as a smoke test.
                plugins: [
                    storybookTest({
                        configDir: `${import.meta.dirname}/.storybook`,
                    }),
                ],
                test: {
                    name: "storybook",
                    browser: browser(),
                    setupFiles: [".storybook/vitest.setup.ts"],
                },
            },
        ],
    },
};

export default defineConfig(config) as UserConfig;
