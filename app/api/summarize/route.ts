import { MAX_BODY_BYTES, TIMEOUT_MS } from "@/lib/ai/config";
import { SummarizeError, fail } from "@/lib/ai/errors";
import { SummarizeRequestSchema } from "@/lib/ai/schema";
import { summarize } from "@/lib/ai/summarize";
import { isAiConfigured } from "@/lib/env";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import type { SummarizeResponse } from "@/types";

/**
 * POST /api/summarize
 *
 * Per-request and upstream-dependent — must never be cached. Route Handlers
 * are uncached by default in Next 16, so this needs no opt-out, but equally
 * must never gain `dynamic = 'force-static'`. docs/rules.md §3.5.
 *
 * Pre-flight runs cheapest-rejection-first: an abusive client is turned away
 * before we parse a body, and a missing key fails before any network call.
 */
function respond(payload: SummarizeResponse, status: number, headers?: HeadersInit) {
  return Response.json(payload, { status, headers });
}

export async function POST(request: Request) {
  const traceId = crypto.randomUUID();

  try {
    // 1 ── Rate limit.
    const ip = clientIp(request.headers);
    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      throw fail(
        "RATE_LIMITED",
        429,
        `Rate limited: ${ip}`,
        limit.retryAfterSeconds,
      );
    }

    // 2 ── Body size, checked before reading it into memory where possible.
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (declared > MAX_BODY_BYTES) {
      throw fail("PAYLOAD_TOO_LARGE", 413, `Declared ${declared} bytes`);
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      throw fail("PAYLOAD_TOO_LARGE", 413, `Actual ${rawBody.length} bytes`);
    }

    // 3 ── Shape.
    let json: unknown;
    try {
      json = JSON.parse(rawBody);
    } catch {
      throw fail("INVALID_QUERY", 400, "Body was not JSON");
    }

    const parsed = SummarizeRequestSchema.safeParse(json);
    if (!parsed.success) {
      throw fail(
        "INVALID_QUERY",
        400,
        `Request schema: ${parsed.error.issues[0]?.message}`,
      );
    }

    // 4 ── Provider configured. Fails before any network call, and the message
    //      the user sees says nothing about keys or configuration.
    if (!isAiConfigured()) {
      throw fail("AI_UNAVAILABLE", 503, "GROQ_API_KEY not set");
    }

    // 5 ── Ground, call, validate. The whole budget lives inside this signal.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const data = await summarize(
        parsed.data.query,
        parsed.data.jurisdictionCodes,
        controller.signal,
      );
      return respond({ ok: true, data }, 200);
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    const e =
      err instanceof SummarizeError
        ? err
        : fail("UPSTREAM_ERROR", 502, `Unhandled: ${String(err)}`);

    // Full detail server-side only, against a trace id the user can quote.
    console.error(
      `[summarize:${traceId}] ${e.code} (${e.status}) — ${e.detail ?? "no detail"}`,
    );

    const headers: HeadersInit = {};
    if (e.retryAfterSeconds) {
      headers["Retry-After"] = String(e.retryAfterSeconds);
    }

    return respond(
      {
        ok: false,
        code: e.code,
        message: e.userMessage,
        ...(e.retryAfterSeconds
          ? { retryAfterSeconds: e.retryAfterSeconds }
          : {}),
        traceId,
      },
      e.status,
      headers,
    );
  }
}

/** Anything other than POST is a client error, not a 404. */
export function GET() {
  return Response.json(
    { ok: false, code: "INVALID_QUERY", message: "Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
