"use client";

import { motion, useReducedMotion } from "framer-motion";

import { INSTANT, SPRING } from "../../lib/motion";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { MONO, MUTED } from "../../lib/classes";

import type { Locale } from "locales/types";

interface SyringeGaugeProps {
  /** Units to draw. May exceed `capacity` — the bar saturates, the pin keeps telling the truth. */
  units: number;
  capacity: number;
  unitsLabel: string;
  locale: Locale;
  over: boolean;
}

/** Every graduation the chosen syringe actually prints: 1 unit apart, 2 above the 50-unit barrel. */
function graduations(capacity: number) {
  const minorStep = capacity > 50 ? 2 : 1;
  const majorStep = capacity / 5;
  const minors: number[] = [];
  const majors: number[] = [];

  for (let unit = 0; unit <= capacity; unit += minorStep) minors.push(unit);
  for (let unit = 0; unit <= capacity; unit += majorStep) majors.push(unit);

  return { minors, majors };
}

/** Keeps the first and last graduation labels inside the barrel instead of hanging off its ends. */
function labelShift(index: number, count: number) {
  if (index === 0) return "translate-x-0";
  if (index === count - 1) return "-translate-x-full";

  return "-translate-x-1/2";
}

/** Same idea for the value pin, which can land anywhere along the barrel. */
function pinShift(percent: number) {
  if (percent > 88) return "-translate-x-full";
  if (percent < 8) return "translate-x-0";

  return "-translate-x-1/2";
}

/**
 * The barrel, drawn to the scale of the syringe the user picked.
 *
 * This is the answer the page exists to give: not "0.125 mL" but "this far up the one in
 * your hand". So the graduations are generated from the selected capacity rather than
 * hard-coded, and an overflowing dose turns the whole gauge red instead of being clamped
 * quietly — the number that does not fit is exactly the one worth seeing.
 */
export function SyringeGauge({ units, capacity, unitsLabel, locale, over }: SyringeGaugeProps) {
  const reduced = useReducedMotion();
  const { minors, majors } = graduations(capacity);
  const percent = Math.min(100, Math.max(0, (units / capacity) * 100));
  const transition = reduced ? INSTANT : SPRING;

  return (
    <div className="relative pb-6">
      <div className="relative h-12 overflow-hidden rounded-md border border-slate-400 bg-base-100 dark:border-slate-600">
        <motion.div
          animate={{ width: `${percent}%` }}
          className={`absolute inset-y-0 left-0 border-r-[3px] bg-gradient-to-r ${
            over
              ? "border-danger from-[rgba(239,68,68,0.2)] to-[rgba(239,68,68,0.45)]"
              : "border-primary from-[rgba(79,142,247,0.25)] to-[rgba(35,139,230,0.55)]"
          }`}
          initial={false}
          transition={transition}
        />

        {minors.map((unit) => (
          <span className="absolute bottom-0 h-2 w-px bg-slate-400" key={`minor-${unit}`} style={{ left: `${(unit / capacity) * 100}%` }} />
        ))}

        {majors.map((unit, index) => (
          <span key={`major-${unit}`}>
            <span className="absolute bottom-0 h-4 w-px bg-slate-600 dark:bg-slate-300" style={{ left: `${(unit / capacity) * 100}%` }} />
            <span
              className={`absolute top-1 text-[10px] ${MONO} ${MUTED} ${labelShift(index, majors.length)}`}
              style={{ left: `${(unit / capacity) * 100}%` }}
            >
              {formatLocaleNumber(unit, 0, locale)}
            </span>
          </span>
        ))}
      </div>

      <motion.span animate={{ left: `${percent}%` }} className="absolute bottom-0 block" initial={false} transition={transition}>
        <span
          className={`block whitespace-nowrap rounded-full px-2 py-[3px] text-[11px] font-bold text-white ${
            over ? "bg-danger" : "bg-primary"
          } ${pinShift(percent)}`}
        >
          {formatLocaleNumber(units, 2, locale)} {unitsLabel}
        </span>
      </motion.span>
    </div>
  );
}
