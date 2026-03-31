import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { project, BOUNDS_POLYGON } from './data';

// Use the BOUNDS_POLYGON from data.ts (circular perimeter)
function pointInPolygon(lat: number, lon: number, polygon: { lat: number; lon: number }[]): boolean {
  if (polygon.length < 3) return true;
  let inside = false;
  let j = polygon.length - 1;
  for (let i = 0; i < polygon.length; i++) {
    if ((polygon[i].lat > lat) !== (polygon[j].lat > lat) &&
        lon < (polygon[j].lon - polygon[i].lon) * (lat - polygon[i].lat) /
              (polygon[j].lat - polygon[i].lat) + polygon[i].lon) {
      inside = !inside;
    }
    j = i;
  }
  return inside;
}

// Helper to check if point is inside bounds
function isInsideBounds(lat: number, lon: number): boolean {
  return pointInPolygon(lat, lon, BOUNDS_POLYGON);
}

// ============ BUS STOPS ============
// Local cached data from Barcelona Open Data

export interface BusStopData {
  position: [number, number, number];
  name?: string;
  district?: string;
}

export async function fetchBusStops(): Promise<BusStopData[]> {
  try {
    const response = await fetch('/data/barcelona/bus-stops.json');

    if (!response.ok) {
      console.warn('Bus stops data not found');
      return [];
    }

    const data = await response.json();
    if (!data.success || !data.result?.records) {
      return [];
    }

    const stops = data.result.records
      .filter((r: any) => {
        const lat = parseFloat(r.LATITUD);
        const lon = parseFloat(r.LONGITUD);
        return lat && lon && isInsideBounds(lat, lon);
      })
      .map((r: any) => ({
        position: project(parseFloat(r.LONGITUD), parseFloat(r.LATITUD)),
        name: r.EQUIPAMENT,
        district: r.NOM_DISTRICTE,
      }));

    console.log(`Bus stops: ${stops.length} in view`);
    return stops;
  } catch (err) {
    console.error('Bus stops fetch error:', err);
    return [];
  }
}

// Bus stop shelter - simple post with small roof
interface InstancedBusStopsProps {
  stops: BusStopData[];
  postColor?: string;
  roofColor?: string;
}

export function InstancedBusStops({
  stops,
  postColor = '#3366aa',
  roofColor = '#4488cc',
}: InstancedBusStopsProps) {
  const postRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);

  const POST_HEIGHT = 3;
  const POST_RADIUS = 0.15;
  const ROOF_SIZE = 1.5;

  useEffect(() => {
    if (!postRef.current || !roofRef.current || stops.length === 0) return;

    const tempObject = new THREE.Object3D();

    stops.forEach((stop, i) => {
      // Post
      tempObject.position.set(stop.position[0], stop.position[1], POST_HEIGHT / 2);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      postRef.current!.setMatrixAt(i, tempObject.matrix);

      // Small roof/sign at top
      tempObject.position.set(stop.position[0], stop.position[1], POST_HEIGHT + 0.1);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      roofRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    postRef.current.instanceMatrix.needsUpdate = true;
    roofRef.current.instanceMatrix.needsUpdate = true;
  }, [stops]);

  if (stops.length === 0) return null;

  return (
    <>
      {/* Posts */}
      <instancedMesh ref={postRef} args={[undefined, undefined, stops.length]}>
        <cylinderGeometry args={[POST_RADIUS, POST_RADIUS, POST_HEIGHT, 6]} />
        <meshBasicMaterial color={postColor} />
      </instancedMesh>

      {/* Roof/sign panels */}
      <instancedMesh ref={roofRef} args={[undefined, undefined, stops.length]}>
        <boxGeometry args={[ROOF_SIZE, ROOF_SIZE * 0.6, 0.1]} />
        <meshBasicMaterial color={roofColor} />
      </instancedMesh>
    </>
  );
}

// ============ PARKING ZONES ============
// Local cached data from Barcelona Open Data

export interface ParkingZoneData {
  startPos: [number, number, number];
  endPos: [number, number, number];
  color: string;
  spots: number;
}

export async function fetchParkingZones(): Promise<ParkingZoneData[]> {
  try {
    const response = await fetch('/data/barcelona/parking-zones.json');

    if (!response.ok) {
      console.warn('Parking zones data not found');
      return [];
    }

    const data = await response.json();
    if (!data.success || !data.result?.records) {
      return [];
    }

    const zones = data.result.records
      .filter((r: any) => {
        const latI = parseFloat(r.LATITUD_I);
        const lonI = parseFloat(r.LONGITUD_I);
        const latF = parseFloat(r.LATITUD_F);
        const lonF = parseFloat(r.LONGITUD_F);
        // Both endpoints must be inside perimeter
        return latI && lonI && latF && lonF &&
          isInsideBounds(latI, lonI) &&
          isInsideBounds(latF, lonF);
      })
      .map((r: any) => ({
        startPos: project(parseFloat(r.LONGITUD_I), parseFloat(r.LATITUD_I)),
        endPos: project(parseFloat(r.LONGITUD_F), parseFloat(r.LATITUD_F)),
        color: r.COLOR_RGB ? `#${r.COLOR_RGB}` : '#4488ff',
        spots: parseInt(r.PLACES) || 0,
      }));

    console.log(`Parking zones: ${zones.length} in view`);
    return zones;
  } catch (err) {
    console.error('Parking zones fetch error:', err);
    return [];
  }
}

// Parking zones rendered as colored line segments
interface ParkingZonesProps {
  zones: ParkingZoneData[];
  opacity?: number;
}

export function ParkingZones({ zones, opacity = 0.7 }: ParkingZonesProps) {
  if (zones.length === 0) return null;

  // Group by color for efficiency
  const byColor = useMemo(() => {
    const grouped: Record<string, ParkingZoneData[]> = {};
    zones.forEach(z => {
      if (!grouped[z.color]) grouped[z.color] = [];
      grouped[z.color].push(z);
    });
    return grouped;
  }, [zones]);

  return (
    <group>
      {Object.entries(byColor).map(([color, colorZones]) => (
        <group key={color}>
          {colorZones.map((zone, i) => (
            <Line
              key={i}
              points={[zone.startPos, zone.endPos]}
              color={color}
              lineWidth={3}
              transparent
              opacity={opacity}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

// ============ BIKE LANES ============
// TODO: Download bike lanes GeoJSON manually (blocked by captcha)
// Source: https://opendata-ajuntament.barcelona.cat/data/dataset/carrils-bici-construccio

export interface BikeLaneData {
  path: [number, number, number][];
}

export async function fetchBikeLanes(): Promise<BikeLaneData[]> {
  try {
    const response = await fetch('/data/barcelona/bike-lanes.geojson');

    if (!response.ok) {
      return []; // File not available yet
    }

    const geojson = await response.json();
    if (!geojson.features) return [];

    const lanes: BikeLaneData[] = [];

    for (const feature of geojson.features) {
      if (!feature.geometry) continue;

      let coordinates: number[][] = [];

      if (feature.geometry.type === 'LineString') {
        coordinates = feature.geometry.coordinates;
      } else if (feature.geometry.type === 'MultiLineString') {
        coordinates = feature.geometry.coordinates.flat();
      } else {
        continue;
      }

      // Filter to only points inside perimeter
      const path: [number, number, number][] = coordinates
        .filter(([lon, lat]) => isInsideBounds(lat, lon))
        .map(([lon, lat]) => project(lon, lat));

      if (path.length >= 2) {
        lanes.push({ path });
      }
    }

    console.log(`Bike lanes: ${lanes.length} in view`);
    return lanes;
  } catch (err) {
    return [];
  }
}

// Bike lanes rendered as green lines
interface BikeLanesProps {
  lanes: BikeLaneData[];
  color?: string;
  lineWidth?: number;
  opacity?: number;
}

export function BikeLanes({
  lanes,
  color = '#22aa44',
  lineWidth = 2,
  opacity = 1,
}: BikeLanesProps) {
  if (lanes.length === 0) return null;

  return (
    <group>
      {lanes.map((lane, i) => (
        <Line
          key={i}
          points={lane.path}
          color={color}
          lineWidth={lineWidth}
          transparent
          opacity={opacity}
        />
      ))}
    </group>
  );
}

// ============ BICING STATIONS ============
// Local cached data from CityBikes API

export interface BicingStationData {
  position: [number, number, number];
  name?: string;
  capacity?: number;
}

export async function fetchBicingStations(): Promise<BicingStationData[]> {
  try {
    const response = await fetch('/data/barcelona/bicing-stations.json');

    if (!response.ok) {
      console.warn('Bicing stations data not found');
      return [];
    }

    const data = await response.json();

    // CityBikes format: data.network.stations
    const stations = data.network?.stations || [];

    const result = stations
      .filter((s: any) => {
        const lat = s.latitude;
        const lon = s.longitude;
        return lat && lon && isInsideBounds(lat, lon);
      })
      .map((s: any) => ({
        position: project(s.longitude, s.latitude),
        name: s.name,
        capacity: (s.free_bikes || 0) + (s.empty_slots || 0),
      }));

    console.log(`Bicing stations: ${result.length} in view`);
    return result;
  } catch (err) {
    console.error('Bicing stations fetch error:', err);
    return [];
  }
}

// Bicing station dock - red/orange posts with bike rack
interface InstancedBicingStationsProps {
  stations: BicingStationData[];
  postColor?: string;
  dockColor?: string;
}

export function InstancedBicingStations({
  stations,
  postColor = '#cc3333',  // Bicing red
  dockColor = '#aa2222',
}: InstancedBicingStationsProps) {
  const postRef = useRef<THREE.InstancedMesh>(null);
  const dockRef = useRef<THREE.InstancedMesh>(null);

  const POST_HEIGHT = 2.5;
  const DOCK_WIDTH = 3;
  const DOCK_DEPTH = 1.5;

  useEffect(() => {
    if (!postRef.current || !dockRef.current || stations.length === 0) return;

    const tempObject = new THREE.Object3D();

    stations.forEach((station, i) => {
      // Post/sign
      tempObject.position.set(station.position[0], station.position[1], POST_HEIGHT / 2);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      postRef.current!.setMatrixAt(i, tempObject.matrix);

      // Dock base
      tempObject.position.set(station.position[0], station.position[1], 0.15);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      dockRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    postRef.current.instanceMatrix.needsUpdate = true;
    dockRef.current.instanceMatrix.needsUpdate = true;
  }, [stations]);

  if (stations.length === 0) return null;

  return (
    <>
      {/* Posts */}
      <instancedMesh ref={postRef} args={[undefined, undefined, stations.length]}>
        <cylinderGeometry args={[0.12, 0.12, POST_HEIGHT, 6]} />
        <meshBasicMaterial color={postColor} />
      </instancedMesh>

      {/* Dock bases */}
      <instancedMesh ref={dockRef} args={[undefined, undefined, stations.length]}>
        <boxGeometry args={[DOCK_WIDTH, DOCK_DEPTH, 0.3]} />
        <meshBasicMaterial color={dockColor} />
      </instancedMesh>
    </>
  );
}

// ============ TRAFFIC VIOLATIONS ============
// Local cached data from Barcelona Open Data (traffic complaints/sanctions)

export interface TrafficViolationData {
  position: [number, number, number];
  type?: string;
  district?: string;
  fine?: number;
}

export async function fetchTrafficViolations(): Promise<TrafficViolationData[]> {
  try {
    const response = await fetch('/data/barcelona/traffic-violations.json');

    if (!response.ok) {
      console.warn('Traffic violations data not found');
      return [];
    }

    const data = await response.json();
    if (!data.success || !data.result?.records) {
      return [];
    }

    const violations = data.result.records
      .filter((r: any) => {
        const lat = parseFloat(r.Latitud_WGS84);
        const lon = parseFloat(r.Longitud_WGS84);
        return lat && lon && isInsideBounds(lat, lon);
      })
      .map((r: any) => ({
        position: project(parseFloat(r.Longitud_WGS84), parseFloat(r.Latitud_WGS84)),
        type: r.Infraccio_Codi,
        district: r.Nom_Districte,
        fine: parseFloat(r['Import_Nominal_€']) || 0,
      }));

    console.log(`Traffic violations: ${violations.length} in view`);
    return violations;
  } catch (err) {
    console.error('Traffic violations fetch error:', err);
    return [];
  }
}

// Traffic violations as small red dots (heatmap-style)
interface InstancedTrafficViolationsProps {
  violations: TrafficViolationData[];
  color?: string;
  opacity?: number;
}

export function InstancedTrafficViolations({
  violations,
  color = '#ff4444',
  opacity = 0.3,
}: InstancedTrafficViolationsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current || violations.length === 0) return;

    const tempObject = new THREE.Object3D();

    violations.forEach((v, i) => {
      tempObject.position.set(v.position[0], v.position[1], 0.5);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [violations]);

  if (violations.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, violations.length]}>
      <circleGeometry args={[1.5, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </instancedMesh>
  );
}
