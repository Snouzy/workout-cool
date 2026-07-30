"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { PRESS } from "../../lib/motion";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { MUTED } from "../../lib/classes";
import { NumberField } from "./NumberField";

import type { Locale } from "locales/types";

const EPSILON = 1e-9;

interface ValueChipsProps {
  legend: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
  unit: string;
  step: number;
  otherLabel: string;
  locale: Locale;
  /** Same quantity in the other unit, shown beside the free-entry field. */
  conversion?: string;
  /** Forces the free-entry field open — the dose unit switch uses it when the value has no matching preset. */
  custom?: boolean;
  onCustomChange?: (custom: boolean) => void;
}

/**
 * A row of preset values plus an "Other…" escape hatch.
 *
 * Three columns on mobile so the touch targets stay 44px tall without a horizontal
 * scroll; a plain wrap from `sm` up, where the options sit next to their label.
 * "Other…" is dashed and quiet until it is the selected one: it is a way out, not a
 * fifth value competing with the presets.
 */
export function ValueChips({
  legend,
  options,
  value,
  onChange,
  unit,
  step,
  otherLabel,
  locale,
  conversion,
  custom,
  onCustomChange,
}: ValueChipsProps) {
  const reduced = useReducedMotion();
  const matchesPreset = options.some((option) => Math.abs(option - value) < EPSILON);
  const [ownCustom, setOwnCustom] = useState(!matchesPreset);
  const isCustom = custom ?? ownCustom;

  const setCustom = (next: boolean) => {
    setOwnCustom(next);
    onCustomChange?.(next);
  };

  return (
    <fieldset className="grid grid-cols-3 gap-1.5">
      <legend className="sr-only">{legend}</legend>

      {options.map((option) => {
        const selected = !isCustom && Math.abs(option - value) < EPSILON;

        return (
          <motion.button
            aria-pressed={selected}
            className={`min-h-11 rounded-lg px-1 py-[11px] text-center text-xs font-semibold transition-colors ${
              selected
                ? "border-2 border-primary bg-light-blue text-primary dark:bg-primary/15"
                : "border border-slate-400 bg-base-100 text-slate-700 shadow-3xl hover:border-primary/50 dark:border-slate-600 dark:text-slate-200"
            }`}
            key={option}
            onClick={() => {
              setCustom(false);
              onChange(option);
            }}
            transition={PRESS}
            type="button"
            whileTap={reduced ? undefined : { scale: 0.95 }}
          >
            {formatLocaleNumber(option, 2, locale)} {unit}
          </motion.button>
        );
      })}

      <motion.button
        aria-pressed={isCustom}
        className={`min-h-11 rounded-lg px-1 py-[11px] text-center text-xs font-semibold transition-colors ${
          isCustom
            ? "border-2 border-primary bg-light-blue text-primary dark:bg-primary/15"
            : `border border-dashed border-slate-400 font-medium hover:border-primary/50 dark:border-slate-600 ${MUTED}`
        }`}
        onClick={() => setCustom(true)}
        transition={PRESS}
        type="button"
        whileTap={reduced ? undefined : { scale: 0.95 }}
      >
        {otherLabel}
      </motion.button>

      {isCustom && (
        <NumberField autoFocus conversion={conversion} label={legend} onChange={onChange} step={step} unit={unit} value={value} />
      )}
    </fieldset>
  );
}
