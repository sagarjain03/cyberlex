import { SITE } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

/**
 * "Not legal advice."
 *
 * Non-dismissible by design and required wherever a legal conclusion is
 * rendered — the highest-severity product risk is a user treating this as
 * advice. docs/prd.md R-1.
 */
export function Disclaimer({
  variant = "inline",
  className,
}: {
  variant?: "inline" | "block";
  className?: string;
}) {
  if (variant === "block") {
    return (
      <aside
        className={cn(
          "border-l border-pending/40 bg-pending/[0.04] py-3 pl-4 pr-3",
          className,
        )}
      >
        <p className="text-micro text-pending">Not legal advice</p>
        <p className="mt-2 max-w-[62ch] text-body-sm text-ink-300">
          {SITE.disclaimer}
        </p>
      </aside>
    );
  }

  return (
    <p className={cn("text-code text-ink-700", className)}>{SITE.disclaimer}</p>
  );
}
