import type { Metadata } from "next";
import { Scale } from "lucide-react";

import { PageShell, Section } from "@/components/layout/page-shell";
import { ComparatorSelector } from "@/components/compare/comparator-selector";
import { ComparisonGrid } from "@/components/compare/comparison-grid";
import { ReportingTimeline } from "@/components/compare/reporting-timeline";
import { RevenueControl } from "@/components/compare/revenue-control";
import { Disclaimer } from "@/components/ui/disclaimer";
import { EmptyState } from "@/components/ui/states";
import {
  getComparisonMatrix,
  getJurisdictions,
  getMetricsByCode,
} from "@/lib/data";
import { MIN_COMPARE_ITEMS } from "@/lib/constants/thresholds";
import { formatCompactUsd } from "@/lib/scoring/normalize";
import { parseCompareCodes, parseRevenue } from "@/lib/url-state";
import type { JurisdictionMetrics } from "@/types";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Compare cyber law strictness across jurisdictions: criminal exposure, corporate fines, breach reporting windows and AI governance.",
};

export default async function Page(props: PageProps<"/compare">) {
  const params = await props.searchParams;

  const jurisdictions = await getJurisdictions({}, "name-asc");
  const codes = parseCompareCodes(
    params,
    jurisdictions.map((j) => j.code),
  );
  const revenue = parseRevenue(params);

  const ready = codes.length >= MIN_COMPARE_ITEMS;

  const [matrix, metrics] = ready
    ? await Promise.all([
        getComparisonMatrix(codes, revenue),
        Promise.all(codes.map((c) => getMetricsByCode(c))).then((m) =>
          m.filter((x): x is JurisdictionMetrics => x !== null),
        ),
      ])
    : [null, []];

  return (
    <PageShell
      eyebrow="Module 02"
      title={
        <>
          Where they
          <span className="font-serif italic text-ink-500"> actually </span>
          diverge.
        </>
      }
      lede="Two or three jurisdictions, side by side. Criminal exposure normalised to years, corporate ceilings normalised against a stated revenue assumption, and reporting clocks on one axis."
    >
      <Section label="Selection">
        <ComparatorSelector jurisdictions={jurisdictions} />
      </Section>

      {!ready || !matrix ? (
        <EmptyState
          icon={Scale}
          headline="Nothing to compare yet"
          body={`Pick at least ${MIN_COMPARE_ITEMS} jurisdictions above. Your selection is held in the URL, so a comparison can be shared or bookmarked.`}
        />
      ) : (
        <>
          <Section label="Comparison">
            <ComparisonGrid matrix={matrix} />
          </Section>

          <Section label="Reporting windows">
            <p className="measure text-body-sm text-ink-500">
              Shortest binding window to first notify a regulator, on a
              logarithmic axis — the tight end is where the differences matter.
            </p>
            <div className="mt-8 max-w-3xl">
              <ReportingTimeline metrics={metrics} names={matrix.names} />
            </div>
          </Section>

          <Section label="Normalisation assumption">
            <p className="measure text-body-sm text-ink-500">
              A flat cap and a percentage of global turnover are not the same
              kind of thing. Changing the revenue below re-computes every
              turnover-based ceiling; the native structure is always shown
              beneath the normalised figure.
            </p>
            <div className="mt-6">
              <RevenueControl current={revenue} />
            </div>
            <p className="mt-4 text-code text-ink-700">
              Currently normalising against {formatCompactUsd(revenue)} annual
              revenue.
            </p>
          </Section>
        </>
      )}

      <Section label="Disclaimer">
        <Disclaimer variant="block" className="max-w-3xl" />
      </Section>
    </PageShell>
  );
}
