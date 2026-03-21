import { useState, useEffect, useCallback, useRef } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const useTextScramble = (finalText: string, options?: { trigger?: boolean; speed?: number; delay?: number }) => {
  const { trigger = true, speed = 30, delay = 0 } = options || {};
  const [display, setDisplay] = useState("");
  const frameRef = useRef(0);

  useEffect(() => {
    if (!trigger) {
      setDisplay("");
      return;
    }

    let cancelled = false;
    const delayTimer = setTimeout(() => {
      let iteration = 0;
      const totalIterations = finalText.length * 3;

      const scramble = () => {
        if (cancelled) return;
        iteration++;

        const revealed = Math.floor((iteration / totalIterations) * finalText.length);
        let result = "";

        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === " ") {
            result += " ";
          } else if (i < revealed) {
            result += finalText[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        setDisplay(result);

        if (iteration < totalIterations) {
          frameRef.current = window.setTimeout(scramble, speed);
        } else {
          setDisplay(finalText);
        }
      };
      scramble();
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(delayTimer);
      clearTimeout(frameRef.current);
    };
  }, [trigger, finalText, speed, delay]);

  return display;
};
