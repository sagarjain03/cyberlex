"use client";

import { useRef } from "react";

import { Counter } from "@/components/docs/counter";
import { EASE, MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";

export interface HeroStat {
  label: string;
  value: number;
  /** Set for figures that read as quantities rather than instrument counts. */
  plain?: boolean;
}

/**
 * The one place in the product that opens with a set piece.
 *
 * Words arrive on mount, the block drifts and dims as it leaves — a depth cue
 * for "you are at the top of a long document", which is the only thing the
 * reader needs to know here. Everything is server-rendered first: with JS off
 * the headline, the lede and every figure are already on the page.
 */
export function DocsHero({ stats }: { stats: readonly HeroStat[] }) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from("[data-word]", {
            yPercent: 70,
            opacity: 0,
            duration: 0.9,
            stagger: 0.055,
          })
          .from(
            "[data-hero-item]",
            { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 },
            "-=0.55",
          );

        // Drift and dim on the way out. Scrubbed against native scroll — the
        // page is never taken over, only read.
        gsap.to(content.current, {
          yPercent: -10,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to("[data-hero-light]", {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom 40%",
            scrub: true,
          },
        });

        gsap.to("[data-hero-cue]", {
          yPercent: 55,
          opacity: 0.15,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative">
      {/* The system's single ambient gradient, reused from the console. */}
      <div
        data-hero-light
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-14 h-[28rem] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(242,239,233,0.05),transparent_70%)]"
      />

      <div ref={content} className="relative pb-16 pt-14 lg:pb-24 lg:pt-24">
        <p data-hero-item className="text-micro text-ink-500">
          Documentation · Read once
        </p>

        <h1 className="mt-6 text-display-sm text-bone lg:text-display">
          <span data-word className="inline-block">
            What
          </span>{" "}
          <span data-word className="inline-block">
            this
          </span>{" "}
          <span data-word className="inline-block">
            is,
          </span>{" "}
          <span data-word className="inline-block font-serif italic text-ink-500">
            and
          </span>{" "}
          <span data-word className="inline-block font-serif italic text-ink-500">
            how
          </span>{" "}
          <span data-word className="inline-block">
            to
          </span>{" "}
          <span data-word className="inline-block">
            drive
          </span>{" "}
          <span data-word className="inline-block">
            it.
          </span>
        </h1>

        <p data-hero-item className="measure mt-8 text-body text-ink-300">
          CyberLex Global tracks cyber law from statute to commencement, so you
          can tell the difference between a regime that has passed a law and one
          that can actually enforce it. This page is the manual: what each
          surface answers, what every word in the interface means, and where the
          product stops being reliable.
        </p>

        <dl
          data-hero-item
          className="mt-12 grid grid-cols-2 border-t border-rule sm:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map((s) => (
            // Bottom rule only — a right rule on the last cell of a wrapping
            // grid draws a box edge where there is no box.
            <div key={s.label} className="border-b border-rule py-5 pr-6">
              <dd className="text-data-lg text-bone">
                <Counter value={s.value} pad={!s.plain} />
              </dd>
              <dt className="mt-2 text-micro text-ink-700">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex items-center gap-4">
          <span
            aria-hidden="true"
            className="relative block h-8 w-px overflow-hidden bg-rule-strong"
          >
            <span
              data-hero-cue
              className="absolute inset-x-0 top-0 block h-3 bg-bone"
            />
          </span>
          <span className="text-micro text-ink-700">Scroll</span>
        </div>
      </div>
    </section>
  );
}
