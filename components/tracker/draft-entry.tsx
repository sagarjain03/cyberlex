import { CommencementStatus } from "@/components/tracker/commencement-status";
import { PhaseSchedule } from "@/components/tracker/phase-schedule";
import { LastVerified } from "@/components/shared/last-verified";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { IMPACT_LABEL } from "@/types";
import type { DeveloperImpact } from "@/types";
import type { DraftWithJurisdiction } from "@/lib/data";

const IMPACT_STYLE: Record<DeveloperImpact, { dot: string; text: string }> = {
  material: { dot: "bg-draft", text: "text-draft" },
  low: { dot: "bg-pending", text: "text-pending" },
  none: { dot: "bg-null", text: "text-null" },
};

/**
 * One tracked instrument. A hairline row, not a card — the design system has
 * no boxes, and a list of thirteen cards would read as a feed rather than a
 * register.
 */
export function DraftEntry({ entry }: { entry: DraftWithJurisdiction }) {
  const impact = IMPACT_STYLE[entry.developerImpact];

  return (
    <article className="border-t border-rule py-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-code text-ink-700">{entry.jurisdictionCode}</span>
        <h3 className="text-h3 text-ink-100">{entry.shortTitle}</h3>
      </div>

      <p className="mt-1 text-code text-ink-700">{entry.title}</p>

      <div className="mt-6 grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          <div>
            <p className="text-micro text-ink-700">What changes</p>
            <p className="measure mt-2 text-body-sm text-ink-300">
              {entry.whatChanges}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-2 text-micro text-ink-700">
              <span
                className={cn("size-1 shrink-0", impact.dot)}
                aria-hidden="true"
              />
              Engineering impact
              <span className={impact.text}>
                {IMPACT_LABEL[entry.developerImpact]}
              </span>
            </p>
            <p className="measure mt-2 text-body-sm text-ink-500">
              {entry.impactNote}
            </p>
          </div>

          {entry.phases && <PhaseSchedule phases={entry.phases} />}
        </div>

        <div className="space-y-5 lg:border-l lg:border-rule lg:pl-8">
          <CommencementStatus
            stage={entry.stage}
            datePassed={entry.datePassed}
            blocker={entry.blocker}
            expectedCommencement={entry.expectedCommencement}
            expectedNote={entry.expectedCommencementNote}
          />

          <dl className="space-y-2">
            <div className="flex items-baseline gap-2">
              <dt className="text-micro text-ink-700">Sponsor</dt>
              <dd className="text-code text-ink-500">{entry.sponsor}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-micro text-ink-700">Last action</dt>
              <dd className="text-code text-ink-500">
                {formatDate(entry.lastAction)}
              </dd>
            </div>
          </dl>

          <p className="measure text-code text-ink-700">
            {entry.lastActionNote}
          </p>

          <LastVerified date={entry.lastVerified} status={entry.verification} />
        </div>
      </div>
    </article>
  );
}
