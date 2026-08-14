import { cn } from "@/lib/utils";
import { LEGAL_STATUS_LABEL, LEGAL_STATUS_TOKEN } from "@/types";
import type { LegalStatus } from "@/types";

const DOT: Record<string, string> = {
  live: "bg-live",
  partial: "bg-partial",
  pending: "bg-pending",
  draft: "bg-draft",
  null: "bg-null",
};

const TEXT: Record<string, string> = {
  live: "text-live",
  partial: "text-partial",
  pending: "text-pending",
  draft: "text-draft",
  null: "text-null",
};

/**
 * Status as a square swatch plus its word.
 *
 * No icon and no pill: at this size a word reads faster than a glyph, and the
 * word is what makes the badge survive greyscale and colour-blindness — colour
 * is reinforcement only. docs/rules.md §5.3.
 */
export function StatusBadge({
  status,
  tone = "muted",
  className,
}: {
  status: LegalStatus;
  /** `muted` for dense lists, `strong` where the status is the point. */
  tone?: "muted" | "strong";
  className?: string;
}) {
  const token = LEGAL_STATUS_TOKEN[status];

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span className={cn("size-1 shrink-0", DOT[token])} aria-hidden="true" />
      <span
        className={cn(
          "text-code whitespace-nowrap",
          tone === "strong" ? TEXT[token] : "text-ink-500",
          status === "repealed" && "line-through",
        )}
      >
        {LEGAL_STATUS_LABEL[status]}
      </span>
    </span>
  );
}
