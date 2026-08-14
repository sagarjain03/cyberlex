import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { DirectoryFilters } from "@/components/dashboard/directory-filters";
import { WorldMap, type MapMarker } from "@/components/map/world-map";
import { ScoreRule } from "@/components/shared/score-rule";
import { StatusBadge } from "@/components/shared/status-badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { EmptyState } from "@/components/ui/states";
import {
  getDirectoryStats,
  getJurisdictions,
  getTrackedGeometryIds,
} from "@/lib/data";
import { padCount } from "@/lib/format";
import { parseFilters, parseSort } from "@/lib/url-state";
import { LEGAL_STATUS_LABEL, LEGAL_STATUS_TOKEN } from "@/types";
import type { LegalStatus } from "@/types";

const DOT: Record<string, string> = {
  live: "bg-live",
  partial: "bg-partial",
  pending: "bg-pending",
  draft: "bg-draft",
  null: "bg-null",
};

const LEGEND: LegalStatus[] = [
  "in-force",
  "partially-in-force",
  "unnotified",
  "draft",
];

export default async function Page(props: PageProps<"/">) {
  const params = await props.searchParams;
  const filters = parseFilters(params);
  const sort = parseSort(params);

  const [jurisdictions, stats, geometry] = await Promise.all([
    getJurisdictions(filters, sort),
    getDirectoryStats(),
    getTrackedGeometryIds(),
  ]);

  // The map mirrors the filtered index — markers and lit landmass both narrow
  // as filters are applied, so the two halves of the console never disagree.
  const visible = new Set(jurisdictions.map((j) => j.code));

  const markers: MapMarker[] = jurisdictions.map((j) => ({
    code: j.code,
    label: j.shortName,
    anchor: j.anchor,
    status: j.primaryLawStatus,
  }));

  const trackedIsoIds = geometry
    .filter((g) => visible.has(g.code))
    .flatMap((g) => g.isoNumeric);

  const readout = [
    { k: "Jurisdictions", v: padCount(stats.jurisdictions) },
    { k: "In force", v: padCount(stats.inForce) },
    { k: "Unnotified", v: padCount(stats.unnotified) },
    { k: "Partial", v: padCount(stats.partiallyInForce) },
    {
      k: "Tightest window",
      v: stats.tightestWindow?.display ?? "—",
      note: stats.tightestWindow?.code,
    },
    { k: "Median strictness", v: String(stats.medianStrictness) },
  ];

  return (
    // The console fills the viewport minus the 56px masthead. Every other page
    // scrolls normally through `PageShell`.
    <div className="flex flex-col lg:h-[calc(100dvh-3.5rem)] lg:overflow-hidden">
      {/* DOM order puts the h1 and map first (correct reading order); the rail
          is pulled to the left edge on desktop with `lg:order-1`. */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* ── Map canvas ─────────────────────────────────────────────────── */}
        <section className="relative min-h-[26rem] flex-1 overflow-hidden lg:order-2 lg:min-h-0">
          {/* Single top light — the only ambient gradient in the system. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(242,239,233,0.05),transparent_70%)]"
          />

          {/* Nudged right and down so the headline sits over open Pacific
              rather than over North America. */}
          <div className="absolute inset-0 flex items-center justify-center px-2 pb-14 pt-40 lg:translate-x-[4%] lg:translate-y-[5%] lg:px-8 lg:pb-16 lg:pt-16">
            <WorldMap
              markers={markers}
              trackedIsoIds={trackedIsoIds}
              className="max-h-full"
            />
          </div>

          {/* Editorial overlay — set against the map, not boxed on top of it. */}
          <div className="pointer-events-none absolute left-5 top-6 max-w-sm lg:left-10 lg:top-12">
            <p className="text-micro text-ink-500">2026 · Global survey</p>
            <h1 className="mt-3 text-display-sm text-bone lg:text-display">
              Passed
              <span className="font-serif italic text-ink-500"> is not </span>
              in force.
            </h1>
            <p className="mt-5 max-w-xs text-body-sm text-ink-300">
              {stats.jurisdictions} jurisdictions, tracked from statute to
              commencement — including the {stats.unnotified} whose headline law
              exists on paper and binds no one yet.
            </p>
          </div>

          <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-x-5 gap-y-2 lg:bottom-6 lg:left-10">
            {LEGEND.map((s) => (
              <span key={s} className="flex items-center gap-2">
                <span className={`size-1 ${DOT[LEGAL_STATUS_TOKEN[s]]}`} />
                <span className="text-code text-ink-500">
                  {LEGAL_STATUS_LABEL[s]}
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* ── Index rail ─────────────────────────────────────────────────── */}
        <aside className="flex shrink-0 flex-col border-t border-rule lg:order-1 lg:w-[27rem] lg:border-r lg:border-t-0">
          <DirectoryFilters resultCount={jurisdictions.length} />

          {jurisdictions.length === 0 ? (
            <EmptyState
              icon={SlidersHorizontal}
              headline="No jurisdictions match"
              body="Nothing in the tracked set satisfies every active filter. Loosen one to see results."
            />
          ) : (
            <ol className="flex-1 lg:overflow-y-auto">
              {jurisdictions.map((j) => (
                <li key={j.code}>
                  <Link
                    href={`/jurisdictions/${j.code.toLowerCase()}`}
                    className="row-mark block border-b border-rule px-5 py-4 transition-colors hover:bg-abyss lg:px-8"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="w-7 shrink-0 text-code text-ink-700">
                        {j.code}
                      </span>
                      <span className="flex-1 truncate text-h3 text-ink-100">
                        {j.name}
                      </span>
                      <StatusBadge
                        status={j.primaryLawStatus}
                        className="shrink-0"
                      />
                    </div>

                    <div className="mt-1 pl-10 text-body-sm text-ink-500">
                      {j.primaryLawTitle}{" "}
                      <span className="text-code text-ink-700">
                        · {j.primaryLawYear}
                      </span>
                    </div>

                    <ScoreRule score={j.score} className="mt-3 pl-10" />
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>

      {/* ── Readout ───────────────────────────────────────────────────────── */}
      <footer className="shrink-0 border-t border-rule">
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {readout.map((r) => (
            <div
              key={r.k}
              className="border-b border-r border-rule px-5 py-4 last:border-r-0 lg:border-b-0 lg:px-8"
            >
              <dt className="text-micro text-ink-700">{r.k}</dt>
              <dd className="mt-2 flex items-baseline gap-2">
                <span className="text-data-lg text-bone">{r.v}</span>
                {r.note && (
                  <span className="text-code text-ink-500">{r.note}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-rule px-5 py-3 lg:px-8">
          <Disclaimer />
        </div>
      </footer>
    </div>
  );
}
