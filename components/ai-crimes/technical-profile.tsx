import type { TechnicalProfile as Profile } from "@/types";

/**
 * Defensive technical description.
 *
 * ⚠️ Framing rule, enforced by review: describe what the technique *is* and how
 * defenders recognise it. Never how to execute it. docs/phases.md Phase 6.
 */
export function TechnicalProfile({ profile }: { profile: Profile }) {
  return (
    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <p className="text-micro text-ink-700">Mechanism</p>
        <p className="measure mt-3 text-body text-ink-300">
          {profile.howItWorks}
        </p>
      </div>

      <div>
        <p className="text-micro text-ink-700">Indicators</p>
        <ul className="mt-3">
          {profile.indicators.map((i) => (
            <li
              key={i}
              className="border-t border-rule py-3 text-body-sm text-ink-300 last:border-b"
            >
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
