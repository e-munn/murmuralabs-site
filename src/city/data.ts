// Barcelona Eixample bounds - hexagonal region
export const CENTER = { lat: 41.39217756756757, lon: 2.15813620693481 };
export const RADIUS_M = 665;

// Generate hexagonal perimeter polygon (6 vertices, flat-top orientation)
function generateHexPolygon(center: { lat: number; lon: number }, radiusM: number) {
  const points: { lat: number; lon: number }[] = [];
  const latRadius = radiusM / 111000;
  const lonRadius = radiusM / (111000 * Math.cos(center.lat * Math.PI / 180));

  for (let i = 0; i < 6; i++) {
    // Flat-top hex: start at 0° (pointing right)
    const angle = (i / 6) * 2 * Math.PI;
    points.push({
      lat: center.lat + latRadius * Math.cos(angle),
      lon: center.lon + lonRadius * Math.sin(angle),
    });
  }
  return points;
}

export const BOUNDS_POLYGON = generateHexPolygon(CENTER, RADIUS_M);

export function project(lon: number, lat: number): [number, number, number] {
  const x = (lon - CENTER.lon) * 111000 * Math.cos(CENTER.lat * Math.PI / 180);
  const y = (lat - CENTER.lat) * 111000;
  return [x, y, 0];
}

// Project perimeter to scene coordinates (cached)
let projectedPerimeter: [number, number][] | null = null;
function getProjectedPerimeter(): [number, number][] {
  if (!projectedPerimeter) {
    projectedPerimeter = BOUNDS_POLYGON.map(p => {
      const [x, y] = project(p.lon, p.lat);
      return [x, y] as [number, number];
    });
  }
  return projectedPerimeter;
}

// Point-in-polygon test (2D)
function pointInPolygon2D(x: number, y: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// Line segment intersection
function lineIntersection(
  p1: [number, number], p2: [number, number],
  p3: [number, number], p4: [number, number]
): [number, number] | null {
  const [x1, y1] = p1, [x2, y2] = p2;
  const [x3, y3] = p3, [x4, y4] = p4;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-10) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
  }
  return null;
}

// Find intersection of line segment with polygon boundary
function findBoundaryIntersection(
  inside: [number, number], outside: [number, number], polygon: [number, number][]
): [number, number] {
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const intersection = lineIntersection(inside, outside, polygon[i], polygon[j]);
    if (intersection) return intersection;
  }
  return inside; // fallback
}

// Clip a path to the polygon boundary
function clipPathToPolygon(path: [number, number, number][], polygon: [number, number][]): [number, number, number][][] {
  const segments: [number, number, number][][] = [];
  let currentSegment: [number, number, number][] = [];

  for (let i = 0; i < path.length; i++) {
    const [x, y, z] = path[i];
    const isInside = pointInPolygon2D(x, y, polygon);

    if (isInside) {
      if (currentSegment.length === 0 && i > 0) {
        // Entering polygon - add intersection point
        const [px, py] = path[i - 1];
        const wasInside = pointInPolygon2D(px, py, polygon);
        if (!wasInside) {
          const [ix, iy] = findBoundaryIntersection([x, y], [px, py], polygon);
          currentSegment.push([ix, iy, z]);
        }
      }
      currentSegment.push([x, y, z]);
    } else {
      if (currentSegment.length > 0) {
        // Exiting polygon - add intersection point and close segment
        const lastInside = currentSegment[currentSegment.length - 1];
        const [ix, iy] = findBoundaryIntersection(
          [lastInside[0], lastInside[1]], [x, y], polygon
        );
        currentSegment.push([ix, iy, z]);
        segments.push(currentSegment);
        currentSegment = [];
      }
    }
  }

  if (currentSegment.length >= 2) {
    segments.push(currentSegment);
  }

  return segments;
}

// Load cached OSM road data (custom perimeter)
export async function fetchOSMData() {
  const response = await fetch('/data/perimeter/barcelona-roads-custom.json');
  if (!response.ok) throw new Error('Failed to load road data');
  return response.json();
}

// ============ RADIUS-BASED FILTERING ============
// All data is projected to scene coordinates (centered at 0,0)
// These functions filter by distance from origin

// Check if a point is within radius (in scene/meter units)
export function isWithinRadius(x: number, y: number, radius: number): boolean {
  return x * x + y * y <= radius * radius;
}

// Generate a hex polygon in scene coordinates for a given radius
function generateSceneHex(radius: number): [number, number][] {
  const hex: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI
    hex.push([radius * Math.sin(angle), radius * Math.cos(angle)])
  }
  return hex
}

// Check if a point is within a hex boundary (in scene/meter units)
export function isWithinHex(x: number, y: number, radius: number): boolean {
  const hex = generateSceneHex(radius)
  return pointInPolygon2D(x, y, hex)
}

// Filter point array by radius
export function filterPointsByRadius(
  points: [number, number, number][],
  radius: number
): [number, number, number][] {
  return points.filter(([x, y]) => isWithinHex(x, y, radius));
}

// Clip a path segment to a circular boundary
// Returns array of clipped segments (a path crossing the boundary becomes multiple segments)
function _clipPathToRadius(
  path: [number, number, number][],
  radius: number
): [number, number, number][][] {
  if (path.length < 2) return [];

  const segments: [number, number, number][][] = [];
  let currentSegment: [number, number, number][] = [];
  const radiusSq = radius * radius;

  for (let i = 0; i < path.length; i++) {
    const [x, y, z] = path[i];
    const distSq = x * x + y * y;
    const isInside = distSq <= radiusSq;

    if (isInside) {
      // If entering from outside, find intersection
      if (currentSegment.length === 0 && i > 0) {
        const [px, py, pz] = path[i - 1];
        const prevDistSq = px * px + py * py;
        if (prevDistSq > radiusSq) {
          const intersection = lineCircleIntersection(px, py, x, y, radius);
          if (intersection) {
            currentSegment.push([intersection[0], intersection[1], (z + pz) / 2]);
          }
        }
      }
      currentSegment.push([x, y, z]);
    } else {
      // Exiting - find intersection and close segment
      if (currentSegment.length > 0) {
        const last = currentSegment[currentSegment.length - 1];
        const intersection = lineCircleIntersection(last[0], last[1], x, y, radius);
        if (intersection) {
          currentSegment.push([intersection[0], intersection[1], (last[2] + z) / 2]);
        }
        if (currentSegment.length >= 2) {
          segments.push(currentSegment);
        }
        currentSegment = [];
      }
    }
  }

  if (currentSegment.length >= 2) {
    segments.push(currentSegment);
  }

  return segments;
}

// Find intersection of line segment with circle
function lineCircleIntersection(
  x1: number, y1: number,
  x2: number, y2: number,
  radius: number
): [number, number] | null {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const a = dx * dx + dy * dy;
  const b = 2 * (x1 * dx + y1 * dy);
  const c = x1 * x1 + y1 * y1 - radius * radius;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) return null;

  const sqrtD = Math.sqrt(discriminant);
  // We want the intersection point along the segment (0 <= t <= 1)
  const t1 = (-b - sqrtD) / (2 * a);
  const t2 = (-b + sqrtD) / (2 * a);

  // Pick the t that's in [0,1] and closest to the inside point
  let t = -1;
  if (t1 >= 0 && t1 <= 1) t = t1;
  if (t2 >= 0 && t2 <= 1 && (t < 0 || t2 < t)) t = t2;

  if (t < 0) return null;

  return [x1 + t * dx, y1 + t * dy];
}

// Parse roads from OSM data (with polygon clipping)
export function parseRoads(data: any) {
  const nodes: Record<number, { lon: number; lat: number }> = {};
  const roads: { path: [number, number, number][]; type: string; width: number }[] = [];
  const polygon = getProjectedPerimeter();

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
  };

  for (const el of data.elements) {
    if (el.type !== 'way' || !el.nodes || !el.tags?.highway) continue;

    const path = el.nodes
      .map((id: number) => nodes[id])
      .filter(Boolean)
      .map((n: { lon: number; lat: number }) => project(n.lon, n.lat));

    if (path.length >= 2) {
      // Clip road to polygon boundary
      const clippedSegments = clipPathToPolygon(path, polygon);
      for (const segment of clippedSegments) {
        if (segment.length >= 2) {
          roads.push({
            path: segment,
            type: el.tags.highway,
            width: widths[el.tags.highway] || 5,
          });
        }
      }
    }
  }

  return roads;
}

// Road type for filtering
export interface RoadSegment {
  path: [number, number, number][];
  type: string;
  width: number;
}

// Filter roads by hex boundary - clips paths at hex edge
export function filterRoadsByRadius(roads: RoadSegment[], radius: number): RoadSegment[] {
  const hex = generateSceneHex(radius)
  const filtered: RoadSegment[] = [];

  for (const road of roads) {
    // Use polygon clipping with the hex
    const clippedSegments = clipPathToPolygon(road.path, hex);
    for (const segment of clippedSegments) {
      if (segment.length >= 2) {
        filtered.push({
          path: segment,
          type: road.type,
          width: road.width,
        });
      }
    }
  }

  return filtered;
}
