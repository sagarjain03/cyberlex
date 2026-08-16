"use client";

import { useRef } from "react";

import { MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";
import { cn } from "@/lib/utils";

/**
 * A hairline that draws itself against scroll position.
 *
 * Scrubbed rather than triggered, so the line is a readout of how far through
 * the block you are — the rule's length carries information the whole time it
 * is on screen, which is the bar §6 of docs/design.md sets for motion.
 *
 * With JS off or reduced motion set, the rule renders complete. Nothing is
 * behind it.
 */
export function TraceLine({
  orientation = "x",
  className,
  start,
  end,
}: {
  orientation?: "x" | "y";
  className?: string;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const vertical = orientation === "y";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 },
          {
            scaleX: 1,
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: start ?? (vertical ? "top 82%" : "top 92%"),
              end: end ?? (vertical ? "bottom 55%" : "bottom 65%"),
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "block bg-rule-strong",
        vertical ? "w-px origin-top" : "h-px origin-left",
        className,
      )}
    />
  );
}
