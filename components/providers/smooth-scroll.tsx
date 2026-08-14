"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Lenis smooth scrolling.
 *
 * Disabled entirely under `prefers-reduced-motion` — hijacking scroll is one of
 * the most disorienting things you can do to a user who asked for less motion,
 * so this opts out rather than merely shortening the easing. docs/rules.md §5.4.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.11,
        duration: 1.1,
        smoothWheel: true,
        // Native scrolling on touch: momentum scrolling already feels right
        // there, and overriding it costs responsiveness.
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
