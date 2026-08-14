"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  MAX_COMPARE_ITEMS,
  MIN_COMPARE_ITEMS,
} from "@/lib/constants/thresholds";
import { COMPARE_SLOTS } from "@/lib/url-state";

/**
 * Comparator selection, held in `?a=&b=&c=`.
 *
 * The URL is the single source of truth — there is no local mirror to fall out
 * of sync with it, and a comparison is therefore shareable by construction.
 * docs/prd.md M2-1.
 */
export function useCompareSelection(validCodes: readonly string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keyed on the serialised params and codes rather than the objects
  // themselves: both are fresh identities on every render, which would defeat
  // the memo and re-create `toggle` each time.
  const codeKey = validCodes.join(",");
  const paramKey = searchParams.toString();

  const selected = useMemo(() => {
    const valid = new Set(codeKey.split(","));
    const params = new URLSearchParams(paramKey);
    const out: string[] = [];

    for (const slot of COMPARE_SLOTS) {
      const raw = params.get(slot)?.toUpperCase();
      if (raw && valid.has(raw) && !out.includes(raw)) out.push(raw);
    }
    return out;
  }, [codeKey, paramKey]);

  const write = useCallback(
    (codes: string[]) => {
      const next = new URLSearchParams(searchParams.toString());
      COMPARE_SLOTS.forEach((slot, i) => {
        if (codes[i]) next.set(slot, codes[i]);
        else next.delete(slot);
      });
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const toggle = useCallback(
    (code: string) => {
      const upper = code.toUpperCase();
      if (selected.includes(upper)) {
        write(selected.filter((c) => c !== upper));
        return;
      }
      // Silently ignore rather than evicting someone else's pick — at the cap
      // the UI disables unselected options, so this is a belt-and-braces guard.
      if (selected.length >= MAX_COMPARE_ITEMS) return;
      write([...selected, upper]);
    },
    [selected, write],
  );

  const clear = useCallback(() => write([]), [write]);

  return {
    selected,
    toggle,
    clear,
    isFull: selected.length >= MAX_COMPARE_ITEMS,
    isComplete: selected.length >= MIN_COMPARE_ITEMS,
    remaining: Math.max(0, MIN_COMPARE_ITEMS - selected.length),
  };
}
