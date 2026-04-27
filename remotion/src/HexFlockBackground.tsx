// Frame-deterministic port of ../../src/HexGridBackground.tsx for Remotion.
// Same aperture-7 hex grid + 5 wandering flock attractors with Gaussian
// influence — but driven by useCurrentFrame instead of requestAnimationFrame.

import { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Presets: orange RGB, red RGB, layer1 max alpha, layer2 max alpha
const PRESETS: { orange: [number, number, number]; red: [number, number, number]; a1: number; a2: number }[] = [
  { orange: [253, 186, 116], red: [252, 165, 165], a1: 0.08, a2: 0.03 },
  { orange: [253, 186, 116], red: [252, 165, 165], a1: 0.15, a2: 0.06 }, // default (index 1)
  { orange: [253, 186, 116], red: [252, 165, 165], a1: 0.25, a2: 0.1 },
  { orange: [251, 146, 60], red: [248, 113, 113], a1: 0.06, a2: 0.025 },
  { orange: [251, 146, 60], red: [248, 113, 113], a1: 0.12, a2: 0.04 },
  { orange: [251, 146, 60], red: [248, 113, 113], a1: 0.2, a2: 0.07 },
];

const SQRT7 = Math.sqrt(7);
const AP7_ROT = Math.atan2(Math.sqrt(3), 5);

function honeycombCenters(r: number, rot: number, rings: number): { x: number; y: number }[] {
  const dist = r * Math.sqrt(3);
  const dirs: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + rot;
    dirs.push([dist * Math.cos(a), dist * Math.sin(a)]);
  }
  const centers: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  const seen = new Set<string>();
  seen.add("0,0");
  for (let ring = 1; ring <= rings; ring++) {
    let x = dirs[4][0] * ring;
    let y = dirs[4][1] * ring;
    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < ring; step++) {
        const key = `${Math.round(x * 10)},${Math.round(y * 10)}`;
        if (!seen.has(key)) {
          seen.add(key);
          centers.push({ x, y });
        }
        x += dirs[side][0];
        y += dirs[side][1];
      }
    }
  }
  return centers;
}

function hexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot;
    const px = cx + r * Math.cos(a);
    const py = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function insideHex(px: number, py: number, cx: number, cy: number, r: number, rot: number): boolean {
  const dx = px - cx;
  const dy = py - cy;
  const cos = Math.cos(-rot);
  const sin = Math.sin(-rot);
  const lx = dx * cos - dy * sin;
  const ly = dx * sin + dy * cos;
  const ax = Math.abs(lx);
  const ay = Math.abs(ly);
  return ay <= (r * Math.sqrt(3)) / 2 && ax <= r && ax + ay / Math.sqrt(3) <= r;
}

function buildChildMap(
  layer1: { x: number; y: number }[],
  layer2: { x: number; y: number }[],
  R2: number,
  rot2: number,
): number[][] {
  return layer2.map(({ x: px, y: py }) => {
    const children: number[] = [];
    for (let i = 0; i < layer1.length; i++) {
      if (insideHex(layer1[i].x, layer1[i].y, px, py, R2, rot2)) children.push(i);
    }
    return children;
  });
}

const TW_COLORS: [number, number, number][] = [
  [234, 88, 12], // orange-600
  [220, 38, 38], // red-600
];

function nearestTailwind(r: number, g: number, b: number): [number, number, number] {
  let best = TW_COLORS[0];
  let bestDist = Infinity;
  for (const tw of TW_COLORS) {
    const dr = r - tw[0];
    const dg = g - tw[1];
    const db = b - tw[2];
    const d = dr * dr + dg * dg + db * db;
    if (d < bestDist) {
      bestDist = d;
      best = tw;
    }
  }
  return best;
}

const FLOCK_COUNT = 5;
const FLOCK_RADIUS = 180;

function flockCenter(i: number, t: number, W: number, H: number): [number, number] {
  const fx = 0.13 + i * 0.07;
  const fy = 0.11 + i * 0.05;
  const px = i * 1.7 + 0.3;
  const py = i * 2.3 + 1.1;
  const x = Math.sin(t * fx + px) * W * 0.4;
  const y = Math.sin(t * fy + py) * H * 0.35;
  return [x, y];
}

interface CellResult {
  alpha: number;
  r: number;
  g: number;
  b: number;
}

function undulate(
  x: number,
  y: number,
  t: number,
  W: number,
  H: number,
  flockColors: [number, number, number][],
): CellResult {
  let acc = 0;
  let rr = 0,
    gg = 0,
    bb = 0;
  for (let i = 0; i < FLOCK_COUNT; i++) {
    const [fx, fy] = flockCenter(i, t, W, H);
    const dx = x - fx;
    const dy = y - fy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.exp(-(dist * dist) / (FLOCK_RADIUS * FLOCK_RADIUS * 2));
    const [cr, cg, cb] = flockColors[i];
    rr += cr * influence;
    gg += cg * influence;
    bb += cb * influence;
    acc += influence;
  }
  const v = Math.min(acc, 1.0);
  const alpha = v * v * v;
  if (acc > 0.001) {
    rr /= acc;
    gg /= acc;
    bb /= acc;
  } else {
    rr = 127;
    gg = 94;
    bb = 70;
  }
  return { alpha, r: rr, g: gg, b: bb };
}

interface Props {
  preset?: number; // 0..5, default 1 (matches the site default)
}

export const HexFlockBackground: React.FC<Props> = ({ preset = 1 }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const grid = useMemo(() => {
    const R1 = 18;
    const rot1 = 0;
    const R2 = R1 * SQRT7;
    const rot2 = AP7_ROT;
    const maxDim = Math.max(W, H);
    const rings1 = Math.ceil(maxDim / (R1 * Math.sqrt(3))) + 2;
    const rings2 = Math.ceil(maxDim / (R2 * Math.sqrt(3))) + 2;
    const layer1 = honeycombCenters(R1, rot1, rings1);
    const layer2 = honeycombCenters(R2, rot2, rings2);
    const childMap = buildChildMap(layer1, layer2, R2, rot2);
    return { R1, rot1, R2, rot2, layer1, layer2, childMap };
  }, [W, H]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const t = frame / fps;
    const ox = W / 2;
    const oy = H / 2;
    const p = PRESETS[Math.max(0, Math.min(PRESETS.length - 1, preset))];

    // 4 orange flocks + 1 red, matching the site's allocation
    const flockColors: [number, number, number][] = [p.orange, p.orange, p.orange, p.orange, p.red];

    ctx.clearRect(0, 0, W, H);

    const { R1, rot1, R2, rot2, layer1, layer2, childMap } = grid;

    // Layer 1: fine grid
    const cellResults: CellResult[] = new Array(layer1.length);
    for (let i = 0; i < layer1.length; i++) {
      cellResults[i] = undulate(layer1[i].x, layer1[i].y, t, W, H, flockColors);
    }

    for (let i = 0; i < layer1.length; i++) {
      const c = layer1[i];
      const sx = ox + c.x;
      const sy = oy + c.y;
      if (sx < -R1 || sx > W + R1 || sy < -R1 || sy > H + R1) continue;
      const { alpha, r, g, b } = cellResults[i];
      const fa = alpha * p.a1;
      if (fa > 0.005) {
        hexPath(ctx, sx, sy, R1, rot1);
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${fa.toFixed(3)})`;
        ctx.fill();
      }
    }

    // Layer 2: coarse grid, fill = nearest tailwind of lightest child
    for (let j = 0; j < layer2.length; j++) {
      const c = layer2[j];
      const sx = ox + c.x;
      const sy = oy + c.y;
      if (sx < -R2 || sx > W + R2 || sy < -R2 || sy > H + R2) continue;

      const children = childMap[j];
      let sumAlpha = 0;
      let lightestIdx = -1;
      let lightestAlpha = Infinity;
      if (children.length > 0) {
        for (const ci of children) {
          sumAlpha += cellResults[ci].alpha;
          if (cellResults[ci].alpha < lightestAlpha) {
            lightestAlpha = cellResults[ci].alpha;
            lightestIdx = ci;
          }
        }
        sumAlpha /= children.length;
      }

      let fr = 127,
        fg = 94,
        fb = 70;
      if (lightestIdx >= 0) {
        const d = cellResults[lightestIdx];
        [fr, fg, fb] = nearestTailwind(d.r, d.g, d.b);
      }
      const fa = sumAlpha * p.a2;

      if (fa > 0.003) {
        hexPath(ctx, sx, sy, R2, rot2);
        ctx.fillStyle = `rgba(${fr},${fg},${fb},${fa.toFixed(3)})`;
        ctx.fill();
      }
    }
  }, [frame, fps, W, H, grid, preset]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};
