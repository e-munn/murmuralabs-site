import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

// ─── Boids params (mirrors src/Murmuration.tsx) ───
const COUNT = 280;
const MAX_SPEED = 2.6;
const VISUAL_RANGE = 70;
const SEPARATION_DIST = 30;
const COHESION = 0.0022;
const ALIGNMENT = 0.05;
const SEPARATION = 0.05;
const EDGE_MARGIN = 60;
const EDGE_TURN = 0.22;

const W = 1920;
const H = 1080;
const TOTAL_FRAMES = 360; // 12s @ 30fps; should be ≥ Composition durationInFrames

// Deterministic LCG so studio + render produce identical motion
const makeRng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
};

interface BoidFrame {
  x: number;
  y: number;
  a: number; // angle
}

// Pre-compute the entire flock simulation once at module load.
// Cost: ~O(F * N²) — for 360 × 280² ≈ 28M ops. Runs once.
const SIM: BoidFrame[][] = (() => {
  const rng = makeRng(1337);
  const x = new Float32Array(COUNT);
  const y = new Float32Array(COUNT);
  const vx = new Float32Array(COUNT);
  const vy = new Float32Array(COUNT);

  // Seed boids in a soft cluster off-center
  for (let i = 0; i < COUNT; i++) {
    x[i] = W * 0.25 + rng() * W * 0.5;
    y[i] = H * 0.25 + rng() * H * 0.5;
    vx[i] = (rng() - 0.5) * 2;
    vy[i] = (rng() - 0.5) * 2;
  }

  const frames: BoidFrame[][] = [];

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    for (let i = 0; i < COUNT; i++) {
      let cx = 0,
        cy = 0,
        cN = 0;
      let ax = 0,
        ay = 0,
        aN = 0;
      let sx = 0,
        sy = 0;

      const bxi = x[i];
      const byi = y[i];

      for (let j = 0; j < COUNT; j++) {
        if (i === j) continue;
        const dx = x[j] - bxi;
        const dy = y[j] - byi;
        const d2 = dx * dx + dy * dy;
        if (d2 < VISUAL_RANGE * VISUAL_RANGE) {
          const d = Math.sqrt(d2);
          cx += x[j];
          cy += y[j];
          cN++;
          ax += vx[j];
          ay += vy[j];
          aN++;
          if (d < SEPARATION_DIST && d > 0) {
            sx -= dx / d;
            sy -= dy / d;
          }
        }
      }

      if (cN > 0) {
        vx[i] += (cx / cN - bxi) * COHESION;
        vy[i] += (cy / cN - byi) * COHESION;
      }
      if (aN > 0) {
        vx[i] += (ax / aN - vx[i]) * ALIGNMENT;
        vy[i] += (ay / aN - vy[i]) * ALIGNMENT;
      }
      vx[i] += sx * SEPARATION;
      vy[i] += sy * SEPARATION;

      if (bxi < EDGE_MARGIN) vx[i] += EDGE_TURN;
      if (bxi > W - EDGE_MARGIN) vx[i] -= EDGE_TURN;
      if (byi < EDGE_MARGIN) vy[i] += EDGE_TURN;
      if (byi > H - EDGE_MARGIN) vy[i] -= EDGE_TURN;

      const sp = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
      if (sp > MAX_SPEED) {
        vx[i] = (vx[i] / sp) * MAX_SPEED;
        vy[i] = (vy[i] / sp) * MAX_SPEED;
      }
      x[i] += vx[i];
      y[i] += vy[i];
    }

    const snapshot: BoidFrame[] = new Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      snapshot[i] = { x: x[i], y: y[i], a: Math.atan2(vy[i], vx[i]) };
    }
    frames.push(snapshot);
  }

  return frames;
})();

// Pre-build SVG path "d" for one frame's worth of boid triangles.
const buildFlockPath = (boids: BoidFrame[]): string => {
  const parts: string[] = [];
  const len = 8;
  for (const b of boids) {
    const tipX = b.x + Math.cos(b.a) * len;
    const tipY = b.y + Math.sin(b.a) * len;
    const lX = b.x + Math.cos(b.a + 2.5) * len * 0.5;
    const lY = b.y + Math.sin(b.a + 2.5) * len * 0.5;
    const rX = b.x + Math.cos(b.a - 2.5) * len * 0.5;
    const rY = b.y + Math.sin(b.a - 2.5) * len * 0.5;
    parts.push(
      `M ${tipX.toFixed(1)} ${tipY.toFixed(1)} L ${lX.toFixed(1)} ${lY.toFixed(1)} L ${rX.toFixed(1)} ${rY.toFixed(1)} Z`,
    );
  }
  return parts.join(" ");
};

export const Murmuration: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const idx = Math.min(frame, SIM.length - 1);
  const d = buildFlockPath(SIM[idx]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.linen }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <path d={d} fill="rgba(127, 94, 70, 0.55)" />
      </svg>
    </AbsoluteFill>
  );
};
