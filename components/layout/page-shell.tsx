import { Disclaimer } from "@/components/ui/disclaimer";
import { cn } from "@/lib/utils";

/**
 * Frame for ordinary scrolling pages.
 *
 * The dashboard is a fixed-height console and does not use this — everything
 * else does, so page rhythm and the footer disclaimer stay in one place.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  actions,
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 lg:px-8", className)}>
      <header className="border-b border-rule pb-10 pt-10 lg:pb-14 lg:pt-16">
        <p className="text-micro text-ink-500">{eyebrow}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-display-sm text-bone">{title}</h1>
          {actions}
        </div>
        {lede && (
          <p className="measure mt-6 text-body text-ink-300">{lede}</p>
        )}
      </header>

      <div className="py-10 lg:py-14">{children}</div>

      <footer className="border-t border-rule py-8">
        <Disclaimer />
      </footer>
    </div>
  );
}

/** Section divider used inside `PageShell`. */
export function Section({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-12 first:mt-0 lg:mt-16", className)}>
      <h2 className="text-micro text-ink-500">{label}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
