"use client";

import Link from "next/link";
import { useRef } from "react";

import { EASE, MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";
import { DOC_FLOW } from "@/lib/constants/docs";

/**
 * How the five paths through the product fit together — and that every one of
 * them terminates at a cited primary source.
 *
 * Built from hairlines rather than boxes: each row is one continuous rule with
 * three blocks hanging beneath it, so the diagram is drawn in the same language
 * as the rest of the interface (docs/design.md §3 — depth from rules, not cards).
 * The rules draw themselves left-to-right as the row arrives, which is the
 * direction you are meant to read them.
 */
export function JourneyFlow() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        el.querySelectorAll<HTMLElement>("[data-flow-row]").forEach((row) => {
          gsap
            .timeline({
              defaults: { ease: EASE },
              scrollTrigger: { trigger: row, start: "top 82%" },
            })
            .from(row.querySelectorAll("[data-flow-node]"), {
              opacity: 0,
              y: 14,
              duration: 0.5,
              stagger: 0.12,
            })
            .from(
              row.querySelectorAll("[data-flow-line]"),
              { scaleX: 0, scaleY: 0, duration: 0.45, stagger: 0.12 },
              0.1,
            );
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="max-w-5xl">
      {/* Column heads carry the direction, so the diagram needs no arrowheads. */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_3rem_1fr_3rem_1fr]">
        <p className="text-micro text-ink-700">Enter here</p>
        <span />
        <p className="text-micro text-ink-700">Narrow it</p>
        <span />
        <p className="text-micro text-ink-700">What you read</p>
      </div>

      <div className="mt-4 grid lg:grid-cols-[1fr_3rem_1fr_3rem_1fr] lg:gap-y-8">
        {DOC_FLOW.map((row) => (
          <div
            key={row.id}
            data-flow-row
            className="mt-10 flex flex-col first:mt-0 lg:contents"
          >
            <Link
              data-flow-node
              href={row.href}
              className="group border-t border-rule-strong pt-3 transition-colors hover:border-bone"
            >
              <span className="block text-h3 text-bone">{row.start}</span>
              <span className="mt-1 block text-micro text-ink-700">
                Module
              </span>
            </Link>

            <FlowLine />

            <div data-flow-node className="border-t border-rule pt-3">
              <p className="text-body-sm text-ink-100">{row.narrow}</p>
              <p className="mt-1 text-body-sm text-ink-500">{row.narrowNote}</p>
            </div>

            <FlowLine />

            <div data-flow-node className="border-t border-rule pt-3">
              <p className="text-body-sm text-ink-100">{row.land}</p>
              <p className="mt-1 text-body-sm text-ink-500">{row.landNote}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Convergence. Every path above ends at the same obligation. */}
      <div data-flow-row className="mt-10 lg:mt-12">
        <div className="flex justify-center lg:justify-end lg:pr-[16%]">
          <span
            data-flow-line
            className="block h-10 w-px origin-top bg-rule-strong"
          />
        </div>

        <div
          data-flow-node
          className="mt-0 border-t border-bone pt-4 lg:flex lg:items-baseline lg:gap-8"
        >
          <p className="shrink-0 text-h3 text-bone">A cited primary source</p>
          <p className="measure mt-2 text-body-sm text-ink-500 lg:mt-0">
            Every route through this product terminates at an official
            publisher and the date the record was last checked against it. If a
            path ever stops short of one, that is a bug in the data, not a
            shortcut you are meant to take.
          </p>
        </div>
      </div>
    </div>
  );
}

/** The connector: horizontal between columns, vertical when the row stacks. */
function FlowLine() {
  return (
    <div className="flex justify-center py-4 lg:block lg:py-0">
      <span
        data-flow-line
        className="block h-8 w-px origin-top bg-rule-strong lg:hidden"
      />
      <span
        data-flow-line
        className="hidden h-px w-full origin-left bg-rule-strong lg:block"
      />
    </div>
  );
}
