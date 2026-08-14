import { aiCrimes } from "@/data/ai-crimes";
import { drafts } from "@/data/drafts";
import { jurisdictions } from "@/data/jurisdictions";
import { laws } from "@/data/laws";
import { metrics } from "@/data/metrics";
import { computeStrictness } from "@/lib/scoring/strictness";
import { formatHours } from "@/lib/scoring/normalize";
import { isKnown } from "@/types";
import type { JurisdictionCode } from "@/types";

export interface DirectoryStats {
  jurisdictions: number;
  inForce: number;
  partiallyInForce: number;
  unnotified: number;
  draft: number;
  bindingAiRegimes: number;
  medianStrictness: number;
  /** Tightest binding initial-notification window across tracked regimes. */
  tightestWindow: { hours: number; display: string; code: JurisdictionCode } | null;
  aiCrimeTechniques: number;
  /** Technique/jurisdiction pairs with no clear statutory coverage. */
  coverageGaps: number;
  /** Records still awaiting human verification against primary sources. */
  needsReview: number;
}

/**
 * Aggregates for the readout strip. Computed from the same records the rest of
 * the app renders, so a figure here can never drift from its detail page.
 */
export async function getDirectoryStats(): Promise<DirectoryStats> {
  const primaryLaws = jurisdictions.map((j) =>
    laws.find((l) => l.id === j.primaryLawId),
  );

  const scores = jurisdictions
    .map((j) => computeStrictness(j.strictness))
    .sort((a, b) => a - b);

  const windows = metrics
    .filter((m) => isKnown(m.reporting))
    .map((m) => ({
      code: m.code,
      hours: isKnown(m.reporting) ? m.reporting.value.initialHours : Infinity,
    }))
    .sort((a, b) => a.hours - b.hours);

  const tightest = windows[0];

  const allRecords = [
    ...jurisdictions,
    ...laws,
    ...metrics,
    ...drafts,
    ...aiCrimes,
  ];

  return {
    jurisdictions: jurisdictions.length,
    inForce: primaryLaws.filter((l) => l?.status === "in-force").length,
    partiallyInForce: primaryLaws.filter(
      (l) => l?.status === "partially-in-force",
    ).length,
    unnotified: primaryLaws.filter((l) => l?.status === "unnotified").length,
    draft: primaryLaws.filter((l) => l?.status === "draft").length,
    bindingAiRegimes: jurisdictions.filter(
      (j) =>
        j.aiPosture === "binding-comprehensive" ||
        j.aiPosture === "binding-sectoral",
    ).length,
    medianStrictness: median(scores),
    tightestWindow: tightest
      ? {
          hours: tightest.hours,
          display: formatHours(tightest.hours),
          code: tightest.code,
        }
      : null,
    aiCrimeTechniques: aiCrimes.length,
    coverageGaps: aiCrimes.reduce(
      (sum, c) =>
        sum + c.mappings.filter((m) => m.coverage === "no-coverage").length,
      0,
    ),
    needsReview: allRecords.filter((r) => r.verification !== "verified").length,
  };
}

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}
