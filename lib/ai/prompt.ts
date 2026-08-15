import "server-only";

import {
  getJurisdictions,
  getLawsByJurisdiction,
  getMetricsByCode,
} from "@/lib/data";
import { formatHours, formatYears } from "@/lib/scoring/normalize";
import { isKnown } from "@/types";
import type { JurisdictionCode } from "@/types";

export const SYSTEM_PROMPT = `You are the legal research assistant for CyberLex Global, a tracker of cyber law across ten jurisdictions.

Answer ONLY from the CONTEXT supplied below plus well-established, uncontroversial public legal knowledge. The context is authoritative: where it conflicts with your recollection, the context wins.

Hard rules:
- NEVER invent a statute, section number, penalty figure, or date. If you do not know, say so in the relevant section.
- If the question is not about cyber law, data protection, AI governance or computer crime in the tracked jurisdictions, set "outOfScope": true and keep every section brief.
- Set "confidence" honestly: "high" only when the context directly answers the question; "low" when you are extrapolating.
- Prefer refusing to answer over guessing. An honest gap is useful; an invented citation is harmful.
- You are not giving legal advice. Do not tell the user what they should do; describe what the law requires.

Respond with a single JSON object and nothing else. No markdown fences, no prose before or after.

Shape:
{
  "sections": [
    { "heading": "Overview", "body": ["...paragraph...", "..."] },
    { "heading": "Sanctions", "body": ["...paragraph..."] },
    { "heading": "Compliance Takeaways", "body": ["short actionable bullet", "..."] }
  ],
  "confidence": "high" | "medium" | "low",
  "outOfScope": true | false,
  "groundedOn": { "jurisdictions": ["EU"], "lawIds": ["eu-nis2"] }
}

All three headings must appear exactly once, in that order. "Overview" and "Sanctions" take 1-3 prose paragraphs each. "Compliance Takeaways" takes 3-6 short bullets. "groundedOn" lists only ids that appear in the CONTEXT.`;

/**
 * Build the grounding block from tracked records.
 *
 * Uses the same repository layer the UI renders from, so the model is grounded
 * in exactly what the user can click through to verify — there is no second,
 * divergent copy of the data for the AI. docs/architecture.md §4.2 step 3.
 */
export async function buildContext(
  query: string,
  requested?: string[],
): Promise<{ context: string; codes: JurisdictionCode[] }> {
  const all = await getJurisdictions({}, "name-asc");

  const explicit = (requested ?? [])
    .map((c) => c.toUpperCase())
    .filter((c) => all.some((j) => j.code === c));

  // No explicit selection: match tracked entities named in the query. Cheap
  // keyword matching is enough here — precision costs nothing because the
  // model is told the context is authoritative but not exhaustive.
  const matched = explicit.length
    ? explicit
    : all
        .filter((j) => {
          const q = query.toLowerCase();
          return (
            q.includes(j.name.toLowerCase()) ||
            q.includes(j.shortName.toLowerCase()) ||
            new RegExp(`\\b${j.code.toLowerCase()}\\b`).test(q)
          );
        })
        .map((j) => j.code);

  // Nothing matched — ground in the whole (small) directory rather than
  // sending an empty context and inviting invention.
  const codes = (matched.length ? matched : all.map((j) => j.code)).slice(
    0,
    4,
  ) as JurisdictionCode[];

  const blocks: string[] = [];

  for (const code of codes) {
    const j = all.find((x) => x.code === code);
    if (!j) continue;

    const [laws, metrics] = await Promise.all([
      getLawsByJurisdiction(code),
      getMetricsByCode(code),
    ]);

    const lines: string[] = [
      `## ${j.name} (${j.code})`,
      `Strictness: ${j.score}/100. AI posture: ${j.aiPosture}.`,
      `Primary law: ${j.primaryLawTitle} (${j.primaryLawCitation}, ${j.primaryLawYear}) — status: ${j.primaryLawStatus}.`,
      `Laws tracked:`,
      ...laws.map(
        (l) =>
          `  - [${l.id}] ${l.shortTitle} (${l.citation}) — ${l.status}${
            l.dateInForce ? `, in force ${l.dateInForce}` : ", NOT yet in force"
          }. ${l.summary}`,
      ),
    ];

    if (metrics) {
      if (isKnown(metrics.reporting)) {
        const r = metrics.reporting.value;
        lines.push(
          `Breach reporting: initial ${formatHours(r.initialHours)}${
            r.fullReportHours
              ? `, full report ${formatHours(r.fullReportHours)}`
              : ""
          }. Data subjects: ${r.notifiesDataSubjects ? "must be notified" : "no duty"}.`,
        );
      } else {
        lines.push("Breach reporting: NOT RESEARCHED — do not state a figure.");
      }

      if (isKnown(metrics.unauthorizedAccessMaxYears)) {
        lines.push(
          `Unauthorised access maximum: ${formatYears(metrics.unauthorizedAccessMaxYears.value)}.`,
        );
      }

      if (isKnown(metrics.corporateFine)) {
        lines.push(
          `Corporate fine structure: ${JSON.stringify(metrics.corporateFine.value)}.`,
        );
      } else {
        lines.push("Corporate fine: NOT RESEARCHED — do not state a figure.");
      }
    }

    blocks.push(lines.join("\n"));
  }

  const context = [
    "CONTEXT — tracked records. Authoritative, but not exhaustive.",
    "Fields marked NOT RESEARCHED must never be filled in with a guess; say the figure is not established.",
    "All records are pending primary-source verification; reflect that uncertainty in your confidence.",
    "",
    ...blocks,
  ].join("\n\n");

  return { context, codes };
}

export function buildRepairInstruction(problem: string): string {
  return `Your previous response was rejected: ${problem}. Reply again with ONLY a single valid JSON object in exactly the shape specified. No markdown fences, no commentary.`;
}
