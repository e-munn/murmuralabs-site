// Fetches a static Mapbox image of Richmond at the same viewState as the murmur app
// and saves it to remotion/public/richmond-base.png.
//
// Usage:
//   npx tsx scripts/fetch-richmond-base.ts
//
// Reads VITE_MAPBOX_TOKEN from ../../../murmur/.env

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MURMUR_ENV = resolve(__dirname, "../../../murmur/.env");
const OUT_PATH = resolve(__dirname, "../public/richmond-base.png");

// Match richmond.ts viewState
const CENTER_LNG = -122.36;
const CENTER_LAT = 37.93;
const ZOOM = 12;
// mapbox/standard isn't supported by the Static Images API; light-v11 is the closest
// neutral base that pairs well with a warm rust choropleth overlay.
const STYLE = "mapbox/light-v11";
// Mapbox Static API caps at 1280; @2x doubles the rendered resolution
const WIDTH = 1280;
const HEIGHT = 720;

function readToken(): string {
  if (!existsSync(MURMUR_ENV)) {
    throw new Error(`Cannot find ${MURMUR_ENV}. The murmur repo must be a sibling of this site repo.`);
  }
  const env = readFileSync(MURMUR_ENV, "utf8");
  const match = env.match(/^VITE_MAPBOX_TOKEN=(.+)$/m);
  if (!match) throw new Error("VITE_MAPBOX_TOKEN not found in murmur/.env");
  return match[1].trim();
}

async function main() {
  const token = readToken();
  const url = `https://api.mapbox.com/styles/v1/${STYLE}/static/${CENTER_LNG},${CENTER_LAT},${ZOOM}/${WIDTH}x${HEIGHT}@2x?access_token=${token}`;

  console.log(`Fetching ${WIDTH}x${HEIGHT}@2x map at ${CENTER_LNG},${CENTER_LAT} zoom ${ZOOM}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Mapbox API returned ${res.status}: ${await res.text()}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(OUT_PATH, buf);
  console.log(`Saved ${buf.length} bytes to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
