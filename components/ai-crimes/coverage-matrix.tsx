import Link from "next/link";

import { CoverageCell } from "@/components/shared/coverage-cell";
import type { CoverageLevel, CoverageMatrix } from "@/types";

const LEVELS: CoverageLevel[] = [
  "direct",
  "analogical",
  "no-coverage",
  "not-researched",
];

/**
 * Technique × jurisdiction coverage.
 *
 * A Server Component — the matrix has no interactive state, so it ships zero
 * JavaScript. Sticky-gutter mechanics follow the recipe established in
 * `comparison-grid.tsx`: `border-separate` (collapsed borders break sticky
 * painting), `min-w-*` rather than `w-*` (auto layout treats width as a
 * suggestion), and no horizontal padding on the scroll container (`sticky
 * left-0` anchors to the padding edge).
 */
export function CoverageMatrixTable({ matrix }: { matrix: CoverageMatrix }) {
  return (
    <div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-void to-transparent lg:hidden"
        />

        {/* `relative` is load-bearing: `sr-only` is `position: absolute`, so
            without a positioned scroller its containing block becomes the outer
            wrapper and it escapes the horizontal clip — dragging the page width
            out to 798px at 375px. Making the scroller the containing block
            clips any absolutely-positioned descendant, present or future. */}
        <div className="relative -mx-5 overflow-x-auto lg:mx-0">
          <table className="w-full min-w-[46rem] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Statutory coverage of {matrix.rows.length} AI-enabled techniques
              across {matrix.jurisdictions.length} jurisdictions
            </caption>

            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-52 min-w-52 border-b border-r border-rule bg-void pb-3 pl-5 pr-4 align-bottom lg:pl-0"
                >
                  <span className="text-micro text-ink-700">Technique</span>
                </th>
                {matrix.jurisdictions.map((j) => (
                  // `aria-label` rather than an sr-only span: it gives screen
                  // readers the full name without adding a positioned element
                  // inside a horizontally-scrolling region.
                  <th
                    key={j.code}
                    scope="col"
                    aria-label={j.shortName}
                    className="min-w-16 border-b border-rule pb-3 pr-4 align-bottom"
                  >
                    <span className="text-code text-ink-500">{j.code}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {matrix.rows.map((row) => (
                <tr key={row.slug}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 min-w-52 border-r border-t border-rule bg-void py-4 pl-5 pr-4 align-middle font-normal lg:pl-0"
                  >
                    <Link
                      href={`/ai-crimes/${row.slug}`}
                      className="text-body-sm text-ink-300 transition-colors hover:text-bone"
                    >
                      {row.shortName}
                    </Link>
                  </th>

                  {row.cells.map((cell) => (
                    <td
                      key={cell.code}
                      className="border-t border-rule py-4 pr-4 align-middle"
                    >
                      <CoverageCell coverage={cell.coverage} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        {LEVELS.map((level) => (
          <li key={level}>
            <CoverageCell coverage={level} showLabel />
          </li>
        ))}
      </ul>

      <p className="measure mt-5 text-body-sm text-ink-500">
        <span className="text-ink-300">No clear coverage</span> means we checked
        and found no provision that plausibly reaches the technique.{" "}
        <span className="text-ink-300">Not researched</span> means we have not
        checked. They are different claims, and this matrix never conflates
        them. {countLevel(matrix, "no-coverage")} cells are the former;{" "}
        {countLevel(matrix, "not-researched")} the latter.
      </p>
    </div>
  );
}

function countLevel(matrix: CoverageMatrix, level: CoverageLevel): number {
  return matrix.rows
    .flatMap((r) => r.cells)
    .filter((c) => c.coverage === level).length;
}
