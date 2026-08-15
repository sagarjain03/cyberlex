import { formatMonth } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PhaseStep } from "@/types";

/**
 * Staged commencement as an obligation → applicable-from timeline.
 *
 * A single status badge cannot express "half of this binds you today and the
 * rest lands in eighteen months", which is the actual position for the AI Act
 * and the CRA. docs/prd.md M3-6.
 *
 * Shared by the tracker and the jurisdiction detail page — one implementation,
 * because the two must never disagree about what is in force.
 */
export function PhaseSchedule({
  phases,
  className,
}: {
  phases: PhaseStep[];
  className?: string;
}) {
  const live = phases.filter((p) => p.inForce).length;

  return (
    <div className={className}>
      <p className="text-micro text-ink-700">
        Commencement · {live} of {phases.length} in force
      </p>

      <ol className="mt-3 border-l border-rule pl-4">
        {phases.map((p) => (
          <li key={p.obligation} className="relative py-2">
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-[1.3125rem] top-3.5 size-1.5 rounded-full",
                p.inForce ? "bg-live" : "bg-null",
              )}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span
                className={cn(
                  "text-body-sm",
                  p.inForce ? "text-ink-300" : "text-ink-500",
                )}
              >
                {p.obligation}
              </span>
              <span
                className={cn(
                  "text-code",
                  p.inForce ? "text-live" : "text-ink-700",
                )}
              >
                {p.applicableFrom ? formatMonth(p.applicableFrom) : "No date set"}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
