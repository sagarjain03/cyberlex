import { formatHours } from "@/lib/scoring/normalize";
import { cn } from "@/lib/utils";
import { isKnown } from "@/types";
import type { JurisdictionMetrics } from "@/types";

const TICKS = [2, 6, 24, 72, 168, 720];
const MIN_H = 1;
const MAX_H = 720;

/**
 * Log-scaled because the windows span 2h to 720h. On a linear axis every
 * tight deadline — which is the interesting end — would collapse against the
 * left edge.
 */
function position(hours: number): number {
  const clamped = Math.min(MAX_H, Math.max(MIN_H, hours));
  return (Math.log(clamped) / Math.log(MAX_H)) * 100;
}

interface Entry {
  code: string;
  name: string;
  hours: number | null;
}

/**
 * Breach reporting windows on one axis, so the tightest is obvious at a
 * glance rather than requiring the reader to compare numbers across columns.
 * docs/prd.md M2-4.
 */
export function ReportingTimeline({
  metrics,
  names,
}: {
  metrics: JurisdictionMetrics[];
  names: Record<string, string>;
}) {
  const entries: Entry[] = metrics.map((m) => ({
    code: m.code,
    name: names[m.code] ?? m.code,
    hours: isKnown(m.reporting) ? m.reporting.value.initialHours : null,
  }));

  const known = entries.filter((e) => e.hours !== null);
  const tightest = known.length
    ? Math.min(...known.map((e) => e.hours as number))
    : null;

  return (
    <div>
      {/* Axis */}
      <div className="relative h-5" aria-hidden="true">
        <div className="absolute inset-x-0 top-2.5 h-px bg-rule" />
        {TICKS.map((t) => (
          <span
            key={t}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${position(t)}%` }}
          >
            <span className="block h-2 w-px bg-rule-strong" />
            <span className="mt-1 block text-code text-ink-700">
              {formatHours(t)}
            </span>
          </span>
        ))}
      </div>

      <ul className="mt-8">
        {entries.map((e) => {
          const isTightest = e.hours !== null && e.hours === tightest;

          return (
            <li key={e.code} className="border-t border-rule py-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm text-ink-300">
                  {e.name}
                  <span className="ml-2 text-code text-ink-700">{e.code}</span>
                </span>

                {e.hours === null ? (
                  <span className="text-body-sm text-null">
                    Not yet researched
                  </span>
                ) : (
                  <span className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "text-data",
                        isTightest ? "text-critical" : "text-ink-100",
                      )}
                    >
                      {formatHours(e.hours)}
                    </span>
                    {isTightest && (
                      <span className="text-micro text-critical">Tightest</span>
                    )}
                  </span>
                )}
              </div>

              {e.hours !== null && (
                <div className="relative mt-3 h-1.5" aria-hidden="true">
                  <div className="absolute inset-x-0 top-[3px] h-px bg-rule" />
                  <span
                    className={cn(
                      "absolute top-0 h-1.5 w-px -translate-x-1/2",
                      isTightest ? "bg-critical" : "bg-ink-500",
                    )}
                    style={{ left: `${position(e.hours)}%` }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
