"use client";

import { useRef } from "react";

import { MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";
import { ScoreRule } from "@/components/shared/score-rule";
import { getStrictnessBand } from "@/lib/constants/thresholds";

export interface StrictnessDatum {
  code: string;
  shortName: string;
  score: number;
}

/**
 * Every tracked regime on one axis, ranked.
 *
 * The row *is* the product's `ScoreRule`, so a score reads identically here and
 * on the console — one meter, one meaning. Each row carries its number and its
 * band name as text: the band hues are close enough in low-vision and
 * colour-blind rendering that they are reinforcement only, never the channel.
 *
 * One axis, 0–100, shared by every row. The median is drawn once as a reference
 * line rather than repeated per row.
 */
export function StrictnessChart({
  data,
  median,
}: {
  data: readonly StrictnessDatum[];
  median: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tracks = el.querySelectorAll("[data-score-track]");

        gsap.from(tracks, {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 78%" },
        });

        gsap.from("[data-median]", {
          scaleY: 0,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="max-w-3xl">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-micro text-ink-500">
          Strictness · {data.length} regimes
        </p>
        <p className="text-code text-ink-700">0 — 100</p>
      </div>

      <div className="relative mt-8">
        {/* Reference line. Inset on the right by the width of `ScoreRule`s
            trailing number column, so it lands on the same axis as the rules. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 right-9"
        >
          <div
            data-median
            className="absolute inset-y-0 w-px origin-top bg-rule-strong"
            style={{ left: `${median}%` }}
          />
          <span
            className="absolute -top-6 -translate-x-1/2 whitespace-nowrap text-code text-ink-700"
            style={{ left: `${median}%` }}
          >
            median {median}
          </span>
        </div>

        <ol>
          {data.map((d) => {
            const band = getStrictnessBand(d.score);

            return (
              <li key={d.code} className="border-t border-rule py-4 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="truncate text-body-sm text-ink-100">
                    <span className="text-code text-ink-700">{d.code}</span>{" "}
                    {d.shortName}
                  </span>
                  <span className="shrink-0 text-code text-ink-500">
                    {band.label}
                  </span>
                </div>

                <ScoreRule score={d.score} showLabel={false} className="mt-3" />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
