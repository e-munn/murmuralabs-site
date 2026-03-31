import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Site palette accent colors
export const COLORS = {
  blue500: '#0284c7',    // sky
  red500: '#dc2626',     // danger
  yellow400: '#ea580c',  // ember
  green500: '#16a34a',   // canopy
  white: '#FFE4CC',      // linen
};

// Shared animation config
const DROP_HEIGHT = 80;
const ANIMATION_DURATION = 0.6; // seconds
const STAGGER_DELAY = 0.003; // seconds between each marker

// Ease out back for bounce effect
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Seeded random for consistent per-marker randomness
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ============ BUS STOP MARKERS ============
// Simple circle on pole - BLUE

interface BusStopMarkersProps {
  positions: [number, number, number][];
  color?: string;
  poleHeight?: number;
  opacity?: number;
}

export function BusStopMarkers({
  positions,
  color = COLORS.blue500,
  poleHeight = 30,
  opacity = 1,
}: BusStopMarkersProps) {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const circleRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef<number | null>(null);
  const animationComplete = useRef(false);

  // Sort positions by distance from center for radial stagger effect (perimeter first, inward)
  const sortedIndices = useMemo(() => {
    return positions
      .map((pos, i) => ({ i, dist: Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]) }))
      .sort((a, b) => b.dist - a.dist)
      .map((item) => item.i);
  }, [positions]);

  useFrame(({ clock }) => {
    if (!poleRef.current || !circleRef.current || positions.length === 0) return;

    // Initialize start time
    if (startTime.current === null) {
      startTime.current = clock.elapsedTime;
    }

    // Skip if animation is complete
    if (animationComplete.current) return;

    const elapsed = clock.elapsedTime - startTime.current;
    const tempObject = new THREE.Object3D();
    let allComplete = true;

    positions.forEach((pos, i) => {
      // Get stagger order from sorted indices
      const staggerOrder = sortedIndices.indexOf(i);
      // Add small random offset to break up clustering
      const randomOffset = seededRandom(i * 13) * 0.015;
      const delay = staggerOrder * STAGGER_DELAY + randomOffset;
      const localTime = Math.max(0, elapsed - delay);
      const progress = Math.min(1, localTime / ANIMATION_DURATION);
      const eased = easeOutBack(progress);

      if (progress < 1) allComplete = false;

      // Calculate z offset (drop from above)
      const zOffset = DROP_HEIGHT * (1 - eased);

      // Pole
      tempObject.position.set(pos[0], pos[1], poleHeight / 2 + zOffset);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      poleRef.current!.setMatrixAt(i, tempObject.matrix);

      // Circle at top
      tempObject.position.set(pos[0], pos[1], poleHeight + 4 + zOffset);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      circleRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    poleRef.current.instanceMatrix.needsUpdate = true;
    circleRef.current.instanceMatrix.needsUpdate = true;

    if (allComplete) {
      animationComplete.current = true;
    }
  });

  if (positions.length === 0) return null;

  return (
    <>
      <instancedMesh ref={poleRef} args={[undefined, undefined, positions.length]} frustumCulled>
        <cylinderGeometry args={[0.6, 0.6, poleHeight, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.75 * opacity} />
      </instancedMesh>
      <instancedMesh ref={circleRef} args={[undefined, undefined, positions.length]} frustumCulled>
        <circleGeometry args={[5, 16]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.75 * opacity} />
      </instancedMesh>
    </>
  );
}

// ============ BICING STATION MARKERS ============
// Simple square on pole - RED

interface BicingMarkersProps {
  positions: [number, number, number][];
  color?: string;
  poleHeight?: number;
  opacity?: number;
}

export function BicingMarkers({
  positions,
  color = COLORS.red500,
  poleHeight = 30,
  opacity = 1,
}: BicingMarkersProps) {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const squareRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef<number | null>(null);
  const animationComplete = useRef(false);

  // Sort positions by distance from center for radial stagger effect (perimeter first, inward)
  const sortedIndices = useMemo(() => {
    return positions
      .map((pos, i) => ({ i, dist: Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]) }))
      .sort((a, b) => b.dist - a.dist)
      .map((item) => item.i);
  }, [positions]);

  useFrame(({ clock }) => {
    if (!poleRef.current || !squareRef.current || positions.length === 0) return;

    if (startTime.current === null) {
      startTime.current = clock.elapsedTime;
    }

    if (animationComplete.current) return;

    const elapsed = clock.elapsedTime - startTime.current;
    const tempObject = new THREE.Object3D();
    let allComplete = true;

    positions.forEach((pos, i) => {
      const staggerOrder = sortedIndices.indexOf(i);
      // Add small random offset to break up clustering
      const randomOffset = seededRandom(i * 11) * 0.015;
      const delay = staggerOrder * STAGGER_DELAY + randomOffset;
      const localTime = Math.max(0, elapsed - delay);
      const progress = Math.min(1, localTime / ANIMATION_DURATION);
      const eased = easeOutBack(progress);

      if (progress < 1) allComplete = false;

      const zOffset = DROP_HEIGHT * (1 - eased);

      // Pole
      tempObject.position.set(pos[0], pos[1], poleHeight / 2 + zOffset);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      poleRef.current!.setMatrixAt(i, tempObject.matrix);

      // Square at top
      tempObject.position.set(pos[0], pos[1], poleHeight + 4 + zOffset);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      squareRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    poleRef.current.instanceMatrix.needsUpdate = true;
    squareRef.current.instanceMatrix.needsUpdate = true;

    if (allComplete) {
      animationComplete.current = true;
    }
  });

  if (positions.length === 0) return null;

  return (
    <>
      <instancedMesh ref={poleRef} args={[undefined, undefined, positions.length]} frustumCulled>
        <cylinderGeometry args={[0.6, 0.6, poleHeight, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.75 * opacity} />
      </instancedMesh>
      <instancedMesh ref={squareRef} args={[undefined, undefined, positions.length]} frustumCulled>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.75 * opacity} />
      </instancedMesh>
    </>
  );
}

// ============ TRAFFIC VIOLATION MARKERS ============
// Simple triangle on pole - YELLOW

interface TrafficViolationMarkersProps {
  positions: [number, number, number][];
  color?: string;
  poleHeight?: number;
  opacity?: number;
}

export function TrafficViolationMarkers({
  positions,
  color = COLORS.yellow400,
  poleHeight = 30,
  opacity = 1,
}: TrafficViolationMarkersProps) {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const triangleRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef<number | null>(null);
  const animationComplete = useRef(false);

  // Triangle geometry
  const triangleGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 5);
    shape.lineTo(5, -3);
    shape.lineTo(-5, -3);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  // Sort positions by distance from center for radial stagger effect (perimeter first, inward)
  const sortedIndices = useMemo(() => {
    return positions
      .map((pos, i) => ({ i, dist: Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]) }))
      .sort((a, b) => b.dist - a.dist)
      .map((item) => item.i);
  }, [positions]);

  useFrame(({ clock }) => {
    if (!poleRef.current || !triangleRef.current || positions.length === 0) return;

    if (startTime.current === null) {
      startTime.current = clock.elapsedTime;
    }

    if (animationComplete.current) return;

    const elapsed = clock.elapsedTime - startTime.current;
    const tempObject = new THREE.Object3D();
    let allComplete = true;

    positions.forEach((pos, i) => {
      const staggerOrder = sortedIndices.indexOf(i);
      // Add small random offset to break up clustering
      const randomOffset = seededRandom(i * 17) * 0.015;
      const delay = staggerOrder * STAGGER_DELAY + randomOffset;
      const localTime = Math.max(0, elapsed - delay);
      const progress = Math.min(1, localTime / ANIMATION_DURATION);
      const eased = easeOutBack(progress);

      if (progress < 1) allComplete = false;

      const zOffset = DROP_HEIGHT * (1 - eased);

      // Pole
      tempObject.position.set(pos[0], pos[1], poleHeight / 2 + zOffset);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      poleRef.current!.setMatrixAt(i, tempObject.matrix);

      // Triangle at top
      tempObject.position.set(pos[0], pos[1], poleHeight + 4 + zOffset);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      triangleRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    poleRef.current.instanceMatrix.needsUpdate = true;
    triangleRef.current.instanceMatrix.needsUpdate = true;

    if (allComplete) {
      animationComplete.current = true;
    }
  });

  if (positions.length === 0) return null;

  return (
    <>
      <instancedMesh ref={poleRef} args={[undefined, undefined, positions.length]} frustumCulled>
        <cylinderGeometry args={[0.6, 0.6, poleHeight, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.75 * opacity} />
      </instancedMesh>
      <instancedMesh ref={triangleRef} args={[triangleGeometry, undefined, positions.length]} frustumCulled>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.75 * opacity} />
      </instancedMesh>
    </>
  );
}

// ============ PARKING MARKERS ============
// P symbol on pole

interface ParkingMarkersProps {
  startPositions: [number, number, number][];
  color?: string;
}

export function ParkingMarkers({
  startPositions,
  color = COLORS.blue500,
}: ParkingMarkersProps) {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const signRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef<number | null>(null);
  const animationComplete = useRef(false);

  const poleHeight = 28;

  // Sort positions by distance from center for radial stagger effect (perimeter first, inward)
  const sortedIndices = useMemo(() => {
    return startPositions
      .map((pos, i) => ({ i, dist: Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]) }))
      .sort((a, b) => b.dist - a.dist)
      .map((item) => item.i);
  }, [startPositions]);

  useFrame(({ clock }) => {
    if (!poleRef.current || !signRef.current || startPositions.length === 0) return;

    if (startTime.current === null) {
      startTime.current = clock.elapsedTime;
    }

    if (animationComplete.current) return;

    const elapsed = clock.elapsedTime - startTime.current;
    const tempObject = new THREE.Object3D();
    let allComplete = true;

    startPositions.forEach((pos, i) => {
      const staggerOrder = sortedIndices.indexOf(i);
      const delay = staggerOrder * STAGGER_DELAY;
      const localTime = Math.max(0, elapsed - delay);
      const progress = Math.min(1, localTime / ANIMATION_DURATION);
      const eased = easeOutBack(progress);

      if (progress < 1) allComplete = false;

      const zOffset = DROP_HEIGHT * (1 - eased);

      // Pole
      tempObject.position.set(pos[0], pos[1], poleHeight / 2 + zOffset);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      poleRef.current!.setMatrixAt(i, tempObject.matrix);

      // P sign (circle)
      tempObject.position.set(pos[0], pos[1], poleHeight + 1.5 + zOffset);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      signRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    poleRef.current.instanceMatrix.needsUpdate = true;
    signRef.current.instanceMatrix.needsUpdate = true;

    if (allComplete) {
      animationComplete.current = true;
    }
  });

  if (startPositions.length === 0) return null;

  return (
    <>
      <instancedMesh ref={poleRef} args={[undefined, undefined, startPositions.length]}>
        <cylinderGeometry args={[0.25, 0.25, poleHeight, 6]} />
        <meshBasicMaterial color={color} />
      </instancedMesh>
      <instancedMesh ref={signRef} args={[undefined, undefined, startPositions.length]}>
        <circleGeometry args={[2, 16]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </instancedMesh>
    </>
  );
}

// ============ TREE MARKERS ============
// Stylized tree markers

interface TreeMarkersProps {
  positions: [number, number, number][];
  trunkColor?: string;
  canopyColor?: string;
}

export function TreeMarkers({
  positions,
  trunkColor = '#8b5a2b',
  canopyColor = COLORS.green500,
}: TreeMarkersProps) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const startTime = useRef<number | null>(null);
  const animationComplete = useRef(false);

  const trunkHeight = 12;
  const canopyRadius = 5;

  // Sort positions by distance from center for radial stagger effect (perimeter first, inward)
  const sortedIndices = useMemo(() => {
    return positions
      .map((pos, i) => ({ i, dist: Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]) }))
      .sort((a, b) => b.dist - a.dist)
      .map((item) => item.i);
  }, [positions]);

  useFrame(({ clock }) => {
    if (!trunkRef.current || !canopyRef.current || positions.length === 0) return;

    if (startTime.current === null) {
      startTime.current = clock.elapsedTime;
    }

    if (animationComplete.current) return;

    const elapsed = clock.elapsedTime - startTime.current;
    const tempObject = new THREE.Object3D();
    const seed = (i: number) => ((i * 127) % 100) / 100;
    let allComplete = true;

    positions.forEach((pos, i) => {
      const staggerOrder = sortedIndices.indexOf(i);
      const delay = staggerOrder * STAGGER_DELAY;
      const localTime = Math.max(0, elapsed - delay);
      const progress = Math.min(1, localTime / ANIMATION_DURATION);
      const eased = easeOutBack(progress);

      if (progress < 1) allComplete = false;

      const zOffset = DROP_HEIGHT * (1 - eased);

      const heightVar = 0.8 + seed(i) * 0.4;
      const canopyVar = 0.8 + seed(i + 50) * 0.4;

      // Trunk
      tempObject.position.set(pos[0], pos[1], (trunkHeight * heightVar) / 2 + zOffset);
      tempObject.rotation.set(Math.PI / 2, 0, 0);
      tempObject.scale.set(1, 1, heightVar);
      tempObject.updateMatrix();
      trunkRef.current!.setMatrixAt(i, tempObject.matrix);

      // Canopy (sphere)
      tempObject.position.set(pos[0], pos[1], trunkHeight * heightVar + canopyRadius * canopyVar * 0.6 + zOffset);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(canopyVar, canopyVar, canopyVar * 0.7);
      tempObject.updateMatrix();
      canopyRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;

    if (allComplete) {
      animationComplete.current = true;
    }
  });

  if (positions.length === 0) return null;

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, positions.length]}>
        <cylinderGeometry args={[0.5, 0.7, trunkHeight, 6]} />
        <meshBasicMaterial color={trunkColor} />
      </instancedMesh>
      <instancedMesh ref={canopyRef} args={[undefined, undefined, positions.length]}>
        <sphereGeometry args={[canopyRadius, 8, 6]} />
        <meshBasicMaterial color={canopyColor} />
      </instancedMesh>
    </>
  );
}
