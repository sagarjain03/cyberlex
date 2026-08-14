/**
 * Shared numeric thresholds. Nothing in this file may be duplicated as a magic
 * number in a component. docs/rules.md §3.3.
 */

/**
 * A record older than this shows a "verify before relying" affordance.
 * PRD open question #3 — resolved at 120 days: cyber law moves faster than the
 * 180-day option tolerates, while 90 days would flag records that are still
 * genuinely current.
 */
export const STALENESS_THRESHOLD_DAYS = 120;

/** Comparator selection bounds. docs/prd.md M2-1. */
export const MIN_COMPARE_ITEMS = 2;
export const MAX_COMPARE_ITEMS = 3;

/** Default hypothetical annual revenue (USD) for fine normalization. M2-3. */
export const DEFAULT_HYPOTHETICAL_REVENUE_USD = 100_000_000;

/** Assistant query bounds, enforced client-side and again server-side. M5-1. */
export const QUERY_MIN_LENGTH = 8;
export const QUERY_MAX_LENGTH = 500;

/**
 * Strictness bands. Scores are 0–100. The `label` always renders beside the
 * meter — colour is reinforcement, never the sole carrier. docs/design.md §1.4.
 */
export const STRICTNESS_BANDS = [
  { min: 0, max: 39, label: "Permissive", token: "emerald" },
  { min: 40, max: 59, label: "Moderate", token: "cyan" },
  { min: 60, max: 79, label: "Strict", token: "amber" },
  { min: 80, max: 100, label: "Severe", token: "rose" },
] as const;

export type StrictnessBand = (typeof STRICTNESS_BANDS)[number];

export function getStrictnessBand(score: number): StrictnessBand {
  const clamped = Math.min(100, Math.max(0, score));
  // The band table is exhaustive over 0–100, so the fallback is unreachable in
  // practice; it exists to keep the return type non-nullable.
  return (
    STRICTNESS_BANDS.find((b) => clamped >= b.min && clamped <= b.max) ??
    STRICTNESS_BANDS[0]
  );
}

/** Meter segment counts by size. docs/design.md §4.1. */
export const METER_SEGMENTS = { sm: 12, md: 20, lg: 24 } as const;
