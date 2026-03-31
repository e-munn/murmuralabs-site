import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CENTER, BOUNDS_POLYGON, project } from './data';

function projectToScene(lon: number, lat: number): [number, number] {
  const x = (lon - CENTER.lon) * 111000 * Math.cos(CENTER.lat * Math.PI / 180);
  const y = (lat - CENTER.lat) * 111000;
  return [x, y];
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

// Building data structure
export interface BuildingData {
  centroid: [number, number, number];
  footprint: [number, number][]; // 2D polygon points
  height: number;
  numFloors?: number;
}

// Fetch buildings from cached OSM data (custom perimeter)
export async function fetchOvertureBuildings(): Promise<BuildingData[]> {
  try {
    const response = await fetch('/data/perimeter/barcelona-buildings-custom.json');
    if (!response.ok) {
      console.warn('No building data found');
      return [];
    }
    const osmData = await response.json();
    return parseOSMBuildings(osmData);
  } catch (err) {
    console.error('Failed to load buildings:', err);
    return [];
  }
}

// Parse OSM Overpass JSON format for buildings
function parseOSMBuildings(data: any): BuildingData[] {
  const buildings: BuildingData[] = [];
  const nodes: Record<number, { lon: number; lat: number }> = {};
  const polygon = getProjectedPerimeter();

  // First pass: collect all nodes
  for (const el of data.elements) {
    if (el.type === 'node') {
      nodes[el.id] = { lon: el.lon, lat: el.lat };
    }
  }

  // Second pass: process building ways
  for (const el of data.elements) {
    if (el.type !== 'way' || !el.nodes || !el.tags?.building) continue;

    // Get footprint coordinates
    const footprint: [number, number][] = [];
    for (const nodeId of el.nodes) {
      const node = nodes[nodeId];
      if (node) {
        const [x, y] = projectToScene(node.lon, node.lat);
        footprint.push([x, y]);
      }
    }

    if (footprint.length < 3) continue;

    // Calculate centroid
    let cx = 0, cy = 0;
    for (const [x, y] of footprint) {
      cx += x;
      cy += y;
    }
    cx /= footprint.length;
    cy /= footprint.length;

    // Skip buildings whose centroid is outside the polygon boundary
    if (!pointInPolygon2D(cx, cy, polygon)) continue;

    // Get height from tags or estimate
    let height = parseFloat(el.tags.height) || 0;
    if (!height && el.tags['building:levels']) {
      height = parseFloat(el.tags['building:levels']) * 3.5;
    }
    if (!height) {
      // Default Barcelona Eixample height (5-7 floors)
      height = 18 + Math.random() * 7;
    }

    buildings.push({
      centroid: [cx, cy, 0],
      footprint,
      height,
      numFloors: el.tags['building:levels'] ? parseInt(el.tags['building:levels']) : undefined,
    });
  }

  return buildings;
}

// Fallback: Fetch from third-party Overture API
async function _fetchBuildingsFromAPI(): Promise<BuildingData[]> {
  try {
    // Using the free OvertureMapsAPI.com endpoint
    const url = `https://overture-maps-api.thatapicompany.com/places/buildings?lat=${CENTER.lat}&lng=${CENTER.lon}&radius=800`;
    const response = await fetch(url, {
      headers: { 'x-api-key': 'DEMO-API-KEY' }
    });

    if (!response.ok) {
      console.warn('API fallback failed');
      return [];
    }

    const data = await response.json();
    return parseAPIResponse(data);
  } catch (err) {
    console.error('API fallback error:', err);
    return [];
  }
}

// Parse Overture GeoJSON format
function _parseOvertureGeoJSON(geojson: any): BuildingData[] {
  const buildings: BuildingData[] = [];

  if (!geojson.features) return buildings;

  for (const feature of geojson.features) {
    if (feature.geometry?.type !== 'Polygon' && feature.geometry?.type !== 'MultiPolygon') continue;

    const props = feature.properties || {};

    // Get height from Overture properties
    // Overture uses: height, num_floors, min_height
    let height = props.height || props.roof_height;
    if (!height && props.num_floors) {
      height = props.num_floors * 3.5; // ~3.5m per floor
    }
    if (!height) {
      // Default Barcelona Eixample building height (5-7 floors)
      height = 18 + Math.random() * 7;
    }

    // Parse polygon coordinates
    let coordinates: number[][][] = [];
    if (feature.geometry.type === 'Polygon') {
      coordinates = [feature.geometry.coordinates[0]]; // Outer ring only
    } else if (feature.geometry.type === 'MultiPolygon') {
      // Take first polygon for simplicity
      coordinates = [feature.geometry.coordinates[0][0]];
    }

    if (coordinates.length === 0 || coordinates[0].length < 3) continue;

    // Project coordinates to scene space
    const footprint: [number, number][] = coordinates[0].map(([lon, lat]) => projectToScene(lon, lat));

    // Calculate centroid
    let cx = 0, cy = 0;
    for (const [x, y] of footprint) {
      cx += x;
      cy += y;
    }
    cx /= footprint.length;
    cy /= footprint.length;

    buildings.push({
      centroid: [cx, cy, 0],
      footprint,
      height,
      numFloors: props.num_floors,
    });
  }

  return buildings;
}

// Parse API response format
function parseAPIResponse(data: any): BuildingData[] {
  // API format may differ - adjust as needed
  if (!data.results) return [];

  return data.results.map((item: any) => {
    const [lon, lat] = item.geometry?.coordinates || [CENTER.lon, CENTER.lat];
    const [x, y] = projectToScene(lon, lat);

    return {
      centroid: [x, y, 0] as [number, number, number],
      footprint: [], // API may not include footprint
      height: item.properties?.height || 20,
      numFloors: item.properties?.num_floors,
    };
  });
}

// Simple extruded building component using instanced boxes
// For buildings without detailed footprints
interface InstancedBuildingsProps {
  buildings: BuildingData[];
  color?: string;
}

export function InstancedBuildings({
  buildings,
  color = '#2a3444',
}: InstancedBuildingsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current || buildings.length === 0) return;

    const tempObject = new THREE.Object3D();

    buildings.forEach((b, i) => {
      // Estimate building size from footprint or use default
      let width = 20, depth = 20;

      if (b.footprint.length >= 3) {
        // Calculate bounding box of footprint
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        for (const [x, y] of b.footprint) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
        width = maxX - minX;
        depth = maxY - minY;
      }

      tempObject.position.set(b.centroid[0], b.centroid[1], b.height / 2);
      tempObject.scale.set(width, depth, b.height);
      tempObject.rotation.set(0, 0, 0);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings]);

  if (buildings.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, buildings.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
}

// Detailed extruded building with actual footprint shape and roof outline
interface ExtrudedBuildingProps {
  footprint: [number, number][];
  height: number;
  color?: string;
  edgeColor?: string;
  fillOpacity?: number;
  edgeOpacity?: number;
}

export function ExtrudedBuilding({
  footprint,
  height,
  color = '#c6a181',
  edgeColor = '#7f5e46',
  fillOpacity = 0.2,
  edgeOpacity = 0.3,
}: ExtrudedBuildingProps) {
  const { geometry, roofEdgesGeometry } = useMemo(() => {
    if (footprint.length < 3) return { geometry: null, roofEdgesGeometry: null };

    // Shape is created in X-Y plane, extrusion goes along +Z
    const shape = new THREE.Shape();
    shape.moveTo(footprint[0][0], footprint[0][1]);
    for (let i = 1; i < footprint.length; i++) {
      shape.lineTo(footprint[i][0], footprint[i][1]);
    }
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: height,
      bevelEnabled: false,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Create roof outline only (not all edges) - this avoids interior edge clutter
    const roofPoints: number[] = [];
    for (let i = 0; i < footprint.length; i++) {
      const curr = footprint[i];
      const next = footprint[(i + 1) % footprint.length];
      // Roof edge at height
      roofPoints.push(curr[0], curr[1], height);
      roofPoints.push(next[0], next[1], height);
    }
    const roofGeo = new THREE.BufferGeometry();
    roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(roofPoints, 3));

    return { geometry: geo, roofEdgesGeometry: roofGeo };
  }, [footprint, height]);

  if (!geometry || !roofEdgesGeometry) return null;

  return (
    <group>
      {/* Semi-transparent fill - front faces only to avoid back-face clutter */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={fillOpacity}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Roof outline only - clean top edge */}
      <lineSegments geometry={roofEdgesGeometry}>
        <lineBasicMaterial
          color={edgeColor}
          transparent
          opacity={edgeOpacity}
        />
      </lineSegments>
    </group>
  );
}

// Render all buildings with detailed footprints
interface DetailedBuildingsProps {
  buildings: BuildingData[];
  color?: string;
  edgeColor?: string;
  fillOpacity?: number;
  edgeOpacity?: number;
  maxBuildings?: number; // Limit for performance
}

export function DetailedBuildings({
  buildings,
  color = '#c6a181',
  edgeColor = '#7f5e46',
  fillOpacity = 0.2,
  edgeOpacity = 0.3,
  maxBuildings = 10000,
}: DetailedBuildingsProps) {
  // Limit buildings for performance
  const limitedBuildings = useMemo(() => {
    return buildings
      .filter(b => b.footprint.length >= 3)
      .slice(0, maxBuildings);
  }, [buildings, maxBuildings]);

  return (
    <group>
      {limitedBuildings.map((building, i) => (
        <ExtrudedBuilding
          key={i}
          footprint={building.footprint}
          height={building.height}
          color={color}
          edgeColor={edgeColor}
          fillOpacity={fillOpacity}
          edgeOpacity={edgeOpacity}
        />
      ))}
    </group>
  );
}
