"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { ActionLink, ErrorState } from "@/components/ui/states";

/**
 * Comparator-specific boundary: falls back to a bare selector link rather than
 * a dead end, so the module stays usable after a bad selection or a failure in
 * the comparison logic. docs/architecture.md §7.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell
      eyebrow="Module 02"
      title="Comparison failed."
      lede="The selection could not be rendered. Starting over usually clears it."
    >
      <ErrorState
        icon={TriangleAlert}
        headline="Unable to build this comparison"
        body="This can happen if the selection in the URL refers to jurisdictions that are no longer tracked."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ActionLink onClick={reset} variant="solid">
              Try again
            </ActionLink>
            <Link
              href="/compare"
              className="inline-flex items-center rounded-sm border border-rule-strong px-4 py-2 text-micro text-ink-300 transition-colors hover:border-bone hover:text-bone"
            >
              Clear selection
            </Link>
          </div>
        }
      />
    </PageShell>
  );
}
