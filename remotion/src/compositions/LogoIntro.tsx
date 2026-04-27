import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS, FONTS } from "../theme";
import { HexFlockBackground } from "../HexFlockBackground";

loadQuicksand("normal", { weights: ["700"] });
loadInter("normal", { weights: ["400"] });
loadJetBrains("normal", { weights: ["400", "500"] });

// Logo hex paths — mirror public/logo.svg, drawn outer → inner
const LOGO_HEXES = [
  {
    points: "17.82,-44.57 47.51,-6.86 29.69,37.71 -17.82,44.57 -47.51,6.86 -29.69,-37.71",
    opacity: 0.08,
    stroke: false,
  },
  {
    points: "26.71,-30.84 40.06,7.71 13.35,38.55 -26.71,30.84 -40.06,-7.71 -13.35,-38.55",
    opacity: 0.2,
    stroke: false,
  },
  {
    points: "30.03,-17.34 30.03,17.34 0.00,34.68 -30.03,17.34 -30.03,-17.34 -0.00,-34.68",
    opacity: 0.6,
    stroke: true,
  },
];

// Two-stage reveal:
//   Stage 1 (frames 5-25):  logo + "murmura labs presents" fade in together
//   Stage 2 (frames 30-55): big "murmur" + platform line + v0.1 pill fade in together
const STAGE1_START = 5;
const STAGE1_END = 25;
const STAGE2_START = 30;
const STAGE2_END = 55;

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stage1Opacity = interpolate(frame, [STAGE1_START, STAGE1_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stage2Opacity = interpolate(frame, [STAGE2_START, STAGE2_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing dot on the v0.1 pill — visible once stage 2 reveals
  const pulse = (Math.sin((frame / fps) * Math.PI * 2) + 1) / 2;
  const dotScale = 0.85 + pulse * 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.linen }}>
      {/* Animated honeycomb undulation — frame-deterministic port of HexGridBackground */}
      <HexFlockBackground preset={1} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Stage 1: logo */}
        <svg
          viewBox="-60 -60 120 120"
          width={200}
          height={200}
          style={{
            marginBottom: 32,
            opacity: stage1Opacity,
          }}
        >
          {LOGO_HEXES.map((hex, i) => (
            <polygon
              key={i}
              points={hex.points}
              fill={COLORS.espresso}
              stroke={hex.stroke ? COLORS.espresso : undefined}
              strokeWidth={hex.stroke ? 1 : undefined}
              opacity={hex.opacity}
              style={{ transformOrigin: "center center", transformBox: "fill-box" }}
            />
          ))}
        </svg>

        {/* Stage 1: "murmura labs presents" */}
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 28,
            color: COLORS.driftwood,
            textTransform: "lowercase",
            letterSpacing: "0.22em",
            opacity: stage1Opacity,
            marginBottom: 28,
          }}
        >
          murmura labs presents
        </div>

        {/* Stage 2: "murmur" wordmark */}
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 110,
            color: COLORS.espresso,
            textTransform: "lowercase",
            letterSpacing: "0.22em",
            lineHeight: 1,
            opacity: stage2Opacity,
            marginBottom: 28,
          }}
        >
          murmur
        </div>

        {/* Stage 2: platform line */}
        <div
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 400,
            fontSize: 32,
            color: COLORS.driftwood,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            opacity: stage2Opacity,
            marginBottom: 28,
          }}
        >
          urban foresight platform
        </div>

        {/* Stage 2: v0.1 pill + April 2026 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: stage2Opacity,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              fontFamily: FONTS.mono,
              fontWeight: 500,
              fontSize: 18,
              color: COLORS.emerald.text,
              backgroundColor: COLORS.emerald.bg,
              border: `1px solid ${COLORS.emerald.border}`,
              borderRadius: 999,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: COLORS.emerald.dot,
                transform: `scale(${dotScale})`,
                transformOrigin: "center center",
              }}
            />
            v0.1
          </div>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              color: COLORS.driftwood,
              opacity: 0.55,
            }}
          >
            April 2026
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
