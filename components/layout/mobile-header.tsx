"use client";

import { Wordmark } from "@/components/layout/wordmark";
import { VerificationStatus } from "@/components/layout/top-nav";
import { useScrolled } from "@/hooks/use-scroll-state";
import { cn } from "@/lib/utils";

/**
 * Compact mobile masthead. Transparent at rest so the page opens uncluttered,
 * picking up the veil surface only once content scrolls beneath it.
 */
export function MobileHeader({ unverifiedCount }: { unverifiedCount: number }) {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b px-5 transition-colors duration-260 lg:hidden",
        scrolled ? "veil border-rule" : "border-transparent bg-void",
      )}
    >
      <Wordmark />
      <VerificationStatus count={unverifiedCount} />
    </header>
  );
}
