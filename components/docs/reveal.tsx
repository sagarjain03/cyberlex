"use client";

import { useRef } from "react";

import { EASE, MOTION_OK, gsap, useGSAP } from "@/components/docs/gsap-core";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Seconds between each direct child. Omit to move the container as one
   * block — which is what most sections want.
   */
  stagger?: number;
  /** Travel distance, px. Kept small: this is a settle, not an entrance. */
  y?: number;
  /** ScrollTrigger `start`. Later values hold the reveal until further up. */
  start?: string;
  delay?: number;
}

/**
 * Fade-and-settle as the block enters the viewport.
 *
 * Plays on the way in and never reverses — a reveal that re-plays on scroll-back
 * reads as decoration. That is GSAP's default `toggleActions`; `once: true` would
 * look the same and then `self.kill()` mid-`update()`, splicing the trigger out
 * of ScrollTrigger's array while a later trigger is walking it. Don't reach for it.
 *
 * The content is present and legible in the server-rendered HTML; this only
 * animates the arrival.
 *
 * ⚠️ Do not wrap anything that scrolls sideways in its own container. GSAP
 * leaves a transform on this element, and a transformed ancestor leaks a nested
 * scroller's overflow up to the document — which reads as a horizontally
 * scrolling *page* on a phone. Reveal the prose; leave the scroller outside.
 */
export function Reveal({
  children,
  className,
  stagger,
  y = 20,
  start = "top 88%",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const targets =
          stagger === undefined ? [el] : Array.from(el.children);
        if (targets.length === 0) return;

        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 0.7,
          delay,
          ease: EASE,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
