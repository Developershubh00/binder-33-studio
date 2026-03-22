import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import binderLogo from "@/assets/binder-logo.png";

const PageIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2800);
    const t4 = setTimeout(() => onComplete(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  const letters = "BINDER 33 LABS".split("");

  return (
    <AnimatePresence>
      {phase < 3 && (
        <>
          {/* Top half */}
          <motion.div
            className="fixed inset-0 z-[100] bg-background"
            style={{ height: "50vh", top: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Bottom half */}
          <motion.div
            className="fixed inset-0 z-[100] bg-background"
            style={{ height: "50vh", top: "50vh" }}
            exit={{ y: "100%" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Scanning line */}
          <motion.div
            className="fixed z-[102] left-0 right-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              boxShadow: '0 0 20px rgba(255,255,255,0.3)',
            }}
            initial={{ top: "0%" }}
            animate={phase >= 1 ? { top: "100%", opacity: [1, 1, 0] } : { top: "50%" }}
            transition={{
              duration: phase >= 1 ? 1.5 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* Center content */}
          <motion.div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-8"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Logo with glow ring */}
            <div className="relative">
              {/* Pulsing glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: phase >= 0 ? [0, 0.4, 0.15] : 0,
                  scale: phase >= 0 ? [0.5, 1.8, 1.5] : 0.5,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  width: '200%',
                  height: '200%',
                  top: '-50%',
                  left: '-50%',
                }}
              />
              <motion.img
                src={binderLogo}
                alt="Binder 33 Labs"
                className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10"
                initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                animate={{
                  opacity: phase >= 0 ? 1 : 0,
                  scale: phase >= 0 ? 1 : 0.5,
                  rotateY: phase >= 0 ? 0 : -90,
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4)) drop-shadow(0 0 60px rgba(255,255,255,0.15))',
                }}
              />
            </div>

            {/* Letter-by-letter wordmark */}
            <motion.div
              className="flex items-center justify-center gap-[2px] md:gap-1 overflow-visible"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-mono text-[20px] md:text-[28px] tracking-[0.2em] text-foreground/90"
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={phase >= 1 ? {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  } : {}}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.3)',
                    minWidth: letter === ' ' ? '0.5em' : undefined,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* Expanding line with glow */}
            <motion.div
              className="h-[1px] mt-1"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: phase >= 2 ? 160 : 0,
                opacity: phase >= 2 ? 1 : 0,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                boxShadow: '0 0 15px rgba(255,255,255,0.2)',
              }}
            />

            {/* Tagline */}
            <motion.p
              className="font-mono text-[11px] md:text-[13px] tracking-[0.3em] uppercase text-foreground/30"
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              We build things that work
            </motion.p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PageIntro;
