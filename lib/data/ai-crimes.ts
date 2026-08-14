import { aiCrimes } from "@/data/ai-crimes";
import { jurisdictions } from "@/data/jurisdictions";
import type {
  AiCrime,
  CoverageLevel,
  CoverageMatrix,
  JurisdictionCode,
  StatuteMapping,
} from "@/types";

import { resolveSources, type ResolvedSource } from "./sources";

export interface AiCrimeSummary {
  slug: string;
  name: string;
  shortName: string;
  severity: AiCrime["severity"];
  prevalence: AiCrime["prevalence"];
  summary: string;
  /** How many tracked jurisdictions have direct statutory coverage. */
  directCount: number;
  /** How many have no clear coverage — the number that matters. */
  gapCount: number;
}

const SEVERITY_ORDER: Record<AiCrime["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export async function getAiCrimes(): Promise<AiCrimeSummary[]> {
  return aiCrimes
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      shortName: c.shortName,
      severity: c.severity,
      prevalence: c.prevalence,
      summary: c.summary,
      directCount: c.mappings.filter((m) => m.coverage === "direct").length,
      gapCount: c.mappings.filter((m) => m.coverage === "no-coverage").length,
    }))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

export interface MappingWithJurisdiction extends StatuteMapping {
  jurisdictionName: string;
  jurisdictionShortName: string;
  resolvedSources: ResolvedSource[];
}

export interface AiCrimeDetail extends Omit<AiCrime, "mappings"> {
  mappings: MappingWithJurisdiction[];
  resolvedSources: ResolvedSource[];
}

const COVERAGE_ORDER: Record<CoverageLevel, number> = {
  direct: 0,
  analogical: 1,
  "no-coverage": 2,
  "not-researched": 3,
};

export async function getAiCrimeBySlug(
  slug: string,
): Promise<AiCrimeDetail | null> {
  const crime = aiCrimes.find((c) => c.slug === slug);
  if (!crime) return null;

  const mappings = crime.mappings
    .map((m) => {
      const j = jurisdictions.find((x) => x.code === m.jurisdictionCode);
      return {
        ...m,
        jurisdictionName: j?.name ?? m.jurisdictionCode,
        jurisdictionShortName: j?.shortName ?? m.jurisdictionCode,
        resolvedSources: resolveSources(m.sources),
      };
    })
    // Strongest coverage first, so gaps collect at the bottom where they read
    // as a conclusion rather than as missing rows.
    .sort((a, b) => COVERAGE_ORDER[a.coverage] - COVERAGE_ORDER[b.coverage]);

  return {
    ...crime,
    mappings,
    resolvedSources: resolveSources(crime.sources),
  };
}

export async function getAiCrimeSlugs(): Promise<string[]> {
  return aiCrimes.map((c) => c.slug);
}

/**
 * Technique × jurisdiction grid. Any pair without an explicit mapping is
 * `not-researched` — never silently omitted, never assumed uncovered.
 * docs/prd.md M4-3.
 */
export async function getCoverageMatrix(): Promise<CoverageMatrix> {
  const cols = jurisdictions.map((j) => ({
    code: j.code as JurisdictionCode,
    shortName: j.shortName,
  }));

  return {
    jurisdictions: cols,
    rows: aiCrimes
      .slice()
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
      .map((c) => ({
        slug: c.slug,
        shortName: c.shortName,
        severity: c.severity,
        cells: cols.map((col) => ({
          code: col.code,
          coverage:
            c.mappings.find((m) => m.jurisdictionCode === col.code)?.coverage ??
            "not-researched",
        })),
      })),
  };
}
