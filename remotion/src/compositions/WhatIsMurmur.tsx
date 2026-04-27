import type { ReactElement } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS, FONTS } from "../theme";

loadQuicksand("normal", { weights: ["700"] });
loadInter("normal", { weights: ["400", "500", "600"] });
loadJetBrains("normal", { weights: ["400", "500"] });

// ─── Aperture-7 hex math, ported from src/HexResolutions2D.tsx ───
const SQRT7 = Math.sqrt(7);
const AP7_ROT = Math.atan2(Math.sqrt(3), 5);

const hexToRgb = (hex: string): string => {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`;
};

const r4 = (n: number) => Math.round(n * 10000) / 10000;

const hexPoints = (cx: number, cy: number, r: number, rot = 0): string => {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6 + rot;
    pts.push(`${r4(cx + r * Math.cos(a))},${r4(cy + r * Math.sin(a))}`);
  }
  return pts.join(" ");
};

const honeycomb = (
  r: number,
  rot: number,
  rings: number,
): [number, number][] => {
  if (rings === 0) return [[0, 0]];
  const dist = r * Math.sqrt(3);
  const dirs: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + rot;
    dirs.push([dist * Math.cos(a), dist * Math.sin(a)]);
  }
  const centers: [number, number][] = [[0, 0]];
  const seen = new Set<string>();
  seen.add("0,0");
  for (let ring = 1; ring <= rings; ring++) {
    let x = dirs[4][0] * ring;
    let y = dirs[4][1] * ring;
    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < ring; step++) {
        const key = `${Math.round(x * 100)},${Math.round(y * 100)}`;
        if (!seen.has(key)) {
          seen.add(key);
          centers.push([x, y]);
        }
        x += dirs[side][0];
        y += dirs[side][1];
      }
    }
  }
  return centers;
};

// Geometry presets — match site
const ROT3 = 0;
const R3 = 12;
const ROT2 = ROT3 + AP7_ROT;
const R2 = R3 * SQRT7;
const ROT1 = ROT2 + AP7_ROT;
const R1 = R2 * SQRT7;

const LAYER1 = honeycomb(R1, ROT1, 0);
const LAYER2 = honeycomb(R2, ROT2, 1);
const LAYER3 = honeycomb(R3, ROT3, 4);

// ─── Phase timeline (frames @ 30fps) ───
// Open directly on the base (parcel) layer; no intro.
// Each layer holds for ~1s longer than v1; fade-in/out windows tightened for snap.
// Phase A: Parcel scale       —   0..124
// Phase B: Block scale        — 114..238
// Phase C: Neighborhood scale — 228..end (holds; no fade-out)
const PHASES = {
  parcelIn: [0, 14],
  parcelOut: [107, 124],
  blockIn: [114, 128],
  blockOut: [221, 238],
  neighIn: [228, 242],
} as const;

const fade = (frame: number, [a, b]: readonly [number, number]) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, [a, b]: readonly [number, number]) =>
  interpolate(frame, [a, b], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ─── Hex grid as an SVG ───
type LayerVisibility = { l1: number; l2: number; l3: number };

const HexGrid: React.FC<{ vis: LayerVisibility }> = ({ vis }) => {
  const parcel = COLORS.driftwood;
  const block = COLORS.sand;
  const neigh = COLORS.linen;
  const parcelRgb = hexToRgb(parcel);
  const blockRgb = hexToRgb(block);

  return (
    <svg viewBox="-180 -180 360 360" width="100%" height="100%">
      {LAYER3.map(([cx, cy], i) => {
        const dist = Math.sqrt(cx * cx + cy * cy);
        const t = dist / (R3 * Math.sqrt(3) * 4);
        const fillAlpha = 0.3 * Math.exp(-3 * t * t);
        return (
          <polygon
            key={`l3-${i}`}
            points={hexPoints(cx, cy, R3 * 0.97, ROT3)}
            fill={`rgba(${parcelRgb}, ${fillAlpha})`}
            stroke={parcel}
            strokeWidth={0.3}
            opacity={vis.l3 * 0.5}
          />
        );
      })}
      {LAYER2.map(([cx, cy], i) => {
        const dist = Math.sqrt(cx * cx + cy * cy);
        const t = dist / (R2 * Math.sqrt(3));
        const fillAlpha = 0.05 + 0.15 * Math.exp(-3 * t * t);
        return (
          <polygon
            key={`l2-${i}`}
            points={hexPoints(cx, cy, R2 * 0.98, ROT2)}
            fill={`rgba(${blockRgb}, ${fillAlpha})`}
            stroke={block}
            strokeWidth={1}
            opacity={vis.l2 * 0.7}
          />
        );
      })}
      {LAYER1.map(([cx, cy], i) => (
        <polygon
          key={`l1-${i}`}
          points={hexPoints(cx, cy, R1 * 0.99, ROT1)}
          fill="none"
          stroke={neigh}
          strokeWidth={2}
          opacity={vis.l1 * 0.9}
        />
      ))}
    </svg>
  );
};

// ─── Faint hex pattern background, mirroring pitch deck dark slides ───
const BgHexPattern: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const cellW = 110;
  const cellH = 95;
  const cols = Math.ceil(width / cellW) + 2;
  const rows = Math.ceil(height / cellH) + 2;
  const hexes: ReactElement[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * cellW + (row % 2 === 0 ? 0 : cellW / 2) - cellW;
      const cy = row * cellH - cellH;
      hexes.push(
        <polygon
          key={`bg-${row}-${col}`}
          points={hexPoints(cx, cy, 38, 0)}
          fill="none"
          stroke={COLORS.sand}
          strokeWidth={0.6}
          opacity={0.08}
        />,
      );
    }
  }
  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    >
      {hexes}
    </svg>
  );
};

// ─── Text panels for each phase ───
const PhaseHeader: React.FC<{
  dotColor: string;
  textColor: string;
  label: string;
  scale?: string;
  opacity: number;
  shift: number;
}> = ({ dotColor, textColor, label, scale, opacity, shift }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 24,
      opacity,
      transform: `translateY(${shift}px)`,
    }}
  >
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: dotColor,
      }}
    />
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: 18,
        color: textColor,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
    {scale && (
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 15,
          color: COLORS.driftwood,
          letterSpacing: "0.18em",
          opacity: 0.6,
        }}
      >
        {scale}
      </span>
    )}
  </div>
);

const Heading: React.FC<{
  children: React.ReactNode;
  opacity: number;
  shift: number;
  fontSize?: number;
}> = ({ children, opacity, shift, fontSize = 64 }) => (
  <h2
    style={{
      fontFamily: FONTS.display,
      fontWeight: 700,
      fontSize,
      lineHeight: 1.1,
      color: COLORS.linen,
      margin: 0,
      marginBottom: 28,
      opacity,
      transform: `translateY(${shift}px)`,
    }}
  >
    {children}
  </h2>
);

const Body: React.FC<{
  children: React.ReactNode;
  opacity: number;
  shift: number;
}> = ({ children, opacity, shift }) => (
  <p
    style={{
      fontFamily: FONTS.sans,
      fontWeight: 400,
      fontSize: 26,
      lineHeight: 1.4,
      color: "rgba(255, 228, 204, 0.75)",
      maxWidth: 620,
      margin: 0,
      opacity,
      transform: `translateY(${shift}px)`,
    }}
  >
    {children}
  </p>
);

const Tag: React.FC<{
  label: string;
  color: string;
  bg: string;
  delay: number;
  frame: number;
}> = ({ label, color, bg, delay, frame }) => {
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shift = interpolate(frame, [delay, delay + 8], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: 18,
        color,
        backgroundColor: bg,
        padding: "8px 16px",
        borderRadius: 999,
        opacity,
        transform: `translateY(${shift}px)`,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
};

// ─── Main composition ───
export const WhatIsMurmur: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Per-phase fade-in opacity (rises 0→1, then holds 1 forever — used for slide-in and hex layers)
  const parcelInFade = fade(frame, PHASES.parcelIn);
  const blockInFade = fade(frame, PHASES.blockIn);
  const neighInFade = fade(frame, PHASES.neighIn);

  // Text envelope (fade in then fade out for parcel/block; neighborhood holds)
  const parcelVis = Math.min(parcelInFade, fadeOut(frame, PHASES.parcelOut));
  const blockVis = Math.min(blockInFade, fadeOut(frame, PHASES.blockOut));
  const neighVis = neighInFade;

  // Hex grid layers strictly accumulate — once visible, never fade
  const hexL3 = parcelInFade;
  const hexL2 = blockInFade;
  const hexL1 = neighInFade;

  // Slow rotation of the hex grid for life
  const rotation = interpolate(frame, [0, 390], [0, 4]);

  // Bottom murmur logo bar — fade in immediately
  const logoOpacity = fade(frame, [0, 30]);

  // Text shift helper — small upward translation as text fades in
  const textShift = (vis: number) => (1 - vis) * 14;

  // Header pulse on top — appears immediately
  const headerPulse =
    (Math.sin((frame / fps) * Math.PI * 2 * 0.4) + 1) / 2;
  const headerDot = 0.85 + headerPulse * 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.espresso }}>
      <BgHexPattern width={width} height={height} />

      {/* Top header — "What is murmur?" persistent eyebrow */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: FONTS.mono,
          fontSize: 16,
          color: COLORS.sand,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: logoOpacity,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: COLORS.sand,
            transform: `scale(${headerDot})`,
          }}
        />
        What is murmur?
      </div>

      {/* Main two-column layout */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 80px 120px",
          gap: 60,
        }}
      >
        {/* Left — hex grid (≈60% width) */}
        <div
          style={{
            flex: "0 0 58%",
            aspectRatio: "1 / 1",
            maxHeight: "100%",
            position: "relative",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <HexGrid vis={{ l1: hexL1, l2: hexL2, l3: hexL3 }} />
        </div>

        {/* Right — phase content (flush top so eyebrows stay in a fixed position across phases) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingTop: 60,
            position: "relative",
            minHeight: 600,
          }}
        >
          {/* Phase A: Parcel */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              opacity: parcelVis,
            }}
          >
            <PhaseHeader
              dotColor={COLORS.driftwood}
              textColor={COLORS.driftwood}
              label="Parcel scale"
              scale="~25 m"
              opacity={parcelVis}
              shift={textShift(parcelInFade)}
            />
            <Heading opacity={parcelVis} shift={textShift(parcelInFade)}>
              Data layer
            </Heading>
            <Body opacity={parcelVis} shift={textShift(parcelInFade)}>
              100+ fields per cell — demographics, health, housing,
              environment, mobility, economy.
            </Body>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 32,
              }}
            >
              {[
                "demographics",
                "health",
                "housing",
                "environment",
                "mobility",
                "economy",
              ].map((label, i) => (
                <Tag
                  key={label}
                  label={label}
                  color={COLORS.driftwood}
                  bg="rgba(127, 94, 70, 0.18)"
                  delay={PHASES.parcelIn[1] + i * 3}
                  frame={frame}
                />
              ))}
            </div>
          </div>

          {/* Phase B: Block */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              opacity: blockVis,
            }}
          >
            <PhaseHeader
              dotColor={COLORS.driftwood}
              textColor={COLORS.driftwood}
              label="Block scale"
              scale="~250 m"
              opacity={blockVis}
              shift={textShift(blockInFade)}
            />
            <Heading opacity={blockVis} shift={textShift(blockInFade)}>
              Aggregate layer
            </Heading>
            <Body opacity={blockVis} shift={textShift(blockInFade)}>
              Composite indices summarize spatial, demographic, and network
              analyses across each block's parcels.
            </Body>
            <pre
              style={{
                fontFamily: FONTS.mono,
                fontSize: 22,
                lineHeight: 1.6,
                color: "rgba(198, 161, 129, 0.85)",
                backgroundColor: "rgba(255, 228, 204, 0.05)",
                borderRadius: 12,
                padding: "20px 24px",
                marginTop: 32,
                maxWidth: 520,
                opacity: blockVis,
                transform: `translateY(${textShift(blockInFade)}px)`,
              }}
            >
              <span style={{ color: "rgba(198, 161, 129, 0.4)" }}>
                {"{\n"}
              </span>
              {[
                ["displacement_risk", "0.73"],
                ["health_burden", "0.61"],
                ["transit_access", "0.41"],
                ["green_coverage", "0.33"],
              ].map(([k, v]) => (
                <span key={k}>
                  {"  "}
                  <span style={{ color: "rgba(198, 161, 129, 0.65)" }}>
                    "{k}"
                  </span>
                  : <span style={{ color: COLORS.sand }}>{v}</span>,{"\n"}
                </span>
              ))}
              <span style={{ color: "rgba(198, 161, 129, 0.4)" }}>
                {"  ...\n}"}
              </span>
            </pre>
          </div>

          {/* Phase C: Neighborhood */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              opacity: neighVis,
            }}
          >
            <PhaseHeader
              dotColor={COLORS.driftwood}
              textColor={COLORS.driftwood}
              label="Neighborhood scale"
              scale="~1 km"
              opacity={neighVis}
              shift={textShift(neighInFade)}
            />
            <Heading opacity={neighVis} shift={textShift(neighInFade)}>
              Agent layer
            </Heading>
            <Body opacity={neighVis} shift={textShift(neighInFade)}>
              Autonomous agents represent community interests within zoning,
              budget, and equity constraints.
            </Body>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginTop: 32,
                maxWidth: 620,
              }}
            >
              {[
                "Zoning constraints",
                "Budget allocation",
                "Equity-weighted priorities",
                "Cross-neighborhood spillover",
              ].map((label, i) => {
                const delay = PHASES.neighIn[1] + i * 4;
                const opacity = interpolate(
                  frame,
                  [delay, delay + 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                const shift = interpolate(
                  frame,
                  [delay, delay + 10],
                  [10, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 18px",
                      borderRadius: 10,
                      backgroundColor: "rgba(255, 228, 204, 0.06)",
                      border: "1px solid rgba(255, 228, 204, 0.12)",
                      opacity,
                      transform: `translateY(${shift}px)`,
                    }}
                  >
                    <span
                      style={{
                        color: COLORS.linen,
                        fontFamily: FONTS.mono,
                        fontSize: 18,
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 18,
                        color: "rgba(255, 228, 204, 0.85)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </AbsoluteFill>

      {/* Bottom — small murmur logo wordmark */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: logoOpacity,
        }}
      >
        <svg viewBox="-60 -60 120 120" width={36} height={36}>
          <polygon
            points="17.82,-44.57 47.51,-6.86 29.69,37.71 -17.82,44.57 -47.51,6.86 -29.69,-37.71"
            fill={COLORS.linen}
            opacity={0.18}
          />
          <polygon
            points="26.71,-30.84 40.06,7.71 13.35,38.55 -26.71,30.84 -40.06,-7.71 -13.35,-38.55"
            fill={COLORS.linen}
            opacity={0.35}
          />
          <polygon
            points="30.03,-17.34 30.03,17.34 0.00,34.68 -30.03,17.34 -30.03,-17.34 -0.00,-34.68"
            fill={COLORS.linen}
            opacity={0.85}
          />
        </svg>
        <span
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 22,
            color: COLORS.linen,
            letterSpacing: "0.22em",
            textTransform: "lowercase",
          }}
        >
          murmura labs
        </span>
      </div>
    </AbsoluteFill>
  );
};
