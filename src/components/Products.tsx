import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const sharp = [0.16, 1, 0.3, 1];

// Mini node network visualization
const NodeNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 200;

    const nodes = Array.from({ length: 12 }, () => ({
      x: Math.random() * 280 + 10,
      y: Math.random() * 180 + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 2 + Math.random() * 2,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, 300, 200);

      // Update positions
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 10 || n.x > 290) n.vx *= -1;
        if (n.y < 10 || n.y > 190) n.vy *= -1;
      });

      // Draw connections
      ctx.strokeStyle = "rgba(184, 115, 51, 0.12)";
      ctx.lineWidth = 0.5;
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 100) {
            ctx.globalAlpha = 1 - d / 100;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      ctx.globalAlpha = 1;
      nodes.forEach(n => {
        ctx.fillStyle = "rgba(184, 115, 51, 0.3)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-[300px] h-[200px] opacity-60" />;
};

const Products = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 30 });

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
    <section id="products" className="py-36 md:py-44">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: sharp }}
          className="mb-20"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4 block">
            Flagship
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Our Products
          </h2>
        </motion.div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: sharp }}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative bg-card border border-border rounded-lg p-8 md:p-14 overflow-hidden max-w-5xl mx-auto"
        >
          {/* Accent top line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            <div className="flex-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                Flagship Product
              </span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-3 text-foreground">
                Binder OS
              </h3>
              <p className="text-primary text-sm mb-6 font-medium">
                A factory's nervous system — the Textile Manufacturing Operating System.
              </p>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xl mb-4">
                Binder OS is a complete operating system for India's textile SMEs,
                exporters, and job workers. It replaces fragmented spreadsheets and
                WhatsApp coordination with a single system of record — covering
                inventory, job orders, traceability, documentation, and an AI-powered
                COO Agent that monitors operations through Telegram.
              </p>
              <p className="text-muted-foreground/60 text-sm italic mb-8">
                Built from first-hand experience running a textile factory in Panipat —
                India's home textile capital.
              </p>
              <a
                href="https://binderos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors duration-300"
              >
                Explore Binder OS
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </a>
            </div>

            {/* Network visualization */}
            <div className="hidden md:flex items-center justify-center">
              <NodeNetwork />
            </div>
          </div>

          <p className="mt-14 font-mono text-xs text-muted-foreground/40 tracking-wide">
            More products in development.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
