// Generates the full uniform H3 cell grid covering Richmond's bbox.
// No fill data — just cell IDs + lat/lng boundaries — for an "introducing
// the hex grid concept" overlay.
//
// Usage:
//   npx tsx scripts/generate-richmond-overlay.ts

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cellToBoundary, cellToLatLng, polygonToCells } from "h3-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUT = resolve(__dirname, "../src/data/richmond-cells.json");

// Richmond bbox + center, matches richmond.ts in the murmur app
const BBOX = { west: -122.42, south: 37.88, east: -122.3, north: 37.97 };
const CENTER_LNG = -122.36;
const CENTER_LAT = 37.93;

// App default is 10. Bump to 11 for finer mesh, 9 for chunkier.
const RESOLUTION = 10;

function distMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function main() {
  // h3-js polygonToCells expects a GeoJSON-style polygon: [[lat, lng], ...]
  const bboxPolygon: [number, number][] = [
    [BBOX.south, BBOX.west],
    [BBOX.south, BBOX.east],
    [BBOX.north, BBOX.east],
    [BBOX.north, BBOX.west],
    [BBOX.south, BBOX.west],
  ];

  console.log(`Enumerating H3 r${RESOLUTION} cells in Richmond bbox...`);
  const ids = polygonToCells(bboxPolygon, RESOLUTION);
  console.log(`Got ${ids.length} cells`);

  const out = ids.map((id) => {
    const boundary = cellToBoundary(id, false); // [[lat, lng], ...]
    const [centerLat, centerLng] = cellToLatLng(id);
    return {
      id,
      boundary: boundary.map(([lat, lng]) => [
        Math.round(lng * 1e6) / 1e6,
        Math.round(lat * 1e6) / 1e6,
      ] as [number, number]),
      distFromCenter: Math.round(distMeters(centerLat, centerLng, CENTER_LAT, CENTER_LNG)),
    };
  });

  out.sort((a, b) => a.distFromCenter - b.distFromCenter);

  console.log(`Writing ${out.length} cells, sorted center-out, to ${OUT}`);
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        viewState: { centerLng: CENTER_LNG, centerLat: CENTER_LAT, zoom: 12, bbox: BBOX },
        resolution: RESOLUTION,
        cells: out.map(({ id, boundary }) => ({ id, boundary })),
      },
      null,
      0,
    ),
  );
}

main();
