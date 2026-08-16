"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One registration point for the docs' scroll choreography.
 *
 * Registering per-component is how a plugin ends up tree-shaken out of one
 * bundle and not another. Guarded on `window` so importing this from a client
 * component that still server-renders is a no-op on the server.
 *
 * Rules that bind everything importing this (docs/rules.md §1.4):
 * — native scrolling is never overridden; no scroller proxy, no pinning that
 *   takes the wheel away. Sticky panes are CSS, and GSAP only reads progress.
 * — every timeline is created inside a `(prefers-reduced-motion: no-preference)`
 *   matchMedia query, so the reduced-motion path is *no timeline at all*.
 * — nothing is gated behind a trigger: the server-rendered markup is complete
 *   and readable before any of this runs, and with JS off it never runs.
 *
 * ⚠️ **Never clean up by hand inside `useGSAP`.** A `gsap.matchMedia()` registers
 * itself with the enclosing context (`gsap-core.js` → `_context.data.push`), and
 * so does every ScrollTrigger (`ScrollTrigger.js` → `_context(this)`). The hook
 * reverts that context on unmount, so an extra `mm.revert()` or `trigger.kill()`
 * is a *second* revert: it corrupts ScrollTrigger's `_triggers` array and the
 * next `refresh()` walks off the end of it. Create and return nothing.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/** Shorthand for the reduced-motion gate every timeline here sits behind. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** The system's `--ease-out`, expressed for GSAP. docs/design.md §6. */
export const EASE = "power3.out";

export { gsap, ScrollTrigger, useGSAP };
