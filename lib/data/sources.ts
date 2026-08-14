import { sources } from "@/data/sources";
import type { Source, SourceRef } from "@/types";

export interface ResolvedSource extends Source {
  pinpoint?: string;
}

/**
 * Turn citation refs into full source records.
 *
 * A ref pointing at a missing source is dropped rather than rendered as a dead
 * citation — but it throws in development so the data error surfaces at the
 * point it is introduced rather than silently degrading the product's central
 * credibility claim.
 */
export function resolveSources(refs: SourceRef[]): ResolvedSource[] {
  return refs.flatMap<ResolvedSource>((ref) => {
    const source = sources.find((s) => s.id === ref.sourceId);
    if (!source) {
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          `Unknown sourceId "${ref.sourceId}". Add it to data/sources.ts.`,
        );
      }
      return [];
    }
    return [
      ref.pinpoint ? { ...source, pinpoint: ref.pinpoint } : { ...source },
    ];
  });
}

export async function getSources(): Promise<Source[]> {
  return sources;
}

export async function getSourceById(id: string): Promise<Source | null> {
  return sources.find((s) => s.id === id) ?? null;
}
