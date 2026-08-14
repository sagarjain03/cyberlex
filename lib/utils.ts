import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our typography scale is defined as custom `@utility text-*` rules in
 * `globals.css`. tailwind-merge doesn't know them, so by default it classifies
 * e.g. `text-code` as a *colour* — which means `cn("text-code", "text-ink-700")`
 * silently drops the size and the element renders at body size.
 *
 * Registering them as font-size utilities fixes the conflict resolution:
 * size and colour become independent groups again, and only same-group classes
 * override each other.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "display-sm",
            "serif-lead",
            "h2",
            "h3",
            "body",
            "body-sm",
            "micro",
            "data-xl",
            "data-lg",
            "data",
            "code",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
