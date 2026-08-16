import { cn } from "@/lib/utils";
import { getStrictnessBand } from "@/lib/constants/thresholds";

const BAND_FILL: Record<string, string> = {
  emerald: "bg-live",
  cyan: "bg-partial",
  amber: "bg-pending",
  rose: "bg-critical",
};

const BAND_TEXT: Record<string, string> = {
  emerald: "text-live",
  cyan: "text-partial",
  amber: "text-pending",
  rose: "text-critical",
};

/**
 * Strictness as a hairline rule with a travelling tick — a measurement, not a
 * progress bar. Replaces the segmented meter: on a true-black ground, one
 * precise line reads more instrument-like than twenty lit blocks.
 *
 * The band label always renders alongside; colour is never the sole channel.
 */
export function ScoreRule({
  score,
  showLabel = true,
  className,
}: {
  score: number;
  showLabel?: boolean;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, score));
  const band = getStrictnessBand(clamped);

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Strictness ${clamped} of 100 — ${band.label}`}
    >
      {/* `data-score-track` is a hook for scroll choreography that reveals the
          rule by clipping it — fill and tick together. Nothing styles it. */}
      <div
        data-score-track
        className="relative h-px flex-1 bg-rule"
        aria-hidden="true"
      >
        <div
          className={cn("absolute inset-y-0 left-0", BAND_FILL[band.token])}
          style={{ width: `${clamped}%` }}
        />
        <div
          className={cn(
            "absolute top-1/2 h-2.5 w-px -translate-y-1/2",
            BAND_FILL[band.token],
          )}
          style={{ left: `${clamped}%` }}
        />
      </div>

      <span
        className={cn(
          "w-6 shrink-0 text-right text-data",
          BAND_TEXT[band.token],
        )}
      >
        {clamped}
      </span>

      {showLabel && (
        <span className="w-16 shrink-0 text-code text-ink-500">
          {band.label}
        </span>
      )}
    </div>
  );
}
