import { laws } from "@/data/laws";
import type { Law, LegalStatus } from "@/types";

import { resolveSources, type ResolvedSource } from "./sources";

export interface LawWithSources extends Law {
  resolvedSources: ResolvedSource[];
}

export async function getLaws(status?: LegalStatus): Promise<Law[]> {
  return status ? laws.filter((l) => l.status === status) : laws;
}

export async function getLawsByJurisdiction(code: string): Promise<Law[]> {
  const upper = code.toUpperCase();
  return laws.filter((l) => l.jurisdictionCode === upper);
}

export async function getLawById(id: string): Promise<LawWithSources | null> {
  const law = laws.find((l) => l.id === id);
  if (!law) return null;
  return { ...law, resolvedSources: resolveSources(law.sources) };
}

/**
 * Laws that are law but not yet enforceable. The product's headline claim, so
 * it gets a dedicated accessor rather than a filter callers must remember.
 */
export async function getUnnotifiedLaws(): Promise<Law[]> {
  return laws.filter((l) => l.status === "unnotified");
}

/** Staged instruments with at least one obligation not yet applicable. */
export async function getPartiallyInForceLaws(): Promise<Law[]> {
  return laws.filter(
    (l) =>
      l.status === "partially-in-force" &&
      (l.phases?.some((p) => !p.inForce) ?? false),
  );
}
