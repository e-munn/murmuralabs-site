import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CENTER, project } from './data';

// Fetch trees from pre-filtered Barcelona Open Data (custom perimeter)
export async function fetchOSMTrees(): Promise<[number, number, number][]> {
  try {
    const response = await fetch('/data/perimeter/barcelona-trees-custom.json');
    if (!response.ok) throw new Error('Failed to load tree data');

    const trees = await response.json();
    return trees.map((t: { lat: number; lon: number }) => project(t.lon, t.lat));
  } catch (err) {
    console.error('Tree fetch error:', err);
    return [];
  }
}

// Barcelona Open Data API - Official city tree inventory
// Much more complete than OSM (~200k trees vs ~765)
const BCN_TREE_API = 'https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search_sql';

// Arbrat Viari resource ID (street trees)
const ARBRAT_VIARI_ID = '28034af4-b636-48e7-b3df-fa1c422e6287';
// Arbrat Zona resource ID (park/zone trees)
const ARBRAT_ZONA_ID = '8f2402dd-72dc-4b07-8145-e3f75004b0de';

export async function fetchBarcelonaTrees(): Promise<[number, number, number][]> {
  const halfSize = 0.008;
  const minLat = CENTER.lat - halfSize;
  const maxLat = CENTER.lat + halfSize;
  const minLon = CENTER.lon - halfSize;
  const maxLon = CENTER.lon + halfSize;

  // Query for street trees within bounding box
  // Barcelona uses ETRS89 (similar to WGS84 for our purposes)
  const sql = `
    SELECT latitud, longitud FROM "${ARBRAT_VIARI_ID}"
    WHERE latitud >= ${minLat} AND latitud <= ${maxLat}
    AND longitud >= ${minLon} AND longitud <= ${maxLon}
    LIMIT 5000
  `;

  try {
    const response = await fetch(`${BCN_TREE_API}?sql=${encodeURIComponent(sql)}`);

    if (!response.ok) {
      console.warn('Barcelona tree API failed, falling back to OSM');
      return fetchOSMTrees();
    }

    const data = await response.json();

    if (!data.success || !data.result?.records) {
      console.warn('Barcelona tree API returned no data, falling back to OSM');
      return fetchOSMTrees();
    }

    const trees = data.result.records
      .filter((r: any) => r.latitud && r.longitud)
      .map((r: any) => project(parseFloat(r.longitud), parseFloat(r.latitud)));

    console.log(`Barcelona Open Data: ${trees.length} street trees`);

    // Also try to get zone trees
    const zoneTrees = await fetchBarcelonaZoneTrees(minLat, maxLat, minLon, maxLon);

    return [...trees, ...zoneTrees];
  } catch (err) {
    console.error('Barcelona tree fetch error:', err);
    return fetchOSMTrees();
  }
}

async function fetchBarcelonaZoneTrees(
  minLat: number, maxLat: number, minLon: number, maxLon: number
): Promise<[number, number, number][]> {
  const sql = `
    SELECT latitud, longitud FROM "${ARBRAT_ZONA_ID}"
    WHERE latitud >= ${minLat} AND latitud <= ${maxLat}
    AND longitud >= ${minLon} AND longitud <= ${maxLon}
    LIMIT 2000
  `;

  try {
    const response = await fetch(`${BCN_TREE_API}?sql=${encodeURIComponent(sql)}`);

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.success || !data.result?.records) return [];

    const trees = data.result.records
      .filter((r: any) => r.latitud && r.longitud)
      .map((r: any) => project(parseFloat(r.longitud), parseFloat(r.latitud)));

    console.log(`Barcelona Open Data: ${trees.length} zone trees`);
    return trees;
  } catch (err) {
    return [];
  }
}

// Barcelona Platanus (Plane tree) dimensions - tall trunk with wide spreading canopy
const PLATANUS_TRUNK_HEIGHT = 8;
const PLATANUS_TRUNK_RADIUS = 0.6;
const PLATANUS_CANOPY_WIDTH = 7;  // Wide spreading canopy
const PLATANUS_CANOPY_HEIGHT = 4; // Flattened dome shape

// Low-poly instanced trees component - Barcelona Platanus style
interface InstancedTreesProps {
  positions: [number, number, number][];
  trunkColor?: string;
  foliageColor?: string;
  opacity?: number;
}

export function InstancedTrees({
  positions,
  trunkColor = '#4a3d2e',  // Mottled brown-gray like plane tree bark
  foliageColor = '#3d6b35', // Mediterranean green
}: InstancedTreesProps) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const foliageRef = useRef<THREE.InstancedMesh>(null);

  // Create flattened sphere geometry for spreading canopy
  const canopyGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 8, 6);
    // Scale to create flattened dome (wide and not too tall)
    geo.scale(PLATANUS_CANOPY_WIDTH, PLATANUS_CANOPY_WIDTH, PLATANUS_CANOPY_HEIGHT);
    return geo;
  }, []);

  useEffect(() => {
    if (!trunkRef.current || !foliageRef.current || positions.length === 0) return;

    const tempObject = new THREE.Object3D();
    // Seed for slight randomization
    const seed = (i: number) => ((i * 127) % 100) / 100;

    positions.forEach((pos, i) => {
      // Slight height variation (0.8 to 1.2 scale)
      const heightVar = 0.8 + seed(i) * 0.4;
      const canopyVar = 0.85 + seed(i + 50) * 0.3;

      // Trunk - tall and thin like Platanus
      tempObject.position.set(pos[0], pos[1], (PLATANUS_TRUNK_HEIGHT * heightVar) / 2);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, heightVar);
      tempObject.updateMatrix();
      trunkRef.current!.setMatrixAt(i, tempObject.matrix);

      // Canopy - wide spreading dome at top of trunk
      tempObject.position.set(
        pos[0],
        pos[1],
        PLATANUS_TRUNK_HEIGHT * heightVar + PLATANUS_CANOPY_HEIGHT * canopyVar * 0.3
      );
      tempObject.rotation.set(0, seed(i + 100) * Math.PI * 2, 0); // Random rotation for variety
      tempObject.scale.set(canopyVar, canopyVar, canopyVar);
      tempObject.updateMatrix();
      foliageRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <>
      {/* Trunks - tall thin cylinders */}
      <instancedMesh ref={trunkRef} args={[undefined, undefined, positions.length]}>
        <cylinderGeometry args={[PLATANUS_TRUNK_RADIUS * 0.7, PLATANUS_TRUNK_RADIUS, PLATANUS_TRUNK_HEIGHT, 6]} />
        <meshBasicMaterial color={trunkColor} />
      </instancedMesh>

      {/* Canopy - flattened spreading domes */}
      <instancedMesh ref={foliageRef} args={[canopyGeometry, undefined, positions.length]}>
        <meshBasicMaterial color={foliageColor} />
      </instancedMesh>
    </>
  );
}

// Palm tree dimensions - 1.2x scale for visibility
const PALM_TRUNK_HEIGHT = 7.2;
const PALM_TRUNK_RADIUS = 0.3;
const PALM_CROWN_RADIUS = 3;

// Barcelona Palm trees (Phoenix dactylifera style)
export function InstancedPalmTrees({
  positions,
  trunkColor = '#7f5e46',  // driftwood
  foliageColor = '#16a34a', // canopy
  opacity = 1,
}: InstancedTreesProps) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const foliageRef = useRef<THREE.InstancedMesh>(null);

  // Create star/fan shaped crown geometry (5 segments for asymmetry when rotated)
  const crownGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(PALM_CROWN_RADIUS, 3, 5);
    // Flip and flatten for palm frond effect
    geo.scale(1, 0.5, 1);
    geo.rotateX(Math.PI); // Flip upside down for drooping fronds effect
    return geo;
  }, []);

  useEffect(() => {
    if (!trunkRef.current || !foliageRef.current || positions.length === 0) return;

    const tempObject = new THREE.Object3D();
    const seed = (i: number) => ((i * 127) % 100) / 100;

    positions.forEach((pos, i) => {
      const heightVar = 0.85 + seed(i) * 0.3;
      const crownScaleVar = 0.8 + seed(i + 200) * 0.4; // 0.8 to 1.2 crown size variation

      // Trunk - tall and thin
      tempObject.position.set(pos[0], pos[1], (PALM_TRUNK_HEIGHT * heightVar) / 2);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, heightVar);
      tempObject.updateMatrix();
      trunkRef.current!.setMatrixAt(i, tempObject.matrix);

      // Crown at top - random rotation and scale variation
      tempObject.position.set(pos[0], pos[1], PALM_TRUNK_HEIGHT * heightVar + 1);
      tempObject.rotation.set(0, seed(i + 100) * Math.PI * 2, 0);
      tempObject.scale.set(crownScaleVar, crownScaleVar, crownScaleVar);
      tempObject.updateMatrix();
      foliageRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, positions.length]} frustumCulled>
        <cylinderGeometry args={[PALM_TRUNK_RADIUS * 0.8, PALM_TRUNK_RADIUS, PALM_TRUNK_HEIGHT, 4]} />
        <meshBasicMaterial color={trunkColor} transparent opacity={0.85 * opacity} />
      </instancedMesh>

      <instancedMesh ref={foliageRef} args={[crownGeometry, undefined, positions.length]} frustumCulled>
        <meshBasicMaterial color={foliageColor} transparent opacity={0.7 * opacity} />
      </instancedMesh>
    </>
  );
}

// Orange/Citrus trees - common in Barcelona (rounded compact canopy)
export function InstancedOrangeTrees({
  positions,
  trunkColor = '#3d2817',
  foliageColor = '#2a5a2a', // Deep green
}: InstancedTreesProps) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const foliageRef = useRef<THREE.InstancedMesh>(null);

  const ORANGE_TRUNK_HEIGHT = 3;
  const ORANGE_CANOPY_RADIUS = 4;

  useEffect(() => {
    if (!trunkRef.current || !foliageRef.current || positions.length === 0) return;

    const tempObject = new THREE.Object3D();
    const seed = (i: number) => ((i * 127) % 100) / 100;

    positions.forEach((pos, i) => {
      const sizeVar = 0.8 + seed(i) * 0.4;

      // Short trunk
      tempObject.position.set(pos[0], pos[1], (ORANGE_TRUNK_HEIGHT * sizeVar) / 2);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(sizeVar, sizeVar, sizeVar);
      tempObject.updateMatrix();
      trunkRef.current!.setMatrixAt(i, tempObject.matrix);

      // Round compact canopy
      tempObject.position.set(pos[0], pos[1], ORANGE_TRUNK_HEIGHT * sizeVar + ORANGE_CANOPY_RADIUS * sizeVar * 0.8);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(sizeVar, sizeVar, sizeVar);
      tempObject.updateMatrix();
      foliageRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, positions.length]}>
        <cylinderGeometry args={[0.4, 0.5, ORANGE_TRUNK_HEIGHT, 6]} />
        <meshBasicMaterial color={trunkColor} />
      </instancedMesh>

      <instancedMesh ref={foliageRef} args={[undefined, undefined, positions.length]}>
        <sphereGeometry args={[ORANGE_CANOPY_RADIUS, 8, 6]} />
        <meshBasicMaterial color={foliageColor} />
      </instancedMesh>
    </>
  );
}
