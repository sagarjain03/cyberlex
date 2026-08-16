"use client";

import { useRef } from "react";

import { MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";
import { cn } from "@/lib/utils";

export interface PipelineDatum {
  stage: string;
  label: string;
  count: number;
  /** The stage where an instrument has passed and still binds no one. */
  isGap?: boolean;
}

/**
 * Where the tracked instruments actually sit in the pipeline.
 *
 * Ordered by the pipeline, never by size — the sequence is the information. One
 * hue for magnitude, with the single stage the product exists to surface picked
 * out in the reserved `pending` token and named in words beside it.
 *
 * Counts are direct-labelled, so nothing depends on comparing bar lengths by eye.
 */
export function PipelineChart({ data }: { data: readonly PipelineDatum[] }) {
  const root = useRef<HTMLOListElement>(null);
  const max = Math.max(1, ...data.map((d) => d.count));

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(el.querySelectorAll("[data-pipe-bar]"), {
          scaleX: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="max-w-3xl">
      {data.map((d) => (
        <li
          key={d.stage}
          className="grid grid-cols-[10rem_1fr_2rem] items-center gap-4 border-t border-rule py-3 last:border-b"
        >
          <span
            className={cn(
              "truncate text-body-sm",
              d.isGap ? "text-pending" : "text-ink-300",
            )}
          >
            {d.label}
          </span>

          <span className="block h-px bg-rule" aria-hidden="true">
            <span
              data-pipe-bar
              className={cn(
                "block h-px origin-left",
                d.isGap ? "bg-pending" : "bg-ink-500",
              )}
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </span>

          <span
            className={cn(
              "text-right text-data",
              d.isGap ? "text-pending" : "text-bone",
            )}
          >
            {d.count}
          </span>
        </li>
      ))}
    </ol>
  );
}
