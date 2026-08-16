"use client";

import { useState } from "react";
import Link from "next/link";
import { CornerDownLeft, TriangleAlert } from "lucide-react";

import { SummaryResult } from "@/components/assistant/summary-result";
import { Skeleton } from "@/components/ui/skeleton";
import { useSummarize } from "@/hooks/use-summarize";
import {
  QUERY_MAX_LENGTH,
  QUERY_MIN_LENGTH,
} from "@/lib/constants/thresholds";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "What is the breach reporting deadline in India?",
  "Compare corporate fine exposure in the EU and Singapore",
  "Is the DPDP Act enforceable yet?",
  "Which tracked jurisdictions have a binding AI statute?",
  "What does NIS2 require of an entity's management body?",
];

export function AssistantConsole({ aiConfigured }: { aiConfigured: boolean }) {
  const [query, setQuery] = useState("");
  const { state, run } = useSummarize();

  const trimmed = query.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < QUERY_MIN_LENGTH;
  const canSubmit =
    aiConfigured && trimmed.length >= QUERY_MIN_LENGTH && state.status !== "loading";

  function submit(value: string) {
    const v = value.trim();
    if (!aiConfigured || v.length < QUERY_MIN_LENGTH) return;
    setQuery(v);
    void run(v);
  }

  // Provider not configured: a designed state, not an error. Modules 1–4 are
  // untouched, and the copy says nothing about keys. docs/rules.md §4.3 #12.
  if (!aiConfigured) {
    return (
      <div className="border-l-2 border-pending bg-pending/[0.03] py-6 pl-5 pr-4">
        <p className="text-micro text-pending">AI assistance unavailable</p>
        <p className="measure mt-3 text-body text-ink-300">
          The assistant isn&rsquo;t available right now. Everything else in
          CyberLex works normally — the{" "}
          <Link href="/" className="text-bone underline underline-offset-4">
            directory
          </Link>
          ,{" "}
          <Link href="/compare" className="text-bone underline underline-offset-4">
            comparator
          </Link>
          ,{" "}
          <Link href="/tracker" className="text-bone underline underline-offset-4">
            tracker
          </Link>{" "}
          and{" "}
          <Link
            href="/ai-crimes"
            className="text-bone underline underline-offset-4"
          >
            crime mapping
          </Link>{" "}
          are all curated data and need no AI.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
      >
        <label htmlFor="assistant-query" className="text-micro text-ink-500">
          Your question
        </label>

        <div className="mt-3 flex items-end gap-4 border-b border-rule-strong pb-3 focus-within:border-bone">
          <textarea
            id="assistant-query"
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, QUERY_MAX_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(query);
              }
            }}
            rows={2}
            placeholder="Ask about a statute, a deadline, or a penalty…"
            aria-describedby="assistant-hint"
            // `outline-none` is permitted here only because the container
            // supplies a stronger replacement: its hairline goes bone on
            // `focus-within` (18:1). Do not remove that class without adding a
            // ring back here. docs/rules.md §5.2.
            className="min-h-14 flex-1 resize-none bg-transparent text-body-lg text-ink-100 outline-none placeholder:text-ink-700"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-sm px-3 py-2 text-micro transition-colors",
              canSubmit
                ? "bg-bone text-void hover:bg-ink-100"
                : "cursor-not-allowed border border-rule text-ink-700",
            )}
          >
            <CornerDownLeft className="size-3" strokeWidth={1.5} aria-hidden="true" />
            Ask
          </button>
        </div>

        <p
          id="assistant-hint"
          className={cn(
            "mt-2 text-code",
            tooShort ? "text-pending" : "text-ink-700",
          )}
        >
          {tooShort
            ? `At least ${QUERY_MIN_LENGTH} characters.`
            : `${trimmed.length}/${QUERY_MAX_LENGTH} · Enter to send, Shift+Enter for a new line`}
        </p>
      </form>

      {state.status === "idle" && (
        <div className="mt-10">
          <p className="text-micro text-ink-700">Try one of these</p>
          <div className="mt-4 flex flex-col items-start gap-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => submit(ex)}
                className="text-left text-body-sm text-ink-500 transition-colors hover:text-bone"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      <div aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "loading" && (
          <div className="mt-10 border-l-2 border-synthetic/40 py-6 pl-5">
            <Skeleton className="h-2 w-28" />
            <Skeleton className="mt-6 h-2 w-20" />
            <Skeleton className="mt-4 h-3 w-full max-w-2xl" />
            <Skeleton className="mt-2 h-3 w-full max-w-xl" />
            <Skeleton className="mt-2 h-3 w-2/3 max-w-md" />
            <Skeleton className="mt-8 h-2 w-20" />
            <Skeleton className="mt-4 h-3 w-full max-w-lg" />
            <Skeleton className="mt-2 h-3 w-1/2 max-w-sm" />
          </div>
        )}

        {state.status === "success" && (
          <div className="mt-10">
            <SummaryResult data={state.data} />
          </div>
        )}

        {state.status === "error" && (
          <div
            role="alert"
            className="mt-10 border-l-2 border-critical bg-critical/[0.03] py-6 pl-5 pr-4"
          >
            <p className="flex items-center gap-2 text-micro text-critical">
              <TriangleAlert className="size-3" strokeWidth={1.5} aria-hidden="true" />
              {state.code.replace(/_/g, " ").toLowerCase()}
            </p>

            <p className="measure mt-3 text-body text-ink-100">
              {state.message}
            </p>

            {state.retryAfterSeconds ? (
              <p className="mt-3 text-code text-ink-500">
                Try again in {state.retryAfterSeconds}s.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => submit(query)}
                className="mt-5 inline-flex items-center rounded-sm border border-rule-strong px-4 py-2 text-micro text-ink-300 transition-colors hover:border-bone hover:text-bone"
              >
                Try again
              </button>
            )}

            {state.traceId && (
              <p className="mt-5 text-code text-ink-700">
                Reference {state.traceId}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
