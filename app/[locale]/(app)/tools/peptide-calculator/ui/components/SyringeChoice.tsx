"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { SyringeCapacity } from "../../lib/types";
import { SYRINGE_OPTIONS } from "../../lib/presets";
import { PRESS } from "../../lib/motion";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { MUTED } from "../../lib/classes";

import type { Locale } from "locales/types";

interface SyringeChoiceProps {
  legend: string;
  value: SyringeCapacity;
  onChange: (value: SyringeCapacity) => void;
  unitsLabel: string;
  locale: Locale;
}

/**
 * The three U-100 syringes, as photographs.
 *
 * A snap rail at every width — a squeezed three-column grid would shrink the photos below
 * the point where the barrel graduations are legible, and the photo is the whole reason this
 * step is not a dropdown.
 *
 * `min-w-0` is load-bearing, not tidying. A `<fieldset>` carries a UA default of
 * `min-inline-size: min-content`, so without it the element refuses to shrink below the
 * width of the three cards (472px) whatever its parent measures — `overflow-x-auto` never
 * engages, the fieldset juts out of the document, and the whole page scrolls sideways
 * instead of the rail.
 *
 * Selection reads green rather than blue: it is the one setting the user checks against a
 * physical object in their hand, so "yes, that one" deserves its own colour.
 */
export function SyringeChoice({ legend, value, onChange, unitsLabel, locale }: SyringeChoiceProps) {
  const reduced = useReducedMotion();

  return (
    <fieldset className="flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <legend className="sr-only">{legend}</legend>

      {SYRINGE_OPTIONS.map((option, index) => {
        const selected = option.capacity === value;

        return (
          <motion.button
            aria-pressed={selected}
            className={`w-[152px] flex-none snap-start rounded-xl border-2 p-2 text-center transition-colors ${
              selected
                ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-[0_10px_15px_-3px_rgba(16,185,129,0.2)] dark:from-emerald-900/30 dark:to-emerald-800/20"
                : "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:border-slate-400 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
            }`}
            key={option.capacity}
            onClick={() => onChange(option.capacity)}
            transition={PRESS}
            type="button"
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            <Image alt="" className="h-11 w-full object-contain" height={80} priority={index === 0} src={option.image} width={320} />
            <span className="mt-1 block text-[13px] font-bold text-base-content">{formatLocaleNumber(option.volumeMl, 1, locale)} mL</span>
            <span className={`block text-[11px] ${MUTED}`}>
              {option.capacity} {unitsLabel}
            </span>
          </motion.button>
        );
      })}
    </fieldset>
  );
}
