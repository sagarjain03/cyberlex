import "server-only";

import {
  MAX_TOKENS,
  MAX_UPSTREAM_RETRIES,
  MODEL,
  RESPONSE_FORMAT,
  RETRY_AFTER_CAP_MS,
  RETRY_BASE_DELAY_MS,
  TEMPERATURE,
} from "./config";
import { getGroqClient } from "./client";
import { SummarizeError, classifyUpstream, fail, isRetryable } from "./errors";
import {
  LegalSummarySchema,
  hasAllSections,
  isEffectivelyEmpty,
  type RawLegalSummary,
} from "./schema";
import { SYSTEM_PROMPT, buildContext, buildRepairInstruction } from "./prompt";
import { getJurisdictionCodes, getLaws } from "@/lib/data";
import type { JurisdictionCode, LegalSummary } from "@/types";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * One upstream call. Throws a classified `SummarizeError`; never leaks the
 * raw SDK error upward.
 */
async function callModel(
  messages: Message[],
  signal: AbortSignal,
): Promise<string> {
  try {
    const completion = await getGroqClient().chat.completions.create(
      {
        model: MODEL,
        messages,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        response_format: RESPONSE_FORMAT,
      },
      { signal },
    );

    const text = completion.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw fail("EMPTY_RESPONSE", 502, "Upstream returned no content");
    }
    return text;
  } catch (err) {
    if (err instanceof SummarizeError) throw err;
    throw classifyUpstream(err);
  }
}

/**
 * Parse and validate. Every rejection reason is returned rather than thrown,
 * so the caller can decide whether it is worth one repair attempt.
 */
/** Exported so the malformed/schema/empty paths can be exercised with fixtures
 *  without spending an upstream call — they are the most likely failure modes,
 *  given structured-output enforcement is unreliable on this model class. */
export function validate(
  text: string,
): { ok: true; data: RawLegalSummary } | { ok: false; problem: string } {
  // Models wrap JSON in fences despite being told not to. Stripping that is
  // not "accepting malformed output" — the payload underneath still has to
  // pass the schema untouched.
  const cleaned = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  let raw: unknown;
  try {
    raw = JSON.parse(cleaned);
  } catch {
    return { ok: false, problem: "it was not valid JSON" };
  }

  const parsed = LegalSummarySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      problem: `it did not match the required shape (${parsed.error.issues[0]?.path.join(".") || "unknown field"})`,
    };
  }

  if (!hasAllSections(parsed.data)) {
    return {
      ok: false,
      problem:
        "it did not contain exactly one each of Overview, Sanctions and Compliance Takeaways",
    };
  }

  if (isEffectivelyEmpty(parsed.data)) {
    return { ok: false, problem: "every section was empty" };
  }

  return { ok: true, data: parsed.data };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Full orchestration: ground → call → validate → (one repair) → return.
 *
 * The entire budget, retries included, sits inside the caller's `AbortSignal`,
 * so total server time can never exceed `TIMEOUT_MS`. docs/rules.md §4.4.
 */
export async function summarize(
  query: string,
  jurisdictionCodes: string[] | undefined,
  signal: AbortSignal,
): Promise<LegalSummary> {
  const { context } = await buildContext(query, jurisdictionCodes);

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: context },
    { role: "user", content: query },
  ];


  let text: string;
  try {
    text = await callModel(messages, signal);
  } catch (err) {
    const e = err instanceof SummarizeError ? err : classifyUpstream(err);

    if (!isRetryable(e) || MAX_UPSTREAM_RETRIES < 1) throw e;

    const wait = e.retryAfterSeconds
      ? Math.min(e.retryAfterSeconds * 1000, RETRY_AFTER_CAP_MS)
      : RETRY_BASE_DELAY_MS + Math.random() * RETRY_BASE_DELAY_MS;

    await sleep(wait);
    if (signal.aborted) throw fail("TIMEOUT", 504, "Aborted during backoff");

    // A second failure is final — no further retries, whatever it is.
    text = await callModel(messages, signal);
  }

  // ── Validate, with exactly one repair attempt ──────────────────────────
  let result = validate(text);

  if (!result.ok) {
    if (signal.aborted) throw fail("TIMEOUT", 504, "Aborted before repair");

    const repaired = await callModel(
      [
        ...messages,
        { role: "assistant", content: text },
        { role: "user", content: buildRepairInstruction(result.problem) },
      ],
      signal,
    );

    result = validate(repaired);

    if (!result.ok) {
      // Second failure: never render partial data.
      throw fail(
        result.problem === "every section was empty"
          ? "EMPTY_RESPONSE"
          : "MALFORMED_RESPONSE",
        502,
        `Validation failed twice: ${result.problem}`,
      );
    }
  }

  // ── Grounding attribution, resolved rather than trusted ────────────────
  // Two problems with taking `groundedOn` at face value:
  //   1. The model can name any string, including a jurisdiction we do not
  //      track — casting it would render an in-app link built from a
  //      hallucination.
  //   2. It frequently cites lawIds correctly but leaves `jurisdictions`
  //      empty, which silently drops the "Grounded on" links from a
  //      well-grounded answer.
  // Both are fixed the same way: keep only ids that resolve against real
  // records, then derive the jurisdictions from the cited laws.
  const [validCodes, allLaws] = await Promise.all([
    getJurisdictionCodes(),
    getLaws(),
  ]);

  const codeSet = new Set(validCodes);
  const lawById = new Map(allLaws.map((l) => [l.id, l]));

  const lawIds = result.data.groundedOn.lawIds.filter((id) => lawById.has(id));

  const jurisdictions = Array.from(
    new Set([
      ...result.data.groundedOn.jurisdictions
        .map((c) => c.toUpperCase())
        .filter((c): c is JurisdictionCode => codeSet.has(c as JurisdictionCode)),
      ...lawIds.map((id) => lawById.get(id)!.jurisdictionCode),
    ]),
  );

  return {
    query,
    ...result.data,
    groundedOn: { jurisdictions, lawIds },
  };
}
