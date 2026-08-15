import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  PrevalenceLabel,
  SeverityBadge,
} from "@/components/shared/severity-badge";
import type { AiCrimeSummary } from "@/lib/data";

/**
 * The technique taxonomy. Hairline rows rather than cards, and the gap count
 * is surfaced on every row — where a technique has no clear statutory home is
 * the most useful thing this module knows.
 */
export function CrimeList({ crimes }: { crimes: AiCrimeSummary[] }) {
  return (
    <ul>
      {crimes.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/ai-crimes/${c.slug}`}
            className="row-mark group block border-t border-rule py-6 pl-4 transition-colors last:border-b hover:bg-abyss"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="text-h3 text-ink-100 group-hover:text-bone">
                {c.name}
              </h3>
              <div className="flex shrink-0 items-center gap-4">
                <SeverityBadge severity={c.severity} />
                <PrevalenceLabel prevalence={c.prevalence} />
                <ArrowUpRight
                  className="size-3.5 text-ink-700 transition-colors group-hover:text-bone"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>

            <p className="measure mt-3 text-body-sm text-ink-500">
              {c.summary}
            </p>

            <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-code">
              <span className="text-ink-700">
                <span className="text-live">{c.directCount}</span> direct
              </span>
              <span className="text-ink-700">
                <span className={c.gapCount > 0 ? "text-critical" : "text-ink-500"}>
                  {c.gapCount}
                </span>{" "}
                with no clear coverage
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
