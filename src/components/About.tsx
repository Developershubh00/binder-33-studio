import { motion } from "framer-motion";

const sharp = [0.16, 1, 0.3, 1];

const About = () => {
  return (
    <section id="about" className="py-36 md:py-44 relative">
      {/* Subtle warm background tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(35_15%_95%)] to-transparent opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: sharp }}
          className="mb-16"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4 block">
            Who We Are
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            About Binder 33 Labs
          </h2>
        </motion.div>

        <div className="max-w-3xl space-y-8">
          {/* Pull-quote first paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: sharp }}
            className="text-xl md:text-2xl text-foreground leading-relaxed font-medium"
          >
            Binder 33 Labs is based in India. The company was founded by a builder
            who runs both a technology studio and a textile manufacturing business
            (Creative Home Decor LLP) in Panipat, Haryana. That dual identity —
            operator and engineer — is central to how we work.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: sharp }}
            className="text-[16px] md:text-[17px] text-muted-foreground leading-relaxed"
          >
            Our first product, Binder OS, came directly from the frustration of
            running a factory without any real software. But Binder 33 Labs is not
            defined by one product or one industry. We are a technology company that
            builds wherever we see a hard problem worth solving.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, ease: sharp }}
            className="text-[16px] md:text-[17px] text-muted-foreground leading-relaxed"
          >
            We're a small, focused team. We work with engineers, domain experts,
            and collaborators who care about building things that actually work in
            the real world.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default About;
