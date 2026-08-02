import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useTextScramble } from "@/hooks/useTextScramble";

const principles = [
  {
    num: "01",
    mark: (
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground/20">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "Start from the problem, not the technology",
    description:
      "We don't build solutions looking for problems. We start by operating inside the domain — running the manufacturing floor, doing the work — and build from what's missing.",
  },
  {
    num: "02",
    mark: (
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground/20">
        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="1" />
        <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    title: "Ship complete systems, not features",
    description:
      "We don't build MVPs that stay minimal forever. We build systems of record — complete enough to be relied on, robust enough to become permanent.",
  },
  {
    num: "03",
    mark: (
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground/20">
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    title: "Complexity is a moat",
    description:
      "We gravitate toward domains where the problem is genuinely hard — where physical constraints, industry fragmentation, and deep domain knowledge create natural barriers. That's where durable products live.",
  },
  {
    num: "04",
    mark: (
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground/20">
        <rect x="4" y="4" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="13" y="13" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="11" y1="7.5" x2="13" y2="16.5" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    ),
    title: "Build for the people who do the work",
    description:
      "Our users are manufacturers, machine operators, designers, and job workers — not IT departments. If the person doing the work can't use it without training, it's not done.",
  },
];

const sharp = [0.16, 1, 0.3, 1];

const Approach = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true });
  const heading = useTextScramble("How We Think", { trigger: isInView, speed: 35 });

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
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-4" ref={headingRef}>
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/35 mb-5 block">
                  // Philosophy
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-[3.8rem] font-bold tracking-tight leading-[0.95] text-foreground">
                  {heading || "How We Think"}
                </h2>

                <div className="mt-12 flex flex-col gap-2">
                  {principles.map((p, i) => (
                    <ProgressDot key={i} index={i} total={principles.length} progress={scrollYProgress} />
                  ))}
                </div>
              </div>

              <div className="col-span-8 relative">
                {principles.map((p, i) => (
                  <PrincipleCard key={i} principle={p} index={i} total={principles.length} progress={scrollYProgress} />
                ))}
              </div>
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
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/35 mb-5 block">
              // Philosophy
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">How We Think</h2>
          </motion.div>

          <div className="space-y-16 max-w-2xl">
            {principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-[10px] text-foreground/25">{p.num}</span>
                  {p.mark}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{p.title}</h3>
                <p className="text-[15px] text-muted-foreground leading-[1.8]">
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

const ProgressDot = ({
  index, total, progress,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const start = index / (total + 1);
  const peak = (index + 0.5) / (total + 1);
  const end = (index + 1.5) / (total + 1);

  const opacity = useTransform(progress, [start, peak, end], [0.1, 0.8, 0.1]);
  const width = useTransform(progress, [start, peak, end], [16, 40, 16]);

  return (
    <motion.div
      className="h-[1px] bg-foreground rounded-full origin-left"
      style={{ opacity, width, boxShadow: '0 0 4px rgba(255,255,255,0.1)' }}
    />
  );
};

const PrincipleCard = ({
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

  const opacity = useTransform(progress, [start, peak - 0.02, peak, end - 0.02, end], [0, 0.3, 1, 1, 0]);
  const y = useTransform(progress, [start, peak, end], [80, 0, -40]);
  const scale = useTransform(progress, [start, peak, end], [0.92, 1, 0.95]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex items-center"
    >
      <div className="max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[10px] text-foreground/15 tracking-[0.3em]">{principle.num}</span>
          {principle.mark}
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-5 leading-tight">
          {principle.title}
        </h3>
        <div className="w-10 h-px bg-foreground/15 mb-5" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.05)' }} />
        <p className="text-base text-muted-foreground leading-[1.8]">
          {principle.description}
        </p>
      </div>
    </motion.div>
  );
};

export default Approach;
