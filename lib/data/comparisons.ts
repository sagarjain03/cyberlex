import { jurisdictions } from "@/data/jurisdictions";
import { metrics } from "@/data/metrics";
import { formatDate } from "@/lib/format";
import {
  formatHours,
  formatYears,
  normalizeFine,
  formatCompactUsd,
} from "@/lib/scoring/normalize";
import { DEFAULT_HYPOTHETICAL_REVENUE_USD } from "@/lib/constants/thresholds";
import { isKnown } from "@/types";
import type {
  ComparisonCell,
  ComparisonMatrix,
  ComparisonRow,
  ComparisonSectionKey,
  JurisdictionCode,
  JurisdictionMetrics,
  Known,
} from "@/types";

/** Which end of the scale counts as stricter, for extreme-value marking. */
type Direction = "higher-is-stricter" | "lower-is-stricter";

interface RowSpec {
  key: string;
  label: string;
  hint?: string;
  direction: Direction | null;
  /** Display string, comparable number, and optional secondary line. */
  read: (
    m: JurisdictionMetrics,
    revenue: number,
  ) => Known<{ display: string; numeric: number | null; detail?: string }>;
}

/** Lift a `Known<T>` through a formatter without losing the absent reason. */
function map<T>(
  k: Known<T>,
  fn: (v: T) => { display: string; numeric: number | null; detail?: string },
): Known<{ display: string; numeric: number | null; detail?: string }> {
  return k.kind === "known" ? { kind: "known", value: fn(k.value) } : k;
}

const ROWS: Record<ComparisonSectionKey, RowSpec[]> = {
  criminal: [
    {
      key: "unauthorized-access",
      label: "Unauthorised access",
      hint: "Maximum custodial sentence for the base offence.",
      direction: "higher-is-stricter",
      read: (m) =>
        map(m.unauthorizedAccessMaxYears, (y) => ({
          display: formatYears(y),
          numeric: y,
        })),
    },
    {
      key: "data-theft",
      label: "Data theft",
      direction: "higher-is-stricter",
      read: (m) =>
        map(m.dataTheftMaxYears, (y) => ({
          display: formatYears(y),
          numeric: y,
        })),
    },
    {
      key: "ransomware",
      label: "Ransomware / extortion",
      direction: "higher-is-stricter",
      read: (m) =>
        map(m.ransomwareMaxYears, (y) => ({
          display: formatYears(y),
          numeric: y,
        })),
    },
    {
      key: "officer-liability",
      label: "Officer liability",
      hint: "Whether individuals can be personally liable.",
      direction: null,
      read: (m) =>
        map(m.officerLiability, (b) => ({
          display: b ? "Yes" : "No",
          numeric: b ? 1 : 0,
        })),
    },
  ],

  financial: [
    {
      key: "corporate-fine",
      label: "Corporate ceiling",
      hint: "Normalised worst case. Native structure shown beneath — the two are not equivalent.",
      direction: "higher-is-stricter",
      read: (m, revenue) =>
        map(m.corporateFine, (f) => {
          const n = normalizeFine(f, revenue);
          return {
            display: n.incomparable ? "Sectoral" : formatCompactUsd(n.usd),
            numeric: n.incomparable ? null : n.usd,
            detail: n.assumption
              ? `${n.nativeDisplay} — ${n.assumption}`
              : n.nativeDisplay,
          };
        }),
    },
  ],

  reporting: [
    {
      key: "initial-window",
      label: "Initial notification",
      hint: "Shortest binding window to first notify a regulator.",
      direction: "lower-is-stricter",
      read: (m) =>
        map(m.reporting, (r) => ({
          display: formatHours(r.initialHours),
          numeric: r.initialHours,
          detail: r.note,
        })),
    },
    {
      key: "full-report",
      label: "Full report",
      direction: "lower-is-stricter",
      read: (m) =>
        map(m.reporting, (r) => ({
          display: r.fullReportHours ? formatHours(r.fullReportHours) : "—",
          numeric: r.fullReportHours,
        })),
    },
    {
      key: "notify-subjects",
      label: "Notify data subjects",
      direction: null,
      read: (m) =>
        map(m.reporting, (r) => ({
          display: r.notifiesDataSubjects ? "Required" : "Not required",
          numeric: r.notifiesDataSubjects ? 1 : 0,
        })),
    },
    {
      key: "sectoral-variation",
      label: "Sectoral variation",
      hint: "Whether regulated sectors face tighter deadlines.",
      direction: null,
      read: (m) =>
        map(m.reporting, (r) => ({
          display: r.sectoralVariation ? "Yes" : "No",
          numeric: r.sectoralVariation ? 1 : 0,
        })),
    },
  ],

  ai: [
    {
      key: "ai-binding",
      label: "Binding AI statute",
      direction: null,
      read: (m) =>
        map(m.ai.bindingStatute, (b) => ({
          display: b ? "Yes" : "No",
          numeric: b ? 1 : 0,
        })),
    },
    {
      key: "ai-risk-model",
      label: "Risk model",
      direction: null,
      read: (m) => map(m.ai.riskModel, (s) => ({ display: s, numeric: null })),
    },
    {
      key: "ai-conformity",
      label: "Conformity assessment",
      direction: null,
      read: (m) =>
        map(m.ai.conformityAssessment, (b) => ({
          display: b ? "Mandatory" : "Not required",
          numeric: b ? 1 : 0,
        })),
    },
    {
      key: "ai-deepfake",
      label: "Synthetic media disclosure",
      direction: null,
      read: (m) =>
        map(m.ai.deepfakeProvision, (b) => ({
          display: b ? "Required" : "Not required",
          numeric: b ? 1 : 0,
        })),
    },
    {
      key: "ai-in-force",
      label: "Binding from",
      direction: null,
      read: (m) =>
        map(m.ai.inForceFrom, (d) => ({
          display: formatDate(d),
          numeric: null,
        })),
    },
  ],
};

const SECTION_ORDER: ComparisonSectionKey[] = [
  "criminal",
  "financial",
  "reporting",
  "ai",
];

const SECTION_LABEL: Record<ComparisonSectionKey, string> = {
  criminal: "Criminal exposure",
  financial: "Corporate financial exposure",
  reporting: "Breach reporting",
  ai: "AI governance",
};

function buildRow(
  spec: RowSpec,
  selected: JurisdictionMetrics[],
  revenue: number,
): ComparisonRow {
  const cells: ComparisonCell[] = selected.map((m) => {
    const read = spec.read(m, revenue);
    if (!isKnown(read)) {
      return {
        code: m.code,
        display: null,
        absent: read.kind,
        numeric: null,
        isExtreme: false,
      };
    }
    return {
      code: m.code,
      display: read.value.display,
      absent: null,
      numeric: read.value.numeric,
      isExtreme: false,
      detail: read.value.detail,
    };
  });

  // Mark the strictest known value, where the row has a direction.
  if (spec.direction) {
    const numbers = cells
      .map((c) => c.numeric)
      .filter((n): n is number => n !== null);

    // Only meaningful when the values actually differ. If every jurisdiction
    // ties, marking them all "strictest" says nothing — and marking an
    // arbitrary one would be worse.
    const distinct = new Set(numbers).size;

    if (numbers.length > 1 && distinct > 1) {
      const target =
        spec.direction === "higher-is-stricter"
          ? Math.max(...numbers)
          : Math.min(...numbers);
      for (const c of cells) {
        if (c.numeric === target) c.isExtreme = true;
      }
    }
  }

  // A row is divergent when the jurisdictions actually differ. Rows where every
  // value is absent are not "equivalent" — they are unknown, and the divergence
  // toggle must not dim them into looking settled.
  const displays = cells.map((c) => c.display);
  const allAbsent = displays.every((d) => d === null);
  const divergent =
    allAbsent || new Set(displays.map((d) => d ?? "∅")).size > 1;

  return {
    key: spec.key,
    label: spec.label,
    hint: spec.hint,
    cells,
    divergent,
  };
}

/**
 * The side-by-side comparison. Comparison logic lives here rather than in
 * components so Phase 7's grounding step can reuse it verbatim.
 * docs/architecture.md §4.2 step 3.
 */
export async function getComparisonMatrix(
  codes: string[],
  hypotheticalRevenueUsd: number = DEFAULT_HYPOTHETICAL_REVENUE_USD,
): Promise<ComparisonMatrix> {
  const upper = codes.map((c) => c.toUpperCase() as JurisdictionCode);

  const selected = upper
    .map((c) => metrics.find((m) => m.code === c))
    .filter((m): m is JurisdictionMetrics => Boolean(m));

  const names: Record<string, string> = {};
  for (const m of selected) {
    names[m.code] =
      jurisdictions.find((j) => j.code === m.code)?.shortName ?? m.code;
  }

  return {
    codes: selected.map((m) => m.code),
    names,
    hypotheticalRevenueUsd,
    sections: SECTION_ORDER.map((key) => ({
      key,
      label: SECTION_LABEL[key],
      rows: ROWS[key].map((spec) =>
        buildRow(spec, selected, hypotheticalRevenueUsd),
      ),
    })),
  };
}

/** Raw metrics for a single jurisdiction, for the detail page. */
export async function getMetricsByCode(
  code: string,
): Promise<JurisdictionMetrics | null> {
  return metrics.find((m) => m.code === code.toUpperCase()) ?? null;
}
