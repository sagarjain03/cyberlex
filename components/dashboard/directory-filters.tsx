"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { STRICTNESS_BANDS } from "@/lib/constants/thresholds";
import { cn } from "@/lib/utils";
import { AI_POSTURE_LABEL, LEGAL_STATUS_LABEL, REGION_LABEL } from "@/types";

interface Group {
  key: "region" | "status" | "ai" | "band" | "sort";
  label: string;
  options: { value: string; label: string }[];
}

const GROUPS: Group[] = [
  {
    key: "sort",
    label: "Sort",
    options: [
      { value: "score-desc", label: "Strictness ↓" },
      { value: "score-asc", label: "Strictness ↑" },
      { value: "name-asc", label: "Name" },
      { value: "recently-verified", label: "Verified" },
    ],
  },
  {
    key: "region",
    label: "Region",
    options: Object.entries(REGION_LABEL).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    key: "status",
    label: "Status of primary law",
    options: (
      ["in-force", "partially-in-force", "unnotified", "draft"] as const
    ).map((value) => ({ value, label: LEGAL_STATUS_LABEL[value] })),
  },
  {
    key: "ai",
    label: "AI posture",
    options: (
      [
        "binding-comprehensive",
        "binding-sectoral",
        "guidance-only",
        "draft-framework",
      ] as const
    ).map((value) => ({ value, label: AI_POSTURE_LABEL[value] })),
  },
  {
    key: "band",
    label: "Strictness band",
    options: STRICTNESS_BANDS.map((b) => ({ value: b.label, label: b.label })),
  },
];

/**
 * Filter and sort controls for the jurisdiction index.
 *
 * State lives entirely in the URL, so a filtered view is shareable and the
 * server does the filtering — there is no duplicate filter logic on the client.
 * Written with `router.replace(..., { scroll: false })`: pushing a history
 * entry per click would make the back button useless. docs/rules.md §2.4.
 *
 * Options are text buttons rather than dropdowns — the design system has no
 * boxed select, and at this count a visible set beats a hidden one.
 */
export function DirectoryFilters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeCount = (["region", "status", "ai", "band"] as const).filter(
    (k) => searchParams.get(k),
  ).length;

  const sort = searchParams.get("sort") ?? "score-desc";
  const sortLabel =
    GROUPS[0].options.find((o) => o.value === sort)?.label ?? "Strictness ↓";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    // Clicking the active option clears it — every filter is its own toggle.
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);

    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    const next = new URLSearchParams();
    const currentSort = searchParams.get("sort");
    if (currentSort) next.set("sort", currentSort);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="border-b border-rule">
      <div className="flex items-baseline justify-between gap-3 px-5 pb-3 pt-6 lg:px-8">
        <h2 className="text-micro text-ink-500">
          Jurisdiction index
          <span className="ml-2 text-ink-700">{resultCount}</span>
        </h2>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="text-code text-ink-500 transition-colors hover:text-bone"
        >
          {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""}` : sortLabel}
          <span aria-hidden="true"> {open ? "↑" : "↓"}</span>
        </button>
      </div>

      {open && (
        <div className="space-y-5 px-5 pb-5 lg:px-8">
          {GROUPS.map((group) => {
            const current = searchParams.get(group.key);
            return (
              <div key={group.key}>
                <p className="text-micro text-ink-700">{group.label}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  {group.options.map((opt) => {
                    const active =
                      group.key === "sort"
                        ? sort === opt.value
                        : current === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setParam(group.key, opt.value)}
                        aria-pressed={active}
                        className={cn(
                          "text-body-sm transition-colors",
                          active
                            ? "text-bone underline decoration-bone/40 underline-offset-4"
                            : "text-ink-500 hover:text-ink-100",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1.5 text-code text-ink-500 transition-colors hover:text-bone"
            >
              <X className="size-3" strokeWidth={1.5} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
