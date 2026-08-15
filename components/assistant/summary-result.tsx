import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Disclaimer } from "@/components/ui/disclaimer";
import { cn } from "@/lib/utils";
import type { ConfidenceLevel, LegalSummary } from "@/types";

const CONFIDENCE: Record<
  ConfidenceLevel,
  { label: string; tone: string; note: string }
> = {
  high: {
    label: "High confidence",
    tone: "text-live",
    note: "Directly supported by tracked records.",
  },
  medium: {
    label: "Medium confidence",
    tone: "text-pending",
    note: "Partly extrapolated — verify against the primary sources.",
  },
  low: {
    label: "Low confidence",
    tone: "text-critical",
    note: "Largely extrapolated. Treat as a starting point for research, not an answer.",
  },
};

/**
 * The structured AI response.
 *
 * ⚠️ The violet marker and the disclaimer are structural, not decorative: an
 * AI answer must never be mistakable for a curated, sourced record, and it can
 * not be rendered without its "not legal advice" notice. docs/rules.md §4.6.
 */
export function SummaryResult({ data }: { data: LegalSummary }) {
  const confidence = CONFIDENCE[data.confidence];

  return (
    <article className="border-l-2 border-synthetic bg-synthetic/[0.03] py-6 pl-5 pr-4 lg:pl-7">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="flex items-center gap-2 text-micro text-synthetic">
          <Sparkles className="size-3" strokeWidth={1.5} aria-hidden="true" />
          AI-generated
        </p>
        <p className={cn("text-code", confidence.tone)}>{confidence.label}</p>
      </header>

      {data.outOfScope ? (
        <div className="mt-6">
          <h2 className="text-h2 text-ink-100">
            That&rsquo;s outside what CyberLex tracks.
          </h2>
          <p className="measure mt-3 text-body text-ink-300">
            This tool covers cyber law, data protection, AI governance and
            computer crime across ten jurisdictions. Try the{" "}
            <Link href="/" className="text-bone underline underline-offset-4">
              directory
            </Link>{" "}
            or the{" "}
            <Link
              href="/compare"
              className="text-bone underline underline-offset-4"
            >
              comparator
            </Link>{" "}
            for what is covered.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {data.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-micro text-ink-500">{section.heading}</h2>
              {section.heading === "Compliance Takeaways" ? (
                <ul className="mt-4 max-w-3xl">
                  {section.body.map((line, i) => (
                    <li
                      key={i}
                      className="border-t border-rule py-3 text-body-sm text-ink-300 last:border-b"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="measure mt-4 space-y-4">
                  {section.body.map((para, i) => (
                    <p key={i} className="text-body text-ink-300">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <p className={cn("mt-8 text-code", confidence.tone)}>{confidence.note}</p>

      {data.groundedOn.jurisdictions.length > 0 && (
        <div className="mt-6">
          <p className="text-micro text-ink-700">Grounded on</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {data.groundedOn.jurisdictions.map((code) => (
              <Link
                key={code}
                href={`/jurisdictions/${code.toLowerCase()}`}
                className="text-code text-ink-500 underline underline-offset-4 transition-colors hover:text-bone"
              >
                {code}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Disclaimer variant="block" className="mt-8 max-w-3xl" />
    </article>
  );
}
