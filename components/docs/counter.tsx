"use client";

import { useRef } from "react";

import { MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";
import { padCount } from "@/lib/format";

/**
 * A figure that counts up once, as it arrives.
 *
 * The value is server-rendered — the tween only replaces the text while it is
 * on screen, and reduced motion means the number simply sits there.
 */
export function Counter({
  value,
  pad = true,
  className,
}: {
  value: number;
  /** Zero-pad below ten, matching the readout strip. */
  pad?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const render = (n: number) => (pad ? padCount(n) : String(n));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || value <= 0) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const counter = { n: 0 };

        gsap.fromTo(
          counter,
          { n: 0 },
          {
            n: value,
            duration: 1.1,
            ease: "power2.out",
            snap: { n: 1 },
            // Renders the zero state up front so the figure never pops from
            // its final value back to zero when the trigger catches up.
            immediateRender: true,
            onUpdate: () => {
              el.textContent = render(Math.round(counter.n));
            },
            scrollTrigger: { trigger: el, start: "top 94%" },
          },
        );
      });

      // The tween is reverted by the hook's context; the text it wrote is not,
      // so put the real figure back.
      return () => {
        el.textContent = render(value);
      };
    },
    { scope: ref, dependencies: [value, pad] },
  );

  return (
    <span ref={ref} className={className}>
      {render(value)}
    </span>
  );
}
