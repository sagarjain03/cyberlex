import { cn } from "@/lib/utils";
import { COVERAGE_LABEL } from "@/types";
import type { CoverageLevel } from "@/types";

/**
 * One cell of the technique × jurisdiction coverage matrix.
 *
 * ⚠️ `no-coverage` and `not-researched` must never look alike. They differ by
 * fill, border style, glyph and label — conflating them would assert that we
 * checked and found nothing, when in fact we did not check.
 * docs/phases.md Phase 6.
 */
const STYLE: Record<
  CoverageLevel,
  { box: string; glyph: string; label: string }
> = {
  direct: {
    box: "bg-live/15 border border-live/40 text-live",
    glyph: "✓",
    label: "text-live",
  },
  analogical: {
    box: "bg-pending/12 border border-pending/40 text-pending",
    glyph: "≈",
    label: "text-pending",
  },
  "no-coverage": {
    box: "border border-critical/50 text-critical",
    glyph: "∅",
    label: "text-critical",
  },
  "not-researched": {
    box: "border border-dashed border-null/60 text-null",
    glyph: "–",
    label: "text-null",
  },
};

export function CoverageCell({
  coverage,
  showLabel = false,
  className,
}: {
  coverage: CoverageLevel;
  showLabel?: boolean;
  className?: string;
}) {
  const s = STYLE[coverage];

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm font-mono text-[0.6875rem] leading-none",
          s.box,
        )}
        aria-hidden="true"
      >
        {s.glyph}
      </span>
      {showLabel ? (
        <span className={cn("text-code", s.label)}>
          {COVERAGE_LABEL[coverage]}
        </span>
      ) : (
        <span className="sr-only">{COVERAGE_LABEL[coverage]}</span>
      )}
    </span>
  );
}
