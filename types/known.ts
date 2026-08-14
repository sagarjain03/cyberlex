/**
 * A legal fact that may legitimately be absent — and the reason matters.
 *
 * "This jurisdiction has no provision covering X" and "we have not researched X
 * yet" are different claims, and conflating them into a blank cell or `null` is
 * the most misleading thing this product could do. The UI renders all three
 * states distinctly. docs/rules.md §2.6.
 */
export type Known<T> =
  | { readonly kind: "known"; readonly value: T }
  | { readonly kind: "no-provision" }
  | { readonly kind: "not-researched" };

export const NO_PROVISION = { kind: "no-provision" } as const;
export const NOT_RESEARCHED = { kind: "not-researched" } as const;

export function known<T>(value: T): Known<T> {
  return { kind: "known", value };
}

export function isKnown<T>(
  k: Known<T>,
): k is { readonly kind: "known"; readonly value: T } {
  return k.kind === "known";
}

/** Unwrap, or `undefined` when the fact is absent for either reason. */
export function valueOf<T>(k: Known<T>): T | undefined {
  return k.kind === "known" ? k.value : undefined;
}

/** Human-readable label for the two absent states. */
export function absentLabel(k: Known<unknown>): string | null {
  switch (k.kind) {
    case "known":
      return null;
    case "no-provision":
      return "No specific provision";
    case "not-researched":
      return "Not yet researched";
    default: {
      const _exhaustive: never = k;
      return _exhaustive;
    }
  }
}
