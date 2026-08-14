import type { StrictnessDimensions } from "@/types";

import { DIMENSIONS, type DimensionSpec } from "./weights";

export interface DimensionBreakdown {
  spec: DimensionSpec;
  /** The jurisdiction's raw 0–100 score on this dimension. */
  raw: number;
  /** Its weighted contribution to the total. */
  contribution: number;
}

/**
 * Weighted mean of the six dimensions, rounded to an integer 0–100.
 *
 * Deliberately a plain weighted mean rather than anything cleverer: the model
 * is published and must be reproducible by hand from the table at /methodology.
 */
export function computeStrictness(d: StrictnessDimensions): number {
  const total = DIMENSIONS.reduce(
    (sum, spec) => sum + clamp(d[spec.key]) * spec.weight,
    0,
  );
  return Math.round(total);
}

/**
 * Per-dimension contributions. The detail page shows this rather than only the
 * headline number, so a contested score can be argued with at the level it was
 * actually built. docs/prd.md M1-6.
 */
export function breakdown(d: StrictnessDimensions): DimensionBreakdown[] {
  return DIMENSIONS.map((spec) => {
    const raw = clamp(d[spec.key]);
    return { spec, raw, contribution: raw * spec.weight };
  });
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}
