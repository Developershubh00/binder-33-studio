import { motion } from "framer-motion";

const principles = [
  {
    title: "Start from the problem, not the technology",
    description:
      "We don't build solutions looking for problems. We start by operating inside the domain — running the factory, doing the work — and build from what's missing.",
  },
  {
    title: "Ship complete systems, not features",
    description:
      "We don't build MVPs that stay minimal forever. We build systems of record — complete enough to be relied on, robust enough to become permanent.",
  },
  {
    title: "Complexity is a moat",
    description:
      "We gravitate toward domains where the problem is genuinely hard — where physical constraints, industry fragmentation, and deep domain knowledge create natural barriers. That's where durable products live.",
  },
  {
    title: "Build for the people who do the work",
    description:
      "Our users are factory owners, machine operators, and job workers — not IT departments. If the person doing the work can't use it without training, it's not done.",
  },
];

const Approach = () => {
  return (
    <section id="approach" className="py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mb-16"
        >
          How We Think
        </motion.h2>

        <div className="grid gap-12 max-w-2xl">
          {principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="text-base font-medium text-foreground mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
