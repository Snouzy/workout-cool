"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SPRING } from "../../lib/motion";
import { MUTED } from "../../lib/classes";

interface SegmentedControlProps<T extends string> {
  /** Unique per instance: it namespaces the sliding thumb's shared layout animation. */
  id: string;
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  /** `sm` is the inline dose-unit toggle; `md` the calculation-direction switch. */
  size?: "sm" | "md";
  /** Splits the track into two equal columns on mobile, where the mode switch is full width. */
  block?: boolean;
}

const SIZES = {
  sm: { track: "p-0.5", button: "px-3 py-[5px] text-[11px] font-bold" },
  md: { track: "p-[3px]", button: "px-3 py-[9px] text-xs font-semibold " },
};

/**
 * The pill switch used for the calculation direction and the dose unit.
 *
 * The selected state is a white thumb that slides between the options rather than a
 * background that blinks on and off: with two options sitting side by side, the movement
 * is what says "same control, other side".
 */
export function SegmentedControl<T extends string>({ id, legend, value, options, onChange, size = "md", block }: SegmentedControlProps<T>) {
  const reduced = useReducedMotion();
  const style = SIZES[size];

  return (
    <div
      aria-label={legend}
      className={`${block ? "grid grid-cols-2 " : "inline-flex"} gap-[3px] rounded-full bg-gray-300 dark:bg-slate-800 ${style.track}`}
      role="group"
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            aria-pressed={selected}
            className={`relative rounded-full transition-colors ${style.button} ${selected ? "text-primary" : `${MUTED} hover:text-base-content`}`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {selected && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-base-100 shadow-3xl"
                layoutId={`segmented-thumb-${id}`}
                transition={reduced ? { duration: 0 } : SPRING}
              />
            )}
            <span className="relative whitespace-nowrap">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
