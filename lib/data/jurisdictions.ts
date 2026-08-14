import { jurisdictions } from "@/data/jurisdictions";
import { laws } from "@/data/laws";
import { isStale } from "@/lib/format";
import { breakdown, computeStrictness } from "@/lib/scoring/strictness";
import type {
  DimensionBreakdown,
} from "@/lib/scoring/strictness";
import type {
  AiPosture,
  Jurisdiction,
  JurisdictionCode,
  JurisdictionSummary,
  Law,
  LegalStatus,
  Region,
} from "@/types";

import { resolveSources, type ResolvedSource } from "./sources";

export interface JurisdictionFilters {
  region?: Region;
  status?: LegalStatus;
  aiPosture?: AiPosture;
  /** Inclusive strictness band. */
  minScore?: number;
  maxScore?: number;
}

export type JurisdictionSort =
  | "score-desc"
  | "score-asc"
  | "name-asc"
  | "recently-verified";

function toSummary(j: Jurisdiction, now: Date): JurisdictionSummary {
  const primary = laws.find((l) => l.id === j.primaryLawId);
  if (!primary) {
    // A jurisdiction pointing at a missing law is a data-integrity error, not a
    // runtime condition to paper over.
    throw new Error(
      `Jurisdiction ${j.code} references unknown primaryLawId "${j.primaryLawId}".`,
    );
  }

  return {
    code: j.code,
    name: j.name,
    shortName: j.shortName,
    region: j.region,
    isBloc: j.isBloc,
    anchor: j.anchor,
    aiPosture: j.aiPosture,
    score: computeStrictness(j.strictness),
    primaryLawTitle: primary.shortTitle,
    primaryLawCitation: primary.citation,
    primaryLawYear: primary.year,
    primaryLawStatus: primary.status,
    lastVerified: j.lastVerified,
    isStale: isStale(j.lastVerified, now),
  };
}

/**
 * Filtered, sorted jurisdiction summaries.
 *
 * Async despite the data being synchronous today: this signature is the swap
 * boundary, so replacing the body with a database call in v2 changes nothing
 * upstream. docs/architecture.md §2.1.
 */
export async function getJurisdictions(
  filters: JurisdictionFilters = {},
  sort: JurisdictionSort = "score-desc",
  now: Date = new Date(),
): Promise<JurisdictionSummary[]> {
  let result = jurisdictions.map((j) => toSummary(j, now));

  if (filters.region) result = result.filter((j) => j.region === filters.region);
  if (filters.aiPosture)
    result = result.filter((j) => j.aiPosture === filters.aiPosture);
  if (filters.status)
    result = result.filter((j) => j.primaryLawStatus === filters.status);
  if (filters.minScore !== undefined)
    result = result.filter((j) => j.score >= filters.minScore!);
  if (filters.maxScore !== undefined)
    result = result.filter((j) => j.score <= filters.maxScore!);

  switch (sort) {
    case "score-desc":
      return result.sort((a, b) => b.score - a.score);
    case "score-asc":
      return result.sort((a, b) => a.score - b.score);
    case "name-asc":
      return result.sort((a, b) => a.name.localeCompare(b.name));
    case "recently-verified":
      return result.sort((a, b) => b.lastVerified.localeCompare(a.lastVerified));
    default: {
      const _exhaustive: never = sort;
      return _exhaustive;
    }
  }
}

export interface JurisdictionDetail {
  jurisdiction: Jurisdiction;
  score: number;
  breakdown: DimensionBreakdown[];
  primaryLaw: Law;
  laws: Law[];
  sources: ResolvedSource[];
  isStale: boolean;
}

export async function getJurisdictionByCode(
  code: string,
  now: Date = new Date(),
): Promise<JurisdictionDetail | null> {
  const upper = code.toUpperCase() as JurisdictionCode;
  const j = jurisdictions.find((x) => x.code === upper);
  if (!j) return null;

  const jLaws = laws.filter((l) => l.jurisdictionCode === j.code);
  const primaryLaw = jLaws.find((l) => l.id === j.primaryLawId);
  if (!primaryLaw) {
    throw new Error(
      `Jurisdiction ${j.code} references unknown primaryLawId "${j.primaryLawId}".`,
    );
  }

  return {
    jurisdiction: j,
    score: computeStrictness(j.strictness),
    breakdown: breakdown(j.strictness),
    primaryLaw,
    // Primary first, then most recent.
    laws: jLaws.sort((a, b) =>
      a.isPrimary === b.isPrimary ? b.year - a.year : a.isPrimary ? -1 : 1,
    ),
    sources: resolveSources(j.sources),
    isStale: isStale(j.lastVerified, now),
  };
}

/** Preserves the caller's order — the comparator relies on ?a=&b=&c= order. */
export async function getJurisdictionsByCodes(
  codes: string[],
  now: Date = new Date(),
): Promise<JurisdictionSummary[]> {
  return codes
    .map((c) => jurisdictions.find((j) => j.code === c.toUpperCase()))
    .filter((j): j is Jurisdiction => Boolean(j))
    .map((j) => toSummary(j, now));
}

/** Every valid code, for `generateStaticParams` and selector options. */
export async function getJurisdictionCodes(): Promise<JurisdictionCode[]> {
  return jurisdictions.map((j) => j.code);
}

/** Map geometry ids per jurisdiction, so the map can light tracked regions. */
export async function getTrackedGeometryIds(): Promise<
  { code: JurisdictionCode; isoNumeric: string[] }[]
> {
  return jurisdictions.map((j) => ({
    code: j.code,
    isoNumeric: j.isoNumeric,
  }));
}
