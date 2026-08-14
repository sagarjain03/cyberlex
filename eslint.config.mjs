import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored shadcn/ui primitives — re-skinned, not authored by us.
    "components/ui/**",
  ]),

  // ── CyberLex project rules — docs/rules.md ────────────────────────────────
  {
    rules: {
      // §3.1 — no `any`, ever.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // §2.6 — the data boundary. Raw records are reachable only through the
  // repository layer, so swapping `data/` for a real backend in v2 touches
  // only `lib/data/`. docs/architecture.md §2.1.
  {
    ignores: ["lib/data/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/data", "@/data/*", "**/data/*"],
              message:
                "Import from '@/lib/data' instead. Components and routes must not read raw records directly — see docs/architecture.md §2.1.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
