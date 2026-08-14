import { cn } from "@/lib/utils";
import { PREVALENCE_LABEL, SEVERITY_LABEL, SEVERITY_TOKEN } from "@/types";
import type { CrimeSeverity, Prevalence } from "@/types";

const DOT: Record<string, string> = {
  critical: "bg-critical",
  draft: "bg-draft",
  pending: "bg-pending",
  live: "bg-live",
};

const TEXT: Record<string, string> = {
  critical: "text-critical",
  draft: "text-draft",
  pending: "text-pending",
  live: "text-live",
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: CrimeSeverity;
  className?: string;
}) {
  const token = SEVERITY_TOKEN[severity];

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span className={cn("size-1 shrink-0", DOT[token])} aria-hidden="true" />
      <span className={cn("text-code", TEXT[token])}>
        {SEVERITY_LABEL[severity]}
      </span>
    </span>
  );
}

export function PrevalenceLabel({
  prevalence,
  className,
}: {
  prevalence: Prevalence;
  className?: string;
}) {
  return (
    <span className={cn("text-code text-ink-500", className)}>
      {PREVALENCE_LABEL[prevalence]}
    </span>
  );
}
