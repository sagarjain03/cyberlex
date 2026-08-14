"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { COVERAGE_LABEL } from "@/types";
import type { ComparisonCell, ComparisonMatrix } from "@/types";

/**
 * The side-by-side comparison.
 *
 * A real `<table>` with `<th scope>` — this is tabular data and a grid of divs
 * would be unusable with a screen reader. The row-label column is
 * `position: sticky` with an opaque background so data scrolls beneath it on
 * narrow viewports; columns are never hidden or squashed. docs/prd.md M2-7.
 *
 * Client-side only because of the divergence toggle, which is a view
 * preference rather than shareable state and so stays out of the URL.
 * docs/rules.md §2.4.
 */
export function ComparisonGrid({ matrix }: { matrix: ComparisonMatrix }) {
  const [onlyDivergent, setOnlyDivergent] = useState(false);
  const cols = matrix.codes.length;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 pb-4">
        <p className="text-micro text-ink-500">
          {cols} jurisdictions ·{" "}
          {matrix.sections.reduce((n, s) => n + s.rows.length, 0)} metrics
        </p>

        <button
          type="button"
          onClick={() => setOnlyDivergent((v) => !v)}
          aria-pressed={onlyDivergent}
          className={cn(
            "text-code transition-colors",
            onlyDivergent
              ? "text-bone underline decoration-bone/40 underline-offset-4"
              : "text-ink-500 hover:text-bone",
          )}
        >
          Highlight divergence
        </button>
      </div>

      <div className="relative">
        {/* Edge fades signal that the region scrolls. Mobile only — at `lg`
            the whole table fits. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-void to-transparent lg:hidden"
        />

        {/* No horizontal padding on the scroller: `sticky left-0` anchors to
            the padding edge, so a `px-5` gutter left a 20px strip in which
            scrolled content stayed visible beside the pinned column. The
            page inset lives on the cells instead. */}
        <div className="-mx-5 overflow-x-auto lg:mx-0">
          {/* `border-separate` rather than `border-collapse`: with collapsed
              borders a sticky <th> does not paint reliably above the cells
              scrolling under it, and content bleeds through the pinned label
              column. Borders therefore live on the cells, not the rows. */}
          <table className="w-full min-w-[46rem] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Comparison of {matrix.codes.join(", ")} across{" "}
              {matrix.sections.length} categories
            </caption>

            <thead>
              <tr>
                {/* `min-w` rather than `w`: under auto table layout a plain
                    width is only a suggestion and the browser was collapsing
                    the gutter to 112px, wrapping every label to six lines. */}
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-44 min-w-44 border-b border-r border-rule bg-void pb-3 pl-5 pr-4 align-bottom lg:pl-0"
                >
                  <span className="text-micro text-ink-700">Metric</span>
                </th>
                {matrix.codes.map((code) => (
                  <th
                    key={code}
                    scope="col"
                    className="min-w-[13rem] border-b border-rule pb-3 pr-6 align-bottom"
                  >
                    <span className="block text-code text-ink-700">{code}</span>
                    <span className="mt-1 block text-h3 text-bone">
                      {matrix.names[code]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {matrix.sections.map((section) => (
              <tbody key={section.key}>
                <tr>
                  {/* The section heading is pinned too, so the group a row
                      belongs to stays visible while scrolling sideways. */}
                  <th
                    scope="colgroup"
                    colSpan={cols + 1}
                    className="sticky left-0 z-10 bg-void pb-2 pl-5 pt-8 text-left lg:pl-0"
                  >
                    <span className="text-micro text-ink-500">
                      {section.label}
                    </span>
                  </th>
                </tr>

                {section.rows.map((row) => {
                  const dimmed = onlyDivergent && !row.divergent;

                  return (
                    <tr
                      key={row.key}
                      className={cn(
                        "transition-opacity duration-260",
                        dimmed && "opacity-30",
                      )}
                    >
                      <th
                        scope="row"
                        className="sticky left-0 z-10 min-w-44 border-r border-t border-rule bg-void py-4 pl-5 pr-4 align-top font-normal lg:pl-0"
                      >
                        <span className="block text-body-sm text-ink-300">
                          {row.label}
                        </span>
                        {/* Hints are the largest contributor to row height and
                            are unreadable in an 11rem gutter — desktop only,
                            where the column has room. */}
                        {row.hint && (
                          <span className="mt-1 hidden text-code text-ink-700 lg:block">
                            {row.hint}
                          </span>
                        )}
                      </th>

                      {row.cells.map((cell) => (
                        <Cell key={cell.code} cell={cell} />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

function Cell({ cell }: { cell: ComparisonCell }) {
  // An absent value is never a blank cell — the reason is stated, and the two
  // reasons are worded differently. docs/rules.md §2.6.
  if (cell.display === null) {
    return (
      <td className="border-t border-rule py-4 pr-6 align-top">
        <span
          className={cn(
            "text-body-sm",
            cell.absent === "no-provision" ? "text-critical" : "text-null",
          )}
        >
          {cell.absent === "no-provision"
            ? "No specific provision"
            : COVERAGE_LABEL["not-researched"]}
        </span>
      </td>
    );
  }

  return (
    <td className="py-4 pr-6 align-top">
      <span
        className={cn(
          "flex items-baseline gap-2 text-body-sm",
          cell.isExtreme ? "text-bone" : "text-ink-100",
        )}
      >
        {cell.display}
        {cell.isExtreme && (
          <span className="text-micro text-pending">Strictest</span>
        )}
      </span>

      {cell.detail && (
        <span className="mt-1.5 block max-w-[22rem] text-code text-ink-700">
          {cell.detail}
        </span>
      )}
    </td>
  );
}
