import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/page-shell";
import { StatuteMapping } from "@/components/ai-crimes/statute-mapping";
import { TechnicalProfile } from "@/components/ai-crimes/technical-profile";
import { LastVerified } from "@/components/shared/last-verified";
import {
  PrevalenceLabel,
  SeverityBadge,
} from "@/components/shared/severity-badge";
import { SourceList } from "@/components/shared/source-list";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getAiCrimeBySlug, getAiCrimeSlugs } from "@/lib/data";

/** Fixed technique set — see the note in app/jurisdictions/[code]/page.tsx. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAiCrimeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/ai-crimes/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const crime = await getAiCrimeBySlug(slug);
  if (!crime) return { title: "Not found" };

  return {
    title: crime.name,
    description: `${crime.summary} Statutory coverage across ten jurisdictions, with sources.`,
  };
}

export default async function Page(props: PageProps<"/ai-crimes/[slug]">) {
  const { slug } = await props.params;
  const crime = await getAiCrimeBySlug(slug);
  if (!crime) notFound();

  const direct = crime.mappings.filter((m) => m.coverage === "direct").length;
  const analogical = crime.mappings.filter(
    (m) => m.coverage === "analogical",
  ).length;
  const gaps = crime.mappings.filter(
    (m) => m.coverage === "no-coverage",
  ).length;
  const unresearched = crime.mappings.filter(
    (m) => m.coverage === "not-researched",
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
      <header className="border-b border-rule pb-10 pt-10 lg:pb-14 lg:pt-16">
        <div className="flex items-baseline gap-3">
          <Link
            href="/ai-crimes"
            className="text-micro text-ink-500 transition-colors hover:text-bone"
          >
            AI crimes
          </Link>
          <span className="text-micro text-ink-700">/</span>
          <span className="text-micro text-ink-500">Technique</span>
        </div>

        <h1 className="mt-4 text-display-sm text-bone">{crime.name}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <SeverityBadge severity={crime.severity} />
          <PrevalenceLabel prevalence={crime.prevalence} />
        </div>

        <p className="measure mt-8 text-body text-ink-300">{crime.summary}</p>

        <LastVerified
          date={crime.lastVerified}
          status={crime.verification}
          className="mt-6"
        />
      </header>

      <div className="py-10 lg:py-14">
        <Section label="Coverage across tracked jurisdictions">
          <dl className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            <Tally label="Direct" value={direct} tone="text-live" />
            <Tally label="Analogical" value={analogical} tone="text-pending" />
            <Tally
              label="No clear coverage"
              value={gaps}
              tone={gaps > 0 ? "text-critical" : "text-ink-500"}
            />
            <Tally
              label="Not researched"
              value={unresearched}
              tone="text-null"
            />
          </dl>

          {gaps > 0 && (
            <p className="measure mt-6 text-body-sm text-ink-300">
              In {gaps} of the ten tracked jurisdictions, no provision was
              identified that plausibly reaches this technique. That is a
              finding, not an omission — the reasoning is set out per
              jurisdiction below.
            </p>
          )}
        </Section>

        <Section label="Technical profile">
          <TechnicalProfile profile={crime.technicalProfile} />
        </Section>

        <Section label="Statutory mapping">
          <StatuteMapping mappings={crime.mappings} />
        </Section>

        <Section label="Primary sources">
          <SourceList sources={crime.resolvedSources} className="max-w-3xl" />
        </Section>

        <Section label="Disclaimer">
          <Disclaimer variant="block" className="max-w-3xl" />
        </Section>
      </div>
    </div>
  );
}

function Tally({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="border-t border-rule py-4">
      <dt className="text-micro text-ink-700">{label}</dt>
      {/* A zero is never coloured. "Direct 0" in green reads as reassurance,
          when zero direct coverage is precisely the finding. */}
      <dd className={`mt-2 text-data-lg ${value === 0 ? "text-ink-700" : tone}`}>
        {value}
      </dd>
    </div>
  );
}
