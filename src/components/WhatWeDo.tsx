import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTextScramble } from "@/hooks/useTextScramble";

const cards = [
  {
    num: "01",
    title: "Products",
    description:
      "We build our own software products — identifying underserved markets, deeply understanding the problem, and shipping complete systems. Our flagship product is Binder OS.",
  },
  {
    num: "02",
    title: "Projects",
    description:
      "We selectively take on technology projects as an agency — working with companies and teams that need serious engineering and product thinking applied to hard problems.",
  },
  {
    num: "03",
    title: "Hardware",
    tag: "Expanding Into",
    description:
      "We're extending into hardware — building physical products that complement our software capabilities. More details coming soon.",
  },
];

const sharp = [0.16, 1, 0.3, 1];

const Card = ({ card, i }: { card: typeof cards[0]; i: number }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
      style={{ perspective: 1000 }}
    >
      {/* Animated border trace */}
      <div className="absolute inset-0 rounded-sm overflow-hidden">
        <div
          className="absolute inset-0 rounded-sm transition-opacity duration-700"
          style={{
            opacity: hovered ? 1 : 0,
            background: `
              linear-gradient(90deg, hsl(27 52% 46% / 0.5) 0%, transparent 50%) top/100% 1px no-repeat,
              linear-gradient(90deg, transparent 50%, hsl(27 52% 46% / 0.5) 100%) bottom/100% 1px no-repeat,
              linear-gradient(180deg, hsl(27 52% 46% / 0.5) 0%, transparent 50%) left/1px 100% no-repeat,
              linear-gradient(180deg, transparent 50%, hsl(27 52% 46% / 0.5) 100%) right/1px 100% no-repeat
            `,
          }}
        />
      </div>

      <div className="relative bg-card/50 backdrop-blur-sm border border-border/60 rounded-sm p-8 md:p-10 h-full transition-all duration-500 group-hover:border-primary/20 group-hover:bg-card/80">
        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/30 to-transparent transition-all duration-700" />

        <div className="flex items-baseline justify-between mb-6">
          <span className="font-mono text-[10px] text-primary/30 tracking-[0.3em]">{card.num}</span>
          {card.tag && (
            <span className="shimmer-tag font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70 border border-primary/20 px-3 py-1 rounded-full">
              {card.tag}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4 transition-colors duration-300 group-hover:text-primary">
          {card.title}
        </h3>

        <div className="w-8 h-px bg-border group-hover:bg-primary/40 group-hover:w-12 transition-all duration-500 mb-5" />

        <p className="text-[15px] text-muted-foreground leading-relaxed">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
};

const SectionHeading = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const scrambled = useTextScramble("What We Do", { trigger: isInView, speed: 35 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: sharp }}
      className="mb-24"
    >
      <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary/40 mb-5 block">
        // Capabilities
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-[3.8rem] font-bold tracking-tight">
        {scrambled || "What We Do"}
      </h2>
    </motion.div>
  );
};

const WhatWeDo = () => {
  return (
    <section id="what-we-do" className="py-36 md:py-48 relative">
      {/* Faint grid background */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(27 52% 46%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(27 52% 46%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="container mx-auto px-6 relative">
        <SectionHeading />
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <Card key={card.title} card={card} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
