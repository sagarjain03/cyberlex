import { cn } from "@/lib/utils";
import {
  COUNTRY_SHAPES,
  MAP_HEIGHT,
  MAP_WIDTH,
  project,
} from "@/lib/map/world";
import type { JurisdictionCode, LegalStatus } from "@/types";
import { LEGAL_STATUS_TOKEN } from "@/types";

export interface MapMarker {
  code: JurisdictionCode;
  label: string;
  anchor: [number, number];
  status: LegalStatus;
}

interface WorldMapProps {
  markers: MapMarker[];
  /** ISO 3166-1 numeric ids to light as tracked. */
  trackedIsoIds: string[];
  className?: string;
}

const TONE_VAR: Record<string, string> = {
  live: "var(--color-live)",
  partial: "var(--color-partial)",
  pending: "var(--color-pending)",
  draft: "var(--color-draft)",
  null: "var(--color-null)",
};

/**
 * Real vector geography — Natural Earth projection, resolved from topojson at
 * module scope on the server. The dataset never reaches the browser; only the
 * projected path strings do, so the map costs zero client JS.
 *
 * Knows nothing about the data layer: which regions are tracked and where the
 * markers sit are both passed in, keeping geography and law separate concerns.
 */
export function WorldMap({
  markers,
  trackedIsoIds,
  className,
}: WorldMapProps) {
  const tracked = new Set(trackedIsoIds);

  const placed = markers
    .map((m) => ({ marker: m, point: project(m.anchor[0], m.anchor[1]) }))
    .filter(
      (m): m is { marker: MapMarker; point: { x: number; y: number } } =>
        m.point !== null,
    );

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`World map showing ${markers.length} tracked jurisdictions`}
    >
      <defs>
        {/* Light falls from above — landmass fades toward the poles. */}
        <linearGradient id="landfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232327" />
          <stop offset="55%" stopColor="#1b1b1e" />
          <stop offset="100%" stopColor="#141416" />
        </linearGradient>
        <linearGradient id="landlit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a54" />
          <stop offset="100%" stopColor="#33333b" />
        </linearGradient>
        <radialGradient id="markerglow">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.42" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g>
        {COUNTRY_SHAPES.map((c) => {
          if (!c.d) return null;
          const isTracked = tracked.has(c.id);
          return (
            <path
              key={c.key}
              d={c.d}
              fill={isTracked ? "url(#landlit)" : "url(#landfade)"}
              stroke={isTracked ? "#4a4a52" : "#000000"}
              strokeWidth={isTracked ? 0.5 : 0.4}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>

      <g>
        {placed.map(({ marker, point }) => {
          const tone =
            TONE_VAR[LEGAL_STATUS_TOKEN[marker.status]] ?? TONE_VAR.null;
          return (
            <g key={marker.code} style={{ color: tone }}>
              <circle cx={point.x} cy={point.y} r={22} fill="url(#markerglow)" />
              <circle
                cx={point.x}
                cy={point.y}
                r={5}
                fill="none"
                stroke={tone}
                strokeWidth={0.7}
                opacity={0.5}
                className="animate-ping-slow motion-reduce:hidden"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <circle cx={point.x} cy={point.y} r={2.6} fill={tone} />
              <text
                x={point.x + 9}
                y={point.y + 3}
                className="fill-ink-300 font-mono"
                fontSize={8}
                letterSpacing="0.14em"
              >
                {marker.code}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
