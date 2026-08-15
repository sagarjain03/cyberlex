import {
  DEFAULT_HYPOTHETICAL_REVENUE_USD,
  MAX_COMPARE_ITEMS,
  STRICTNESS_BANDS,
} from "@/lib/constants/thresholds";
import type {
  DraftFilters,
  JurisdictionFilters,
  JurisdictionSort,
} from "@/lib/data";
import { LEGISLATIVE_STAGES } from "@/types";
import type {
  AiPosture,
  DeveloperImpact,
  JurisdictionCode,
  LegalStatus,
  Region,
} from "@/types";

/**
 * Duplicated from the data layer deliberately: this module must stay free of
 * `@/data` imports, and validating against a literal list keeps URL parsing a
 * pure function. Kept in sync by the `JurisdictionCode` type — adding a
 * jurisdiction without updating this is a compile error.
 */
const JURISDICTION_CODES: JurisdictionCode[] = [
  "US",
  "EU",
  "UK",
  "IN",
  "SG",
  "CN",
  "JP",
  "AU",
  "BR",
  "AE",
];

/**
 * Typed reading of `searchParams`.
 *
 * Every value is validated against its closed set — an unknown or malformed
 * param is dropped rather than throwing or leaking into a filter, so a
 * hand-edited URL degrades to the unfiltered view instead of an error page.
 */
export type RawSearchParams = Record<string, string | string[] | undefined>;

const REGIONS: Region[] = [
  "north-america",
  "europe",
  "asia-pacific",
  "south-asia",
  "middle-east",
  "latin-america",
];

const STATUSES: LegalStatus[] = [
  "in-force",
  "partially-in-force",
  "unnotified",
  "draft",
  "repealed",
];

const POSTURES: AiPosture[] = [
  "binding-comprehensive",
  "binding-sectoral",
  "guidance-only",
  "draft-framework",
  "none",
];

const SORTS: JurisdictionSort[] = [
  "score-desc",
  "score-asc",
  "name-asc",
  "recently-verified",
];

export const FILTER_KEYS = ["region", "status", "ai", "band"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function pick<T extends string>(
  v: string | string[] | undefined,
  allowed: T[],
): T | undefined {
  const s = one(v);
  return s && (allowed as string[]).includes(s) ? (s as T) : undefined;
}

export function parseFilters(params: RawSearchParams): JurisdictionFilters {
  const filters: JurisdictionFilters = {};

  const region = pick(params.region, REGIONS);
  if (region) filters.region = region;

  const status = pick(params.status, STATUSES);
  if (status) filters.status = status;

  const ai = pick(params.ai, POSTURES);
  if (ai) filters.aiPosture = ai;

  // Bands are addressed by label so URLs read as `?band=Strict`, not `?min=60`.
  const bandLabel = one(params.band);
  const band = STRICTNESS_BANDS.find((b) => b.label === bandLabel);
  if (band) {
    filters.minScore = band.min;
    filters.maxScore = band.max;
  }

  return filters;
}

export function parseSort(params: RawSearchParams): JurisdictionSort {
  return pick(params.sort, SORTS) ?? "score-desc";
}

export function countActiveFilters(params: RawSearchParams): number {
  return FILTER_KEYS.filter((k) => one(params[k])).length;
}

/* ── Tracker ────────────────────────────────────────────────────────────── */

const IMPACTS: DeveloperImpact[] = ["none", "low", "material"];

export function parseDraftFilters(params: RawSearchParams): DraftFilters {
  const filters: DraftFilters = {};

  const stage = pick(params.stage, [...LEGISLATIVE_STAGES]);
  if (stage) filters.stage = stage;

  const impact = pick(params.impact, IMPACTS);
  if (impact) filters.impact = impact;

  const code = one(params.jurisdiction)?.toUpperCase();
  if (code && JURISDICTION_CODES.includes(code as JurisdictionCode)) {
    filters.jurisdictionCode = code as JurisdictionCode;
  }

  return filters;
}

/* ── Comparator ─────────────────────────────────────────────────────────── */

export const COMPARE_SLOTS = ["a", "b", "c"] as const;

/**
 * Read `?a=&b=&c=` into a validated, deduplicated, clamped selection.
 *
 * Unknown codes are dropped rather than rejected, so a stale or hand-edited
 * link degrades to whatever it got right instead of an error page.
 * docs/prd.md M2-1.
 */
export function parseCompareCodes(
  params: RawSearchParams,
  validCodes: readonly string[],
): string[] {
  const valid = new Set(validCodes);
  const seen = new Set<string>();
  const out: string[] = [];

  for (const slot of COMPARE_SLOTS) {
    const raw = one(params[slot])?.toUpperCase();
    if (!raw || !valid.has(raw) || seen.has(raw)) continue;
    seen.add(raw);
    out.push(raw);
  }

  return out.slice(0, MAX_COMPARE_ITEMS);
}

/** Hypothetical annual revenue used to normalise turnover-based fines. */
export function parseRevenue(params: RawSearchParams): number {
  const raw = one(params.rev);
  if (!raw) return DEFAULT_HYPOTHETICAL_REVENUE_USD;

  const n = Number(raw);
  // Reject anything not a sane positive figure — a nonsense revenue would
  // silently produce a nonsense penalty ceiling.
  if (!Number.isFinite(n) || n <= 0 || n > 1e15) {
    return DEFAULT_HYPOTHETICAL_REVENUE_USD;
  }
  return n;
}
