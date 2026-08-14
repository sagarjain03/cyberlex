import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";

import worldTopo from "world-atlas/countries-110m.json";

import { EU_MEMBER_IDS } from "./iso";

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 500;

export { EU_MEMBER_IDS };

export interface CountryShape {
  /**
   * Stable React key. Not every feature in the dataset carries an id — those
   * would all collapse to the same key, so the index disambiguates.
   */
  key: string;
  /** ISO 3166-1 numeric, or "000" where the dataset has no id. */
  id: string;
  /** Projected SVG path, or null for geometry that falls outside the frame. */
  d: string | null;
}

export interface ProjectedPoint {
  x: number;
  y: number;
}

const projection = geoNaturalEarth1().fitExtent(
  [
    [12, 12],
    [MAP_WIDTH - 12, MAP_HEIGHT - 12],
  ],
  { type: "Sphere" },
);

const toPath = geoPath(projection);

const collection = feature(
  worldTopo as unknown as Topology,
  (worldTopo as unknown as Topology).objects.countries,
) as unknown as FeatureCollection<Geometry, { name: string }>;

/**
 * Every country as a projected SVG path. Computed once at module scope on the
 * server — the topojson never reaches the client, only the resulting strings.
 *
 * Deliberately knows nothing about which jurisdictions are tracked: that comes
 * from the data layer and is passed in by the caller, so this module stays a
 * pure geography concern.
 */
export const COUNTRY_SHAPES: CountryShape[] = collection.features
  // Antarctica carries no jurisdiction we track and, under this projection,
  // reads as a bright slab across the bottom edge that fights the data.
  .filter((f) => String(f.id ?? "").padStart(3, "0") !== "010")
  .map((f, i) => {
    // world-atlas ids are numeric strings; some are unpadded or absent.
    const id = String(f.id ?? "").padStart(3, "0");
    return {
      key: `${id}-${i}`,
      id,
      d: toPath(f as GeoPermissibleObjects),
    };
  });

/** Project a [lon, lat] pair into map coordinates. */
export function project(lon: number, lat: number): ProjectedPoint | null {
  const p = projection([lon, lat]);
  return p ? { x: p[0], y: p[1] } : null;
}

/** The graticule-free sphere outline, used as the map's edge. */
export const SPHERE_PATH = toPath({ type: "Sphere" } as GeoPermissibleObjects);
