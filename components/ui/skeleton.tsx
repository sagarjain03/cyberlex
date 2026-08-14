import { cn } from "@/lib/utils";

/**
 * Loading placeholder.
 *
 * Callers size these to match the real content's geometry — a skeleton that
 * doesn't match causes a layout shift when data lands, which is worse than a
 * spinner. docs/rules.md §7 gate.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block bg-riser/60", className)}
      style={{
        // Shimmer as an inline gradient sweep — one animation, no extra DOM.
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, rgba(166,162,155,0.08) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s linear infinite",
      }}
    />
  );
}
