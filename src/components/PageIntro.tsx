import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import binderLogo from "@/assets/binder-logo.png";

const PageIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 0: logo fades in (immediate)
    // Phase 1: wordmark appears (after logo has been visible 1s)
    // Phase 2: hold everything visible for 0.8s then begin exit
    // Phase 3: curtains split, exit
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => onComplete(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const letters = "BINDER 33 LABS".split("");

  return (
    <AnimatePresence>
      {phase < 2 && (
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

          {/* Center content */}
          <motion.div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-8"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Logo — emerges from nothing */}
            <motion.img
              src={binderLogo}
              alt="Binder 33 Labs"
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.3)) drop-shadow(0 0 60px rgba(255,255,255,0.1))',
              }}
            />

            {/* Wordmark — plain fade in */}
            <motion.p
              className="font-mono text-[20px] md:text-[28px] tracking-[0.2em] text-foreground/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.25)' }}
            >
              BINDER 33 LABS
            </motion.p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PageIntro;
