import Link from "next/link";
import { Compass } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/states";
import { PRIMARY_NAV } from "@/lib/constants/nav";

export default function NotFound() {
  return (
    <PageShell
      eyebrow="404"
      title="No such page."
      lede="The route you asked for does not exist. These do."
    >
      <EmptyState
        icon={Compass}
        headline="Nothing here"
        body="If you followed a link from inside the app, that is a defect worth reporting."
      />

      <ul className="mx-auto max-w-md">
        {PRIMARY_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="row-mark flex items-center gap-3 border-t border-rule py-4 pl-3 transition-colors hover:bg-abyss last:border-b"
            >
              <item.icon
                className="size-4 text-ink-700"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-body-sm text-ink-100">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
