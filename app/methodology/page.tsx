import type { Metadata } from "next";

import { PageShell, Section } from "@/components/layout/page-shell";
import { SourceList } from "@/components/shared/source-list";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getDirectoryStats, getSources } from "@/lib/data";
import { DIMENSIONS, METHODOLOGY_LIMITATIONS } from "@/lib/scoring/weights";
import { STALENESS_THRESHOLD_DAYS } from "@/lib/constants/thresholds";
import { STRICTNESS_BANDS } from "@/lib/constants/thresholds";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How CyberLex scores jurisdictional strictness, how records are sourced and verified, and the limits of both.",
};

export default async function Page() {
  const [stats, sources] = await Promise.all([
    getDirectoryStats(),
    getSources(),
  ]);

  return (
    <PageShell
      eyebrow="Methodology"
      title={
        <>
          How this is
          <span className="font-serif italic text-ink-500"> built </span>
          and where it fails.
        </>
      }
      lede="The strictness score is a comparative indicator, not a measurement. Everything behind it — the dimensions, the weights, the sourcing rules and the known limits — is published here so it can be argued with."
    >
      {/* ── Verification ──────────────────────────────────────────────────── */}
      <Section label="Verification status">
        <div id="verification" className="scroll-mt-20">
          {stats.needsReview > 0 ? (
            <div className="border-l border-pending/40 bg-pending/[0.04] py-4 pl-5 pr-4">
              <p className="text-micro text-pending">
                {stats.needsReview} records pending verification
              </p>
              <p className="measure mt-3 text-body text-ink-300">
                Every record currently in this product was authored from
                secondary knowledge and structural understanding of each regime.
                It has <strong className="text-ink-100">not</strong> been
                checked line-by-line against the cited primary sources by a
                person with legal training.
              </p>
              <p className="measure mt-3 text-body text-ink-300">
                Until that count reads zero, nothing here is citable and this
                product should not be treated as authoritative. The count is
                shown in the masthead on every page for that reason.
              </p>
            </div>
          ) : (
            <p className="measure text-body text-ink-300">
              All records have been checked against their cited primary sources.
            </p>
          )}
        </div>
      </Section>

      {/* ── Scoring model ─────────────────────────────────────────────────── */}
      <Section label="Strictness model">
        <p className="measure text-body text-ink-300">
          Six dimensions, each scored 0–100, combined as a plain weighted mean.
          Deliberately plain: the model must be reproducible by hand from this
          table. A higher score means a stricter regime — not a better, safer or
          more effective one.
        </p>

        <dl className="mt-8">
          {DIMENSIONS.map((d) => (
            <div key={d.key} className="border-t border-rule py-6">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-h3 text-ink-100">{d.label}</dt>
                <span className="shrink-0 text-data text-bone">
                  ×{d.weight.toFixed(2)}
                </span>
              </div>
              <dd className="mt-3 space-y-3">
                <p className="measure text-body-sm text-ink-300">
                  {d.definition}
                </p>
                <p className="measure text-body-sm text-ink-500">
                  <span className="text-micro text-ink-700">Basis · </span>
                  {d.basis}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Bands ─────────────────────────────────────────────────────────── */}
      <Section label="Bands">
        <dl className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {STRICTNESS_BANDS.map((b) => (
            <div key={b.label} className="border-t border-rule py-4">
              <dt className="text-h3 text-ink-100">{b.label}</dt>
              <dd className="mt-1 text-data text-ink-500">
                {b.min}–{b.max}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Limitations ───────────────────────────────────────────────────── */}
      <Section label="Known limitations">
        <ul className="max-w-3xl">
          {METHODOLOGY_LIMITATIONS.map((l) => (
            <li
              key={l}
              className="border-t border-rule py-4 text-body text-ink-300 last:border-b"
            >
              {l}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Sourcing ──────────────────────────────────────────────────────── */}
      <Section label="Sourcing rules">
        <div className="measure space-y-4 text-body text-ink-300">
          <p>
            Every legal fact carries at least one citation to an official
            publisher and the date it was last checked. News articles, blog
            posts and law-firm summaries are useful for finding a source; they
            are never the source.
          </p>
          <p>
            Where a figure could not be established with confidence it is marked{" "}
            <span className="text-ink-100">not researched</span> rather than
            estimated. That is distinct from{" "}
            <span className="text-ink-100">no provision</span>, which asserts
            the jurisdiction genuinely has no such rule. The two are rendered
            differently throughout, because conflating them would claim research
            that was never done.
          </p>
          <p>
            Records older than {STALENESS_THRESHOLD_DAYS} days show a
            re-check affordance. Legislative state moves fastest and goes stale
            first.
          </p>
        </div>
      </Section>

      {/* ── Sources ───────────────────────────────────────────────────────── */}
      <Section label={`Source register · ${sources.length}`}>
        <SourceList sources={sources} className="max-w-3xl" />
      </Section>

      <Section label="Disclaimer">
        <Disclaimer variant="block" className="max-w-3xl" />
      </Section>
    </PageShell>
  );
}
