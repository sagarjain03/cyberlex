"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Wordmark } from "@/components/layout/wordmark";
import { VerificationStatus } from "@/components/layout/top-nav";
import { useScrolled } from "@/hooks/use-scroll-state";
import { DOCS_NAV, isActiveRoute } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";

/**
 * Compact mobile masthead. Transparent at rest so the page opens uncluttered,
 * picking up the veil surface only once content scrolls beneath it.
 *
 * Carries the docs link, since the bottom nav is full at five items.
 */
export function MobileHeader({ unverifiedCount }: { unverifiedCount: number }) {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const docsActive = isActiveRoute(pathname, DOCS_NAV.href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b px-5 transition-colors duration-260 lg:hidden",
        scrolled ? "veil border-rule" : "border-transparent bg-void",
      )}
    >
      <Wordmark />

      <div className="flex items-center gap-4">
        <Link
          href={DOCS_NAV.href}
          aria-current={docsActive ? "page" : undefined}
          className={cn(
            // Full-height hit area — the header is 56px, clearing the 44px floor.
            "flex h-11 items-center text-micro transition-colors",
            docsActive ? "text-bone" : "text-ink-500",
          )}
        >
          {DOCS_NAV.label}
        </Link>
        <VerificationStatus count={unverifiedCount} />
      </div>
    </header>
  );
}
