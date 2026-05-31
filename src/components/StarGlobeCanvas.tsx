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
      // Large globe whose center sits near/past the right edge so only the
      // left portion is visible — matching the reference image ratio.
      radius = h * 0.92;
      cx = w * 0.98;
      cy = h * 0.52;
    };
    resize();
    window.addEventListener("resize", resize);

    const INDIA_CENTER_ROTATION = ((78 - 90) * Math.PI) / 180;
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

      // Latitude / longitude grid
      drawGrid(cosY, sinY);

      // Land dots
      for (const d of DOTS) {
        // rotate around Y
        const x = d.x * cosY + d.z * sinY;
        const z = -d.x * sinY + d.z * cosY;
        const y = d.y;

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
        let x = cl * Math.cos(lon);
        const y0 = Math.sin(lat);
        let z = cl * Math.sin(lon);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        return { x: cx + x1 * radius, y: cy - y0 * radius, z: z1 };
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