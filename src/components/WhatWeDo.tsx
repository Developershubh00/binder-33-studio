import { motion } from "framer-motion";

const cards = [
  {
    title: "Products",
    description:
      "We build our own software products — identifying underserved markets, deeply understanding the problem, and shipping complete systems. Our flagship product is Binder OS.",
  },
  {
    title: "Projects",
    description:
      "We selectively take on technology projects as an agency — working with companies and teams that need serious engineering and product thinking applied to hard problems.",
  },
  {
    title: "Hardware",
    tag: "Expanding Into",
    description:
      "We're extending into hardware — building physical products that complement our software capabilities. More details coming soon.",
  },
];

const WhatWeDo = () => {
  return (
    <section id="what-we-do" className="py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mb-16"
        >
          What We Do
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-8 hover:border-primary/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-medium text-foreground">{card.title}</h3>
                {card.tag && (
                  <span className="text-[10px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {card.tag}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
