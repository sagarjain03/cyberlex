import type { JurisdictionCode } from "./jurisdiction";
import type { Sourced, SourceRef } from "./source";

export type CrimeSeverity = "critical" | "high" | "medium" | "low";

export const SEVERITY_LABEL: Record<CrimeSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const SEVERITY_TOKEN: Record<CrimeSeverity, string> = {
  critical: "critical",
  high: "draft",
  medium: "pending",
  low: "live",
};

export type Prevalence = "widespread" | "emerging" | "rare" | "theoretical";

export const PREVALENCE_LABEL: Record<Prevalence, string> = {
  widespread: "Widespread",
  emerging: "Emerging",
  rare: "Rare",
  theoretical: "Theoretical",
};

/**
 * How well an existing statute actually reaches a technique.
 *
 * `analogical` is the interesting state: a general provision drafted before the
 * technique existed, being stretched to cover it. `no-coverage` and
 * `not-researched` are different claims and must never be conflated —
 * docs/phases.md Phase 6 treats that as a correctness bug.
 */
export type CoverageLevel =
  | "direct"
  | "analogical"
  | "no-coverage"
  | "not-researched";

export const COVERAGE_LABEL: Record<CoverageLevel, string> = {
  direct: "Direct",
  analogical: "Analogical",
  "no-coverage": "No clear coverage",
  "not-researched": "Not researched",
};

export const COVERAGE_TOKEN: Record<CoverageLevel, string> = {
  direct: "live",
  analogical: "pending",
  "no-coverage": "critical",
  "not-researched": "null",
};

export interface StatuteMapping {
  jurisdictionCode: JurisdictionCode;
  coverage: CoverageLevel;
  /** Instrument relied on. Absent when coverage is no-coverage/not-researched. */
  statute?: string;
  section?: string;
  penaltyNote?: string;
  /** Why this provision does — or does not — reach the technique. */
  rationale: string;
  sources: SourceRef[];
}

export interface TechnicalProfile {
  /** High-level mechanism. Defensive framing only — never operational detail. */
  howItWorks: string;
  /** What defenders typically observe. */
  indicators: string[];
}

export interface AiCrime extends Sourced {
  id: string;
  slug: string;
  name: string;
  /** Short label for the coverage matrix row. */
  shortName: string;
  severity: CrimeSeverity;
  prevalence: Prevalence;
  summary: string;
  technicalProfile: TechnicalProfile;
  mappings: StatuteMapping[];
}

/** Technique × jurisdiction grid. docs/prd.md M4-5. */
export interface CoverageMatrix {
  jurisdictions: { code: JurisdictionCode; shortName: string }[];
  rows: {
    slug: string;
    shortName: string;
    severity: CrimeSeverity;
    cells: { code: JurisdictionCode; coverage: CoverageLevel }[];
  }[];
}
