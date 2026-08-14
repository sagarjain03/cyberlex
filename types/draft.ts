import type { JurisdictionCode } from "./jurisdiction";
import type { PhaseStep } from "./law";
import type { Sourced } from "./source";

/**
 * The pipeline from consultation to enforceability. Ordered — the tracker
 * renders progression in this sequence. docs/prd.md M3-3.
 */
export type LegislativeStage =
  | "consultation"
  | "introduced"
  | "in-committee"
  | "passed"
  | "awaiting-notification"
  | "partially-in-force";

export const LEGISLATIVE_STAGES: readonly LegislativeStage[] = [
  "consultation",
  "introduced",
  "in-committee",
  "passed",
  "awaiting-notification",
  "partially-in-force",
] as const;

export const STAGE_LABEL: Record<LegislativeStage, string> = {
  consultation: "Consultation",
  introduced: "Introduced",
  "in-committee": "In committee",
  passed: "Passed",
  "awaiting-notification": "Awaiting notification",
  "partially-in-force": "Partially in force",
};

/** Why an instrument that has passed is still not enforceable. */
export type CommencementBlocker =
  | "rules-pending"
  | "gazette-pending"
  | "phased-schedule"
  | "regulator-setup"
  | "none"
  | "unknown";

export const BLOCKER_LABEL: Record<CommencementBlocker, string> = {
  "rules-pending": "Subordinate rules not yet made",
  "gazette-pending": "Commencement notification not yet gazetted",
  "phased-schedule": "Phased commencement schedule",
  "regulator-setup": "Regulator not yet constituted",
  none: "No outstanding blocker",
  unknown: "Blocker not established",
};

/** Whether an engineering team needs to act. docs/prd.md M3-5. */
export type DeveloperImpact = "none" | "low" | "material";

export const IMPACT_LABEL: Record<DeveloperImpact, string> = {
  none: "No engineering impact",
  low: "Low impact",
  material: "Material impact",
};

export interface DraftLaw extends Sourced {
  id: string;
  jurisdictionCode: JurisdictionCode;
  title: string;
  shortTitle: string;
  stage: LegislativeStage;
  /** ISO date passed, null while still a bill. */
  datePassed: string | null;
  blocker: CommencementBlocker;
  /** ISO date, or a described expectation, or null where none is announced. */
  expectedCommencement: string | null;
  expectedCommencementNote?: string;
  /** Sponsoring ministry, committee, or institution. */
  sponsor: string;
  /** ISO date of the most recent legislative action. */
  lastAction: string;
  lastActionNote: string;
  /** Plain language: what changes if/when this bites. */
  whatChanges: string;
  developerImpact: DeveloperImpact;
  impactNote: string;
  /** Present for staged commencement. */
  phases?: PhaseStep[];
}
