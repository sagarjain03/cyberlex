import type { JurisdictionCode } from "./jurisdiction";

export type ConfidenceLevel = "high" | "medium" | "low";

/** One titled block of the structured AI answer. docs/prd.md M5-2. */
export interface SummarySection {
  heading: "Overview" | "Sanctions" | "Compliance Takeaways";
  /** Prose for Overview/Sanctions; bullets for Compliance Takeaways. */
  body: string[];
}

export interface LegalSummary {
  query: string;
  sections: SummarySection[];
  confidence: ConfidenceLevel;
  /** True when the question falls outside what CyberLex tracks. M5-4. */
  outOfScope: boolean;
  /** Tracked record ids the answer drew on, resolved to in-app links. M5-3. */
  groundedOn: {
    jurisdictions: JurisdictionCode[];
    lawIds: string[];
  };
}

export interface SummarizeRequest {
  query: string;
  jurisdictionCodes?: JurisdictionCode[];
}

/**
 * Every failure mode in docs/rules.md §4.3 maps to exactly one of these.
 * The client switches on `code`, never on `message` text.
 */
export type ApiErrorCode =
  | "RATE_LIMITED"
  | "UPSTREAM_RATE_LIMITED"
  | "TIMEOUT"
  | "UPSTREAM_ERROR"
  | "AI_UNAVAILABLE"
  | "MALFORMED_RESPONSE"
  | "EMPTY_RESPONSE"
  | "INVALID_QUERY"
  | "PAYLOAD_TOO_LARGE"
  | "NETWORK_ERROR";

export type SummarizeResponse =
  | { ok: true; data: LegalSummary }
  | {
      ok: false;
      code: ApiErrorCode;
      /** User-facing copy. Never an upstream body, stack trace, or key. */
      message: string;
      retryAfterSeconds?: number;
      /** Correlation id for support; full detail is logged server-side only. */
      traceId?: string;
    };
