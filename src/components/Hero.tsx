import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const sharp = [0.16, 1, 0.3, 1] as const;

// Particle constellation background
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

    // Particles
    const count = Math.min(Math.floor(w * h / 8000), 180);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update & draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.01;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        const alpha = 0.2 + Math.sin(p.pulse) * 0.15;
        ctx.fillStyle = `rgba(184, 115, 51, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nearby particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < 14400) { // 120px
            const alpha = (1 - d / 14400) * 0.08;
            ctx.strokeStyle = `rgba(184, 115, 51, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Horizontal scan line
      const scanY = (Date.now() * 0.03) % h;
      const gradient = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      gradient.addColorStop(0, "rgba(184, 115, 51, 0)");
      gradient.addColorStop(0.5, "rgba(184, 115, 51, 0.03)");
      gradient.addColorStop(1, "rgba(184, 115, 51, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 30, w, 60);

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
    <span className="inline-block overflow-hidden">
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
    let rafId: number;

    const update = () => {
      frame++;
      const revealed = Math.floor((frame / totalFrames) * text.length);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") result += " ";
        else if (i < revealed) result += text[i];
        else result += chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(result);
      if (frame < totalFrames) rafId = requestAnimationFrame(update);
      else setDisplay(text);
    };

    // Use interval for consistent speed
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
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-bg">
      <ParticleField />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,115,51,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,115,51,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <motion.div
        style={{ opacity, y, scale }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-5xl">
          {/* Lab identifier */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-px bg-primary mb-10 origin-left"
          />
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: sharp }}
            className="font-mono text-[11px] tracking-[0.4em] uppercase text-primary/50 mb-10"
          >
            Binder 33 Labs
          </motion.p>

          <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-[-0.03em] leading-[0.9] text-hero-fg">
            <RevealText delay={0.6}>We Build Things</RevealText>
            <br />
            <span className="text-primary">
              <RevealText delay={0.8}>That Work</RevealText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="mt-12 text-lg md:text-xl text-hero-fg/50 max-w-2xl leading-relaxed font-mono text-sm md:text-base"
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
            className="group inline-flex items-center gap-4 mt-14 text-sm text-hero-fg/70 hover:text-primary transition-colors duration-500 relative"
          >
            <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
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

        {/* Coordinate overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 right-6 hidden lg:block"
        >
          <div className="font-mono text-[10px] text-hero-fg/15 space-y-1 text-right">
            <div>29.3919° N</div>
            <div>76.9681° E</div>
            <div className="text-primary/30">PANIPAT, IN</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gradient transition to light */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
