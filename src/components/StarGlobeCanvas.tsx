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
      // Large globe kept on the RIGHT side, bleeding off the right edge.
      // cx near the right edge keeps the visible portion out of the center.
      radius = h * 0.72;
      cx = w * 0.95;
      cy = h * 0.46;
    };
    resize();
    window.addEventListener("resize", resize);

    // Rotate so the visible left portion of the front face shows the
    // Africa / Middle-East / India landmasses (not empty Pacific ocean).
    const INDIA_CENTER_ROTATION = (-60 * Math.PI) / 180;
    // Pitch the globe forward so we look down onto the northern hemisphere.
    const TILT = (32 * Math.PI) / 180;
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    let animId: number;

    const render = (rotY: number) => {
      ctx.clearRect(0, 0, w, h);

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

      // Land dots
      for (const d of DOTS) {
        // rotate around Y
        const x = d.x * cosY + d.z * sinY;
        const zr = -d.x * sinY + d.z * cosY;
        const yr = d.y;
        // pitch around X (look from above)
        const y = yr * cosT - zr * sinT;
        const z = yr * sinT + zr * cosT;

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

    const drawGrid = (cosY: number, sinY: number) => {
      const project = (lat: number, lon: number) => {
        const cl = Math.cos(lat);
        const x0 = cl * Math.cos(lon);
        const y0 = Math.sin(lat);
        const z0 = cl * Math.sin(lon);
        const x1 = x0 * cosY + z0 * sinY;
        const z1 = -x0 * sinY + z0 * cosY;
        const y2 = y0 * cosT - z1 * sinT;
        const z2 = y0 * sinT + z1 * cosT;
        return { x: cx + x1 * radius, y: cy - y2 * radius, z: z2 };
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
      render(INDIA_CENTER_ROTATION);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    let start = performance.now();
    const loop = (now: number) => {
      const rotY = INDIA_CENTER_ROTATION + ((now - start) / 1000) * 0.18;
      render(rotY);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
};

export default StarGlobeCanvas;