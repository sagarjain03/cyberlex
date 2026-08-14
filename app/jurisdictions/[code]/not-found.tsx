import Link from "next/link";
import { MapPinOff } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/states";
import { getJurisdictions } from "@/lib/data";

export default async function NotFound() {
  const jurisdictions = await getJurisdictions({}, "name-asc");

  return (
    <PageShell
      eyebrow="404"
      title="Not a tracked jurisdiction."
      lede="v1 covers ten jurisdictions at national or bloc level. Sub-national law is out of scope."
    >
      <EmptyState
        icon={MapPinOff}
        headline="No such jurisdiction"
        body="These are the ten currently tracked."
      />

      <ul className="mx-auto max-w-md">
        {jurisdictions.map((j) => (
          <li key={j.code}>
            <Link
              href={`/jurisdictions/${j.code.toLowerCase()}`}
              className="row-mark flex items-baseline gap-3 border-t border-rule py-3 pl-3 transition-colors last:border-b hover:bg-abyss"
            >
              <span className="w-7 shrink-0 text-code text-ink-700">
                {j.code}
              </span>
              <span className="text-body-sm text-ink-100">{j.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
