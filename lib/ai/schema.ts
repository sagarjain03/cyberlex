import "server-only";

import { z } from "zod";

import { QUERY_MAX_LENGTH, QUERY_MIN_LENGTH } from "@/lib/constants/thresholds";

/** Request body. Validated before anything else touches it. */
export const SummarizeRequestSchema = z.object({
  query: z.string().trim().min(QUERY_MIN_LENGTH).max(QUERY_MAX_LENGTH),
  jurisdictionCodes: z.array(z.string().length(2)).max(10).optional(),
});

/**
 * The model's response.
 *
 * LLM output is untrusted input. A response that parses as JSON but does not
 * match this shape is a failure, never a partial render — half a legal answer
 * is worse than none. docs/rules.md §4.3 #8.
 */
export const LegalSummarySchema = z.object({
  sections: z
    .array(
      z.object({
        heading: z.enum(["Overview", "Sanctions", "Compliance Takeaways"]),
        body: z.array(z.string().min(1)).min(1).max(8),
      }),
    )
    .length(3),
  confidence: z.enum(["high", "medium", "low"]),
  outOfScope: z.boolean(),
  groundedOn: z.object({
    jurisdictions: z.array(z.string()).max(10),
    lawIds: z.array(z.string()).max(20),
  }),
});

export type RawLegalSummary = z.infer<typeof LegalSummarySchema>;

/**
 * Require all three sections, exactly once each — the model returning
 * "Overview" three times would otherwise satisfy `.length(3)`.
 */
export function hasAllSections(parsed: RawLegalSummary): boolean {
  const headings = new Set(parsed.sections.map((s) => s.heading));
  return (
    headings.size === 3 &&
    headings.has("Overview") &&
    headings.has("Sanctions") &&
    headings.has("Compliance Takeaways")
  );
}

/** True when the model returned structurally valid but substantively empty text. */
export function isEffectivelyEmpty(parsed: RawLegalSummary): boolean {
  return parsed.sections.every((s) =>
    s.body.every((line) => line.trim().length === 0),
  );
}
