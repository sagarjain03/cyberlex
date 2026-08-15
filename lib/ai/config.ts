import "server-only";

import { env } from "@/lib/env";

/**
 * Every upstream parameter lives here — no magic numbers at the call site.
 * docs/rules.md §4.2.
 */

/**
 * Default model.
 *
 * ⚠️ Groq's catalogue moves. `llama-3.3-70b-versatile` — the default this
 * project originally documented — was deprecated for free and developer tiers
 * on 17 June 2026, along with `llama-3.1-8b-instant`, `qwen/qwen3-32b` and
 * `meta-llama/llama-4-scout-17b-16e-instruct`. Groq's recommended replacement
 * is `openai/gpt-oss-120b`.
 *
 * Overridable via `GROQ_MODEL` so a future deprecation is a config change, not
 * a deploy. Documented fallback if this one is retired: `qwen/qwen3.6-27b`.
 */
export const MODEL = env.GROQ_MODEL ?? "openai/gpt-oss-120b";

/**
 * `json_object`, deliberately not `json_schema`.
 *
 * Structured-output (`json_schema`) enforcement is reported to be silently
 * ignored on gpt-oss models, returning free-form prose instead of conforming
 * JSON. Relying on it would mean trusting a guarantee the provider does not
 * reliably keep. We ask for JSON, then validate it ourselves and repair once —
 * so a provider regression degrades to a designed error state rather than
 * rendering garbage as legal information.
 */
export const RESPONSE_FORMAT = { type: "json_object" } as const;

/** Legal summarisation wants determinism, not creativity. */
export const TEMPERATURE = 0.2;

/** Our schema does not need more; caps cost and latency. */
export const MAX_TOKENS = 1500;

/** Hard ceiling on total server time, retries included. */
export const TIMEOUT_MS = env.AI_REQUEST_TIMEOUT_MS ?? 20_000;

/** Rough-abuse brake. Per instance — see lib/rate-limit.ts. */
export const RATE_LIMIT_MAX = env.RATE_LIMIT_MAX ?? 10;
export const RATE_LIMIT_WINDOW_MS = env.RATE_LIMIT_WINDOW_MS ?? 60_000;

/** Request body cap, checked before parsing. */
export const MAX_BODY_BYTES = 8 * 1024;

/**
 * Retry budget. Exactly one retry, and only for the classes listed in
 * docs/rules.md §4.4 — never for timeouts, non-429 4xx, or a second malformed
 * response.
 */
export const MAX_UPSTREAM_RETRIES = 1;
export const RETRY_BASE_DELAY_MS = 400;
/** Cap on any honoured `Retry-After`, so a long header cannot stall the request. */
export const RETRY_AFTER_CAP_MS = 5_000;
