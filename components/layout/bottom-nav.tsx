"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PRIMARY_NAV, isActiveRoute } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";

/**
 * Mobile primary navigation. Five items — the maximum that fits at 320px
 * without crowding, which is why `PRIMARY_NAV` is capped at five.
 *
 * Sits above the iOS home indicator via `env(safe-area-inset-bottom)`; pages
 * carry matching bottom padding so nothing hides behind it.
 * docs/design.md §7.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="veil-strong fixed inset-x-0 bottom-0 z-40 border-t border-rule lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex h-16">
        {PRIMARY_NAV.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative flex size-full min-h-11 flex-col items-center justify-center gap-1.5"
              >
                {/* Active indicator sits above the icon, not behind it. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-0 h-px w-7 origin-center bg-bone transition-transform duration-260",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
                <Icon
                  className={cn(
                    "size-5 transition-colors",
                    active ? "text-bone" : "text-ink-500",
                  )}
                  strokeWidth={active ? 1.75 : 1.5}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-micro transition-colors",
                    active ? "text-bone" : "text-ink-500",
                  )}
                >
                  {item.shortLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
