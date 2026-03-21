import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-32">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mb-12"
        >
          About Binder 33 Labs
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl space-y-6 text-sm text-muted-foreground leading-relaxed"
        >
          <p>
            Binder 33 Labs is based in India. The company was founded by a builder
            who runs both a technology studio and a textile manufacturing business
            (Creative Home Decor LLP) in Panipat, Haryana. That dual identity —
            operator and engineer — is central to how we work.
          </p>
          <p>
            Our first product, Binder OS, came directly from the frustration of
            running a factory without any real software. But Binder 33 Labs is not
            defined by one product or one industry. We are a technology company that
            builds wherever we see a hard problem worth solving.
          </p>
          <p>
            We're a small, focused team. We work with engineers, domain experts,
            and collaborators who care about building things that actually work in
            the real world.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
