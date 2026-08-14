import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Serif name against a mono qualifier — the type pairing that carries the
 * identity, at its smallest scale. docs/design.md §7.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-baseline gap-2.5", className)}
      aria-label="CyberLex Global — home"
    >
      <span className="font-serif text-[1.375rem] leading-none tracking-tight text-bone">
        CyberLex
      </span>
      <span className="text-micro text-ink-500 transition-colors group-hover:text-ink-300">
        Global
      </span>
    </Link>
  );
}
