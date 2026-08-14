import { cn } from "@/lib/utils";
import type { DimensionBreakdown } from "@/lib/scoring/strictness";

/**
 * Per-dimension contributions behind a strictness score.
 *
 * Exists so a contested score can be argued with at the level it was built,
 * rather than only as a headline number. The weight is shown next to every
 * dimension for the same reason. docs/prd.md M1-6, R-3.
 */
export function ScoreBreakdown({
  rows,
  className,
}: {
  rows: DimensionBreakdown[];
  className?: string;
}) {
  return (
    <dl className={cn("space-y-px", className)}>
      {rows.map(({ spec, raw, contribution }) => (
        <div
          key={spec.key}
          className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2 border-t border-rule py-3"
        >
          <dt className="text-body-sm text-ink-300">
            {spec.label}
            <span className="ml-2 text-code text-ink-700">
              ×{spec.weight.toFixed(2)}
            </span>
          </dt>

          <dd className="flex items-baseline gap-3 text-data">
            <span className="text-ink-100">{raw}</span>
            <span className="w-10 text-right text-ink-500">
              +{contribution.toFixed(1)}
            </span>
          </dd>

          {/* Full-width hairline meter beneath each row. */}
          <div
            className="col-span-2 h-px bg-rule"
            aria-hidden="true"
          >
            <div className="h-px bg-ink-500" style={{ width: `${raw}%` }} />
          </div>
        </div>
      ))}
    </dl>
  );
}
