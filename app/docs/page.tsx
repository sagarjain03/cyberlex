import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Counter } from "@/components/docs/counter";
import { CoverageGrid } from "@/components/docs/coverage-grid";
import { DocsHero, type HeroStat } from "@/components/docs/docs-hero";
import { JourneyFlow } from "@/components/docs/journey-flow";
import { ModuleTour } from "@/components/docs/module-tour";
import {
  PipelineChart,
  type PipelineDatum,
} from "@/components/docs/pipeline-chart";
import { ReadingRail } from "@/components/docs/reading-rail";
import { Reveal } from "@/components/docs/reveal";
import {
  StrictnessChart,
  type StrictnessDatum,
} from "@/components/docs/strictness-chart";
import { TraceLine } from "@/components/docs/trace-line";
import { WeightScale } from "@/components/docs/weight-scale";
import { ScoreRule } from "@/components/shared/score-rule";
import { Disclaimer } from "@/components/ui/disclaimer";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "@/lib/ai/config";
import {
  DOC_ABSENCE_TERMS,
  DOC_COMMENCEMENT_STEPS,
  DOC_COVERAGE_TERMS,
  DOC_LEGAL_STATUS_TERMS,
  DOC_TASKS,
  type DocTerm,
} from "@/lib/constants/docs";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/lib/constants/nav";
import {
  QUERY_MAX_LENGTH,
  QUERY_MIN_LENGTH,
  STALENESS_THRESHOLD_DAYS,
  STRICTNESS_BANDS,
} from "@/lib/constants/thresholds";
import {
  getCoverageMatrix,
  getDirectoryStats,
  getDraftsByStage,
  getJurisdictions,
} from "@/lib/data";
import { METHODOLOGY_LIMITATIONS } from "@/lib/scoring/weights";
import { STAGE_LABEL } from "@/types";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How to use CyberLex Global: what each module answers, what every status word means, how the strictness score is built, and where the product stops being reliable.",
};

/** Status dot colours. Mirrors the console legend. docs/design.md §1.3. */
const DOT: Record<string, string> = {
  live: "bg-live",
  partial: "bg-partial",
  pending: "bg-pending",
  draft: "bg-draft",
  critical: "bg-critical",
  synthetic: "bg-synthetic",
  null: "bg-null",
};

export default async function Page() {
  const [stats, stages, jurisdictions, matrix] = await Promise.all([
    getDirectoryStats(),
    getDraftsByStage(),
    getJurisdictions(),
    getCoverageMatrix(),
  ]);

  // Every figure on this page is computed from the same records the modules
  // render, so the manual can never describe a product that has moved on.
  const pipeline: PipelineDatum[] = stages.map((bucket) => ({
    stage: bucket.stage,
    label: STAGE_LABEL[bucket.stage],
    count: bucket.entries.length,
    isGap: bucket.stage === "awaiting-notification",
  }));

  const distribution: StrictnessDatum[] = jurisdictions.map((j) => ({
    code: j.code,
    shortName: j.shortName,
    score: j.score,
  }));

  const heroStats: HeroStat[] = [
    { label: "Jurisdictions", value: stats.jurisdictions },
    { label: "In force", value: stats.inForce },
    { label: "Passed, not in force", value: stats.unnotified },
    { label: "AI techniques", value: stats.aiCrimeTechniques },
    { label: "Coverage gaps", value: stats.coverageGaps },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
      <ReadingRail />

      <DocsHero stats={heroStats} />

      {/* ── 01 · Premise ─────────────────────────────────────────────────── */}
      <DocSection
        id="premise"
        index="01"
        label="The premise"
        title={
          <>
            A law can exist
            <span className="font-serif italic text-ink-500"> and bind </span>
            no one.
          </>
        }
      >
        <Reveal className="measure space-y-4 text-body text-ink-300">
          <p>
            Most trackers report the date a law passed. That date tells you less
            than it appears to. Between a legislature voting and an obligation
            attaching to you there is a second act — notification, gazettal,
            commencement — which can take years, arrive in pieces, or never
            happen at all. In the meantime the statute is real, quotable, and
            enforceable against nobody.
          </p>
          <p>
            This product is built around that gap. Every instrument carries the
            state it is actually in rather than the date it was voted through,
            and where something has passed without commencing, the tracker names
            the specific reason it is still inert.
          </p>
        </Reveal>

        <div className="mt-12">
          <TraceLine className="mb-px" />
          <Reveal stagger={0.14} className="grid sm:grid-cols-3">
            {DOC_COMMENCEMENT_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="border-t border-rule py-5 pr-6 sm:border-t-0"
              >
                <div className="flex items-center gap-2">
                  <span className={`size-1 ${DOT[step.token]}`} />
                  <span className="text-micro text-ink-500">
                    Stage {i + 1} · {step.label}
                  </span>
                </div>
                <p className="mt-3 text-body-sm text-ink-300">{step.note}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="mt-10 border-l border-pending/40 bg-pending/[0.04] py-4 pl-5 pr-4">
          <p className="measure text-body text-ink-300">
            <span className="text-data-lg text-bone">
              <Counter value={stats.unnotified} />
            </span>{" "}
            of the{" "}
            <span className="text-data text-ink-100">{stats.jurisdictions}</span>{" "}
            tracked headline instruments are in exactly that state today, and{" "}
            <span className="text-data text-ink-100">
              {stats.partiallyInForce}
            </span>{" "}
            are live in part only. If you plan against the year in the headline,
            you will plan against the wrong date in both directions — too early
            for what has not commenced, too late for the phases that already
            have.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h3 className="text-h3 text-ink-100">
            Where the tracked instruments actually sit
          </h3>
          <p className="measure mt-3 text-body-sm text-ink-500">
            The tracker&rsquo;s pipeline, by stage rather than by size — the
            order is the information. The highlighted stage is the one this
            product was built to make visible: voted through, and still binding
            no one.
          </p>
          <div className="mt-8">
            <PipelineChart data={pipeline} />
          </div>
        </Reveal>
      </DocSection>

      {/* ── 02 · The map ─────────────────────────────────────────────────── */}
      <DocSection
        id="map"
        index="02"
        label="How it fits together"
        title={
          <>
            Five ways in.
            <span className="font-serif italic text-ink-500"> One </span>
            way out.
          </>
        }
        lede="Whichever module you enter through, the path is the same shape: narrow the question, land on a record, finish at the source it cites."
      >
        <JourneyFlow />
      </DocSection>

      {/* ── 03 · Modules ─────────────────────────────────────────────────── */}
      <DocSection
        id="modules"
        index="03"
        label="The five modules"
        title={
          <>
            Five surfaces, five
            <span className="font-serif italic text-ink-500"> questions. </span>
          </>
        }
        lede="Each module exists to answer one question well. Knowing which question you are asking is most of the work of using this."
      >
        <ModuleTour />
      </DocSection>

      {/* ── 04 · Vocabulary ──────────────────────────────────────────────── */}
      <DocSection
        id="vocabulary"
        index="04"
        label="Reading the interface"
        title={
          <>
            Every word here is
            <span className="font-serif italic text-ink-500"> load- </span>
            bearing.
          </>
        }
        lede="The interface uses a small, fixed vocabulary. None of it is decorative, and two words that look similar never mean the same thing."
      >
        <TermTable
          heading="Status of an instrument"
          note="Shown as a coloured dot beside the label. Colour is always doubled by the word — nothing is carried by hue alone."
          terms={DOC_LEGAL_STATUS_TERMS}
        />

        <TermTable
          heading="Statutory coverage of a technique"
          note="Used on the AI Crimes matrix, where the question is whether an existing provision reaches conduct it was not drafted for."
          terms={DOC_COVERAGE_TERMS}
          className="mt-14"
        />

        <Reveal className="mt-10">
          <p className="measure text-body-sm text-ink-500">
            The matrix below is the live one, at a quarter scale. Each mark is
            encoded twice — by colour and by shape — so the verdict survives a
            greyscale print, a colour-blind reader, and a screenshot pasted into
            a deck.
          </p>
        </Reveal>

        {/* Deliberately NOT inside `Reveal`: the grid scrolls sideways in its
            own container, and a transformed ancestor leaks that scrollable
            overflow to the document. It animates itself anyway. */}
        <div className="mt-8">
          <CoverageGrid matrix={matrix} />
        </div>

        <TermTable
          heading="The two kinds of nothing"
          note="The single most important distinction in the product. A blank cell would collapse both into one, so there are no blank cells."
          terms={DOC_ABSENCE_TERMS}
          className="mt-14"
        />

        {/* Score anatomy */}
        <Reveal className="mt-14">
          <h3 className="text-h3 text-ink-100">The strictness rule</h3>
          <p className="measure mt-3 text-body-sm text-ink-500">
            A hairline with a travelling tick, a number, and a band name. It is
            an instrument reading, not a progress bar: 0–100, higher meaning
            stricter as drafted. The band label always renders beside it.
          </p>

          <div className="mt-8 max-w-lg space-y-6">
            {STRICTNESS_BANDS.map((band) => (
              <ScoreRule
                key={band.label}
                score={Math.round((band.min + band.max) / 2)}
              />
            ))}
          </div>
        </Reveal>

        {/* Verification */}
        <Reveal className="mt-14">
          <h3 className="text-h3 text-ink-100">Verification and staleness</h3>
          <div className="measure mt-3 space-y-4 text-body-sm text-ink-500">
            <p>
              Every legal fact carries at least one citation to an official
              publisher and the date it was last checked. Records older than{" "}
              {STALENESS_THRESHOLD_DAYS} days show a re-check affordance, because
              legislative state goes stale first and fastest.
            </p>
            <p>
              The masthead carries a verification count on every page.{" "}
              {stats.needsReview > 0 ? (
                <>
                  It currently reads{" "}
                  <Link
                    href="/methodology#verification"
                    className="text-pending underline decoration-pending/40 underline-offset-4 transition-colors hover:decoration-pending"
                  >
                    {stats.needsReview} unverified
                  </Link>
                  , which means no record here has been checked line-by-line
                  against its cited sources by a person with legal training.
                  Until that count reads zero, nothing on this site is citable.
                </>
              ) : (
                <>
                  It currently reads verified: every record has been checked
                  against its cited primary sources.
                </>
              )}
            </p>
          </div>
        </Reveal>
      </DocSection>

      {/* ── 05 · Strictness model ────────────────────────────────────────── */}
      <DocSection
        id="model"
        index="05"
        label="The strictness model"
        title={
          <>
            A comparative indicator,
            <span className="font-serif italic text-ink-500"> not a </span>
            measurement.
          </>
        }
        lede="Six dimensions, each scored 0–100, combined as a plain weighted mean. Deliberately plain: you should be able to reproduce any score by hand from the weights below."
      >
        <WeightScale />

        <Reveal className="mt-12">
          <h3 className="text-h3 text-ink-100">Bands</h3>
          <dl className="mt-5 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {STRICTNESS_BANDS.map((b) => (
              <div key={b.label} className="border-t border-rule py-4">
                <dt className="text-h3 text-ink-100">{b.label}</dt>
                <dd className="mt-1 text-data text-ink-500">
                  {b.min}–{b.max}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-16">
          <h3 className="text-h3 text-ink-100">Every tracked regime, scored</h3>
          <p className="measure mt-3 text-body-sm text-ink-500">
            The same model applied to all {distribution.length} jurisdictions,
            ranked. Read the numbers, not the lengths: the band hues are close
            enough under colour-blind rendering that they are reinforcement
            only, which is why every row carries its score and its band in
            words.
          </p>
          <div className="mt-12">
            <StrictnessChart data={distribution} median={stats.medianStrictness} />
          </div>
        </Reveal>

        <Reveal className="measure mt-12 space-y-4 text-body text-ink-300">
          <p>
            A higher score means a stricter regime as drafted. It does not mean a
            better, safer, or more effective one — and it says nothing about how
            any particular sector is actually policed.
          </p>
          <p>
            The full table, including the evidentiary basis for each dimension
            and the arguments against it, is published at{" "}
            <Link
              href="/methodology"
              className="text-ink-100 underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-bone"
            >
              Methodology
            </Link>
            . It is published so it can be argued with.
          </p>
        </Reveal>
      </DocSection>

      {/* ── 06 · Assistant ───────────────────────────────────────────────── */}
      <DocSection
        id="assistant"
        index="06"
        label="The assistant"
        title={
          <>
            The one surface
            <span className="font-serif italic text-ink-500"> no human </span>
            wrote.
          </>
        }
        lede="Plain-English questions in, one structured answer out. Useful for orientation, never for citation."
      >
        <Reveal stagger={0.1} className="grid gap-px lg:grid-cols-3">
          <FactCard
            label="How to ask"
            body={`One specific question, between ${QUERY_MIN_LENGTH} and ${QUERY_MAX_LENGTH} characters. The bounds are enforced in the browser and again on the server, so a crafted request cannot slip past them.`}
          />
          <FactCard
            label="What comes back"
            body="A fixed shape — overview, sanctions, compliance takeaways — validated against a schema before it renders. Malformed output is repaired once, then surfaced as a designed error rather than rendered as legal information."
          />
          <FactCard
            label="What it will not do"
            body="It will not invent a provision to fill a gap, and it is built to say it does not know. Treat that as the answer, not as a failure."
          />
        </Reveal>

        <Reveal className="measure mt-10 space-y-4 text-body text-ink-300">
          <p>
            The provider key never reaches the browser: questions go to a route
            handler on the server, which is also where the throttle lives —{" "}
            {RATE_LIMIT_MAX} requests per{" "}
            {Math.round(RATE_LIMIT_WINDOW_MS / 1000)} seconds per address, a
            rough brake on abuse rather than a security control.
          </p>
          <p>
            If the assistant is not configured on the deployment you are looking
            at, the console says so plainly instead of pretending to think.
          </p>
        </Reveal>

        <Reveal className="mt-8">
          <Disclaimer variant="block" className="max-w-3xl" />
        </Reveal>
      </DocSection>

      {/* ── 07 · Common tasks ────────────────────────────────────────────── */}
      <DocSection
        id="tasks"
        index="07"
        label="Common tasks"
        title={
          <>
            If this is your
            <span className="font-serif italic text-ink-500"> question, </span>
            start here.
          </>
        }
      >
        <Reveal stagger={0.07} className="max-w-4xl">
          {DOC_TASKS.map((t) => (
            <Link
              key={t.task}
              href={t.href}
              className="row-mark group flex gap-5 border-t border-rule py-5 pl-4 transition-colors last:border-b hover:bg-abyss"
            >
              <span className="flex-1">
                <span className="block text-body text-ink-100">{t.task}</span>
                <span className="mt-2 block text-body-sm text-ink-500">
                  {t.path}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 self-start pt-1">
                <span className="text-micro text-ink-500 transition-colors group-hover:text-bone">
                  {t.route}
                </span>
                <ArrowUpRight
                  className="size-3 text-ink-700 transition-colors group-hover:text-bone"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </Reveal>
      </DocSection>

      {/* ── 08 · Limits ──────────────────────────────────────────────────── */}
      <DocSection
        id="limits"
        index="08"
        label="Limits"
        title={
          <>
            Where this
            <span className="font-serif italic text-ink-500"> stops </span>
            being reliable.
          </>
        }
        lede="Published in the product rather than buried in a policy page, because a limit you have to go looking for is not a disclosure."
      >
        <Reveal stagger={0.08}>
          {METHODOLOGY_LIMITATIONS.map((l) => (
            <p
              key={l}
              className="max-w-3xl border-t border-rule py-4 text-body text-ink-300 last:border-b"
            >
              {l}
            </p>
          ))}
        </Reveal>

        <Reveal className="measure mt-10 space-y-4 text-body text-ink-300">
          <p>
            Two further limits worth stating here: sub-national law is out of
            scope for v1, so US state statutes, EU Member State transposition and
            Indian state rules are not reflected in any score; and every figure
            describes the law as drafted, not as enforced against your sector on
            your facts.
          </p>
          <p>
            Nothing on this site is legal advice. It is an orientation tool that
            tells you what to go and read, and who to ask.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <Disclaimer variant="block" className="max-w-3xl" />
        </Reveal>
      </DocSection>

      {/* ── Onward ───────────────────────────────────────────────────────── */}
      <section className="border-t border-rule py-14 lg:py-20">
        <p className="text-micro text-ink-500">Start working</p>
        <Reveal stagger={0.06} className="mt-6 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {[...PRIMARY_NAV, ...SECONDARY_NAV]
            .filter((item) => item.href !== "/docs")
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="row-mark group flex items-center gap-3 border-t border-rule py-5 pl-4 transition-colors hover:bg-abyss"
                >
                  <Icon
                    className="size-4 text-ink-500 transition-colors group-hover:text-bone"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-h3 text-ink-100">
                    {item.label}
                  </span>
                  <ArrowUpRight
                    className="size-3 text-ink-700 transition-colors group-hover:text-bone"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
        </Reveal>
      </section>

      <footer className="border-t border-rule py-8">
        <Disclaimer />
      </footer>
    </div>
  );
}

/* ── Local building blocks ───────────────────────────────────────────────── */

/**
 * A numbered chapter. The index is part of the section head rather than the
 * heading text, so screen readers get a clean outline.
 */
function DocSection({
  id,
  index,
  label,
  title,
  lede,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-rule py-14 lg:py-24">
      <Reveal className="flex items-baseline gap-4">
        <span className="text-code text-ink-700">{index}</span>
        <span className="text-micro text-ink-500">{label}</span>
      </Reveal>

      <Reveal>
        <h2 className="mt-6 max-w-3xl text-display-sm text-bone">{title}</h2>
      </Reveal>

      {lede && (
        <Reveal>
          <p className="measure mt-6 text-body text-ink-300">{lede}</p>
        </Reveal>
      )}

      <div className="mt-10 lg:mt-14">{children}</div>
    </section>
  );
}

/** Vocabulary block: dot, term, definition. */
function TermTable({
  heading,
  note,
  terms,
  className,
}: {
  heading: string;
  note: string;
  terms: readonly DocTerm[];
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <h3 className="text-h3 text-ink-100">{heading}</h3>
      <p className="measure mt-3 text-body-sm text-ink-500">{note}</p>

      <dl className="mt-6 max-w-3xl">
        {terms.map((t) => (
          <div
            key={t.term}
            className="flex flex-col gap-2 border-t border-rule py-4 last:border-b sm:flex-row sm:gap-6"
          >
            <dt className="flex shrink-0 items-center gap-2 sm:w-52">
              <span className={`size-1 shrink-0 ${DOT[t.token]}`} />
              <span className="text-body-sm text-ink-100">{t.term}</span>
            </dt>
            <dd className="text-body-sm text-ink-500">{t.meaning}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/** One-fact panel used across the assistant section. */
function FactCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="border-t border-rule py-5 pr-6">
      <p className="text-micro text-ink-500">{label}</p>
      <p className="mt-3 text-body-sm text-ink-300">{body}</p>
    </div>
  );
}
