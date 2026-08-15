"use client";

import { useCallback, useRef, useState } from "react";

import type { ApiErrorCode, LegalSummary, SummarizeResponse } from "@/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: LegalSummary }
  | {
      status: "error";
      code: ApiErrorCode;
      message: string;
      retryAfterSeconds?: number;
      traceId?: string;
    };

/** Slightly longer than the server's ceiling, so the server wins the race. */
const CLIENT_TIMEOUT_MS = 25_000;

/**
 * Assistant request lifecycle.
 *
 * Never throws to an error boundary — every failure resolves to a typed state
 * rendered inline. A user-initiated cancel (resubmitting, navigating away) is
 * silent and is never surfaced as an error. docs/rules.md §4.3 #14.
 */
export function useSummarize() {
  const [state, setState] = useState<State>({ status: "idle" });
  const inFlight = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    inFlight.current?.abort();
    inFlight.current = null;
    setState({ status: "idle" });
  }, []);

  const run = useCallback(async (query: string) => {
    // Supersede any in-flight request rather than racing it.
    inFlight.current?.abort();

    const controller = new AbortController();
    inFlight.current = controller;
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    setState({ status: "loading" });

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      const payload = (await res.json()) as SummarizeResponse;

      if (payload.ok) {
        setState({ status: "success", data: payload.data });
      } else {
        setState({
          status: "error",
          code: payload.code,
          message: payload.message,
          retryAfterSeconds: payload.retryAfterSeconds,
          traceId: payload.traceId,
        });
      }
    } catch {
      // The user cancelled or navigated. Not an error.
      if (controller.signal.aborted && inFlight.current !== controller) return;

      if (controller.signal.aborted) {
        setState({
          status: "error",
          code: "TIMEOUT",
          message: "That took too long. Try a shorter, more specific question.",
        });
        return;
      }

      setState({
        status: "error",
        code: "NETWORK_ERROR",
        message:
          "Couldn't reach the AI service. Check your connection and retry.",
      });
    } finally {
      clearTimeout(timer);
      if (inFlight.current === controller) inFlight.current = null;
    }
  }, []);

  return { state, run, reset };
}
