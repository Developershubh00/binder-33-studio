import { useEffect, useRef } from "react";
import { LAND_POINTS } from "./landPoints";

interface DotVec {
  x: number;
  y: number;
  z: number;
}

// Precompute unit-sphere vectors from lat/lon pairs once at module load.
const DOTS: DotVec[] = (() => {
  const out: DotVec[] = [];
  for (let i = 0; i < LAND_POINTS.length; i += 2) {
    const lat = (LAND_POINTS[i] * Math.PI) / 180;
    const lon = (LAND_POINTS[i + 1] * Math.PI) / 180;
    const cl = Math.cos(lat);
    out.push({
      x: cl * Math.cos(lon),
      y: Math.sin(lat),
      z: cl * Math.sin(lon),
    });
  }
  return out;
})();

const StarGlobeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let radius = 0;
    // Globe center is pushed toward the right edge so it bleeds off-screen.
    let cx = 0;
    let cy = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(h * 0.62, w * 0.55);
      cx = w * 0.92;
      cy = h * 0.5;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      tiltRef.current = { x: nx, y: ny };
    };
    window.addEventListener("mousemove", onMouse);

    const TILT = -0.42; // fixed axial tilt
    let animId: number;

    const render = (rotY: number) => {
      ctx.clearRect(0, 0, w, h);

      const targetTiltX = TILT + tiltRef.current.y * 0.12;
      const targetTiltZ = tiltRef.current.x * 0.08;

      const cosT = Math.cos(targetTiltX);
      const sinT = Math.sin(targetTiltX);
      const cosZ = Math.cos(targetTiltZ);
      const sinZ = Math.sin(targetTiltZ);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Faint sphere haze
      const haze = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      haze.addColorStop(0, "rgba(255,255,255,0.025)");
      haze.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = haze;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Latitude / longitude grid
      drawGrid(cosY, sinY, cosT, sinT, cosZ, sinZ);

      // Land dots
      for (const d of DOTS) {
        // rotate around Y
        let x = d.x * cosY + d.z * sinY;
        let z = -d.x * sinY + d.z * cosY;
        let y = d.y;
        // tilt around X
        let y2 = y * cosT - z * sinT;
        let z2 = y * sinT + z * cosT;
        y = y2;
        z = z2;
        // slight roll around Z
        const x3 = x * cosZ - y * sinZ;
        const y3 = x * sinZ + y * cosZ;
        x = x3;
        y = y3;

        if (z < -0.02) continue; // cull far hemisphere

        const depth = (z + 1) / 2; // 0..1
        const sx = cx + x * radius;
        const sy = cy - y * radius;
        const size = 0.5 + depth * 1.4;
        const alpha = 0.12 + depth * 0.78;

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        if (depth > 0.82) {
          ctx.beginPath();
          ctx.arc(sx, sy, size * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(depth - 0.82) * 0.25})`;
          ctx.fill();
        }
      }
    };

    const drawGrid = (
      cosY: number,
      sinY: number,
      cosT: number,
      sinT: number,
      cosZ: number,
      sinZ: number,
    ) => {
      const project = (lat: number, lon: number) => {
        const cl = Math.cos(lat);
        let x = cl * Math.cos(lon);
        const y0 = Math.sin(lat);
        let z = cl * Math.sin(lon);
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;
        let y1 = y0;
        const y2 = y1 * cosT - z1 * sinT;
        const z2 = y1 * sinT + z1 * cosT;
        y1 = y2;
        z1 = z2;
        const xr = x1 * cosZ - y1 * sinZ;
        const yr = x1 * sinZ + y1 * cosZ;
        return { x: cx + xr * radius, y: cy - yr * radius, z: z1 };
      };

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";

      // Latitude lines
      for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
        const lat = (latDeg * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        for (let lonDeg = 0; lonDeg <= 360; lonDeg += 4) {
          const p = project(lat, (lonDeg * Math.PI) / 180);
          if (p.z < -0.05) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Longitude lines
      for (let lonDeg = 0; lonDeg < 360; lonDeg += 30) {
        const lon = (lonDeg * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        for (let latDeg = -90; latDeg <= 90; latDeg += 4) {
          const p = project((latDeg * Math.PI) / 180, lon);
          if (p.z < -0.05) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }
    };

    if (reduceMotion) {
      render(0.6);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMouse);
      };
    }

    let start = performance.now();
    const loop = (now: number) => {
      const rotY = ((now - start) / 1000) * 0.18;
      render(rotY);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
};

export default StarGlobeCanvas;