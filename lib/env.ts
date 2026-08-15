import "server-only";

import { z } from "zod";

/**
 * The only place `process.env` is read. docs/rules.md §3.4, §4.1.
 *
 * `server-only` makes an accidental client import a **build-time** failure
 * rather than a production key leak. Nothing in this module is ever returned
 * to a client, logged, or included in an error message.
 */

/** `.env.example` ships every key with an empty value; treat those as unset. */
const blankToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const schema = z.object({
  GROQ_API_KEY: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  GROQ_MODEL: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  AI_REQUEST_TIMEOUT_MS: z.preprocess(
    blankToUndefined,
    z.coerce.number().int().positive().max(60_000).optional(),
  ),
  RATE_LIMIT_MAX: z.preprocess(
    blankToUndefined,
    z.coerce.number().int().positive().max(1000).optional(),
  ),
  RATE_LIMIT_WINDOW_MS: z.preprocess(
    blankToUndefined,
    z.coerce.number().int().positive().optional(),
  ),
});

const parsed = schema.safeParse({
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL,
  AI_REQUEST_TIMEOUT_MS: process.env.AI_REQUEST_TIMEOUT_MS,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
});

if (!parsed.success) {
  // Names only — never values, which could echo key material into a log.
  const bad = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
  throw new Error(
    `Invalid environment configuration for: ${bad}. See .env.example.`,
  );
}

export const env = parsed.data;

/**
 * Whether the AI provider is usable at all.
 *
 * Callers branch on this to fail fast with `AI_UNAVAILABLE` before any network
 * call — and, critically, the resulting user-facing message never mentions
 * keys or configuration. docs/rules.md §4.1 rule 5.
 */
export function isAiConfigured(): boolean {
  return Boolean(env.GROQ_API_KEY);
}
