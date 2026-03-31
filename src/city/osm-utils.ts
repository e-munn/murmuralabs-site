// OSM data fetching utilities for Barcelona Eixample
import { CENTER, project } from './data';

// Re-export for backwards compatibility
export { CENTER };

// Alias project function
export const projectToScene = project;

// Generate bounding box string for Overpass API
export function getBBox(halfSizeKm: number): string {
  const latOffset = halfSizeKm / 111;
  const lonOffset = halfSizeKm / (111 * Math.cos(CENTER.lat * Math.PI / 180));
  return `${CENTER.lat - latOffset},${CENTER.lon - lonOffset},${CENTER.lat + latOffset},${CENTER.lon + lonOffset}`;
}

// ===========================================
// ROAD DATA
// ===========================================

export interface RoadData {
  path: [number, number, number][];
  type: string;
  width: number;
}

export async function fetchOSMRoads(halfSizeKm: number = 0.4): Promise<RoadData[]> {
  const bbox = getBBox(halfSizeKm);

  const query = `
    [out:json][timeout:30];
    (
      way["highway"~"^(primary|secondary|tertiary|residential|living_street|pedestrian|service|footway)$"](${bbox});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error('Failed to fetch OSM roads');
  const data = await response.json();

  return parseRoads(data);
}

function parseRoads(data: any): RoadData[] {
  const nodes: Record<number, { lon: number; lat: number }> = {};
  const roads: RoadData[] = [];

  for (const el of data.elements) {
    if (el.type === 'node') {
      nodes[el.id] = { lon: el.lon, lat: el.lat };
    }
  }

  const widths: Record<string, number> = {
    primary: 12,
    secondary: 10,
    tertiary: 8,
    residential: 6,
    living_street: 5,
    pedestrian: 4,
    service: 4,
    footway: 2,
  };

  for (const el of data.elements) {
    if (el.type !== 'way' || !el.nodes || !el.tags?.highway) continue;

    const path = el.nodes
      .map((id: number) => nodes[id])
      .filter(Boolean)
      .map((n: { lon: number; lat: number }) => projectToScene(n.lon, n.lat));

    if (path.length >= 2) {
      roads.push({
        path,
        type: el.tags.highway,
        width: widths[el.tags.highway] || 5,
      });
    }
  }

  return roads;
}

// ===========================================
// BUILDING DATA
// ===========================================

export interface BuildingData {
  footprint: [number, number][]; // 2D polygon
  centroid: [number, number, number];
  height: number;
  levels?: number;
  type?: string;
}

export async function fetchOSMBuildings(halfSizeKm: number = 0.4): Promise<BuildingData[]> {
  const bbox = getBBox(halfSizeKm);

  const query = `
    [out:json][timeout:60];
    (
      way["building"](${bbox});
      relation["building"](${bbox});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error('Failed to fetch OSM buildings');
  const data = await response.json();

  return parseBuildings(data);
}

function parseBuildings(data: any): BuildingData[] {
  const nodes: Record<number, { lon: number; lat: number }> = {};
  const buildings: BuildingData[] = [];

  // Index nodes
  for (const el of data.elements) {
    if (el.type === 'node') {
      nodes[el.id] = { lon: el.lon, lat: el.lat };
    }
  }

  // Process ways (building footprints)
  for (const el of data.elements) {
    if (el.type !== 'way' || !el.nodes || !el.tags?.building) continue;

    const footprint: [number, number][] = el.nodes
      .map((id: number) => nodes[id])
      .filter(Boolean)
      .map((n: { lon: number; lat: number }) => {
        const [x, y] = projectToScene(n.lon, n.lat);
        return [x, y] as [number, number];
      });

    if (footprint.length < 3) continue;

    // Calculate centroid
    let cx = 0, cy = 0;
    for (const [x, y] of footprint) {
      cx += x;
      cy += y;
    }
    cx /= footprint.length;
    cy /= footprint.length;

    // Estimate height from levels or use default
    const levels = el.tags['building:levels'] ? parseInt(el.tags['building:levels']) : null;
    const heightTag = el.tags.height ? parseFloat(el.tags.height) : null;

    // Default: 3-6 levels for Barcelona, ~3.5m per level
    const defaultLevels = 4 + Math.random() * 2;
    const height = heightTag || (levels ? levels * 3.5 : defaultLevels * 3.5);

    buildings.push({
      footprint,
      centroid: [cx, cy, 0],
      height,
      levels: levels || Math.round(height / 3.5),
      type: el.tags.building,
    });
  }

  return buildings;
}

// ===========================================
// TREE/VEGETATION DATA (from OSM)
// ===========================================

export interface TreeData {
  position: [number, number, number];
  type?: string;
}

export async function fetchOSMTrees(halfSizeKm: number = 0.4): Promise<TreeData[]> {
  const bbox = getBBox(halfSizeKm);

  const query = `
    [out:json][timeout:30];
    (
      node["natural"="tree"](${bbox});
      way["landuse"="forest"](${bbox});
      way["leisure"="park"](${bbox});
    );
    out body;
    >;
    out skel qt;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error('Failed to fetch OSM trees');
  const data = await response.json();

  return parseTrees(data);
}

function parseTrees(data: any): TreeData[] {
  const trees: TreeData[] = [];
  const nodes: Record<number, { lon: number; lat: number }> = {};

  // Index nodes
  for (const el of data.elements) {
    if (el.type === 'node') {
      nodes[el.id] = { lon: el.lon, lat: el.lat };
    }
  }

  // Individual trees
  for (const el of data.elements) {
    if (el.type === 'node' && el.tags?.natural === 'tree') {
      trees.push({
        position: projectToScene(el.lon, el.lat),
        type: el.tags.species || el.tags.genus || 'unknown',
      });
    }
  }

  // Parks/forests - scatter trees within area
  for (const el of data.elements) {
    if (el.type !== 'way' || !el.nodes) continue;
    if (!el.tags?.landuse && !el.tags?.leisure) continue;

    const polygon = el.nodes
      .map((id: number) => nodes[id])
      .filter(Boolean);

    if (polygon.length < 3) continue;

    // Calculate bounding box and scatter trees
    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;

    for (const n of polygon) {
      minLon = Math.min(minLon, n.lon);
      maxLon = Math.max(maxLon, n.lon);
      minLat = Math.min(minLat, n.lat);
      maxLat = Math.max(maxLat, n.lat);
    }

    // Scatter trees (simplified - doesn't check if point is inside polygon)
    const numTrees = Math.floor(((maxLon - minLon) * (maxLat - minLat)) * 1000000);
    for (let i = 0; i < Math.min(numTrees, 20); i++) {
      const lon = minLon + Math.random() * (maxLon - minLon);
      const lat = minLat + Math.random() * (maxLat - minLat);
      trees.push({
        position: projectToScene(lon, lat),
        type: 'park',
      });
    }
  }

  return trees;
}

// ===========================================
// COMBINED LOADER
// ===========================================

export interface CityData {
  roads: RoadData[];
  buildings: BuildingData[];
  trees: TreeData[];
}

export async function fetchAllCityData(halfSizeKm: number = 0.4): Promise<CityData> {
  const [roads, buildings, trees] = await Promise.all([
    fetchOSMRoads(halfSizeKm),
    fetchOSMBuildings(halfSizeKm),
    fetchOSMTrees(halfSizeKm),
  ]);

  return { roads, buildings, trees };
}
