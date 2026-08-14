import type { StrictnessDimensionKey } from "@/types";

export interface DimensionSpec {
  key: StrictnessDimensionKey;
  label: string;
  /** Fraction of the total score. Must sum to 1. */
  weight: number;
  /** What the dimension measures — rendered verbatim at /methodology. */
  definition: string;
  /** What evidence the analyst score is based on. */
  basis: string;
}

/**
 * The published strictness model. Mirrored verbatim on /methodology.
 *
 * This is a **comparative indicator, not a measurement** (docs/prd.md R-3).
 * Dr. Anya's persona exists specifically to attack this table, so it ships with
 * its weights, definitions and evidentiary basis in the open. Change a weight
 * here and /methodology updates with it — there is no second copy.
 */
export const DIMENSIONS: readonly DimensionSpec[] = [
  {
    key: "criminalExposure",
    label: "Criminal exposure",
    weight: 0.2,
    definition:
      "Maximum custodial sentences available for unauthorised access, data theft and extortion offences, and whether individual officers can be held personally liable.",
    basis:
      "Statutory maxima as drafted, normalised to years. Sentencing practice is deliberately excluded — it varies more than the statute and is far harder to source.",
  },
  {
    key: "corporateFinancial",
    label: "Corporate financial exposure",
    weight: 0.2,
    definition:
      "Ceiling on corporate monetary penalties, normalised across flat caps and turnover-based structures.",
    basis:
      "Statutory maxima normalised against a hypothetical revenue. Turnover-based regimes score higher because exposure scales with the entity.",
  },
  {
    key: "reportingBurden",
    label: "Reporting burden",
    weight: 0.18,
    definition:
      "Tightness of incident and breach notification deadlines, and the number of distinct bodies that must be notified.",
    basis:
      "Shortest binding initial-notification window applicable to a general commercial entity, weighted by whether data subjects must also be told.",
  },
  {
    key: "enforcementIntensity",
    label: "Enforcement intensity",
    weight: 0.17,
    definition:
      "How actively the regime is enforced in practice, as distinct from what the statute permits.",
    basis:
      "Analyst judgement from published enforcement activity and regulator posture. The most subjective dimension, and weighted accordingly.",
  },
  {
    key: "aiGovernance",
    label: "AI governance",
    weight: 0.15,
    definition:
      "Whether binding AI-specific obligations exist, their breadth, and whether conformity assessment or synthetic-media disclosure is mandatory.",
    basis:
      "Presence and scope of in-force binding instruments. Guidance and voluntary frameworks score materially lower than statute.",
  },
  {
    key: "extraterritorialReach",
    label: "Extraterritorial reach",
    weight: 0.1,
    definition:
      "How far obligations bind entities with no establishment in the jurisdiction.",
    basis:
      "Scope provisions as drafted — targeting/effects tests, representative requirements, and data-localisation duties.",
  },
] as const;

/** Fails fast at import time if the weights stop summing to 1. */
const total = DIMENSIONS.reduce((sum, d) => sum + d.weight, 0);
if (Math.abs(total - 1) > 1e-9) {
  throw new Error(
    `Strictness weights must sum to 1, got ${total}. Fix lib/scoring/weights.ts.`,
  );
}

export const METHODOLOGY_LIMITATIONS = [
  "Scores compare regimes as drafted, not as enforced in any particular sector.",
  "Sub-national law (US states, EU Member State transposition, Indian states) is out of scope for v1 and is not reflected in any score.",
  "Turnover-based and flat-cap penalties are not truly commensurable; the normalisation assumption is disclosed wherever a normalised figure appears.",
  "Enforcement intensity is an analyst judgement and the least reproducible dimension in the model.",
  "A higher score means a stricter regime. It does not mean a better, safer, or more effective one.",
] as const;
