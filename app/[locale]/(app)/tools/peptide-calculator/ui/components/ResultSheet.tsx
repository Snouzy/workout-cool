"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Readout, CalculatorMode } from "../../lib/readout";
import { FADE, SPRING } from "../../lib/motion";
import { ResultLabels } from "../../lib/labels";
import { MUTED } from "../../lib/classes";
import { SyringeGauge } from "./SyringeGauge";
import { StatTiles } from "./StatTiles";
import { ResultHeadline } from "./ResultHeadline";
import { ResultAlerts } from "./ResultAlerts";

import type { Locale } from "locales/types";

interface ResultSheetProps {
  readout: Readout | null;
  mode: CalculatorMode;
  capacity: number;
  labels: ResultLabels;
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  /** False once the calculator has scrolled away, so the article below is never covered. */
  visible: boolean;
  toggleLabel: string;
}

/**
 * The result, as a sheet pinned just above the app's bottom navigation — at every width.
 *
 * The settings and the answer never share a screen: the answer follows the reader instead.
 * Collapsed it is the one number being asked for, expanded it is the gauge and the three
 * tiles. It slides away once the calculator itself is off screen — past that point the reader
 * is in the article, and a permanent overlay there would be furniture in the way.
 *
 * Desktop deliberately gets the same surface rather than an inline panel, so there is one
 * result to design, translate and reason about. Past `sm` it stops being edge-to-edge: it
 * centres, caps its width and rounds all four corners, since it is floating rather than
 * docked to the bottom of a phone.
 */
export function ResultSheet({ readout, mode, capacity, labels, locale, open, onToggle, visible, toggleLabel }: ResultSheetProps) {
  const reduced = useReducedMotion();
  const expanded = open && readout !== null;

  return (
    <motion.div
      animate={{ y: visible ? 0 : "110%" }}
      className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-3xl rounded-t-[18px] border-t border-base-200 bg-base-100 px-3.5 pb-3.5 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.14)] dark:border-slate-700 sm:rounded-[18px] sm:border"
      initial={false}
      transition={reduced ? FADE : SPRING}
    >
      <button aria-expanded={expanded} className="w-full text-left" onClick={onToggle} type="button">
        <span aria-hidden="true" className="mx-auto mb-2 mt-0.5 block h-1 w-9 rounded-full bg-slate-300 dark:bg-slate-600" />

        <span className="flex items-start justify-between gap-3">
          {readout === null ? (
            <span className={`text-sm ${MUTED}`}>{labels.invalid}</span>
          ) : (
            <ResultHeadline labels={labels} locale={locale} mode={mode} readout={readout} size="md" />
          )}

          <span className={`flex-none ${MUTED}`}>
            <span className="sr-only">{toggleLabel}</span>
            {expanded ? <ChevronDown aria-hidden="true" size={20} /> : <ChevronUp aria-hidden="true" size={20} />}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && readout !== null && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={reduced ? FADE : SPRING}
          >
            <div className="pt-2.5">
              <SyringeGauge capacity={capacity} locale={locale} over={readout.over} units={readout.units} unitsLabel={labels.units} />
              <StatTiles labels={labels} locale={locale} readout={readout} />
              <ResultAlerts labels={labels} readout={readout} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
