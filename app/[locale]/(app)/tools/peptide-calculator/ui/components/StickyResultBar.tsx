"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Readout, CalculatorMode } from "../../lib/readout";
import { FADE, SPRING } from "../../lib/motion";
import { ResultLabels } from "../../lib/labels";
import { formatDose, formatLocaleNumber } from "../../lib/formatNumber";
import { MONO } from "../../lib/classes";

import type { Locale } from "locales/types";

interface StickyResultBarProps {
  readout: Readout | null;
  mode: CalculatorMode;
  labels: ResultLabels;
  locale: Locale;
  /** True while the user is adjusting settings with the result block off screen. */
  visible: boolean;
  hint: string;
}

/**
 * The desktop reminder bar.
 *
 * Settings first, answer below is the right reading order the first time; it is the wrong one
 * on the fifth adjustment, when the result has scrolled out of view. Rather than duplicate the
 * result block or make it sticky, this shows the single line worth following — and only while
 * the real block is off screen.
 */
export function StickyResultBar({ readout, mode, labels, locale, visible, hint }: StickyResultBarProps) {
  const reduced = useReducedMotion();
  const dose = readout ? formatDose(readout.doseMcg, locale) : null;

  return (
    <AnimatePresence>
      {visible && readout !== null && dose !== null && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-hidden="true"
          className="fixed bottom-4 left-1/2 z-30 hidden max-w-[90vw] -translate-x-1/2 items-center gap-3.5 rounded-full bg-[#252F35] px-3.5 py-2.5 text-[13px] text-white shadow-xl sm:flex"
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={reduced ? FADE : SPRING}
        >
          <span>
            <b className={`text-base ${MONO}`}>
              {mode === "forward"
                ? `${formatLocaleNumber(readout.units, 2, locale)} ${labels.units}`
                : `${dose.value} ${dose.unit}`}
            </b>{" "}
            · {formatLocaleNumber(readout.volumeMl, 3, locale)} mL
          </span>
          <span className="text-xs text-white/70">{hint}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
