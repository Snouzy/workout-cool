"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { FADE, PRESS, PRESS_SCALE, SPRING } from "../../lib/motion";

const RADIO_CHIP = [
  "relative cursor-pointer select-none rounded-xl border-2 bg-base-100 px-4 py-2 text-sm font-semibold transition-colors",
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
].join(" ");

const PRESET_CHIP = [
  "relative cursor-pointer select-none rounded-full border border-base-content/15 bg-base-100 px-3 py-1.5",
  "text-sm font-medium text-base-content/80 transition-colors hover:border-primary/50 hover:text-primary",
].join(" ");

/** Springs the selected state in behind the label instead of snapping a background colour. */
function SelectionHalo({ selected }: { selected: boolean }) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      animate={reduced ? { opacity: selected ? 1 : 0 } : { opacity: selected ? 1 : 0, scale: selected ? 1 : 0.86 }}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-primary/10"
      initial={false}
      transition={reduced ? FADE : SPRING}
    />
  );
}

/** A radio-backed chip. The caller supplies its own `<input className="sr-only">` inside `children`. */
export function ChipLabel({ children, selected }: { children: ReactNode; selected: boolean }) {
  const reduced = useReducedMotion();

  return (
    <motion.label
      className={`${RADIO_CHIP} ${selected ? "border-primary text-primary" : "border-base-content/15 text-base-content/70 hover:border-primary/40"}`}
      transition={PRESS}
      whileTap={reduced ? undefined : { scale: PRESS_SCALE }}
    >
      <SelectionHalo selected={selected} />
      <span className="relative">{children}</span>
    </motion.label>
  );
}

/** A stateless action pill: press feedback only, nothing to select. */
export function ChipButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const reduced = useReducedMotion();

  return (
    <motion.button className={PRESET_CHIP} onClick={onClick} transition={PRESS} type="button" whileTap={reduced ? undefined : { scale: PRESS_SCALE }}>
      {children}
    </motion.button>
  );
}
