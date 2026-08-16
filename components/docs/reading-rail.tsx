"use client";

import { useRef, useState } from "react";

import { ScrollTrigger, gsap, useGSAP } from "@/components/docs/gsap-core";
import { DOC_SECTIONS } from "@/lib/constants/docs";
import { cn } from "@/lib/utils";

/**
 * Where you are in a long document, said twice: a hairline across the top of
 * the viewport, and a section index pinned to the right margin on wide screens.
 *
 * Both are readouts of native scroll position — nothing here moves the page.
 * The section links are ordinary anchors, so they work before hydration.
 */
export function ReadingRail() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(DOC_SECTIONS[0].id);

  useGSAP(
    () => {
      const bar = root.current?.querySelector("[data-rail-progress]");
      if (!bar) return;

      const setScale = gsap.quickSetter(bar, "scaleX");
      setScale(0);

      // Whole-document progress: no trigger element, just the scroller.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setScale(self.progress),
      });

      // The sections live in the page around this component, not inside it.
      DOC_SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActive(s.id),
          onEnterBack: () => setActive(s.id),
        });
      });

      // Web fonts land after first paint and change every measurement the
      // triggers were built from.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <span
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 block h-px origin-left bg-bone"
        data-rail-progress
      />

      {/* Only where the margin is genuinely free — below this the rail would
          crowd the measure. */}
      <nav
        aria-label="On this page"
        className="fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 2xl:block"
      >
        <ol>
          {DOC_SECTIONS.map((s) => {
            const current = s.id === active;

            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={current ? "true" : undefined}
                  className="group flex items-center gap-3 py-1.5"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-px origin-right transition-all duration-260",
                      current
                        ? "w-6 bg-bone"
                        : "w-3 bg-rule-strong group-hover:w-5 group-hover:bg-ink-500",
                    )}
                  />
                  <span
                    className={cn(
                      "text-micro transition-colors",
                      current
                        ? "text-bone"
                        : "text-ink-700 group-hover:text-ink-300",
                    )}
                  >
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
