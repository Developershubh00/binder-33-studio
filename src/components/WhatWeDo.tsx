import { motion } from "framer-motion";
import { useRef, useState } from "react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: i * 0.1, duration: 0.6, ease: sharp }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Border glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: hovered
            ? "linear-gradient(135deg, hsl(27 52% 46% / 0.3), transparent, hsl(27 52% 46% / 0.15))"
            : "transparent",
        }}
      />
      <div className="relative bg-card border border-border rounded-lg p-8 md:p-10 h-full transition-colors duration-300 group-hover:border-transparent">
        <span className="font-mono text-xs text-primary/40 tracking-widest">{card.num}</span>
        <div className="flex items-center gap-3 mt-4 mb-5">
          <h3 className="text-xl font-semibold text-foreground tracking-tight">{card.title}</h3>
          {card.tag && (
            <span className="shimmer-tag font-mono text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {card.tag}
            </span>
          )}
        </div>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
};

const WhatWeDo = () => {
  return (
    <section id="what-we-do" className="py-36 md:py-44">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: sharp }}
          className="mb-20"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4 block">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            What We Do
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Card key={card.title} card={card} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
