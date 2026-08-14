import type { Sourced } from "./source";

/** The ten jurisdictions tracked in v1. docs/prd.md §3 Module 1. */
export type JurisdictionCode =
  | "US"
  | "EU"
  | "UK"
  | "IN"
  | "SG"
  | "CN"
  | "JP"
  | "AU"
  | "BR"
  | "AE";

export type Region =
  | "north-america"
  | "europe"
  | "asia-pacific"
  | "south-asia"
  | "middle-east"
  | "latin-america";

export const REGION_LABEL: Record<Region, string> = {
  "north-america": "North America",
  europe: "Europe",
  "asia-pacific": "Asia-Pacific",
  "south-asia": "South Asia",
  "middle-east": "Middle East",
  "latin-america": "Latin America",
};

/** How binding a jurisdiction's AI-specific rules are. */
export type AiPosture =
  | "binding-comprehensive"
  | "binding-sectoral"
  | "guidance-only"
  | "draft-framework"
  | "none";

export const AI_POSTURE_LABEL: Record<AiPosture, string> = {
  "binding-comprehensive": "Binding, comprehensive",
  "binding-sectoral": "Binding, sectoral",
  "guidance-only": "Guidance only",
  "draft-framework": "Draft framework",
  none: "No AI-specific rules",
};

export interface Regulator {
  name: string;
  abbreviation?: string;
  url?: string;
}

/**
 * The six weighted inputs to the strictness score, each 0–100.
 * Weights live in `lib/scoring/weights.ts` and are published at /methodology —
 * the score is a comparative indicator, never a measurement. docs/prd.md R-3.
 */
export interface StrictnessDimensions {
  criminalExposure: number;
  corporateFinancial: number;
  reportingBurden: number;
  enforcementIntensity: number;
  aiGovernance: number;
  extraterritorialReach: number;
}

export type StrictnessDimensionKey = keyof StrictnessDimensions;

export interface Jurisdiction extends Sourced {
  code: JurisdictionCode;
  /** Full display name. */
  name: string;
  /** Compact name for dense rows. */
  shortName: string;
  region: Region;
  /**
   * ISO 3166-1 numeric codes for map geometry. A bloc resolves to every
   * member state, so this is an array rather than a single id.
   */
  isoNumeric: string[];
  /** Map marker anchor, [longitude, latitude]. */
  anchor: [number, number];
  /** True for supranational blocs — changes copy ("country" is wrong for the EU). */
  isBloc: boolean;
  primaryLawId: string;
  regulators: Regulator[];
  aiPosture: AiPosture;
  strictness: StrictnessDimensions;
  /** Why this jurisdiction is worth tracking — shown on the detail page. */
  profile: string;
}

/** A jurisdiction joined to its computed score, ready to render. */
export interface JurisdictionSummary {
  code: JurisdictionCode;
  name: string;
  shortName: string;
  region: Region;
  isBloc: boolean;
  anchor: [number, number];
  aiPosture: AiPosture;
  score: number;
  primaryLawTitle: string;
  primaryLawCitation: string;
  primaryLawYear: number;
  primaryLawStatus: import("./law").LegalStatus;
  lastVerified: string;
  isStale: boolean;
}
