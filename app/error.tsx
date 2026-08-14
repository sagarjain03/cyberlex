"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { ActionLink, ErrorState } from "@/components/ui/states";

/**
 * Segment error boundary. The nav shell stays mounted above this, so a failure
 * in one module leaves the rest of the app reachable.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Detail goes to the server log, never to the user.
    console.error(error);
  }, [error]);

  return (
    <PageShell
      eyebrow="Error"
      title="Something broke."
      lede="This page failed to render. The rest of CyberLex is unaffected."
    >
      <ErrorState
        icon={TriangleAlert}
        headline="Unable to render this page"
        body="Try again — if it keeps failing, the underlying data or code is at fault, not your input."
        action={
          <ActionLink onClick={reset} variant="solid">
            Try again
          </ActionLink>
        }
      />

      {error.digest && (
        <p className="text-center text-code text-ink-700">
          Reference {error.digest}
        </p>
      )}
    </PageShell>
  );
}
