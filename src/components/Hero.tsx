import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const sharp = [0.16, 1, 0.3, 1] as const;

// Mesh grid background
const MeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = 24;
      const rows = 16;
      const cellW = canvas.width / cols;
      const cellH = canvas.height / rows;

      ctx.strokeStyle = "rgba(184, 115, 51, 0.04)";
      ctx.lineWidth = 0.5;

      // Grid lines with subtle warp
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        for (let j = 0; j <= rows; j++) {
          const x = i * cellW + Math.sin(time + j * 0.3) * 8;
          const y = j * cellH;
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        for (let i = 0; i <= cols; i++) {
          const x = i * cellW;
          const y = j * cellH + Math.cos(time + i * 0.3) * 8;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Intersection nodes
      ctx.fillStyle = "rgba(184, 115, 51, 0.06)";
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * cellW + Math.sin(time + j * 0.3) * 8;
          const y = j * cellH + Math.cos(time + i * 0.3) * 8;
          const pulse = Math.sin(time * 2 + i * 0.5 + j * 0.5) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1.5 + pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Typewriter with mechanical feel
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [revealed, setRevealed] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (revealed >= text.length) return;
    const speed = 35 + Math.random() * 25;
    const timer = setTimeout(() => setRevealed(r => r + 1), speed);
    return () => clearTimeout(timer);
  }, [revealed, started, text.length]);

  return (
    <span>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-100"
          style={{
            opacity: i < revealed ? 1 : 0,
            transform: i < revealed ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      {started && revealed < text.length && (
        <span className="inline-block w-[3px] h-[0.85em] bg-primary/70 ml-0.5 align-baseline animate-pulse" />
      )}
    </span>
  );
};

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, -60]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-bg">
      <MeshBackground />

      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-4xl">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-8">
            Binder 33 Labs
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-hero-fg">
            <TypewriterText text="We Build Things" delay={400} />
            <br />
            <span className="text-primary">
              <TypewriterText text="That Work" delay={1200} />
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2, ease: sharp }}
            className="mt-10 text-lg md:text-xl text-hero-fg/60 max-w-2xl leading-relaxed"
          >
            Binder 33 Labs is a technology company that builds software products,
            takes on hard problems, and ships solutions. Based in India. Building
            for the world.
          </motion.p>
          <motion.a
            href="#products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.5, ease: sharp }}
            className="group inline-flex items-center gap-3 mt-12 text-sm text-primary border border-primary/30 px-7 py-3.5 rounded hover:bg-primary/10 transition-all duration-300"
          >
            See Our Work
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Dark to light gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
