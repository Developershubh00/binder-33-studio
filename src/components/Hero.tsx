import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StarGlobeCanvas from "./StarGlobeCanvas";


const sharp = [0.16, 1, 0.3, 1] as const;

// Deep-space particle field with white glow — matching logo aesthetic
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    // Particles — white/silver tones for depth
    const count = Math.min(Math.floor(w * h / 10000), 140);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      brightness: 0.3 + Math.random() * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update & draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.008;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180 * 0.4;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        const alpha = (0.15 + Math.sin(p.pulse) * 0.1) * p.brightness;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow on brighter particles
        if (p.brightness > 0.6) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Connect nearby particles with faint white lines
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < 12000) {
            const alpha = (1 - d / 12000) * 0.04;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// Headline with clip-mask reveal effect
const RevealText = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  return (
    <span className="inline-block overflow-hidden pb-[0.15em]">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
};

// Scramble text effect for the subheadline
const ScrambleReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const totalFrames = text.length * 2;

    const interval = setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / totalFrames) * text.length);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") result += " ";
        else if (i < revealed) result += text[i];
        else result += chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(result);
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span className={`transition-opacity duration-500 ${started ? "opacity-100" : "opacity-0"}`}>
      {display || text}
    </span>
  );
};

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.7], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.96]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <ParticleField />

      {/* Star globe — right side, bleeds off the edge */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[70%] lg:w-[60%] pointer-events-none hidden sm:block">
        <StarGlobeCanvas />
      </div>

      {/* Radial depth glow — center of screen */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.015) 0%, transparent 70%)'
      }} />

      <motion.div
        style={{ opacity, y, scale }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-5xl">

          <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-[-0.03em] leading-[0.9] text-foreground glow-text">
            <RevealText delay={0.6}>We Build Things</RevealText>
            <br />
            <span className="text-foreground/80">
              <RevealText delay={0.8}>That Work</RevealText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-12 text-foreground/50 max-w-2xl leading-relaxed font-mono text-sm md:text-base font-medium"
          >
            <ScrambleReveal
              text="Binder 33 Labs is a technology company that builds software products, takes on hard problems, and ships solutions. Based in India. Building for the world."
              delay={1.8}
            />
          </motion.p>

          <motion.a
            href="#products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
            className="group inline-flex items-center gap-4 mt-14 text-sm text-foreground/40 hover:text-foreground/80 transition-colors duration-500 relative"
          >
            <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-12" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.1)' }} />
            <span className="font-mono text-xs tracking-[0.2em] uppercase">See Our Work</span>
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </motion.a>
        </div>

      </motion.div>

      {/* Bottom gradient — seamless transition (same bg color) */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div className="section-divider w-full absolute bottom-16" />
      </div>
    </section>
  );
};

export default Hero;
