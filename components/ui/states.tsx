import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Empty and error states.
 *
 * Both are designed rather than defaulted: an empty filter result and a failed
 * fetch are different situations and must not both render "No results".
 * docs/rules.md §7 gate.
 */
function StateFrame({
  icon: Icon,
  tone,
  headline,
  body,
  action,
  className,
}: {
  icon: LucideIcon;
  tone: "null" | "critical";
  headline: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-16 text-center",
        className,
      )}
    >
      <Icon
        className={cn(
          "size-8",
          tone === "critical" ? "text-critical" : "text-ink-700",
        )}
        strokeWidth={1.25}
        aria-hidden="true"
      />
      <h3 className="mt-5 text-h3 text-ink-100">{headline}</h3>
      <p className="mt-2 max-w-[42ch] text-body-sm text-ink-500">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function EmptyState(
  props: Omit<Parameters<typeof StateFrame>[0], "tone">,
) {
  return <StateFrame {...props} tone="null" />;
}

export function ErrorState(
  props: Omit<Parameters<typeof StateFrame>[0], "tone">,
) {
  return <StateFrame {...props} tone="critical" />;
}

/**
 * The bone-on-black action. Square, hairline, no gradient — the system has
 * exactly one button style.
 */
export function ActionLink({
  href,
  children,
  onClick,
  variant = "outline",
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "outline" | "solid";
}) {
  const cls = cn(
    "inline-flex items-center gap-2 rounded-sm px-4 py-2 text-micro transition-colors",
    variant === "solid"
      ? "bg-bone text-void hover:bg-ink-100"
      : "border border-rule-strong text-ink-300 hover:border-bone hover:text-bone",
  );

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
