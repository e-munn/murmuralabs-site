import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

// ===========================================
// PROCEDURAL LOW-POLY MODELS
// Good for isometric city aesthetic
// ===========================================

// Simple low-poly tree (cone + cylinder trunk)
interface TreeProps {
  position?: [number, number, number];
  scale?: number;
  trunkColor?: string;
  foliageColor?: string;
}

export function ProceduralTree({
  position = [0, 0, 0],
  scale = 1,
  trunkColor = '#4a3728',
  foliageColor = '#2d5a27',
}: TreeProps) {
  const trunkHeight = 8 * scale;
  const trunkRadius = 1.5 * scale;
  const foliageHeight = 20 * scale;
  const foliageRadius = 8 * scale;

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[trunkRadius * 0.7, trunkRadius, trunkHeight, 8]} />
        <meshBasicMaterial color={trunkColor} />
      </mesh>
      {/* Foliage - cone */}
      <mesh position={[0, trunkHeight + foliageHeight / 2, 0]}>
        <coneGeometry args={[foliageRadius, foliageHeight, 8]} />
        <meshBasicMaterial color={foliageColor} />
      </mesh>
    </group>
  );
}

// Rounded/bushy tree variant
export function ProceduralBushyTree({
  position = [0, 0, 0],
  scale = 1,
  trunkColor = '#4a3728',
  foliageColor = '#3d6b35',
}: TreeProps) {
  const trunkHeight = 6 * scale;
  const trunkRadius = 1.2 * scale;
  const foliageRadius = 10 * scale;

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[trunkRadius * 0.6, trunkRadius, trunkHeight, 6]} />
        <meshBasicMaterial color={trunkColor} />
      </mesh>
      {/* Foliage - sphere */}
      <mesh position={[0, trunkHeight + foliageRadius * 0.7, 0]}>
        <icosahedronGeometry args={[foliageRadius, 1]} />
        <meshBasicMaterial color={foliageColor} />
      </mesh>
    </group>
  );
}

// Simple low-poly building (box with optional roof)
interface BuildingProps {
  position?: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
  color?: string;
  roofColor?: string;
  hasRoof?: boolean;
}

export function ProceduralBuilding({
  position = [0, 0, 0],
  width = 20,
  depth = 20,
  height = 30,
  color = '#445566',
  roofColor = '#334455',
  hasRoof = true,
}: BuildingProps) {
  return (
    <group position={position}>
      {/* Main building body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Flat roof or pitched roof */}
      {hasRoof && (
        <mesh position={[0, height + 2, 0]}>
          <boxGeometry args={[width + 2, 4, depth + 2]} />
          <meshBasicMaterial color={roofColor} />
        </mesh>
      )}
    </group>
  );
}

// Barcelona-style Eixample building block (chamfered corners)
interface EixampleBlockProps {
  position?: [number, number, number];
  size?: number;
  height?: number;
  chamfer?: number;
  color?: string;
}

export function EixampleBlock({
  position = [0, 0, 0],
  size = 100,
  height = 25,
  chamfer = 15,
  color = '#3a4555',
}: EixampleBlockProps) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const half = size / 2;
    const c = chamfer;

    // Start from top-right, going clockwise with chamfered corners
    s.moveTo(half - c, half);
    s.lineTo(half, half - c);
    s.lineTo(half, -half + c);
    s.lineTo(half - c, -half);
    s.lineTo(-half + c, -half);
    s.lineTo(-half, -half + c);
    s.lineTo(-half, half - c);
    s.lineTo(-half + c, half);
    s.closePath();

    return s;
  }, [size, chamfer]);

  const geometry = useMemo(() => {
    const extrudeSettings = {
      steps: 1,
      depth: height,
      bevelEnabled: false,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [shape, height]);

  return (
    <mesh position={position} geometry={geometry}>
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ===========================================
// GLTF MODEL LOADERS
// For loading external 3D models
// ===========================================

// Free model sources:
// - Poly Pizza: https://poly.pizza (free low-poly)
// - Quaternius: https://quaternius.com (free nature/city packs)
// - Kenney: https://kenney.nl/assets (game-ready)
// - Sketchfab: https://sketchfab.com (search for free GLTF)

interface GLTFModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
}

export function GLTFModel({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: GLTFModelProps) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
      rotation={rotation}
    />
  );
}

// Preload helper for GLTF models
export function preloadModel(url: string) {
  useGLTF.preload(url);
}

// ===========================================
// INSTANCED MODELS (for performance)
// Use when placing many copies of same model
// ===========================================

interface InstancedTreesProps {
  positions: [number, number, number][];
  scale?: number;
  foliageColor?: string;
  trunkColor?: string;
}

export function InstancedTrees({
  positions,
  scale = 1,
  foliageColor = '#2d5a27',
  trunkColor = '#4a3728',
}: InstancedTreesProps) {
  const foliageRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);

  const trunkHeight = 8 * scale;
  const foliageHeight = 20 * scale;

  useMemo(() => {
    if (!foliageRef.current || !trunkRef.current) return;

    const tempObject = new THREE.Object3D();

    positions.forEach((pos, i) => {
      // Trunk
      tempObject.position.set(pos[0], pos[1] + trunkHeight / 2, pos[2]);
      tempObject.updateMatrix();
      trunkRef.current!.setMatrixAt(i, tempObject.matrix);

      // Foliage
      tempObject.position.set(pos[0], pos[1] + trunkHeight + foliageHeight / 2, pos[2]);
      tempObject.updateMatrix();
      foliageRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    foliageRef.current.instanceMatrix.needsUpdate = true;
    trunkRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, trunkHeight, foliageHeight]);

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, positions.length]}>
        <cylinderGeometry args={[1 * scale, 1.5 * scale, trunkHeight, 6]} />
        <meshBasicMaterial color={trunkColor} />
      </instancedMesh>
      <instancedMesh ref={foliageRef} args={[undefined, undefined, positions.length]}>
        <coneGeometry args={[8 * scale, foliageHeight, 6]} />
        <meshBasicMaterial color={foliageColor} />
      </instancedMesh>
    </>
  );
}

interface InstancedBuildingsProps {
  buildings: Array<{
    position: [number, number, number];
    width: number;
    depth: number;
    height: number;
  }>;
  color?: string;
}

export function InstancedBuildings({ buildings, color = '#445566' }: InstancedBuildingsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useMemo(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();

    buildings.forEach((b, i) => {
      tempObject.position.set(b.position[0], b.position[1] + b.height / 2, b.position[2]);
      tempObject.scale.set(b.width, b.height, b.depth);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, buildings.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
}
