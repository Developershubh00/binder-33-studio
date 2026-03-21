import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const PageIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => onComplete(), 2400);
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
          {/* Center content */}
          <motion.div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{
                opacity: phase >= 0 ? 1 : 0,
                letterSpacing: phase >= 1 ? "0.3em" : "0.5em",
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs uppercase text-foreground/50 tracking-[0.5em]"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.15)' }}
            >
              Binder 33 Labs
            </motion.span>

            {/* Expanding line with glow */}
            <motion.div
              className="h-px bg-foreground/30 mt-6"
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
