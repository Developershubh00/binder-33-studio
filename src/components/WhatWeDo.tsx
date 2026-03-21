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
      <div
        className="relative bg-card border border-border rounded-sm p-8 md:p-10 h-full transition-all duration-700"
        style={{
          boxShadow: hovered
            ? '0 0 30px rgba(255,255,255,0.03), 0 0 60px rgba(255,255,255,0.01), inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'inset 0 1px 0 rgba(255,255,255,0.02)',
          borderColor: hovered ? 'rgba(255,255,255,0.12)' : undefined,
        }}
      >
        {/* Top glow line */}
        <div
          className="absolute top-0 left-8 right-8 h-px transition-all duration-700"
          style={{
            background: hovered
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
            boxShadow: hovered ? '0 0 10px rgba(255,255,255,0.05)' : 'none',
          }}
        />

        <div className="flex items-baseline justify-between mb-6">
          <span className="font-mono text-[10px] text-foreground/25 tracking-[0.3em]">{card.num}</span>
          {card.tag && (
            <span className="shimmer-tag font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40 border border-foreground/10 px-3 py-1 rounded-full">
              {card.tag}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4 transition-all duration-500"
          style={{ textShadow: hovered ? '0 0 20px rgba(255,255,255,0.15)' : 'none' }}
        >
          {card.title}
        </h3>

        <div className="w-8 h-px bg-foreground/10 group-hover:bg-foreground/20 group-hover:w-12 transition-all duration-500 mb-5"
          style={{ boxShadow: hovered ? '0 0 6px rgba(255,255,255,0.08)' : 'none' }}
        />

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
      <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/20 mb-5 block">
        // Capabilities
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-foreground">
        {scrambled || "What We Do"}
      </h2>
    </motion.div>
  );
};

const WhatWeDo = () => {
  return (
    <section id="what-we-do" className="py-36 md:py-48 relative">
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
