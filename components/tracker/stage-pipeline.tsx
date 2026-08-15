import Link from "next/link";

import { cn } from "@/lib/utils";
import { STAGE_LABEL } from "@/types";
import type { LegislativeStage } from "@/types";

/**
 * The legislative pipeline, consultation → partially in force.
 *
 * Empty stages are rendered rather than skipped: the sequence *is* the
 * information, and a gap in the middle would misrepresent progression as
 * absence. docs/prd.md M3-3.
 *
 * Each stage is a link that filters the list below, so the pipeline doubles as
 * navigation without a separate control.
 */
export function StagePipeline({
  buckets,
  active,
}: {
  buckets: { stage: LegislativeStage; count: number }[];
  active?: LegislativeStage;
}) {
  return (
    <ol className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
      {buckets.map(({ stage, count }, i) => {
        const isActive = active === stage;
        const empty = count === 0;
        // The last two stages are where a law exists but does not fully bind —
        // the states this product is built to surface.
        const isGapStage = i >= 4;

        return (
          <li key={stage}>
            <Link
              href={isActive ? "/tracker" : `/tracker?stage=${stage}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group block border-t py-4 transition-colors",
                isActive ? "border-bone" : "border-rule hover:border-rule-strong",
              )}
            >
              <span
                className={cn(
                  "block text-data-lg transition-colors",
                  empty
                    ? "text-ink-700"
                    : isActive
                      ? "text-bone"
                      : isGapStage
                        ? "text-pending"
                        : "text-ink-100",
                )}
              >
                {count}
              </span>

              {/* The gap marker goes beside the label, not the numeral —
                  adjacent to a figure it reads as a decimal point. */}
              <span className="mt-2 flex items-center gap-1.5">
                {isGapStage && !empty && (
                  <span
                    className="size-1 shrink-0 bg-pending"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "text-code transition-colors",
                    isActive
                      ? "text-bone"
                      : "text-ink-500 group-hover:text-ink-300",
                  )}
                >
                  {STAGE_LABEL[stage]}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
