import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const CX = 540;
const CY = 540;
const STROKE = "#c26a38";
const BG = "#ece3d6";
const TAU = Math.PI * 2;

// pointy-top hexagon vertices
function hex(r: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (-90 + i * 60) * (Math.PI / 180);
    pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a)]);
  }
  return pts;
}

function ptsStr(p: [number, number][]) {
  return p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

// complete graph lines of a hexagon (edges + diagonals)
function completeLines(p: [number, number][]) {
  const lines: [number, number, number, number][] = [];
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++)
      lines.push([p[i][0], p[i][1], p[j][0], p[j][1]]);
  return lines;
}

function square(r: number, rot: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 4; i++) {
    const a = (rot + i * 90) * (Math.PI / 180);
    pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a)]);
  }
  return pts;
}

interface LayerCfg {
  scale: number;
  rotAmp: number; // deg
  scaleAmp: number;
  phase: number;
  dir: number;
  opacity: number;
  fill?: string;
  width: number;
}

const HEX_R = 470;

export const LogoVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // t goes 0..1 across the loop; sin(TAU*t) starts & ends at 0 => static -> motion -> static
  const t = frame / durationInFrames;
  const ease = Math.sin(TAU * t); // -1..1, 0 at start & end

  const hexLayers: LayerCfg[] = [
    { scale: 1.0, rotAmp: 10, scaleAmp: 0.03, phase: 0.0, dir: 1, opacity: 0.6, width: 1.4 },
    { scale: 0.66, rotAmp: 16, scaleAmp: 0.05, phase: 0.3, dir: -1, opacity: 0.7, width: 1.3 },
    { scale: 0.4, rotAmp: 22, scaleAmp: 0.06, phase: 0.6, dir: 1, opacity: 0.85, width: 1.2 },
  ];

  const squareLayers: LayerCfg[] = [
    { scale: 0.9, rotAmp: 14, scaleAmp: 0.04, phase: 0.15, dir: -1, opacity: 0.55, width: 1.3 },
    { scale: 0.62, rotAmp: 20, scaleAmp: 0.05, phase: 0.45, dir: 1, opacity: 0.7, width: 1.2, fill: "rgba(196,120,70,0.10)" },
    { scale: 0.34, rotAmp: 28, scaleAmp: 0.07, phase: 0.75, dir: -1, opacity: 0.9, width: 1.1, fill: "rgba(196,120,70,0.16)" },
    { scale: 0.18, rotAmp: 36, scaleAmp: 0.09, phase: 0.9, dir: 1, opacity: 1, width: 1.1, fill: "rgba(196,120,70,0.24)" },
  ];

  const renderHex = (cfg: LayerCfg, key: string) => {
    const rot = cfg.dir * cfg.rotAmp * ease + cfg.phase * 0; // base rot 0
    const sc = cfg.scale * (1 + cfg.scaleAmp * Math.sin(TAU * t + cfg.phase * TAU));
    const p = hex(HEX_R);
    const lines = completeLines(p);
    return (
      <g key={key} transform={`rotate(${rot} ${CX} ${CY}) translate(${CX} ${CY}) scale(${sc}) translate(${-CX} ${-CY})`} opacity={cfg.opacity}>
        {lines.map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={STROKE} strokeWidth={cfg.width} />
        ))}
      </g>
    );
  };

  const renderSquare = (cfg: LayerCfg, key: string, baseRot: number) => {
    const rot = baseRot + cfg.dir * cfg.rotAmp * ease;
    const sc = cfg.scale * (1 + cfg.scaleAmp * Math.sin(TAU * t + cfg.phase * TAU));
    const sq = square(HEX_R, 0);
    return (
      <g key={key} transform={`rotate(${rot} ${CX} ${CY}) translate(${CX} ${CY}) scale(${sc}) translate(${-CX} ${-CY})`} opacity={cfg.opacity}>
        <polygon points={ptsStr(sq)} fill={cfg.fill ?? "none"} stroke={STROKE} strokeWidth={cfg.width} />
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={1080} height={1080} viewBox="0 0 1080 1080">
        {hexLayers.map((c, i) => renderHex(c, `h${i}`))}
        {squareLayers.map((c, i) => renderSquare(c, `s${i}`, i % 2 === 0 ? 45 : 0))}
        {/* central diamonds */}
        {renderSquare({ scale: 0.1, rotAmp: 40, scaleAmp: 0.12, phase: 0.5, dir: -1, opacity: 1, width: 1.2, fill: "rgba(196,120,70,0.32)" }, "core", 45)}
      </svg>
    </AbsoluteFill>
  );
};