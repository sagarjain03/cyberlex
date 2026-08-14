import { ArrowUpRight } from "lucide-react";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ResolvedSource } from "@/lib/data";

/**
 * Primary source citations.
 *
 * Rendered as an ordered list of hairline rows — this is the product's
 * credibility surface, so it gets real estate rather than a collapsed
 * "sources" disclosure. docs/rules.md §2.6.
 */
export function SourceList({
  sources,
  className,
}: {
  sources: ResolvedSource[];
  className?: string;
}) {
  if (sources.length === 0) {
    return (
      <p className={cn("text-code text-critical", className)}>
        No primary source cited — this record should not be relied on.
      </p>
    );
  }

  return (
    <ol className={cn("space-y-px", className)}>
      {sources.map((s) => (
        <li key={`${s.id}-${s.pinpoint ?? ""}`}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
            className="row-mark group flex items-start gap-3 border-t border-rule py-3 pl-3 transition-colors hover:bg-abyss"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-body-sm text-ink-100 group-hover:text-bone">
                {s.title}
                {s.pinpoint && (
                  <span className="text-code text-ink-500"> · {s.pinpoint}</span>
                )}
              </span>
              <span className="mt-0.5 block text-code text-ink-700">
                {s.publisher} · retrieved {formatDate(s.retrieved)}
              </span>
            </span>
            <ArrowUpRight
              className="mt-0.5 size-3.5 shrink-0 text-ink-700 transition-colors group-hover:text-bone"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
