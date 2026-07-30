"use client";

import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Readout } from "../../lib/readout";
import { FADE, SPRING } from "../../lib/motion";
import { ResultLabels } from "../../lib/labels";

const OFFSET_PX = -8;

interface ResultAlertsProps {
  readout: Readout;
  labels: ResultLabels;
}

/**
 * The overflow alert, plus the quieter checks the calculator already ran.
 *
 * Overflow is red because it makes the answer unusable as printed; everything else (a draw
 * too small to measure, an unusual water volume, a value between graduations) is amber —
 * still worth saying, never a reason to stop. Both always carry text: colour alone would
 * leave the warning invisible to anyone who cannot separate the two.
 *
 * Warnings arrive from above and leave the way they came, and nothing waits its turn: a user
 * changing chips quickly must never queue behind an outgoing warning.
 */
export function ResultAlerts({ readout, labels }: ResultAlertsProps) {
  const reduced = useReducedMotion();
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: OFFSET_PX };

  const items = [
    ...(readout.over ? [{ id: "overflow", message: labels.overflow, severe: true }] : []),
    ...readout.warnings
      .filter((warning) => warning !== "EXCEEDS_SYRINGE")
      .map((warning) => ({ id: warning, message: labels.warnings[warning], severe: false })),
  ];

  return (
    <ul className="mt-2.5 space-y-1.5 empty:mt-0">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.li
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 rounded-lg border p-2.5 text-[11px] leading-[1.5] ${
              item.severe
                ? "border-danger/50 bg-red-50/60 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                : "border-amber-400/50 bg-amber-50/60 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
            }`}
            exit={hidden}
            initial={hidden}
            key={item.id}
            role="status"
            transition={reduced ? FADE : SPRING}
          >
            <AlertTriangle aria-hidden="true" className="mt-px flex-none" size={14} />
            <span>{item.message}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
