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

// Spiral reveal arc — compressed for a fast, snappy fill.
//   frames 0-10:    map fades in
//   frames 10-50:   cells appear ring-by-ring, spiraling outward.
//                   Direction alternates per ring; per-ring duration scales
//                   so inner rings feel deliberate, outer rings flow fast.
//   frames 50-150:  hold
const FADE_IN_END = 10;
const REVEAL_END = 50;

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

export const RichmondMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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
      const features = meta.map(({ id, ring }) => {
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
        return {
          type: "Feature" as const,
          properties: { id, appearAt, ring },
          geometry: { type: "Polygon" as const, coordinates: [closedRing] },
        };
      });

      console.log(
        `[RichmondMap] r${RESOLUTION}: ${features.length} cells across ${ringIndices.length} rings; spiral spans frames ${FADE_IN_END}-${REVEAL_END}`,
      );

      map.addSource(HEX_SRC, {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      // Rust fill (mid-range population color from murmur's choropleth) at light opacity.
      // No stroke — the inset on each polygon creates the visual gap between cells.
      map.addLayer({
        id: HEX_FILL_LAYER,
        type: "fill",
        source: HEX_SRC,
        paint: {
          "fill-color": "#CB6327",
          "fill-opacity": 0.28,
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

  // Per-frame: advance the reveal by updating the layer filter, then hold the
  // render until Mapbox finishes repainting so the captured frame is consistent.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map || !map.getLayer(HEX_FILL_LAYER)) return;

    const h = delayRender(`Mapbox repaint frame ${frame}`, {
      timeoutInMilliseconds: 8000,
    });
    const filter = ["<=", ["get", "appearAt"], frame] as mapboxgl.FilterSpecification;
    map.setFilter(HEX_FILL_LAYER, filter);
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
