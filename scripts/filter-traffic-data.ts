#!/usr/bin/env npx tsx
/**
 * Pre-filter barcelona traffic-violations.json and parking-zones.json
 * to only include records within the largest display radius (665m from center).
 * Also trims unused fields and rounds coordinates to 6 decimal places.
 *
 * Run: npx tsx scripts/filter-traffic-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// From src/city/data.ts
const CENTER = { lat: 41.39217756756757, lon: 2.15813620693481 };
const RADIUS_M = 665; // largest SIZE_RADII value

// Match the hex-boundary check used in data.ts (isWithinHex → pointInPolygon2D in scene coords)
// Since we're working in lat/lon here, we use a simple circular radius check.
// The hex is inscribed in the circle, so filtering to the circle radius is a safe superset.
// We add 10% margin so the pre-filter never clips anything the runtime would include.
const FILTER_RADIUS_M = RADIUS_M * 1.1;

function distanceM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const latDiff = (lat1 - lat2) * 111000;
  const lonDiff = (lon1 - lon2) * 111000 * Math.cos(CENTER.lat * Math.PI / 180);
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

function isWithinRadius(lat: number, lon: number): boolean {
  return distanceM(lat, lon, CENTER.lat, CENTER.lon) <= FILTER_RADIUS_M;
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Traffic Violations ──────────────────────────────────────────────────────
// Used fields: Latitud_WGS84, Longitud_WGS84, Infraccio_Codi, Nom_Districte, Import_Nominal_€

function filterTrafficViolations(): void {
  const filePath = path.resolve('/Users/elijah/aretian/murmuralabs/site/public/data/barcelona/traffic-violations.json');
  const beforeBytes = fs.statSync(filePath).size;

  console.log(`\nTraffic violations`);
  console.log(`  Before: ${formatBytes(beforeBytes)}`);

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const records: any[] = raw.result.records;
  console.log(`  Records before: ${records.length.toLocaleString()}`);

  const filtered = records
    .filter((r: any) => {
      const lat = parseFloat(r.Latitud_WGS84);
      const lon = parseFloat(r.Longitud_WGS84);
      return !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0 && isWithinRadius(lat, lon);
    })
    .map((r: any) => ({
      Latitud_WGS84: round6(parseFloat(r.Latitud_WGS84)),
      Longitud_WGS84: round6(parseFloat(r.Longitud_WGS84)),
      Infraccio_Codi: r.Infraccio_Codi ?? null,
      Nom_Districte: r.Nom_Districte ?? null,
      'Import_Nominal_€': r['Import_Nominal_€'] ?? null,
    }));

  console.log(`  Records after:  ${filtered.length.toLocaleString()}`);

  const out = {
    success: raw.success,
    result: {
      records: filtered,
    },
  };

  const json = JSON.stringify(out);
  fs.writeFileSync(filePath, json, 'utf8');

  const afterBytes = Buffer.byteLength(json, 'utf8');
  console.log(`  After:  ${formatBytes(afterBytes)}`);
  console.log(`  Reduction: ${((1 - afterBytes / beforeBytes) * 100).toFixed(1)}%`);
}

// ── Parking Zones ────────────────────────────────────────────────────────────
// Used fields: LATITUD_I, LONGITUD_I, LATITUD_F, LONGITUD_F, COLOR_RGB, PLACES

function filterParkingZones(): void {
  const filePath = path.resolve('/Users/elijah/aretian/murmuralabs/site/public/data/barcelona/parking-zones.json');
  const beforeBytes = fs.statSync(filePath).size;

  console.log(`\nParking zones`);
  console.log(`  Before: ${formatBytes(beforeBytes)}`);

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const records: any[] = raw.result.records;
  console.log(`  Records before: ${records.length.toLocaleString()}`);

  const filtered = records
    .filter((r: any) => {
      const latI = parseFloat(r.LATITUD_I);
      const lonI = parseFloat(r.LONGITUD_I);
      const latF = parseFloat(r.LATITUD_F);
      const lonF = parseFloat(r.LONGITUD_F);
      return (
        !isNaN(latI) && !isNaN(lonI) && !isNaN(latF) && !isNaN(lonF) &&
        isWithinRadius(latI, lonI) &&
        isWithinRadius(latF, lonF)
      );
    })
    .map((r: any) => ({
      LATITUD_I: round6(parseFloat(r.LATITUD_I)),
      LONGITUD_I: round6(parseFloat(r.LONGITUD_I)),
      LATITUD_F: round6(parseFloat(r.LATITUD_F)),
      LONGITUD_F: round6(parseFloat(r.LONGITUD_F)),
      COLOR_RGB: r.COLOR_RGB ?? null,
      PLACES: r.PLACES ?? null,
    }));

  console.log(`  Records after:  ${filtered.length.toLocaleString()}`);

  const out = {
    success: raw.success,
    result: {
      records: filtered,
    },
  };

  const json = JSON.stringify(out);
  fs.writeFileSync(filePath, json, 'utf8');

  const afterBytes = Buffer.byteLength(json, 'utf8');
  console.log(`  After:  ${formatBytes(afterBytes)}`);
  console.log(`  Reduction: ${((1 - afterBytes / beforeBytes) * 100).toFixed(1)}%`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log(`Center: ${CENTER.lat}, ${CENTER.lon}`);
console.log(`Filter radius: ${FILTER_RADIUS_M}m (${RADIUS_M}m + 10% margin)`);

filterTrafficViolations();
filterParkingZones();

console.log('\nDone.');
