import { useRef, useEffect } from "react";

const NODE_LABELS = [
  "Inquiry & Order Management",
  "Procurement",
  "Goods Receipt & Inward",
  "Quality Control — Incoming Inspection",
  "Stock Management",
  "Production Planning & Orders",
  "Weaving",
  "Knitting",
  "Dyeing",
  "Printing",
  "Tufting",
  "Embroidery",
  "Finishing",
  "Cutting",
  "Sewing / Stitching",
  "Quilting",
  "Quality Control — Final Inspection",
  "Packaging",
  "Dispatch & Logistics",
];

interface Vec3 { x: number; y: number; z: number }

// Icosahedron vertices
function icosahedronVerts(r: number): Vec3[] {
  const t = (1 + Math.sqrt(5)) / 2;
  const n = r / Math.sqrt(1 + t * t);
  const verts: Vec3[] = [
    {x:-n,y:t*n,z:0},{x:n,y:t*n,z:0},{x:-n,y:-t*n,z:0},{x:n,y:-t*n,z:0},
    {x:0,y:-n,z:t*n},{x:0,y:n,z:t*n},{x:0,y:-n,z:-t*n},{x:0,y:n,z:-t*n},
    {x:t*n,y:0,z:-n},{x:t*n,y:0,z:n},{x:-t*n,y:0,z:-n},{x:-t*n,y:0,z:n},
  ];
  return verts;
}

const ICO_EDGES: [number,number][] = [
  [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
  [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
  [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],
  [7,8],[7,10],[8,9],[10,11]
];

const ICO_FACES: [number,number,number][] = [
  [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
  [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
  [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
  [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
];

function octahedronVerts(r: number): Vec3[] {
  return [{x:r,y:0,z:0},{x:-r,y:0,z:0},{x:0,y:r,z:0},{x:0,y:-r,z:0},{x:0,y:0,z:r},{x:0,y:0,z:-r}];
}
const OCT_EDGES: [number,number][] = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]];

function cubeVerts(r: number): Vec3[] {
  const s = r * 0.577;
  return [{x:-s,y:-s,z:-s},{x:s,y:-s,z:-s},{x:s,y:s,z:-s},{x:-s,y:s,z:-s},{x:-s,y:-s,z:s},{x:s,y:-s,z:s},{x:s,y:s,z:s},{x:-s,y:s,z:s}];
}
const CUBE_EDGES: [number,number][] = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

function diamondVerts(r: number): Vec3[] {
  return [{x:0,y:r,z:0},{x:0,y:-r,z:0},{x:r*0.5,y:0,z:0},{x:-r*0.5,y:0,z:0},{x:0,y:0,z:r*0.5},{x:0,y:0,z:-r*0.5}];
}
const DIAMOND_EDGES: [number,number][] = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]];

function rotateVec3(v: Vec3, ax: number, ay: number, az: number): Vec3 {
  let {x,y,z} = v;
  // Rotate X
  let c = Math.cos(ax), s = Math.sin(ax);
  let y1 = y*c - z*s, z1 = y*s + z*c;
  y = y1; z = z1;
  // Rotate Y
  c = Math.cos(ay); s = Math.sin(ay);
  let x1 = x*c + z*s; z1 = -x*s + z*c;
  x = x1; z = z1;
  // Rotate Z
  c = Math.cos(az); s = Math.sin(az);
  x1 = x*c - y*s; y1 = x*s + y*c;
  return {x: x1, y: y1, z: z1};
}

function project(v: Vec3, cx: number, cy: number, fov: number): {x:number;y:number;scale:number} {
  const scale = fov / (fov + v.z);
  return { x: cx + v.x * scale, y: cy + v.y * scale, scale };
}

const BindingHeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const nodeCount = 19;
    const particleCount = isMobile ? 25 : 45;
    const connDist = isMobile ? 300 : 450;

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth * 0.9;
      h = parent.clientHeight * 0.9;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Nodes
    const pad = 25;
    const labels = NODE_LABELS.slice(0, nodeCount);
    const nodes = labels.map((label) => ({
      x: pad + Math.random() * (w - pad * 2),
      y: pad + Math.random() * (h - pad * 2),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      freqX: 0.0005 + Math.random() * 0.001,
      freqY: 0.0005 + Math.random() * 0.001,
      label,
    }));

    // Particles
    const particles = Array.from({ length: particleCount }, () => {
      const a = Math.floor(Math.random() * nodeCount);
      let b = Math.floor(Math.random() * nodeCount);
      while (b === a) b = Math.floor(Math.random() * nodeCount);
      return { from: a, to: b, t: Math.random(), speed: 0.001 + Math.random() * 0.002 };
    });

    // Polyhedron shapes
    const polyRadius = isMobile ? 55 : 90;
    const icoV = icosahedronVerts(polyRadius);
    const octV = octahedronVerts(polyRadius * 0.6);
    const cubeV = cubeVerts(polyRadius * 0.4);
    const diaV = diamondVerts(polyRadius * 0.22);

    const wireColors = [
      "rgba(212,170,90,", // gold
      "rgba(200,130,70,", // copper
      "rgba(230,190,110,", // amber
      "rgba(210,160,140,", // rose
    ];

    let animId: number;
    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx + Math.sin(now * n.freqX + n.phaseX) * 0.15;
        n.y += n.vy + Math.cos(now * n.freqY + n.phaseY) * 0.15;

        // Boundary bounce
        if (n.x < pad) { n.x = pad; n.vx = Math.abs(n.vx); }
        if (n.x > w - pad) { n.x = w - pad; n.vx = -Math.abs(n.vx); }
        if (n.y < pad) { n.y = pad; n.vy = Math.abs(n.vy); }
        if (n.y > h - pad) { n.y = h - pad; n.vy = -Math.abs(n.vy); }

        // Mouse repulsion
        const dmx = n.x - mx, dmy = n.y - my;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < 120 && dm > 0) {
          const force = (120 - dm) / 120 * 1.5;
          n.x += (dmx / dm) * force;
          n.y += (dmy / dm) * force;
        }
      }

      // Node-to-node repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90 && d > 0) {
            const push = (90 - d) / 90 * 0.3;
            const nx = dx / d * push, ny = dy / d * push;
            nodes[i].x += nx; nodes[i].y += ny;
            nodes[j].x -= nx; nodes[j].y -= ny;
          }
        }
      }

      // Breathing pulse
      const globalPulse = 0.7 + Math.sin(now * 0.0012) * 0.3;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connDist) {
            const localShimmer = Math.sin(now * 0.0008 + (i + j) * 0.05) * 0.15;
            const alpha = (1 - d / connDist) * 0.55 * (globalPulse + localShimmer);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(212,170,90,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      const fontSize = isMobile ? 7.5 : 8.5;
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";

      for (const n of nodes) {
        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212,170,90,0.15)";
        ctx.fill();

        // Golden dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212,170,90,0.85)";
        ctx.fill();

        // White center
        ctx.beginPath();
        ctx.arc(n.x, n.y, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fill();

        // Label
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillText(n.label, n.x, n.y - 7);
      }

      // Draw particles
      for (const p of particles) {
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.from = p.to;
          let nb = Math.floor(Math.random() * nodeCount);
          while (nb === p.from) nb = Math.floor(Math.random() * nodeCount);
          p.to = nb;
        }
        const a = nodes[p.from], b = nodes[p.to];
        if (!a || !b) continue;
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;

        // Golden glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grd.addColorStop(0, "rgba(212,170,90,0.5)");
        grd.addColorStop(1, "rgba(212,170,90,0)");
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // White core
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fill();
      }

      // ============ 3D POLYHEDRON ============
      const fov = 500;
      const shapes = [
        { verts: icoV, edges: ICO_EDGES, faces: ICO_FACES, color: wireColors[0], ax: now*0.0003, ay: now*0.0004, az: now*0.0001, lw: 1.2 },
        { verts: octV, edges: OCT_EDGES, faces: null, color: wireColors[1], ax: now*0.0005, ay: now*0.0002, az: now*0.0003, lw: 1.0 },
        { verts: cubeV, edges: CUBE_EDGES, faces: null, color: wireColors[2], ax: now*0.0002, ay: now*0.0006, az: now*0.0004, lw: 0.8 },
        { verts: diaV, edges: DIAMOND_EDGES, faces: null, color: wireColors[3], ax: now*0.0007, ay: now*0.0003, az: now*0.0005, lw: 0.7 },
      ];

      // Pulsing center glow
      const corePulse = 0.5 + Math.sin(now * 0.002) * 0.3;
      const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, polyRadius * 1.2);
      coreGrd.addColorStop(0, `rgba(212,170,90,${0.12 * corePulse})`);
      coreGrd.addColorStop(0.5, `rgba(212,170,90,${0.04 * corePulse})`);
      coreGrd.addColorStop(1, "rgba(212,170,90,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, polyRadius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = coreGrd;
      ctx.fill();

      for (const shape of shapes) {
        const projected = shape.verts.map(v => {
          const rv = rotateVec3(v, shape.ax, shape.ay, shape.az);
          return { ...project(rv, cx, cy, fov), z: rv.z };
        });

        // Draw translucent faces for icosahedron
        if (shape.faces) {
          for (const [a, b, c] of shape.faces) {
            const avgZ = (projected[a].z + projected[b].z + projected[c].z) / 3;
            const faceAlpha = 0.03 + (avgZ + polyRadius) / (polyRadius * 2) * 0.04;
            ctx.beginPath();
            ctx.moveTo(projected[a].x, projected[a].y);
            ctx.lineTo(projected[b].x, projected[b].y);
            ctx.lineTo(projected[c].x, projected[c].y);
            ctx.closePath();
            ctx.fillStyle = `${shape.color}${faceAlpha})`;
            ctx.fill();
          }
        }

        // Depth-sorted edges
        const edgesWithDepth = shape.edges.map(([a, b]) => ({
          a, b, z: (projected[a].z + projected[b].z) / 2
        }));
        edgesWithDepth.sort((a, b) => a.z - b.z);

        for (const edge of edgesWithDepth) {
          const pa = projected[edge.a], pb = projected[edge.b];
          const depthFactor = 0.4 + (edge.z + polyRadius) / (polyRadius * 2) * 0.6;

          // Glow layer
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `${shape.color}${0.25 * depthFactor})`;
          ctx.lineWidth = shape.lw * 4;
          ctx.stroke();

          // Core line
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `${shape.color}${0.85 * depthFactor})`;
          ctx.lineWidth = shape.lw;
          ctx.stroke();
        }

        // Vertex glows
        for (const p of projected) {
          const vGrd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3 * p.scale);
          vGrd.addColorStop(0, `${shape.color}0.6)`);
          vGrd.addColorStop(1, `${shape.color}0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = vGrd;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 m-auto"
      style={{ width: "90%", height: "90%" }}
    />
  );
};

export default BindingHeroCanvas;
