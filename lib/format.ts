import { STALENESS_THRESHOLD_DAYS } from "@/lib/constants/thresholds";

/** "15 Aug 2026". Stable across locales — we render English only in v1. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** "Aug 2026" — for phase schedules where the day is noise. */
export function formatMonth(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/**
 * Whether a record is old enough to warrant a "verify before relying"
 * affordance. Compared against a caller-supplied `now` so pages stay
 * deterministic at build time. docs/prd.md M1-4.
 */
export function isStale(lastVerified: string, now: Date = new Date()): boolean {
  const d = new Date(lastVerified);
  if (Number.isNaN(d.getTime())) return true;
  const days = (now.getTime() - d.getTime()) / 86_400_000;
  return days > STALENESS_THRESHOLD_DAYS;
}

/** Zero-padded count for the readout strip — "07" reads as instrumentation. */
export function padCount(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
