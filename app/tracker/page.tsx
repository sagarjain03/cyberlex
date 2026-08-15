import type { Metadata } from "next";
import { FileClock } from "lucide-react";

import { PageShell, Section } from "@/components/layout/page-shell";
import { DraftEntry } from "@/components/tracker/draft-entry";
import { StagePipeline } from "@/components/tracker/stage-pipeline";
import { TrackerFilters } from "@/components/tracker/tracker-filters";
import { Disclaimer } from "@/components/ui/disclaimer";
import { EmptyState } from "@/components/ui/states";
import { getDraftsByStage, getJurisdictions } from "@/lib/data";
import { parseDraftFilters } from "@/lib/url-state";
import { STAGE_LABEL } from "@/types";

export const metadata: Metadata = {
  title: "Tracker",
  description:
    "Laws passed but not yet in force, and bills still under review — the gap between enactment and enforceability.",
};

export default async function Page(props: PageProps<"/tracker">) {
  const params = await props.searchParams;
  const filters = parseDraftFilters(params);

  const [buckets, jurisdictions] = await Promise.all([
    getDraftsByStage(filters),
    getJurisdictions({}, "name-asc"),
  ]);

  // The pipeline always counts against stage-independent filters, so selecting
  // a stage narrows the list without hiding what the other stages contain.
  const pipelineBuckets = await getDraftsByStage({
    jurisdictionCode: filters.jurisdictionCode,
    impact: filters.impact,
  });

  const total = buckets.reduce((n, b) => n + b.entries.length, 0);
  const dormant = pipelineBuckets
    .filter(
      (b) => b.stage === "passed" || b.stage === "awaiting-notification",
    )
    .reduce((n, b) => n + b.entries.length, 0);

  return (
    <PageShell
      eyebrow="Module 03"
      title={
        <>
          Law on paper,
          <span className="font-serif italic text-ink-500"> binding </span>
          no one.
        </>
      }
      lede="A statute can be passed, signed and published and still impose no obligation on anyone — until it is notified, gazetted or commenced. This tracks that gap, and what is holding each instrument in it."
    >
      <Section label="Pipeline">
        <StagePipeline
          buckets={pipelineBuckets.map((b) => ({
            stage: b.stage,
            count: b.entries.length,
          }))}
          active={filters.stage}
        />

        {dormant > 0 && (
          <p className="mt-6 text-body-sm text-pending">
            {dormant} instrument{dormant === 1 ? " has" : "s have"} passed and
            still bind{dormant === 1 ? "s" : ""} no one.
          </p>
        )}
      </Section>

      <Section label="Filters">
        <TrackerFilters
          jurisdictions={jurisdictions.map((j) => ({
            code: j.code,
            shortName: j.shortName,
          }))}
        />
      </Section>

      <Section label={`Register · ${total}`}>
        {total === 0 ? (
          <EmptyState
            icon={FileClock}
            headline="Nothing matches"
            body="No tracked instrument satisfies every active filter. Clear one to widen the register."
          />
        ) : (
          <div className="space-y-16">
            {buckets
              .filter((b) => b.entries.length > 0)
              .map((bucket) => (
                <section key={bucket.stage}>
                  <h3 className="text-micro text-ink-500">
                    {STAGE_LABEL[bucket.stage]}
                    <span className="ml-2 text-ink-700">
                      {bucket.entries.length}
                    </span>
                  </h3>

                  <div className="mt-4">
                    {bucket.entries.map((entry) => (
                      <DraftEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </Section>

      <Section label="Disclaimer">
        <Disclaimer variant="block" className="max-w-3xl" />
      </Section>
    </PageShell>
  );
}
