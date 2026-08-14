"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DEFAULT_HYPOTHETICAL_REVENUE_USD } from "@/lib/constants/thresholds";
import { formatCompactUsd } from "@/lib/scoring/normalize";
import { cn } from "@/lib/utils";

const PRESETS = [10_000_000, 100_000_000, 1_000_000_000, 10_000_000_000];

/**
 * The hypothetical revenue that turnover-based fine ceilings are normalised
 * against.
 *
 * Written to the URL rather than held in local state: it materially changes
 * every figure in the financial section, so a shared link must carry the
 * assumption it was computed under. The server recomputes — the normalisation
 * logic exists only in `lib/scoring/normalize.ts`. docs/prd.md M2-3, R-6.
 */
export function RevenueControl({ current }: { current: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function set(value: number) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === DEFAULT_HYPOTHETICAL_REVENUE_USD) next.delete("rev");
    else next.set("rev", String(value));
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <p className="text-micro text-ink-700">Hypothetical annual revenue</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => set(p)}
            aria-pressed={p === current}
            className={cn(
              "text-data transition-colors",
              p === current
                ? "text-bone underline decoration-bone/40 underline-offset-4"
                : "text-ink-500 hover:text-ink-100",
            )}
          >
            {formatCompactUsd(p)}
          </button>
        ))}
      </div>
    </div>
  );
}
