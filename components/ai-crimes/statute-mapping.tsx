import { CoverageCell } from "@/components/shared/coverage-cell";
import { SourceList } from "@/components/shared/source-list";
import { cn } from "@/lib/utils";
import type { MappingWithJurisdiction } from "@/lib/data";

/**
 * Per-jurisdiction statutory mapping.
 *
 * The `rationale` is the substance, not the statute name: an `analogical`
 * mapping asserts that a provision drafted before the technique existed can be
 * stretched to reach it, which is an argument. Several rationales say where
 * that argument strains — that is the interesting content and it is rendered
 * at full weight, not hidden. data/README.md §4.
 */
export function StatuteMapping({
  mappings,
}: {
  mappings: MappingWithJurisdiction[];
}) {
  return (
    <ul>
      {mappings.map((m) => {
        const uncovered =
          m.coverage === "no-coverage" || m.coverage === "not-researched";

        return (
          <li
            key={m.jurisdictionCode}
            className="border-t border-rule py-6 last:border-b"
          >
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-code text-ink-700">
                    {m.jurisdictionCode}
                  </span>
                  <span className="text-h3 text-ink-100">
                    {m.jurisdictionShortName}
                  </span>
                </div>
                <CoverageCell
                  coverage={m.coverage}
                  showLabel
                  className="mt-3"
                />
              </div>

              <div className="min-w-0">
                {m.statute ? (
                  <p className="text-body-sm text-ink-100">
                    {m.statute}
                    {m.section && (
                      <span className="text-code text-ink-500"> · {m.section}</span>
                    )}
                  </p>
                ) : (
                  <p
                    className={cn(
                      "text-body-sm",
                      m.coverage === "no-coverage"
                        ? "text-critical"
                        : "text-null",
                    )}
                  >
                    {m.coverage === "no-coverage"
                      ? "No provision identified that plausibly reaches this technique."
                      : "Not established — this pair has not been researched."}
                  </p>
                )}

                <p className={cn("measure text-body-sm text-ink-300", uncovered ? "mt-2" : "mt-3")}>
                  {m.rationale}
                </p>

                {m.penaltyNote && (
                  <p className="measure mt-2 text-code text-ink-500">
                    {m.penaltyNote}
                  </p>
                )}

                {m.resolvedSources.length > 0 && (
                  <SourceList
                    sources={m.resolvedSources}
                    className="mt-4 max-w-2xl"
                  />
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
