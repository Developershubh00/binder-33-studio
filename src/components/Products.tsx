import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useTextScramble } from "@/hooks/useTextScramble";

const sharp = [0.16, 1, 0.3, 1];

// Network visualization with white glowing nodes
const NetworkVis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = 400, h = 300;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const nodes = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * (w - 40) + 20,
      y: Math.random() * (h - 40) + 20,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1.5 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      type: i < 4 ? "hub" : "node",
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.phase += 0.008;
        if (n.x < 15 || n.x > w - 15) n.vx *= -1;
        if (n.y < 15 || n.y > h - 15) n.vy *= -1;
      });

      // Draw connections — white
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.1;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = nodes[i].type === "hub" || nodes[j].type === "hub" ? 1 : 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes — white with glow
      nodes.forEach(n => {
        const glow = 0.3 + Math.sin(n.phase) * 0.2;
        const r = n.type === "hub" ? n.r * 1.5 : n.r;

        if (n.type === "hub") {
          ctx.fillStyle = `rgba(255, 255, 255, ${glow * 0.08})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${glow + 0.2})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Data pulse
      const time = Date.now() * 0.001;
      const pulseIdx = Math.floor(time * 0.5) % nodes.length;
      const pulseNode = nodes[pulseIdx];
      const t = (time * 0.5) % 1;
      nodes.forEach(n => {
        if (n === pulseNode) return;
        const d = Math.hypot(n.x - pulseNode.x, n.y - pulseNode.y);
        if (d < 120) {
          const px = pulseNode.x + (n.x - pulseNode.x) * t;
          const py = pulseNode.y + (n.y - pulseNode.y) * t;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * (1 - t)})`;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-[400px] h-[300px] opacity-70" />;
};

const Products = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const heading = useTextScramble("Our Products", { trigger: isInView, speed: 35 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 150, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="products" className="py-36 md:py-48" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: sharp }}
          className="mb-24"
        >
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/20 mb-5 block">
            // Flagship
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-foreground">
            {heading || "Our Products"}
          </h2>
        </motion.div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative border border-foreground/8 rounded-sm p-8 md:p-16 overflow-hidden max-w-5xl mx-auto"
          id="product-card"
        >
          {/* Depth glow background */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(255,255,255,0.02) 0%, transparent 60%)'
          }} />

          {/* Top and bottom glow lines */}
          <div className="absolute top-0 left-0 w-full h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            boxShadow: '0 0 10px rgba(255,255,255,0.03)',
          }} />
          <div className="absolute bottom-0 left-0 w-full h-px" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          }} />

          {/* Corner marks */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-foreground/10" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-foreground/10" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-foreground/10" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-foreground/10" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 relative z-10">
            <div className="flex-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/30">
                Flagship Product
              </span>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-4 text-foreground"
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.1)' }}
              >
                Binder OS
              </h3>
              <p className="text-foreground/50 text-sm mb-8 font-medium tracking-wide">
                A factory's nervous system — the Textile Manufacturing Operating System.
              </p>
              <p className="text-foreground/35 text-[15px] leading-[1.8] max-w-xl mb-5">
                Binder OS is a complete operating system for India's textile SMEs,
                exporters, and job workers. It replaces fragmented spreadsheets and
                WhatsApp coordination with a single system of record — covering
                inventory, job orders, traceability, documentation, and an AI-powered
                COO Agent that monitors operations through Telegram.
              </p>
              <p className="text-foreground/20 text-sm italic mb-10 font-mono text-xs">
                Built from first-hand experience running a textile factory in Panipat —
                India's home textile capital.
              </p>
              <a
                href="https://binderos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm font-medium text-background bg-foreground/90 px-8 py-3.5 rounded-sm hover:bg-foreground transition-all duration-300"
                style={{ boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
              >
                <span>Explore Binder OS</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </a>
            </div>

            <div className="hidden md:flex items-center justify-center shrink-0">
              <NetworkVis />
            </div>
          </div>

          <p className="mt-16 font-mono text-[10px] text-foreground/15 tracking-[0.2em] uppercase">
            More products in development.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
