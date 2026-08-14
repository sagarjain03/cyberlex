import type { FineStructure } from "@/types";

/**
 * Indicative USD conversion rates, used only to place fine ceilings on a
 * single axis for comparison.
 *
 * ⚠️ These are static and approximate by design. A live FX feed would imply a
 * precision this comparison does not have — the point is "roughly this order of
 * magnitude", never an exact figure. The UI always shows the native structure
 * alongside anything normalised. docs/prd.md R-6.
 */
const USD_PER: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  SGD: 0.74,
  AUD: 0.66,
  JPY: 0.0064,
  INR: 0.012,
  BRL: 0.18,
  AED: 0.27,
  CNY: 0.14,
};

export interface NormalizedFine {
  /** Worst-case ceiling in USD at the given hypothetical revenue. */
  usd: number;
  /** The native structure, always shown alongside. */
  nativeDisplay: string;
  /** The assumption applied, disclosed inline. */
  assumption: string | null;
  /** True when the structure cannot be reduced to a figure at all. */
  incomparable: boolean;
}

/**
 * Reduce a fine structure to a comparable USD ceiling.
 *
 * A flat cap and a percentage of global turnover are not the same kind of
 * thing. This function makes them plottable on one axis; it does not make them
 * equivalent, and every caller must render `nativeDisplay` and `assumption`.
 */
export function normalizeFine(
  fine: FineStructure,
  hypotheticalRevenueUsd: number,
): NormalizedFine {
  switch (fine.kind) {
    case "flat": {
      const usd = fine.amount * (USD_PER[fine.currency] ?? 1);
      return {
        usd,
        nativeDisplay: `${formatCurrency(fine.amount, fine.currency)} cap`,
        assumption: null,
        incomparable: false,
      };
    }

    case "turnover-percent": {
      const fromTurnover = (fine.percent / 100) * hypotheticalRevenueUsd;
      const floor = fine.alsoFlat
        ? fine.alsoFlat.amount * (USD_PER[fine.alsoFlat.currency] ?? 1)
        : null;

      const usd =
        floor === null
          ? fromTurnover
          : fine.whicheverIs === "higher"
            ? Math.max(fromTurnover, floor)
            : Math.min(fromTurnover, floor);

      const native = fine.alsoFlat
        ? `${fine.percent}% of turnover or ${formatCurrency(
            fine.alsoFlat.amount,
            fine.alsoFlat.currency,
          )}, whichever is ${fine.whicheverIs}`
        : `${fine.percent}% of turnover`;

      return {
        usd,
        nativeDisplay: native,
        assumption: `at ${formatCompactUsd(hypotheticalRevenueUsd)} annual revenue`,
        incomparable: false,
      };
    }

    case "per-contravention": {
      const usd = fine.amount * (USD_PER[fine.currency] ?? 1);
      return {
        usd,
        nativeDisplay: `${formatCurrency(fine.amount, fine.currency)} per contravention`,
        assumption: "single contravention assumed",
        incomparable: false,
      };
    }

    case "sectoral":
      return {
        usd: 0,
        nativeDisplay: fine.note,
        assumption: null,
        incomparable: true,
      };

    default: {
      const _exhaustive: never = fine;
      return _exhaustive;
    }
  }
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      notation: amount >= 1_000_000 ? "compact" : "standard",
    }).format(amount);
  } catch {
    // Unknown currency code — degrade to a readable string rather than throw.
    return `${currency} ${amount.toLocaleString("en")}`;
  }
}

export function formatCompactUsd(amount: number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Custodial sentences are stored in years; this is the display form. */
export function formatYears(years: number): string {
  if (years === 0) return "None";
  if (years < 1) return `${Math.round(years * 12)} months`;
  return years === 1 ? "1 year" : `${years} years`;
}

/**
 * Reporting windows are stored in hours.
 *
 * Deadlines are stated in hours in the instruments themselves — "72 hours", not
 * "3 days" — so hours are preserved up to a week. Beyond that, days read
 * better and no statute expresses the window that way anyway.
 */
export function formatHours(hours: number): string {
  if (hours < 168) return `${hours}h`;
  const days = hours / 24;
  return Number.isInteger(days) ? `${days}d` : `${hours}h`;
}
