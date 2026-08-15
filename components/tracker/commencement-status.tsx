import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BLOCKER_LABEL, STAGE_LABEL } from "@/types";
import type { CommencementBlocker, LegislativeStage } from "@/types";

/**
 * The gap between "passed" and "enforceable" — the product's whole reason to
 * exist, so this is the most carefully-worded component in the app.
 *
 * Three distinct situations, deliberately worded differently:
 *
 *  1. **Passed but inert.** A date passed exists, no in-force date does. The
 *     phrasing must not imply the law binds anyone: "law since X, binding no
 *     one". This is the state most tooling silently renders as "in force".
 *  2. **Still a bill.** Nothing has passed, so there is no gap to measure yet —
 *     only a stage.
 *  3. **Partially in force.** Some obligations bite, some do not. The caller
 *     renders a `PhaseSchedule` beneath; this component must not flatten it to
 *     a yes/no.
 *
 * The elapsed figure is computed against a caller-supplied `now` so pages stay
 * deterministic at build time.
 */
export function CommencementStatus({
  stage,
  datePassed,
  blocker,
  expectedCommencement,
  expectedNote,
  now = new Date(),
  className,
}: {
  stage: LegislativeStage;
  datePassed: string | null;
  blocker: CommencementBlocker;
  expectedCommencement: string | null;
  expectedNote?: string;
  now?: Date;
  className?: string;
}) {
  const dormantDays = datePassed
    ? Math.floor(
        (now.getTime() - new Date(datePassed).getTime()) / 86_400_000,
      )
    : null;

  const isDormant =
    datePassed !== null &&
    (stage === "passed" || stage === "awaiting-notification");

  return (
    <div className={cn("space-y-2", className)}>
      {isDormant && dormantDays !== null ? (
        <p className="text-body-sm text-pending">
          Law since {formatDate(datePassed)} —{" "}
          <span className="text-data text-pending">
            {formatElapsed(dormantDays)}
          </span>{" "}
          without binding effect.
        </p>
      ) : stage === "partially-in-force" ? (
        <p className="text-body-sm text-partial">
          Partially binding — obligations arrive on a schedule.
        </p>
      ) : (
        <p className="text-body-sm text-ink-500">
          {STAGE_LABEL[stage]} — not yet passed, so nothing binds.
        </p>
      )}

      {blocker !== "none" && (
        <p className="text-code text-ink-500">
          <span className="text-ink-700">Blocker · </span>
          {BLOCKER_LABEL[blocker]}
        </p>
      )}

      <p className="text-code text-ink-500">
        <span className="text-ink-700">Expected · </span>
        {expectedCommencement
          ? formatDate(expectedCommencement)
          : (expectedNote ?? "No date announced")}
      </p>
    </div>
  );
}

/** Reads more usefully than a raw day count once a law has been inert a while. */
function formatElapsed(days: number): string {
  if (days < 60) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months < 24) return `${months} months`;
  return `${(days / 365).toFixed(1)} years`;
}
