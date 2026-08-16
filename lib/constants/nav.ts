import {
  BookOpen,
  BrainCircuit,
  FileClock,
  LayoutGrid,
  Ruler,
  Scale,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  /** Full label — desktop top nav. */
  label: string;
  /** Abbreviated label — mobile bottom nav (fits 5-up at 320px). */
  shortLabel: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Single source of truth for navigation. Consumed by both `TopNav` and
 * `BottomNav` — there is no second list. docs/architecture.md §1.2.
 *
 * Exactly five items: the maximum a mobile bottom nav holds without crowding.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Dashboard", shortLabel: "Dash", href: "/", icon: LayoutGrid },
  { label: "Compare", shortLabel: "Compare", href: "/compare", icon: Scale },
  { label: "Tracker", shortLabel: "Tracker", href: "/tracker", icon: FileClock },
  {
    label: "AI Crimes",
    shortLabel: "AI Crime",
    href: "/ai-crimes",
    icon: BrainCircuit,
  },
  {
    label: "Assistant",
    shortLabel: "Assist",
    href: "/assistant",
    icon: Sparkles,
  },
] as const;

/**
 * The manual. Deliberately outside `PRIMARY_NAV` — that list is capped at five
 * because the mobile bottom nav is — so the masthead and mobile header render
 * it explicitly as a trailing link instead of adding a sixth tab.
 */
export const DOCS_NAV: NavItem = {
  label: "Docs",
  shortLabel: "Docs",
  href: "/docs",
  icon: BookOpen,
};

/** Reached contextually and from the footer — never in the primary nav. */
export const SECONDARY_NAV: readonly NavItem[] = [
  DOCS_NAV,
  {
    label: "Methodology",
    shortLabel: "Method",
    href: "/methodology",
    icon: Ruler,
  },
] as const;

/**
 * Active-state test. `/` matches only itself; every other route also matches
 * its descendants (`/ai-crimes/deepfakes` keeps "AI Crimes" active).
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
