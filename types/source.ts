/** What kind of document a citation points at. */
export type SourceType =
  | "primary-legislation"
  | "official-guidance"
  | "regulator"
  | "gazette"
  | "parliamentary"
  | "treaty";

/**
 * How far a record has been checked against its primary source.
 *
 * `needs-review` is the honest default for anything authored without a human
 * reading the cited instrument end to end. Records must reach `verified`
 * before launch — see `docs/phases.md` Phase 8.
 */
export type VerificationStatus = "verified" | "needs-review" | "unverified";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  /** Official URL. Never a news article, blog, or law-firm summary. */
  url: string;
  type: SourceType;
  /** ISO date the URL was last resolved. */
  retrieved: string;
}

export interface SourceRef {
  sourceId: string;
  /** Pinpoint reference — article, section, or schedule. */
  pinpoint?: string;
}

/**
 * Every record carrying a legal fact must implement this. Enforced by review,
 * not by the compiler alone: an uncited figure does not ship.
 * docs/rules.md §2.6.
 */
export interface Sourced {
  sources: SourceRef[];
  /** ISO date the fact was last checked. */
  lastVerified: string;
  verification: VerificationStatus;
}
