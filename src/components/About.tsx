import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTextScramble } from "@/hooks/useTextScramble";

const sharp = [0.16, 1, 0.3, 1];

const About = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true });
  const heading = useTextScramble("About Binder 33 Labs", { trigger: isInView, speed: 30 });

  return (
    <section id="about" className="py-36 md:py-48 relative overflow-hidden">
      {/* Very subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.01) 0%, transparent 70%)'
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <div ref={headingRef}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: sharp }}
            className="mb-20"
          >
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/35 mb-5 block">
              // Who We Are
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-foreground">
              {heading || "About Binder 33 Labs"}
            </h2>
          </motion.div>
        </div>

        <div className="max-w-3xl space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="border-l border-foreground/15 pl-8" style={{ boxShadow: '-1px 0 8px rgba(255,255,255,0.03)' }}>
              <p className="text-xl md:text-[1.6rem] text-foreground/70 leading-[1.7] font-medium tracking-[-0.01em]">
                Binder 33 Labs is based in India. The company was founded by a builder
                who runs both a technology studio and a textile manufacturing business
                (Creative Home Decor LLP) in Panipat, Haryana. That dual identity —
                operator and engineer — is central to how we work.
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-base md:text-[17px] text-muted-foreground leading-[1.8]"
          >
            Our first product, Binder OS, came directly from the frustration of
            running a factory without any real software. But Binder 33 Labs is not
            defined by one product or one industry. We are a technology company that
            builds wherever we see a hard problem worth solving.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-base md:text-[17px] text-muted-foreground leading-[1.8]"
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
