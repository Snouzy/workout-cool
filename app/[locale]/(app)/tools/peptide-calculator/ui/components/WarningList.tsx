"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { FADE, SPRING } from "../../lib/motion";

const OFFSET_PX = -8;

/**
 * Warnings arrive from above and leave the way they came — the same offset on
 * `initial` and `exit`, so a warning that appears and disappears traces one
 * path rather than two. No `mode="wait"`: a user changing chips fast must never
 * queue behind an outgoing warning.
 */
export function WarningList({ items }: { items: { id: string; message: string }[] }) {
  const reduced = useReducedMotion();
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: OFFSET_PX };

  return (
    <ul className="mt-6 space-y-2 empty:mt-0">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.li
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-warning/10 px-4 py-3 text-sm text-base-content"
            exit={hidden}
            initial={hidden}
            key={item.id}
            role="status"
            transition={reduced ? FADE : SPRING}
          >
            {item.message}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
