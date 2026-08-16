"use client";

import { useRef, useState } from "react";

import { MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";
import { COVERAGE_LABEL, type CoverageLevel, type CoverageMatrix } from "@/types";
import { cn } from "@/lib/utils";

/**
 * The coverage matrix in miniature — a specimen of the real surface.
 *
 * Every verdict is encoded twice: by hue *and* by the shape of the mark
 * (solid, half, hollow, dot). The four status hues sit too close together under
 * deuteranopia to be trusted as the only channel, and a grid is exactly where
 * that failure would be invisible. In greyscale, or with the colours removed
 * entirely, the four states stay distinguishable.
 *
 * Rendered as a real table with row and column headers, so the screen-reader
 * pass is the data itself rather than a described picture.
 */
export function CoverageGrid({ matrix }: { matrix: CoverageMatrix }) {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{
    technique: string;
    jurisdiction: string;
    coverage: CoverageLevel;
  } | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Table cells only — the legend uses the same mark and must not be
        // swept into the grid stagger.
        const cells = el.querySelectorAll("table [data-cell]");
        const cols = matrix.jurisdictions.length;

        gsap.from(cells, {
          opacity: 0,
          scale: 0.4,
          duration: 0.4,
          ease: "power2.out",
          stagger: {
            each: 0.012,
            grid: [matrix.rows.length, cols],
            from: "start",
          },
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
    },
    { scope: root, dependencies: [matrix] },
  );

  return (
    <div ref={root}>
      {/* Hover readout. Holds the last inspected cell rather than flickering
          back to a placeholder on every mouse-out. */}
      <p className="h-5 text-code text-ink-500">
        {hovered ? (
          <>
            <span className="text-ink-100">{hovered.technique}</span> ×{" "}
            <span className="text-ink-100">{hovered.jurisdiction}</span> —{" "}
            {COVERAGE_LABEL[hovered.coverage]}
          </>
        ) : (
          "Hover a cell for the verdict"
        )}
      </p>

      {/* `relative` is load-bearing: every cell carries an `sr-only` label, which
          is absolutely positioned. Without a positioned ancestor those resolve
          against the initial containing block, escape this scroller at their
          static position out past 500px, and turn the whole *page* into a
          horizontal scroll at 375px. */}
      <div className="relative mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <caption className="sr-only">
            Statutory coverage of each AI-enabled technique by jurisdiction.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-40 pb-3 text-left">
                <span className="text-micro text-ink-700">Technique</span>
              </th>
              {matrix.jurisdictions.map((j) => (
                <th key={j.code} scope="col" className="pb-3">
                  <span className="text-code text-ink-700">{j.code}</span>
                  <span className="sr-only">{j.shortName}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row.slug} className="border-t border-rule">
                <th scope="row" className="py-2 pr-4 text-left align-middle">
                  <span className="text-body-sm text-ink-300">
                    {row.shortName}
                  </span>
                </th>

                {row.cells.map((cell) => {
                  const jurisdiction =
                    matrix.jurisdictions.find((j) => j.code === cell.code)
                      ?.shortName ?? cell.code;

                  return (
                    <td
                      key={cell.code}
                      className="py-2 text-center align-middle"
                      onMouseEnter={() =>
                        setHovered({
                          technique: row.shortName,
                          jurisdiction,
                          coverage: cell.coverage,
                        })
                      }
                    >
                      <span className="inline-flex justify-center">
                        <CoverageMark coverage={cell.coverage} />
                      </span>
                      <span className="sr-only">
                        {COVERAGE_LABEL[cell.coverage]}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend. Shape first, because shape is the channel that always survives. */}
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
        {(
          [
            "direct",
            "analogical",
            "no-coverage",
            "not-researched",
          ] as CoverageLevel[]
        ).map((level) => (
          <li key={level} className="flex items-center gap-2">
            <CoverageMark coverage={level} />
            <span className="text-code text-ink-500">
              {COVERAGE_LABEL[level]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const MARK_TONE: Record<CoverageLevel, string> = {
  direct: "bg-live",
  analogical: "border border-pending",
  "no-coverage": "border border-critical",
  "not-researched": "border border-null/50",
};

/**
 * Solid · half-filled · hollow · dotted. The redundant channel that makes the
 * grid legible without colour.
 */
function CoverageMark({ coverage }: { coverage: CoverageLevel }) {
  return (
    <span
      data-cell
      aria-hidden="true"
      className={cn("relative block size-3", MARK_TONE[coverage])}
    >
      {coverage === "analogical" && (
        <span className="absolute inset-x-0 bottom-0 block h-1/2 bg-pending" />
      )}
      {coverage === "not-researched" && (
        <span className="absolute left-1/2 top-1/2 block size-1 -translate-x-1/2 -translate-y-1/2 bg-null" />
      )}
    </span>
  );
}
