import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS, FONTS } from "../theme";

loadQuicksand("normal", { weights: ["700"] });
loadInter("normal", { weights: ["400", "500"] });
loadJetBrains("normal", { weights: ["400", "500"] });

// SVG geometry — viewBox 0 0 280 320 (matches site), scaled big for video
const TRUNK_X = 140;
const TRUNK_Y0 = 20;
const TRUNK_Y1 = 300;
const FORK_A_Y = 90;
const FORK_B_Y = 170;
const BR_A_X = 75;
const BR_B_X = 210;

const fade = (frame: number, [a, b]: [number, number]) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Path-draw helper — a stroke is "drawn" by tying dasharray to its length.
const draw = (frame: number, length: number, [start, end]: [number, number]) => {
  const t = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - t),
  };
};

export const ForkScenario: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline (frames @ 30fps) — total ~140 frames / 4.7s
  const eyebrowOp = fade(frame, [0, 10]);
  const headingOp = fade(frame, [6, 22]);
  const headingShift = interpolate(frame, [6, 22], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trunkLen = TRUNK_Y1 - TRUNK_Y0; // 280
  const trunkDraw = draw(frame, trunkLen, [12, 36]);

  // Fork dot pop (spring scale)
  const forkAScale = spring({
    frame: frame - 32,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 240 },
  });
  const forkBScale = spring({
    frame: frame - 52,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 240 },
  });

  // Branch curves
  const curveALen = 140;
  const curveBLen = 140;
  const curveADraw = draw(frame, curveALen, [36, 56]);
  const curveBDraw = draw(frame, curveBLen, [56, 76]);

  const branchATrunkLen = 280 - 180; // 100
  const branchATrunkDraw = draw(frame, branchATrunkLen, [54, 70]);
  const branchBTrunkLen = 280 - 250; // 30
  const branchBTrunkDraw = draw(frame, branchBTrunkLen, [74, 84]);

  // Commit dots — sequential pop
  const commitOpacities = [
    fade(frame, [16, 26]),
    fade(frame, [26, 36]),
    fade(frame, [70, 80]),
    fade(frame, [76, 86]),
    fade(frame, [80, 92]),
    fade(frame, [72, 82]),
    fade(frame, [80, 92]),
    fade(frame, [86, 96]),
  ];

  const labelsOp = fade(frame, [82, 100]);

  // Right-side body text (after the diagram is built)
  const bodyOp = fade(frame, [88, 108]);
  const bodyShift = interpolate(frame, [88, 108], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stroke = COLORS.sand;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.espresso,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 100px",
        gap: 80,
      }}
    >
      {/* Left — title + body */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 720 }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            color: COLORS.driftwood,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: eyebrowOp,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: COLORS.driftwood,
            }}
          />
          Collaborate
        </div>

        <h2
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 1.1,
            color: COLORS.linen,
            margin: 0,
            marginBottom: 28,
            opacity: headingOp,
            transform: `translateY(${headingShift}px)`,
          }}
        >
          Fork a scenario.
          <br />
          <span style={{ color: COLORS.sand }}>Compare futures.</span>
        </h2>

        <p
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 400,
            fontSize: 26,
            lineHeight: 1.4,
            color: "rgba(255, 228, 204, 0.75)",
            margin: 0,
            marginBottom: 18,
            maxWidth: 620,
            opacity: bodyOp,
            transform: `translateY(${bodyShift}px)`,
          }}
        >
          Every team starts from the same living baseline. Fork a scenario,
          explore it, then merge what works.
        </p>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.4,
            color: COLORS.sand,
            margin: 0,
            opacity: bodyOp,
            transform: `translateY(${bodyShift}px)`,
          }}
        >
          City planning as version control.
        </p>
      </div>

      {/* Right — branch diagram */}
      <div style={{ flex: "0 0 520px", display: "flex", justifyContent: "center" }}>
        <svg viewBox="0 0 280 320" width={520} height={600} fill="none">
          {/* Main trunk */}
          <line
            x1={TRUNK_X}
            y1={TRUNK_Y0}
            x2={TRUNK_X}
            y2={TRUNK_Y1}
            stroke={stroke}
            strokeWidth={2}
            strokeDasharray={trunkDraw.strokeDasharray}
            strokeDashoffset={trunkDraw.strokeDashoffset}
          />

          {/* Fork A circle */}
          <circle
            cx={TRUNK_X}
            cy={FORK_A_Y}
            r={5}
            fill={stroke}
            transform={`translate(${TRUNK_X}, ${FORK_A_Y}) scale(${forkAScale}) translate(${-TRUNK_X}, ${-FORK_A_Y})`}
          />

          {/* Branch A curve */}
          <path
            d={`M${TRUNK_X} ${FORK_A_Y} C${TRUNK_X} 140, ${BR_A_X} 120, ${BR_A_X} 180`}
            stroke={stroke}
            strokeWidth={2}
            fill="none"
            strokeDasharray={curveADraw.strokeDasharray}
            strokeDashoffset={curveADraw.strokeDashoffset}
          />
          {/* Branch A trunk */}
          <line
            x1={BR_A_X}
            y1={180}
            x2={BR_A_X}
            y2={280}
            stroke={stroke}
            strokeWidth={2}
            opacity={0.7}
            strokeDasharray={branchATrunkDraw.strokeDasharray}
            strokeDashoffset={branchATrunkDraw.strokeDashoffset}
          />

          {/* Fork B circle */}
          <circle
            cx={TRUNK_X}
            cy={FORK_B_Y}
            r={5}
            fill={stroke}
            transform={`translate(${TRUNK_X}, ${FORK_B_Y}) scale(${forkBScale}) translate(${-TRUNK_X}, ${-FORK_B_Y})`}
          />

          {/* Branch B curve */}
          <path
            d={`M${TRUNK_X} ${FORK_B_Y} C${TRUNK_X} 220, ${BR_B_X} 200, ${BR_B_X} 250`}
            stroke={stroke}
            strokeWidth={2}
            fill="none"
            strokeDasharray={curveBDraw.strokeDasharray}
            strokeDashoffset={curveBDraw.strokeDashoffset}
          />
          {/* Branch B trunk */}
          <line
            x1={BR_B_X}
            y1={250}
            x2={BR_B_X}
            y2={280}
            stroke={stroke}
            strokeWidth={2}
            opacity={0.7}
            strokeDasharray={branchBTrunkDraw.strokeDasharray}
            strokeDashoffset={branchBTrunkDraw.strokeDashoffset}
          />

          {/* Commit dots — appear in order */}
          <circle cx={TRUNK_X} cy={50} r={3} fill={stroke} opacity={commitOpacities[0] * 0.5} />
          <circle cx={TRUNK_X} cy={130} r={3} fill={stroke} opacity={commitOpacities[1] * 0.5} />
          <circle cx={BR_A_X} cy={230} r={3} fill={stroke} opacity={commitOpacities[5] * 0.4} />
          <circle cx={BR_A_X} cy={280} r={4} fill={stroke} opacity={commitOpacities[6] * 0.7} />
          <circle cx={BR_B_X} cy={280} r={4} fill={stroke} opacity={commitOpacities[7] * 0.7} />
          <circle cx={TRUNK_X} cy={230} r={3} fill={stroke} opacity={commitOpacities[2] * 0.5} />
          <circle cx={TRUNK_X} cy={265} r={3} fill={stroke} opacity={commitOpacities[3] * 0.5} />
          <circle cx={TRUNK_X} cy={300} r={4} fill={stroke} opacity={commitOpacities[4] * 0.9} />

          {/* Labels */}
          <text
            x={TRUNK_X}
            y={14}
            textAnchor="middle"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fill={stroke}
            fontSize={9}
            opacity={labelsOp * 0.7}
          >
            baseline
          </text>
          <text
            x={BR_A_X}
            y={296}
            textAnchor="middle"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fill={stroke}
            fontSize={9}
            opacity={labelsOp * 0.7}
          >
            scenario A
          </text>
          <text
            x={BR_B_X}
            y={296}
            textAnchor="middle"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fill={stroke}
            fontSize={9}
            opacity={labelsOp * 0.7}
          >
            scenario B
          </text>
          <text
            x={TRUNK_X}
            y={316}
            textAnchor="middle"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fill={stroke}
            fontSize={9}
            opacity={labelsOp * 0.7}
          >
            main
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
