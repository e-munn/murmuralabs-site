import { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  polygonToCells,
  cellToBoundary,
  cellToLatLng,
  latLngToCell,
  gridDistance,
} from "h3-js";
import { COLORS } from "../theme";
import { standardDayMinimal } from "../mapStyles";

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN as string | undefined;

// Initial framing — matches richmond.ts in the murmur app
const BBOX: [[number, number], [number, number]] = [
  [-122.42, 37.88],
  [-122.3, 37.97],
];
const INITIAL_CENTER: [number, number] = [-122.36, 37.93];
const INITIAL_ZOOM = 12;

// Bump to 10 (finer) or 11 (mesh) — layer renders all densities at WebGL speed.
const RESOLUTION = 9;

const HEX_SRC = "hex-grid";
const HEX_FILL_LAYER = "hex-grid-fill";

// Spiral reveal arc.
//   frames 0-10:     map fades in
//   frames 10-82:    cells appear ring-by-ring, spiraling outward (slower for legibility).
//                    Direction alternates per ring; per-ring duration scales
//                    so inner rings feel deliberate, outer rings flow fast.
//   frames 82-90:    brief hold — full grid sits at solid rust so the choropleth reads
//   frames 90-115:   undulation ramps in (cells shift from solid rust into the flock pattern)
//   frames 115-240:  continuous undulating color + opacity driven by 5 wandering flock attractors
const FADE_IN_END = 10;
const REVEAL_END = 82;
const UNDULATE_START = 90;
const UNDULATE_RAMP_END = 115;

// Tuning for ring pacing — frames per ring scale roughly with sqrt of cell count
function rawRingWeight(ring: number, cellCount: number): number {
  if (ring === 0) return 3;
  if (ring <= 2) return 5 + cellCount * 0.55;
  if (ring <= 5) return 3 + cellCount * 0.25;
  return 2 + cellCount * 0.1;
}

// Per-ring spiral offset: each successive ring starts at a slightly different angle,
// creating a continuous spiral path rather than concentric circles.
const RING_ANGLE_OFFSET = 0.45; // ~26° per ring

// Polygon inset: each hex shrinks toward its centroid so the map shows through as the
// "gap" between cells, mimicking a stroke without actually drawing one. 0.94 = 6% inset.
const HEX_INSET = 0.94;

// Flock-attractor undulation — same pattern as HexFlockBackground (used in LogoIntro).
// 4 warm-orange attractors + 1 reddish, each tracing a slow Lissajous over the canvas.
// Each visible cell samples Gaussian influence from every flock; the result drives
// per-cell opacity (amp) and a warmth shift toward the red flock's color.
const FLOCK_COUNT = 5;
// Tighter than HexFlockBackground (180px on a smaller canvas). On a 1920×1080
// frame this keeps each attractor's hot zone distinct rather than washing the
// whole map in one color.
const FLOCK_RADIUS_PX = 220;

function flockCenter(i: number, t: number, W: number, H: number): [number, number] {
  const fx = 0.13 + i * 0.07;
  const fy = 0.11 + i * 0.05;
  const px = i * 1.7 + 0.3;
  const py = i * 2.3 + 1.1;
  const x = W / 2 + Math.sin(t * fx + px) * W * 0.4;
  const y = H / 2 + Math.sin(t * fy + py) * H * 0.35;
  return [x, y];
}

type CellRecord = { fid: number; px: number; py: number; appearAt: number };

export const RichmondMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const cellsRef = useRef<CellRecord[]>([]);
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const [initHandle] = useState(() =>
    delayRender("Loading Mapbox tiles + building hex layer", {
      timeoutInMilliseconds: 60000,
    }),
  );
  const [ready, setReady] = useState(false);

  // Mount: initialize map, enumerate cells, add source + line layer.
  useEffect(() => {
    if (!containerRef.current) return;
    if (!TOKEN) {
      console.error("REMOTION_MAPBOX_TOKEN not set in remotion/.env");
      continueRender(initHandle);
      return;
    }

    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      // Same warm-day style imports the murmur app uses by default (see mapStyles.ts)
      style: standardDayMinimal(),
      bounds: BBOX,
      fitBoundsOptions: { padding: 30 },
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      bearing: 0,
      pitch: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    let setupOnce = false;
    const onIdle = () => {
      if (setupOnce) return;
      setupOnce = true;
      map.resize();

      const bounds = map.getBounds();
      if (!bounds) {
        continueRender(initHandle);
        return;
      }
      console.log(
        `[RichmondMap] bounds: W=${bounds.getWest().toFixed(4)} E=${bounds.getEast().toFixed(4)} S=${bounds.getSouth().toFixed(4)} N=${bounds.getNorth().toFixed(4)}`,
      );
      const polygon: [number, number][] = [
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getSouth(), bounds.getEast()],
        [bounds.getNorth(), bounds.getEast()],
        [bounds.getNorth(), bounds.getWest()],
        [bounds.getSouth(), bounds.getWest()],
      ];
      const cellIds = polygonToCells(polygon, RESOLUTION);
      console.log(`[RichmondMap] polygonToCells returned ${cellIds.length} cells at r${RESOLUTION}`);

      // Determine the H3 cell at the canvas center — origin of the spiral
      const cw = containerRef.current!.clientWidth;
      const ch = containerRef.current!.clientHeight;
      const centerLngLat = map.unproject([cw / 2, ch / 2]);
      const centerCell = latLngToCell(centerLngLat.lat, centerLngLat.lng, RESOLUTION);

      // Compute ring (H3 grid distance from center) and pixel angle for each cell.
      // h3-js v4 throws if cells are beyond the internal max grid distance (~32-ish at r9),
      // so for cells that throw we synthesize ring from pixel distance instead.
      type CellMeta = { id: string; ring: number; angle: number };
      let throws = 0;
      const meta: CellMeta[] = cellIds.map((id) => {
        const [lat, lng] = cellToLatLng(id);
        const p = map.project([lng, lat]);
        const angle = Math.atan2(p.y - ch / 2, p.x - cw / 2);
        let ring: number;
        try {
          ring = gridDistance(centerCell, id);
          if (ring < 0) throw new Error("negative");
        } catch {
          throws++;
          // Approximate ring from pixel distance — H3 r9 cells are ~213m apart in projected
          // pixels at zoom ~13 (~75 px), so this gives a coarse ring estimate that keeps
          // distant cells in roughly the right radial bucket.
          const pxDist = Math.hypot(p.x - cw / 2, p.y - ch / 2);
          const pxPerRing = 75; // tunable; produces sane bucket sizes
          ring = Math.round(pxDist / pxPerRing);
        }
        return { id, ring, angle };
      });
      if (throws > 0) console.log(`[RichmondMap] gridDistance fallback used for ${throws}/${cellIds.length} cells`);

      // Spiral order: by ring, then by angle. Direction alternates each ring,
      // and each ring is offset slightly so the path forms a continuous spiral.
      const angleSortKey = (angle: number, ring: number): number => {
        let a = angle - ring * RING_ANGLE_OFFSET;
        while (a > Math.PI) a -= 2 * Math.PI;
        while (a < -Math.PI) a += 2 * Math.PI;
        return ring % 2 === 0 ? a : -a;
      };
      meta.sort((a, b) => {
        if (a.ring !== b.ring) return a.ring - b.ring;
        return angleSortKey(a.angle, a.ring) - angleSortKey(b.angle, b.ring);
      });

      // Compute per-ring duration so each ring is its own little animation.
      const ringCounts = new Map<number, number>();
      meta.forEach((c) => ringCounts.set(c.ring, (ringCounts.get(c.ring) ?? 0) + 1));
      const ringIndices = Array.from(ringCounts.keys()).sort((a, b) => a - b);
      const rawDurations = ringIndices.map((r) => rawRingWeight(r, ringCounts.get(r)!));
      const totalRaw = rawDurations.reduce((a, b) => a + b, 0);
      const totalBudget = REVEAL_END - FADE_IN_END;
      const scale = totalBudget / totalRaw;

      const ringStart = new Map<number, number>();
      const ringDuration = new Map<number, number>();
      let cum = 0;
      ringIndices.forEach((r, i) => {
        ringStart.set(r, FADE_IN_END + cum * scale);
        ringDuration.set(r, rawDurations[i] * scale);
        cum += rawDurations[i];
      });

      // Assign appearAt frame per cell: spread linearly within each ring's duration
      const ringIndexCounter = new Map<number, number>();
      const cellRecords: CellRecord[] = [];
      const features = meta.map(({ id, ring, angle: _angle }, idx) => {
        const indexInRing = ringIndexCounter.get(ring) ?? 0;
        ringIndexCounter.set(ring, indexInRing + 1);
        const cellsInRing = ringCounts.get(ring)!;
        const appearAt =
          ringStart.get(ring)! + (indexInRing / cellsInRing) * ringDuration.get(ring)!;

        // Shrink the boundary toward the cell's centroid so adjacent hexes don't touch —
        // the map shows through the gap, giving the grid feel without a stroke.
        const [cLat, cLng] = cellToLatLng(id);
        const boundary = cellToBoundary(id, true); // GeoJSON [lng, lat]
        const inset = boundary.map(
          ([lng, lat]) =>
            [cLng + (lng - cLng) * HEX_INSET, cLat + (lat - cLat) * HEX_INSET] as [number, number],
        );
        const closedRing = [...inset, inset[0]];

        // Cache projected pixel centroid for per-frame flock sampling.
        const projected = map.project([cLng, cLat]);
        cellRecords.push({ fid: idx, px: projected.x, py: projected.y, appearAt });

        return {
          type: "Feature" as const,
          id: idx, // numeric id required for setFeatureState
          properties: { id, appearAt, ring },
          geometry: { type: "Polygon" as const, coordinates: [closedRing] },
        };
      });
      cellsRef.current = cellRecords;
      canvasSizeRef.current = { w: cw, h: ch };

      console.log(
        `[RichmondMap] r${RESOLUTION}: ${features.length} cells across ${ringIndices.length} rings; spiral spans frames ${FADE_IN_END}-${REVEAL_END}`,
      );

      map.addSource(HEX_SRC, {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      // Rust fill (mid-range population color from murmur's choropleth) at light opacity.
      // No stroke — the inset on each polygon creates the visual gap between cells.
      // Color and opacity are modulated per cell via feature-state once the spiral
      // reveal completes — see the per-frame undulation effect below.
      map.addLayer({
        id: HEX_FILL_LAYER,
        type: "fill",
        source: HEX_SRC,
        paint: {
          // Interpolate from a duskier rust at `warmth`=0 toward a vivid crimson at `warmth`=1.
          // Wider color spread = stronger pattern read on the choropleth.
          "fill-color": [
            "interpolate",
            ["linear"],
            ["coalesce", ["feature-state", "warmth"], 0],
            0,
            "#A8421A",
            1,
            "#F02A1A",
          ],
          // Base 0.32 opacity, scaled by `amp` (defaults to 1, ranges ~0.15–2.0 once undulating).
          "fill-opacity": [
            "*",
            0.32,
            ["coalesce", ["feature-state", "amp"], 1],
          ],
          "fill-antialias": true,
        },
        filter: ["<=", ["get", "appearAt"], -1],
      });

      setReady(true);
      continueRender(initHandle);
    };
    map.on("idle", onIdle);

    return () => {
      map.off("idle", onIdle);
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Per-frame: advance the reveal by updating the layer filter, push per-cell
  // undulation state once cells are visible, then hold the render until Mapbox
  // finishes repainting so the captured frame is consistent.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map || !map.getLayer(HEX_FILL_LAYER)) return;

    const h = delayRender(`Mapbox repaint frame ${frame}`, {
      timeoutInMilliseconds: 8000,
    });
    const filter = ["<=", ["get", "appearAt"], frame] as mapboxgl.FilterSpecification;
    map.setFilter(HEX_FILL_LAYER, filter);

    // Undulation: per visible cell, sample the 5 flock attractors and update
    // feature-state so the paint expressions can render the pulsing pattern.
    // Ramps in over (REVEAL_END → UNDULATE_RAMP_END) so the transition from
    // flat rust to undulating color is smooth, not a snap.
    const cells = cellsRef.current;
    const { w: cw, h: ch } = canvasSizeRef.current;
    if (cells.length > 0 && cw > 0 && ch > 0 && frame >= UNDULATE_START) {
      // 2.5x faster motion than the canvas LogoIntro variant — at 30fps with /12,
      // a full Lissajous lap from the slowest flock takes ~6s instead of ~15s.
      const t = (frame - UNDULATE_START) / 12;
      const ramp = Math.min(
        1,
        Math.max(0, (frame - UNDULATE_START) / (UNDULATE_RAMP_END - UNDULATE_START)),
      );
      const flocks: [number, number][] = [];
      for (let i = 0; i < FLOCK_COUNT; i++) flocks.push(flockCenter(i, t, cw, ch));

      for (const cell of cells) {
        if (cell.appearAt > frame) continue;
        let acc = 0;
        let warmAcc = 0;
        for (let i = 0; i < FLOCK_COUNT; i++) {
          const dx = cell.px - flocks[i][0];
          const dy = cell.py - flocks[i][1];
          const d2 = dx * dx + dy * dy;
          const inf = Math.exp(-d2 / (2 * FLOCK_RADIUS_PX * FLOCK_RADIUS_PX));
          acc += inf;
          if (i === 4) warmAcc += inf; // red flock — drives warmth shift
        }
        const v = Math.min(acc, 1);
        // amp: dips to ~0.15 in cold zones, peaks ~2.0 in hot zones (≈13× dynamic range)
        const amp = 1 + (v * 1.7 - 0.85) * ramp;
        const warmth = acc > 0.001 ? Math.min(1, (warmAcc / acc) * ramp) : 0;
        map.setFeatureState(
          { source: HEX_SRC, id: cell.fid },
          { amp, warmth },
        );
      }
    }

    map.once("idle", () => continueRender(h));
  }, [frame, ready]);

  const baseOpacity = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.linen }}>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          width,
          height,
          opacity: baseOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
