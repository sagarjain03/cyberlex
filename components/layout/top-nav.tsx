"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Wordmark } from "@/components/layout/wordmark";
import { useScrolled } from "@/hooks/use-scroll-state";
import { DOCS_NAV, PRIMARY_NAV, isActiveRoute } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";

interface TopNavProps {
  /** Records still awaiting primary-source verification. See data/README.md. */
  unverifiedCount: number;
}

/**
 * Desktop masthead: wordmark, five text links, verification status.
 *
 * No icons, no buttons, no pill backgrounds — the active link is bone with a
 * hairline underline, everything else is ink-500. docs/design.md §7.
 */
export function TopNav({ unverifiedCount }: TopNavProps) {
  const pathname = usePathname();
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 hidden h-14 shrink-0 items-center justify-between gap-6 border-b px-8 transition-colors duration-260 lg:flex",
        scrolled ? "veil border-rule" : "border-rule bg-void",
      )}
    >
      <Wordmark />

      <nav aria-label="Primary" className="flex items-center gap-7">
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActiveRoute(pathname, item.href)}
          />
        ))}

        {/* The manual sits after a hairline: reachable from every page, but
            visibly not one of the five working surfaces. */}
        <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
        <NavLink
          href={DOCS_NAV.href}
          label={DOCS_NAV.label}
          active={isActiveRoute(pathname, DOCS_NAV.href)}
        />
      </nav>

      <VerificationStatus count={unverifiedCount} />
    </header>
  );
}

/** Bone when active, with a hairline that grows from the left. No pills. */
function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative py-1 text-body-sm transition-colors",
        active ? "text-bone" : "text-ink-500 hover:text-ink-100",
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-px h-px origin-left bg-bone transition-transform duration-260",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </Link>
  );
}

/**
 * Deliberately prominent. While records are unverified the product must say so
 * everywhere, not only on the page that happens to render them.
 */
export function VerificationStatus({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="flex items-center gap-2">
        <span className="size-1 bg-live" />
        <span className="text-micro text-ink-500">Verified</span>
      </span>
    );
  }

  return (
    <Link
      href="/methodology#verification"
      className="group flex items-center gap-2"
      title="All records are pending primary-source verification"
    >
      <span className="size-1 animate-breathe bg-pending" />
      <span className="text-micro text-ink-500 transition-colors group-hover:text-ink-300">
        {count} unverified
      </span>
    </Link>
  );
}
