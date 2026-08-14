import type { Sourced } from "./source";
import type { JurisdictionCode } from "./jurisdiction";

/**
 * Where an instrument sits between enactment and enforceability.
 *
 * `unnotified` is the state most tooling ignores: passed by the legislature,
 * but legally inert until notified/gazetted/commenced. It is the product's
 * reason to exist. docs/prd.md §1.
 */
export type LegalStatus =
  | "in-force"
  | "partially-in-force"
  | "unnotified"
  | "draft"
  | "repealed";

export const LEGAL_STATUS_LABEL: Record<LegalStatus, string> = {
  "in-force": "In force",
  "partially-in-force": "Partially in force",
  unnotified: "Unnotified",
  draft: "Draft",
  repealed: "Repealed",
};

/** Design token family per status. docs/design.md §1.3. */
export const LEGAL_STATUS_TOKEN: Record<LegalStatus, string> = {
  "in-force": "live",
  "partially-in-force": "partial",
  unnotified: "pending",
  draft: "draft",
  repealed: "null",
};

/** One obligation within a staged commencement schedule. */
export interface PhaseStep {
  obligation: string;
  /** ISO date, or null where announced but undated. */
  applicableFrom: string | null;
  inForce: boolean;
}

export interface Law extends Sourced {
  id: string;
  jurisdictionCode: JurisdictionCode;
  /** Full official title. */
  title: string;
  /** How practitioners actually refer to it. */
  shortTitle: string;
  /** Official reference — CELEX, chapter number, act number. */
  citation: string;
  year: number;
  status: LegalStatus;
  /** ISO date the instrument was passed/adopted. */
  datePassed: string | null;
  /** ISO date it became enforceable, null while unnotified. */
  dateInForce: string | null;
  /** One-sentence plain-language scope. */
  summary: string;
  /** Present only for `partially-in-force`. */
  phases?: PhaseStep[];
  /** True where this is the jurisdiction's headline cyber instrument. */
  isPrimary: boolean;
}
