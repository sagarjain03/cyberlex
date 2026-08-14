import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types";

/**
 * Verification date plus, where relevant, a warning.
 *
 * Three distinct states, because "checked recently", "checked long ago" and
 * "never checked against the source" are different things and only the first
 * should look settled. docs/prd.md M1-4.
 */
export function LastVerified({
  date,
  status,
  isStale,
  className,
}: {
  date: string;
  status: VerificationStatus;
  isStale?: boolean;
  className?: string;
}) {
  if (status !== "verified") {
    return (
      <span className={cn("flex items-center gap-1.5", className)}>
        <span className="size-1 shrink-0 bg-pending" aria-hidden="true" />
        <span className="text-code text-pending">
          Pending verification · {formatDate(date)}
        </span>
      </span>
    );
  }

  if (isStale) {
    return (
      <span className={cn("flex items-center gap-1.5", className)}>
        <span className="size-1 shrink-0 bg-pending" aria-hidden="true" />
        <span className="text-code text-ink-500">
          Verified {formatDate(date)} — re-check before relying
        </span>
      </span>
    );
  }

  return (
    <span className={cn("text-code text-ink-500", className)}>
      Verified {formatDate(date)}
    </span>
  );
}
