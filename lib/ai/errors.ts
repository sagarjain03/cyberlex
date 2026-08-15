import "server-only";

import type { ApiErrorCode } from "@/types";

/**
 * Upstream failures → typed codes and user-facing copy.
 *
 * The `message` returned here is the only thing a user sees. It never contains
 * an upstream response body, stack trace, model id, or anything about keys or
 * configuration. Full detail is logged server-side against a trace id.
 * docs/rules.md §4.3, §4.5.
 */

export class SummarizeError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    readonly userMessage: string,
    /** Server-side only. Never serialised to the client. */
    readonly detail?: string,
    readonly retryAfterSeconds?: number,
  ) {
    super(userMessage);
    this.name = "SummarizeError";
  }
}

export const USER_MESSAGE: Record<ApiErrorCode, string> = {
  RATE_LIMITED: "You've hit the query limit. Try again shortly.",
  UPSTREAM_RATE_LIMITED: "The AI service is busy right now. Try again in a moment.",
  TIMEOUT: "That took too long. Try a shorter, more specific question.",
  UPSTREAM_ERROR: "The AI service is temporarily unavailable. The rest of CyberLex still works.",
  AI_UNAVAILABLE: "AI assistance isn't available right now. Every other module is unaffected.",
  MALFORMED_RESPONSE: "The AI returned an unreadable answer. Try rephrasing your question.",
  EMPTY_RESPONSE: "The AI couldn't produce an answer for that. Try being more specific.",
  INVALID_QUERY: "That question couldn't be read. Check the length and try again.",
  PAYLOAD_TOO_LARGE: "That request was too large. Shorten your question.",
  NETWORK_ERROR: "Couldn't reach the AI service. Check your connection and retry.",
};

export function fail(
  code: ApiErrorCode,
  status: number,
  detail?: string,
  retryAfterSeconds?: number,
): SummarizeError {
  return new SummarizeError(
    code,
    status,
    USER_MESSAGE[code],
    detail,
    retryAfterSeconds,
  );
}

interface UpstreamShape {
  status?: number;
  name?: string;
  message?: string;
  headers?: Record<string, string> | Headers;
}

function headerValue(
  headers: UpstreamShape["headers"],
  key: string,
): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(key) ?? undefined;
  return headers[key] ?? headers[key.toLowerCase()];
}

/**
 * Classify an unknown thrown value from the SDK.
 *
 * Deliberately duck-typed on `status` rather than `instanceof`: SDK error
 * classes change between versions, and misclassifying a 429 as a generic
 * failure would break the retry policy.
 */
export function classifyUpstream(err: unknown): SummarizeError {
  const e = (err ?? {}) as UpstreamShape;

  // Aborted by our own timeout signal.
  if (e.name === "AbortError" || e.name === "TimeoutError") {
    return fail("TIMEOUT", 504, "Upstream aborted by timeout signal");
  }

  const status = typeof e.status === "number" ? e.status : undefined;

  if (status === 429) {
    const retryAfter = Number(headerValue(e.headers, "retry-after"));
    return fail(
      "UPSTREAM_RATE_LIMITED",
      429,
      "Upstream 429",
      Number.isFinite(retryAfter) ? retryAfter : undefined,
    );
  }

  // 401/403 are operator problems, and not always credentials: Groq returns
  // 403 "Access denied — check your network settings" for blocked network
  // origins such as VPN or datacenter exit IPs, with a perfectly valid key.
  // The upstream message is kept server-side so an operator can tell the two
  // apart; the user is told only that the service is unavailable.
  if (status === 401 || status === 403) {
    return fail(
      "AI_UNAVAILABLE",
      503,
      `Upstream rejected request (${status}): ${e.message ?? "no message"}`,
    );
  }

  if (status !== undefined && status >= 500) {
    return fail("UPSTREAM_ERROR", 502, `Upstream ${status}`);
  }

  if (status !== undefined && status >= 400) {
    // Our request was wrong. Never retried.
    return fail("UPSTREAM_ERROR", 502, `Upstream client error ${status}`);
  }

  // No status at all — almost always a transport failure.
  return fail("NETWORK_ERROR", 502, `Transport failure: ${e.name ?? "unknown"}`);
}

/** Which failures are worth exactly one retry. docs/rules.md §4.4. */
export function isRetryable(err: SummarizeError): boolean {
  return (
    err.code === "UPSTREAM_RATE_LIMITED" ||
    err.code === "NETWORK_ERROR" ||
    (err.code === "UPSTREAM_ERROR" && err.status === 502 &&
      (err.detail?.startsWith("Upstream 5") ?? false))
  );
}
