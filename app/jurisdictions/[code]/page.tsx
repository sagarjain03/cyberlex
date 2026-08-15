import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Scale } from "lucide-react";

import { Section } from "@/components/layout/page-shell";
import { LastVerified } from "@/components/shared/last-verified";
import { ScoreBreakdown } from "@/components/shared/score-breakdown";
import { SourceList } from "@/components/shared/source-list";
import { StatusBadge } from "@/components/shared/status-badge";
import { PhaseSchedule } from "@/components/tracker/phase-schedule";
import { Disclaimer } from "@/components/ui/disclaimer";
import { ActionLink } from "@/components/ui/states";
import {
  getJurisdictionByCode,
  getJurisdictionCodes,
  getMetricsByCode,
} from "@/lib/data";
import { getStrictnessBand } from "@/lib/constants/thresholds";
import { formatDate } from "@/lib/format";
import {
  formatHours,
  formatYears,
  normalizeFine,
} from "@/lib/scoring/normalize";
import { cn } from "@/lib/utils";
import { AI_POSTURE_LABEL, REGION_LABEL, absentLabel, isKnown } from "@/types";
import type { Known } from "@/types";

export async function generateStaticParams() {
  const codes = await getJurisdictionCodes();
  return codes.map((code) => ({ code: code.toLowerCase() }));
}

export async function generateMetadata(
  props: PageProps<"/jurisdictions/[code]">,
): Promise<Metadata> {
  const { code } = await props.params;
  const detail = await getJurisdictionByCode(code);
  if (!detail) return { title: "Not found" };

  const { jurisdiction, primaryLaw, score } = detail;
  return {
    title: jurisdiction.name,
    description: `${jurisdiction.name}: ${primaryLaw.shortTitle} (${primaryLaw.year}), strictness ${score}/100. Penalties, breach reporting windows and AI governance stance, with primary sources.`,
  };
}

const BAND_TEXT: Record<string, string> = {
  emerald: "text-live",
  cyan: "text-partial",
  amber: "text-pending",
  rose: "text-critical",
};

export default async function Page(
  props: PageProps<"/jurisdictions/[code]">,
) {
  const { code } = await props.params;
  const detail = await getJurisdictionByCode(code);
  if (!detail) notFound();

  const metrics = await getMetricsByCode(code);
  const { jurisdiction: j, score, breakdown, primaryLaw, laws, sources } =
    detail;
  const band = getStrictnessBand(score);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-rule pb-10 pt-10 lg:pb-14 lg:pt-16">
        <div className="flex items-baseline gap-3">
          <Link
            href="/"
            className="text-micro text-ink-500 transition-colors hover:text-bone"
          >
            Index
          </Link>
          <span className="text-micro text-ink-700">/</span>
          <span className="text-micro text-ink-500">
            {REGION_LABEL[j.region]}
          </span>
          <span className="text-code text-ink-700">{j.code}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="min-w-0">
            <h1 className="text-display-sm text-bone">{j.name}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <StatusBadge status={primaryLaw.status} tone="strong" />
              <span className="text-body-sm text-ink-500">
                {primaryLaw.shortTitle}
                <span className="text-code text-ink-700">
                  {" "}
                  · {primaryLaw.citation}
                </span>
              </span>
            </p>
          </div>

          {/* Score, set as an instrument reading rather than a badge. */}
          <div className="flex shrink-0 items-baseline gap-4">
            <span className={cn("text-data-xl", BAND_TEXT[band.token])}>
              {score}
            </span>
            <span className="pb-1">
              <span className="block text-micro text-ink-500">{band.label}</span>
              <Link
                href="/methodology"
                className="text-code text-ink-700 transition-colors hover:text-bone"
              >
                How this is scored ↗
              </Link>
            </span>
          </div>
        </div>

        <p className="measure mt-8 text-body text-ink-300">{j.profile}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <LastVerified
            date={j.lastVerified}
            status={j.verification}
            isStale={detail.isStale}
          />
          <ActionLink href={`/compare?a=${j.code}`}>
            <Scale className="size-3" strokeWidth={1.5} aria-hidden="true" />
            Compare
          </ActionLink>
        </div>
      </header>

      <div className="py-10 lg:py-14">
        {/* ── Key figures ─────────────────────────────────────────────────── */}
        <Section label="Key figures">
          <dl className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            <Figure
              label="Initial reporting"
              value={
                metrics
                  ? mapKnown(metrics.reporting, (r) =>
                      formatHours(r.initialHours),
                    )
                  : null
              }
            />
            <Figure
              label="Corporate ceiling"
              value={
                metrics
                  ? mapKnown(
                      metrics.corporateFine,
                      (f) => normalizeFine(f, 100_000_000).nativeDisplay,
                    )
                  : null
              }
            />
            <Figure
              label="Unauthorised access"
              value={
                metrics
                  ? mapKnown(metrics.unauthorizedAccessMaxYears, formatYears)
                  : null
              }
            />
            <Figure label="AI posture" value={AI_POSTURE_LABEL[j.aiPosture]} />
          </dl>
        </Section>

        {/* ── Score breakdown ─────────────────────────────────────────────── */}
        <Section label="Strictness breakdown">
          <p className="measure text-body-sm text-ink-500">
            A comparative indicator, not a measurement. Each dimension is scored
            0–100 against the published rubric, then weighted.
          </p>
          <ScoreBreakdown rows={breakdown} className="mt-6 max-w-3xl" />
        </Section>

        {/* ── Instruments ─────────────────────────────────────────────────── */}
        <Section label={`Tracked instruments · ${laws.length}`}>
          <ul className="max-w-3xl">
            {laws.map((law) => (
              <li key={law.id} className="border-t border-rule py-6 last:border-b">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="text-h3 text-ink-100">
                    {law.shortTitle}
                    {law.isPrimary && (
                      <span className="ml-3 text-micro text-ink-700">
                        Primary
                      </span>
                    )}
                  </h3>
                  <StatusBadge status={law.status} tone="strong" />
                </div>

                <p className="mt-1 text-code text-ink-700">{law.citation}</p>
                <p className="measure mt-3 text-body-sm text-ink-300">
                  {law.summary}
                </p>

                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                  <Meta label="Passed" value={law.datePassed} />
                  <Meta
                    label="In force"
                    value={law.dateInForce}
                    fallback="Not commenced"
                  />
                </dl>

                {law.phases && (
                  <PhaseSchedule phases={law.phases} className="mt-5" />
                )}
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Regulators ──────────────────────────────────────────────────── */}
        <Section label="Regulators">
          <ul className="max-w-3xl">
            {j.regulators.map((r) => (
              <li key={r.name} className="border-t border-rule last:border-b">
                {r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="row-mark group flex items-center justify-between gap-4 py-4 pl-3 transition-colors hover:bg-abyss"
                  >
                    <span className="text-body-sm text-ink-100 group-hover:text-bone">
                      {r.name}
                      {r.abbreviation && (
                        <span className="ml-2 text-code text-ink-700">
                          {r.abbreviation}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-ink-700 transition-colors group-hover:text-bone"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <span className="block py-4 text-body-sm text-ink-100">
                    {r.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Sources ─────────────────────────────────────────────────────── */}
        <Section label="Primary sources">
          <SourceList sources={sources} className="max-w-3xl" />
        </Section>

        <Section label="Disclaimer">
          <Disclaimer variant="block" className="max-w-3xl" />
        </Section>
      </div>
    </div>
  );
}

/** Renders a `Known<T>` as a figure, keeping the reason for absence visible. */
function mapKnown<T>(k: Known<T>, fn: (v: T) => string): string | null {
  return isKnown(k) ? fn(k.value) : absentLabel(k);
}

function Figure({ label, value }: { label: string; value: string | null }) {
  const absent =
    value === "No specific provision" || value === "Not yet researched";

  // Fine structures ("2% of turnover or €10M, whichever is higher") are
  // sentences, not readings — at `data-lg` they overflow the cell and collide
  // with the next column.
  const isPhrase = (value?.length ?? 0) > 18;

  return (
    <div className="border-t border-rule py-4">
      <dt className="text-micro text-ink-700">{label}</dt>
      <dd
        className={cn(
          "mt-2",
          absent
            ? "text-body-sm text-null"
            : isPhrase
              ? "text-body-sm text-ink-100"
              : "text-data-lg text-bone",
        )}
      >
        {value ?? "Not yet researched"}
      </dd>
    </div>
  );
}

function Meta({
  label,
  value,
  fallback = "—",
}: {
  label: string;
  value: string | null;
  fallback?: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-micro text-ink-700">{label}</dt>
      <dd
        className={cn("text-code", value ? "text-ink-300" : "text-pending")}
      >
        {value ? formatDate(value) : fallback}
      </dd>
    </div>
  );
}

