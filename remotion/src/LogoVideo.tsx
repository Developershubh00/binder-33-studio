import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Exact reconstruction (traced from the source logo, coords in the 378x386 space).
const CX = 209.5;
const CY = 194.5;
const STROKE = "#d7894f";
const BG = "#f1ebe3";
const TAU = Math.PI * 2;

// regular pointy-top hexagon vertices (r = center-to-vertex distance)
function hex(r: number): [number, number][] {
  const v: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    v.push([CX + r * Math.cos(a), CY + r * Math.sin(a)]);
  }
  return v;
}

// complete graph K6 (6 edges + 9 diagonals = exactly the lines in the source)
function k6(v: [number, number][]) {
  const l: [number, number, number, number][] = [];
  for (let i = 0; i < 6; i++)
    for (let j = i + 1; j < 6; j++) l.push([v[i][0], v[i][1], v[j][0], v[j][1]]);
  return l;
}

const pts = (v: [number, number][]) => v.map((p) => p.join(",")).join(" ");

// The three nested hexagons (measured radii) + the central diamond.
const HEX_R = [184.5, 124.5, 75];
const DIA = 54.5; // central rotated-square half-diagonal

const SW = 0.85;

interface Motion {
  rotAmp: number; // degrees
  dir: number;
  scaleAmp: number;
  phase: number; // just shifts the peak timing; endpoints stay static
}

// Each shape gets its own rotation direction / amplitude. All motion is
// A*sin(TAU*t) so frame 0 and the last frame are the exact static original.
const HEX_MOTION: Motion[] = [
  { rotAmp: 8, dir: 1, scaleAmp: 0.02, phase: 0 },
  { rotAmp: 14, dir: -1, scaleAmp: 0.05, phase: 0 },
  { rotAmp: 22, dir: 1, scaleAmp: 0.08, phase: 0 },
];
const DIA_MOTION: Motion = { rotAmp: 38, dir: -1, scaleAmp: 0.12, phase: 0 };

function xf(m: Motion, s: number, scaleBase = 1) {
  const rot = m.dir * m.rotAmp * s;
  const sc = scaleBase * (1 + m.scaleAmp * s);
  return `rotate(${rot} ${CX} ${CY}) translate(${CX} ${CY}) scale(${sc}) translate(${-CX} ${-CY})`;
}

export const LogoVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const s = Math.sin(TAU * t); // 0 at start & end -> static -> motion -> static loop

  const hexV = HEX_R.map((r) => hex(r));
  const dia: [number, number][] = [
    [CX, CY - DIA],
    [CX + DIA, CY],
    [CX, CY + DIA],
    [CX - DIA, CY],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={1080} height={1080} viewBox="0 0 378 386">
        {/* subtle warm fills, layered toward the centre (match source) */}
        <g transform={xf(HEX_MOTION[2], s)}>
          <polygon points={pts(hexV[2])} fill="rgba(215,133,80,0.10)" stroke="none" />
        </g>
        <g transform={xf(DIA_MOTION, s)}>
          <polygon points={pts(dia)} fill="rgba(215,128,74,0.20)" stroke="none" />
        </g>

        {/* three nested K6 hexagons */}
        {hexV.map((v, i) => (
          <g key={i} transform={xf(HEX_MOTION[i], s)}>
            {k6(v).map((l, j) => (
              <line key={j} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={STROKE} strokeWidth={SW} />
            ))}
          </g>
        ))}

        {/* central diamond outline */}
        <g transform={xf(DIA_MOTION, s)}>
          <polygon points={pts(dia)} fill="none" stroke={STROKE} strokeWidth={SW} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};