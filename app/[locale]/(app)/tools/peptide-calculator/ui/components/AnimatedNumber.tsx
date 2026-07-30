"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { FADE, SPRING } from "../../lib/motion";

const SHIFT_PX = 6;

/**
 * Cross-fades a formatted value when it changes instead of swapping it.
 *
 * The visible copies are absolutely positioned over an invisible in-flow copy,
 * so an outgoing value never widens the line, and only the in-flow copy is
 * exposed to assistive technology (the animated copies are `aria-hidden`,
 * otherwise the surrounding `aria-live` region would announce both at once).
 *
 * The shift is deliberately tiny: mid-transition legibility beats travel.
 */
export function AnimatedNumber({ className, value }: { className?: string; value: string }) {
  const reduced = useReducedMotion();

  return (
    <span className={`relative inline-block whitespace-nowrap tabular-nums ${className ?? ""}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="invisible">
        {value}
      </span>

      <AnimatePresence initial={false}>
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          aria-hidden="true"
          className="absolute left-0 top-0"
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -SHIFT_PX }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: SHIFT_PX }}
          key={value}
          transition={reduced ? FADE : SPRING}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
