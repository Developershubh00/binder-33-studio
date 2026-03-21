import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import binderLogo from "@/assets/binder-logo.png";

const PageIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => onComplete(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <>
          {/* Top half */}
          <motion.div
            className="fixed inset-0 z-[100] bg-background"
            style={{ height: "50vh", top: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Bottom half */}
          <motion.div
            className="fixed inset-0 z-[100] bg-background"
            style={{ height: "50vh", top: "50vh" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Center content — logo + wordmark */}
          <motion.div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo with pulse glow like the original */}
            <motion.img
              src={binderLogo}
              alt="Binder 33 Labs"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{
                opacity: phase >= 0 ? 1 : 0,
                scale: phase >= 0 ? 1 : 0.72,
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.3)) drop-shadow(0 0 40px rgba(255,255,255,0.1))',
              }}
            />

            {/* Wordmark — BINDER */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg width="280" height="40" viewBox="0 0 360 50" className="overflow-visible">
                <text
                  x="180"
                  y="26"
                  fontFamily="'Courier New', monospace"
                  fontSize="32"
                  letterSpacing="8"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.85)"
                  style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}
                >
                  BINDER 33 LABS
                </text>
              </svg>
            </motion.div>

            {/* Expanding line with glow */}
            <motion.div
              className="h-px bg-foreground/20 mt-2"
              initial={{ width: 0 }}
              animate={{ width: phase >= 1 ? 120 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ boxShadow: '0 0 10px rgba(255,255,255,0.15)' }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PageIntro;
