import type { LucideIcon } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";

/**
 * Placeholder for a route whose module has not been built yet.
 *
 * Deliberately states which phase delivers it and what it will contain, rather
 * than showing a generic "coming soon" — a stub that describes the real thing
 * is testable navigation, and it keeps the build plan visible in the product.
 */
export function PhaseStub({
  eyebrow,
  title,
  lede,
  phase,
  icon: Icon,
  willInclude,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  phase: string;
  icon: LucideIcon;
  willInclude: string[];
}) {
  return (
    <PageShell eyebrow={eyebrow} title={title} lede={lede}>
      {/* No top border: PageShell's header already closes with one, and two
          hairlines a few rem apart read as an empty band. */}
      <div>
        <div className="flex items-center gap-3">
          <Icon
            className="size-4 text-ink-700"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-micro text-ink-500">{phase}</p>
        </div>

        <ul className="mt-6 max-w-2xl">
          {willInclude.map((item) => (
            <li
              key={item}
              className="border-t border-rule py-3 text-body-sm text-ink-300 last:border-b"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
