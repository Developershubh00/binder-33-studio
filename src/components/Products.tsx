import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useTextScramble } from "@/hooks/useTextScramble";
import BindingHeroCanvas from "@/components/BindingHeroCanvas";

const sharp = [0.16, 1, 0.3, 1];


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
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/35 mb-5 block">
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
          className="relative border border-foreground/8 rounded-sm overflow-hidden max-w-5xl mx-auto"
          id="product-card"
        >
          {/* Prime Radiant as full background */}
          <div className="absolute inset-0 z-0">
            <BindingHeroCanvas />
          </div>

          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 z-[1] pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
          }} />

          {/* Corner marks */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-foreground/10 z-[2]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-foreground/10 z-[2]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-foreground/10 z-[2]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-foreground/10 z-[2]" />

          <div className="relative z-[3] text-center max-w-2xl mx-auto py-20 md:py-32 px-8 md:px-16">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/40">
                Flagship Product
              </span>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-4 text-foreground"
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.1)' }}
              >
                Binder OS
              </h3>
              <p className="text-foreground/60 text-sm mb-8 font-medium tracking-wide">
                A factory's nervous system — the Textile Manufacturing Operating System.
              </p>
              <p className="text-foreground/50 text-[15px] leading-[1.8] mx-auto mb-5">
                Binder OS is a complete operating system for India's textile SMEs,
                exporters, and job workers. It replaces fragmented spreadsheets and
                WhatsApp coordination with a single system of record — covering
                inventory, job orders, traceability, documentation, and an AI-powered
                COO Agent that monitors operations through Telegram.
              </p>
              <p className="text-foreground/35 text-sm italic mb-10 font-mono text-xs">
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
              <p className="mt-16 font-mono text-[10px] text-foreground/15 tracking-[0.2em] uppercase">
                More products in development.
              </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
