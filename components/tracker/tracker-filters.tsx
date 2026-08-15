"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { IMPACT_LABEL } from "@/types";
import type { DeveloperImpact, JurisdictionCode } from "@/types";

const IMPACTS: DeveloperImpact[] = ["material", "low", "none"];

/**
 * Jurisdiction and engineering-impact filters, held in the URL alongside the
 * pipeline's `?stage=`. Same pattern as the dashboard: server filters, the
 * client only writes params.
 */
export function TrackerFilters({
  jurisdictions,
}: {
  jurisdictions: { code: JurisdictionCode; shortName: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeJurisdiction = searchParams.get("jurisdiction");
  const activeImpact = searchParams.get("impact");
  const activeStage = searchParams.get("stage");
  const hasAny = Boolean(activeJurisdiction || activeImpact || activeStage);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-micro text-ink-700">Jurisdiction</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {jurisdictions.map((j) => {
            const active = activeJurisdiction === j.code;
            return (
              <button
                key={j.code}
                type="button"
                onClick={() => setParam("jurisdiction", j.code)}
                aria-pressed={active}
                className={cn(
                  "text-body-sm transition-colors",
                  active
                    ? "text-bone underline decoration-bone/40 underline-offset-4"
                    : "text-ink-500 hover:text-ink-100",
                )}
              >
                {j.shortName}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-micro text-ink-700">Engineering impact</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {IMPACTS.map((i) => {
            const active = activeImpact === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setParam("impact", i)}
                aria-pressed={active}
                className={cn(
                  "text-body-sm transition-colors",
                  active
                    ? "text-bone underline decoration-bone/40 underline-offset-4"
                    : "text-ink-500 hover:text-ink-100",
                )}
              >
                {IMPACT_LABEL[i]}
              </button>
            );
          })}
        </div>
      </div>

      {hasAny && (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="flex items-center gap-1.5 text-code text-ink-500 transition-colors hover:text-bone"
        >
          <X className="size-3" strokeWidth={1.5} aria-hidden="true" />
          Clear all
        </button>
      )}
    </div>
  );
}
