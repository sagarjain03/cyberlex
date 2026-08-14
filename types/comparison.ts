import type { Known } from "./known";
import type { JurisdictionCode } from "./jurisdiction";
import type { Sourced } from "./source";

/**
 * Corporate fine ceilings are genuinely not comparable across jurisdictions —
 * a flat cap and a percentage of global turnover measure different things. The
 * UI always shows the raw structure alongside any normalised figure, and
 * discloses the assumption inline. docs/prd.md M2-3, R-6.
 */
export type FineStructure =
  | { kind: "flat"; currency: string; amount: number }
  | {
      kind: "turnover-percent";
      percent: number;
      /** Many regimes take the greater of a percentage and a floor. */
      alsoFlat?: { currency: string; amount: number };
      whicheverIs: "higher" | "lower";
    }
  | {
      kind: "per-contravention";
      currency: string;
      amount: number;
      note: string;
    }
  | { kind: "sectoral"; note: string };

export interface ReportingWindow {
  /** Hours to initial notification. */
  initialHours: number;
  /** Hours to full report, null where no separate deadline exists. */
  fullReportHours: number | null;
  notifiesRegulator: boolean;
  notifiesDataSubjects: boolean;
  /** True where sectors (finance, health, CNI) carry tighter deadlines. */
  sectoralVariation: boolean;
  note?: string;
}

export interface AiGovernanceProfile {
  bindingStatute: Known<boolean>;
  /** e.g. "Four-tier risk classification". */
  riskModel: Known<string>;
  conformityAssessment: Known<boolean>;
  deepfakeProvision: Known<boolean>;
  /** ISO date binding obligations begin. */
  inForceFrom: Known<string>;
}

/** Every comparable value for one jurisdiction. */
export interface JurisdictionMetrics extends Sourced {
  code: JurisdictionCode;

  // Criminal exposure — normalised to years.
  unauthorizedAccessMaxYears: Known<number>;
  dataTheftMaxYears: Known<number>;
  ransomwareMaxYears: Known<number>;
  officerLiability: Known<boolean>;

  // Corporate financial exposure.
  corporateFine: Known<FineStructure>;

  // Breach reporting.
  reporting: Known<ReportingWindow>;

  // AI governance.
  ai: AiGovernanceProfile;
}

export type ComparisonSectionKey =
  | "criminal"
  | "financial"
  | "reporting"
  | "ai";

export const COMPARISON_SECTION_LABEL: Record<ComparisonSectionKey, string> = {
  criminal: "Criminal exposure",
  financial: "Corporate financial exposure",
  reporting: "Breach reporting",
  ai: "AI governance",
};

/** One metric rendered across the selected jurisdictions. */
export interface ComparisonRow {
  key: string;
  label: string;
  /** Longer explanation surfaced on hover/focus. */
  hint?: string;
  cells: ComparisonCell[];
  /** False when every selected jurisdiction is materially equivalent. */
  divergent: boolean;
}

export interface ComparisonCell {
  code: JurisdictionCode;
  /** Pre-formatted display string, or null when absent. */
  display: string | null;
  /** Reason for absence, when `display` is null. */
  absent: "no-provision" | "not-researched" | null;
  /** Raw comparable number, for divergence detection and ranking. */
  numeric: number | null;
  /** True where this is the strictest value in the row. */
  isExtreme: boolean;
  /** Secondary line — e.g. the raw fine structure under a normalised figure. */
  detail?: string;
}

export interface ComparisonSection {
  key: ComparisonSectionKey;
  label: string;
  rows: ComparisonRow[];
}

export interface ComparisonMatrix {
  codes: JurisdictionCode[];
  names: Record<string, string>;
  sections: ComparisonSection[];
  /** Revenue assumption used to normalise turnover-based fines. */
  hypotheticalRevenueUsd: number;
}
