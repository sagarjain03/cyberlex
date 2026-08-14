"use client";

import { useEffect, useState } from "react";

/**
 * True once the window has scrolled past `threshold`.
 *
 * Reads the initial value inside a passive scroll listener rather than during
 * the effect body, so it never triggers a cascading render on mount and stays
 * SSR-safe.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}
