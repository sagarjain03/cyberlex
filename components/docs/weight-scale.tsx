"use client";

import { useRef } from "react";

import { Counter } from "@/components/docs/counter";
import { MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";
import { DIMENSIONS } from "@/lib/scoring/weights";

/**
 * One score, taken apart.
 *
 * Two views of the same six numbers: a composition bar showing how they add up
 * to a whole, and a ranked list showing what each one measures. Both draw
 * themselves as you arrive — the motion is the measurement being taken.
 *
 * The composition is a share-of-one-quantity, so it gets a **sequential ramp**
 * of a single hue (bone, stepped down by lightness in weight order) rather than
 * six categorical colours. Hues in this system mean legal state, and a weight is
 * not a legal state. Each segment is separated by a 2px gap of ground and keyed
 * to its row below by a matching swatch.
 *
 * `/methodology` remains the canonical table with the evidentiary basis for each
 * dimension; this is the same weights, read at a glance.
 */

/** Lightness steps, darkest last. Monotonic with weight, floor kept above 3:1. */
const TONE = [1, 0.88, 0.76, 0.64, 0.54, 0.45];

export function WeightScale() {
  const root = useRef<HTMLDivElement>(null);
  const heaviest = Math.max(...DIMENSIONS.map((d) => d.weight));

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from("[data-composition]", {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });

        el.querySelectorAll<HTMLElement>("[data-weight-row]").forEach((row) => {
          const bar = row.querySelector("[data-weight-bar]");
          if (!bar) return;

          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 90%",
                end: "top 55%",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="max-w-3xl">
      {/* ── Composition ──────────────────────────────────────────────────── */}
      <p className="text-micro text-ink-700">One score · six shares</p>

      <div
        data-composition
        className="mt-4 flex h-1.5 gap-0.5"
        role="img"
        aria-label={`Strictness score composition: ${DIMENSIONS.map(
          (d) => `${d.label} ${Math.round(d.weight * 100)} percent`,
        ).join(", ")}.`}
      >
        {DIMENSIONS.map((d, i) => (
          <span
            key={d.key}
            className="block bg-bone"
            style={{ flexGrow: d.weight, flexBasis: 0, opacity: TONE[i] }}
          />
        ))}
      </div>

      {/* ── Dimensions ───────────────────────────────────────────────────── */}
      <dl className="mt-12">
        {DIMENSIONS.map((d, i) => (
          <div key={d.key} data-weight-row className="border-t border-rule py-6">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="flex items-baseline gap-3 text-h3 text-ink-100">
                <span
                  aria-hidden="true"
                  className="block size-2 shrink-0 translate-y-px bg-bone"
                  style={{ opacity: TONE[i] }}
                />
                {d.label}
              </dt>
              <span className="shrink-0 text-data text-bone">
                <Counter value={Math.round(d.weight * 100)} pad={false} />%
              </span>
            </div>

            {/* Scaled against the heaviest dimension, not against 100 — at true
                scale a 0.10 weight would be a smudge. */}
            <div className="relative mt-4 h-px bg-rule" aria-hidden="true">
              <div
                data-weight-bar
                className="absolute inset-y-0 left-0 origin-left bg-bone"
                style={{ width: `${(d.weight / heaviest) * 100}%` }}
              />
            </div>

            <dd className="measure mt-4 text-body-sm text-ink-500">
              {d.definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
