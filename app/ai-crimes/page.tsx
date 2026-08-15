import type { Metadata } from "next";

import { PageShell, Section } from "@/components/layout/page-shell";
import { CoverageMatrixTable } from "@/components/ai-crimes/coverage-matrix";
import { CrimeList } from "@/components/ai-crimes/crime-list";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getAiCrimes, getCoverageMatrix } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Crimes",
  description:
    "AI-enabled attack techniques mapped to the statutes that apply — and the jurisdictions where none clearly does.",
};

export default async function Page() {
  const [crimes, matrix] = await Promise.all([
    getAiCrimes(),
    getCoverageMatrix(),
  ]);

  const gaps = matrix.rows
    .flatMap((r) => r.cells)
    .filter((c) => c.coverage === "no-coverage").length;

  return (
    <PageShell
      eyebrow="Module 04"
      title={
        <>
          Techniques the statutes
          <span className="font-serif italic text-ink-500"> never </span>
          anticipated.
        </>
      }
      lede="Six classes of AI-enabled attack, mapped against every tracked jurisdiction. Some are covered squarely. Most are reached only by stretching a provision drafted decades earlier. A few are not reached at all."
    >
      <Section label={`Coverage · ${matrix.rows.length} × ${matrix.jurisdictions.length}`}>
        <CoverageMatrixTable matrix={matrix} />
      </Section>

      <Section label="Techniques">
        {gaps > 0 && (
          <p className="measure mb-6 text-body-sm text-critical">
            {gaps} technique–jurisdiction pairs have no provision that
            plausibly applies.
          </p>
        )}
        <CrimeList crimes={crimes} />
      </Section>

      <Section label="Disclaimer">
        <Disclaimer variant="block" className="max-w-3xl" />
      </Section>
    </PageShell>
  );
}
