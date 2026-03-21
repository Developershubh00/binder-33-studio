import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const principles = [
  {
    icon: "◉",
    title: "Start from the problem, not the technology",
    description:
      "We don't build solutions looking for problems. We start by operating inside the domain — running the factory, doing the work — and build from what's missing.",
  },
  {
    icon: "═",
    title: "Ship complete systems, not features",
    description:
      "We don't build MVPs that stay minimal forever. We build systems of record — complete enough to be relied on, robust enough to become permanent.",
  },
  {
    icon: "⬡",
    title: "Complexity is a moat",
    description:
      "We gravitate toward domains where the problem is genuinely hard — where physical constraints, industry fragmentation, and deep domain knowledge create natural barriers. That's where durable products live.",
  },
  {
    icon: "◫",
    title: "Build for the people who do the work",
    description:
      "Our users are factory owners, machine operators, and job workers — not IT departments. If the person doing the work can't use it without training, it's not done.",
  },
];

const sharp = [0.16, 1, 0.3, 1];

const Approach = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="approach" ref={sectionRef} className="relative">
      {/* Desktop: sticky scroll */}
      <div className="hidden md:block" style={{ height: `${(principles.length + 1) * 100}vh` }}>
        <div className="sticky top-0 min-h-screen flex items-center overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4 block">
                Philosophy
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                How We Think
              </h2>
            </div>

            <div className="max-w-2xl space-y-6">
              {principles.map((p, i) => (
                <StickyCard key={i} principle={p} index={i} total={principles.length} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: staggered reveal */}
      <div className="md:hidden py-36">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: sharp }}
            className="mb-16"
          >
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4 block">
              Philosophy
            </span>
            <h2 className="text-4xl font-bold tracking-tight">How We Think</h2>
          </motion.div>

          <div className="space-y-12 max-w-2xl">
            {principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: sharp }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-primary/40 text-lg">{p.icon}</span>
                  <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed pl-8">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StickyCard = ({
  principle,
  index,
  total,
  progress,
}: {
  principle: typeof principles[0];
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const start = index / (total + 1);
  const peak = (index + 0.5) / (total + 1);
  const end = (index + 1.5) / (total + 1);

  const opacity = useTransform(progress, [start, peak, end], [0.15, 1, 0.15]);
  const scale = useTransform(progress, [start, peak, end], [0.96, 1, 0.96]);
  const y = useTransform(progress, [start, peak, end], [30, 0, -10]);

  return (
    <motion.div style={{ opacity, scale, y }} className="origin-left">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-primary/40 text-lg">{principle.icon}</span>
        <h3 className="text-xl font-semibold text-foreground tracking-tight">{principle.title}</h3>
      </div>
      <p className="text-[15px] text-muted-foreground leading-relaxed pl-8">
        {principle.description}
      </p>
    </motion.div>
  );
};

export default Approach;
