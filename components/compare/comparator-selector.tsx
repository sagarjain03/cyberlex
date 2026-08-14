"use client";

import { X } from "lucide-react";

import { useCompareSelection } from "@/hooks/use-compare-selection";
import { MAX_COMPARE_ITEMS } from "@/lib/constants/thresholds";
import { cn } from "@/lib/utils";
import type { JurisdictionSummary } from "@/types";

/**
 * 2–3 jurisdiction picker.
 *
 * Every option is visible: with ten jurisdictions a dropdown would hide the
 * choice set behind an interaction for no benefit. At the cap, unselected
 * options are disabled rather than silently evicting an existing pick.
 */
export function ComparatorSelector({
  jurisdictions,
}: {
  jurisdictions: JurisdictionSummary[];
}) {
  const codes = jurisdictions.map((j) => j.code);
  const { selected, toggle, clear, isFull, isComplete, remaining } =
    useCompareSelection(codes);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="text-micro text-ink-500">
          Select jurisdictions
          <span className="ml-2 text-ink-700">
            {selected.length}/{MAX_COMPARE_ITEMS}
          </span>
        </p>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-1.5 text-code text-ink-500 transition-colors hover:text-bone"
          >
            <X className="size-3" strokeWidth={1.5} aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
        {jurisdictions.map((j) => {
          const active = selected.includes(j.code);
          const disabled = !active && isFull;

          return (
            <button
              key={j.code}
              type="button"
              onClick={() => toggle(j.code)}
              disabled={disabled}
              aria-pressed={active}
              className={cn(
                "flex items-baseline gap-2 text-body-sm transition-colors",
                active && "text-bone",
                !active && !disabled && "text-ink-500 hover:text-ink-100",
                disabled && "cursor-not-allowed text-ink-700",
              )}
            >
              <span
                className={cn(
                  "text-code",
                  active ? "text-bone" : "text-ink-700",
                )}
              >
                {j.code}
              </span>
              <span
                className={cn(
                  active && "underline decoration-bone/40 underline-offset-4",
                )}
              >
                {j.shortName}
              </span>
            </button>
          );
        })}
      </div>

      {!isComplete && (
        <p className="mt-5 text-body-sm text-pending">
          Select {remaining} more to compare.
        </p>
      )}
    </div>
  );
}
