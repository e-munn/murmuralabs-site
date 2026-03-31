import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Flow animation duration in seconds
const FLOW_DURATION = 60;

// Road type classification
const SIDEWALK_TYPES = ['footway', 'path', 'pedestrian', 'cycleway', 'steps'];

// Road styling
const ROAD_COLOR = new THREE.Color('#c6a181');    // sand
const ROAD_WIDTH = 4;
const SIDEWALK_COLOR = new THREE.Color('#a8876a'); // sand-driftwood mid
const SIDEWALK_WIDTH = 1.5;

export interface RoadData {
  path: [number, number, number][];
  type: string;
  width: number;
}

interface RoadsProps {
  roads: RoadData[];
  opacity?: number;
}

export function Roads({ roads, opacity = 1 }: RoadsProps) {
  const { mainRoads, sidewalks } = useMemo(() => {
    const main: RoadData[] = [];
    const sw: RoadData[] = [];

    for (const road of roads) {
      if (SIDEWALK_TYPES.includes(road.type)) {
        sw.push(road);
      } else {
        main.push(road);
      }
    }

    return { mainRoads: main, sidewalks: sw };
  }, [roads]);

  return (
    <group>
      {mainRoads.map((road, i) => (
        <Line
          key={`road-${i}`}
          points={road.path}
          color={ROAD_COLOR}
          lineWidth={ROAD_WIDTH}
          transparent
          opacity={0.9 * opacity}
        />
      ))}
      {sidewalks.map((road, i) => (
        <Line
          key={`sw-${i}`}
          points={road.path}
          color={SIDEWALK_COLOR}
          lineWidth={SIDEWALK_WIDTH}
          transparent
          opacity={opacity}
        />
      ))}
    </group>
  );
}

interface FlowParticlesProps {
  roads: RoadData[];
  color?: string;
  opacity?: number;
}

export function FlowParticles({ roads, color = '#ea580c', opacity = 0.9 }: FlowParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const startTimeRef = useRef<number | null>(null);
  const [isStopped, setIsStopped] = useState(false);

  const particleRoads = useMemo(() => roads.slice(0, 100), [roads]);
  const particleCount = particleRoads.length * 4;

  const pathData = useMemo(() => {
    return particleRoads.map((road, ri) => {
      const path = road.path;
      let totalLen = 0;
      const segLengths: number[] = [];

      for (let i = 1; i < path.length; i++) {
        const segLen = Math.sqrt(
          Math.pow(path[i][0] - path[i - 1][0], 2) +
          Math.pow(path[i][1] - path[i - 1][1], 2)
        );
        segLengths.push(segLen);
        totalLen += segLen;
      }

      return { path, totalLen, segLengths, offsets: [(ri * 37) % 500, (ri * 37 + 125) % 500, (ri * 37 + 250) % 500, (ri * 37 + 375) % 500] };
    });
  }, [particleRoads]);

  useFrame(({ clock }) => {
    if (!meshRef.current || isStopped) return;

    const currentTime = clock.getElapsedTime();

    // Initialize start time on first frame
    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime;
    }

    // Check if duration has elapsed
    const elapsed = currentTime - startTimeRef.current;
    if (elapsed >= FLOW_DURATION) {
      // Hide all particles by moving them far away
      for (let i = 0; i < particleCount; i++) {
        tempObject.position.set(0, 0, -10000);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      setIsStopped(true);
      return;
    }

    const time = (currentTime * 100) % 500;
    let idx = 0;

    for (const { path, totalLen, segLengths, offsets } of pathData) {
      if (path.length < 2) continue;

      for (const offset of offsets) {
        const progress = ((time + offset) % 500) / 500;
        let targetDist = progress * totalLen;
        let pos: [number, number, number] = path[0];

        for (let i = 0; i < segLengths.length; i++) {
          if (targetDist <= segLengths[i]) {
            const t = targetDist / segLengths[i];
            pos = [
              path[i][0] + (path[i + 1][0] - path[i][0]) * t,
              path[i][1] + (path[i + 1][1] - path[i][1]) * t,
              5,
            ];
            break;
          }
          targetDist -= segLengths[i];
          pos = [path[i + 1][0], path[i + 1][1], 5];
        }

        tempObject.position.set(pos[0], pos[1], pos[2]);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(idx, tempObject.matrix);
        idx++;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Don't render if stopped
  if (isStopped) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]} frustumCulled={false} renderOrder={0}>
      <circleGeometry args={[3, 12]} />
      <meshBasicMaterial color={new THREE.Color(color)} transparent opacity={opacity} depthTest={true} />
    </instancedMesh>
  );
}

export { SIDEWALK_TYPES };
