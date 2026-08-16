"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  EASE,
  MOTION_OK,
  ScrollTrigger,
  gsap,
  useGSAP,
} from "@/components/docs/gsap-core";
import { DOC_MODULES } from "@/lib/constants/docs";
import { cn } from "@/lib/utils";

/**
 * The product tour: five surfaces, one per screen-height of scroll.
 *
 * The left pane is `position: sticky` — CSS, not a GSAP pin — so the browser
 * keeps ownership of the scroll and there is no pin-spacer to fight with the
 * sticky masthead. GSAP only *reads* position here: which module you are inside,
 * and how far through the section you have travelled. docs/rules.md §1.4 r.7.
 */
export function ModuleTour() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const blocks = Array.from(
        el.querySelectorAll<HTMLElement>("[data-module-block]"),
      );
      const mm = gsap.matchMedia();

      // Which module is being read. Informational, so it runs regardless of
      // motion preference — nothing here animates.
      mm.add("(min-width: 1024px)", () => {
        blocks.forEach((block, i) => {
          ScrollTrigger.create({
            trigger: block,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });
        });
      });

      mm.add(MOTION_OK, () => {
        blocks.forEach((block) => {
          const parts = block.querySelectorAll("[data-module-reveal]");
          if (parts.length === 0) return;

          gsap.from(parts, {
            opacity: 0,
            y: 18,
            duration: 0.6,
            stagger: 0.07,
            ease: EASE,
            scrollTrigger: { trigger: block, start: "top 80%" },
          });
        });

        // Travel through the section, drawn against the module list.
        gsap.fromTo(
          "[data-tour-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 55%",
              end: "bottom 75%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  const current = DOC_MODULES[active];

  return (
    <div
      ref={root}
      className="mt-10 grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16"
    >
      {/* ── Sticky pane ──────────────────────────────────────────────────── */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          {/* All five numerals stack; only the active one is lit, so the
              crossfade never reflows the block beneath it. */}
          <div className="relative h-14" aria-hidden="true">
            {DOC_MODULES.map((m, i) => (
              <span
                key={m.index}
                className={cn(
                  "absolute inset-0 text-data-xl transition-opacity duration-260",
                  i === active ? "text-bone opacity-100" : "opacity-0",
                )}
              >
                {m.index}
              </span>
            ))}
          </div>

          <p className="mt-6 font-serif text-h2 italic text-ink-100">
            {current.label}
          </p>

          <div className="mt-8 flex gap-4">
            <span
              aria-hidden="true"
              className="relative block w-px shrink-0 bg-rule"
            >
              <span
                data-tour-progress
                className="absolute inset-0 block origin-top bg-bone"
              />
            </span>

            <nav aria-label="Modules" className="flex-1">
              <ol>
                {DOC_MODULES.map((m, i) => (
                  <li key={m.index}>
                    <a
                      href={`#module-${m.index}`}
                      className={cn(
                        "flex items-baseline gap-3 py-2 text-body-sm transition-colors",
                        i === active
                          ? "text-bone"
                          : "text-ink-500 hover:text-ink-100",
                      )}
                    >
                      <span className="text-code text-ink-700">{m.index}</span>
                      {m.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <Link
            href={current.href}
            className="mt-8 inline-flex items-center gap-2 border-b border-rule-strong pb-1 text-micro text-ink-300 transition-colors hover:border-bone hover:text-bone"
          >
            Open {current.label}
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </aside>

      {/* ── Blocks ───────────────────────────────────────────────────────── */}
      <div className="space-y-20 lg:space-y-36">
        {DOC_MODULES.map((m) => {
          const Icon = m.icon;

          return (
            <article
              key={m.index}
              id={`module-${m.index}`}
              data-module-block
              className="scroll-mt-24"
            >
              <header
                data-module-reveal
                className="flex items-center gap-3 border-t border-rule pt-5"
              >
                <Icon
                  className="size-4 text-ink-500"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="text-micro text-ink-500">
                  {m.index} · {m.label}
                </span>
              </header>

              <h3
                data-module-reveal
                className="measure mt-6 text-serif-lead text-bone"
              >
                {m.question}
              </h3>

              <p data-module-reveal className="measure mt-5 text-body text-ink-300">
                {m.summary}
              </p>

              <ol data-module-reveal className="mt-8 max-w-3xl">
                {m.steps.map((step, i) => (
                  <li
                    key={step}
                    className="row-mark flex gap-5 border-t border-rule py-4 pl-4 last:border-b"
                  >
                    <span className="shrink-0 text-code text-ink-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body-sm text-ink-300">{step}</span>
                  </li>
                ))}
              </ol>

              <div
                data-module-reveal
                className="mt-6 max-w-3xl border-l border-pending/40 bg-pending/[0.04] py-3 pl-4 pr-3"
              >
                <p className="text-micro text-pending">Read it correctly</p>
                <p className="mt-2 text-body-sm text-ink-300">{m.caution}</p>
              </div>

              <Link
                data-module-reveal
                href={m.href}
                className="mt-6 inline-flex items-center gap-2 border-b border-rule-strong pb-1 text-micro text-ink-300 transition-colors hover:border-bone hover:text-bone lg:hidden"
              >
                Open {m.label}
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
