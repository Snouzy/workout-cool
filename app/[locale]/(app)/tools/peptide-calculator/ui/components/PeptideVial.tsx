"use client";

import { motion, useReducedMotion } from "framer-motion";

import { FADE, INSTANT, MARQUEE_SECONDS, SPRING, SPRING_SLOW } from "../../lib/motion";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { VialGlassBack, VialGlassFront } from "./VialGlass";

import type { Locale } from "locales/types";

export interface VialLabels {
  cap: string;
  stopper: string;
  glass: string;
  cake: string;
}

interface PeptideVialProps {
  vialMg: number;
  waterMl: number;
  labels: VialLabels;
  locale: Locale;
}

/** Visual ceiling for the liquid level. A drawing scale, never a measurement. */
const FULL_ML = 5;
const ANATOMY: (keyof VialLabels)[] = ["cap", "stopper", "glass", "cake"];

export function PeptideVial({ vialMg, waterMl, labels, locale }: PeptideVialProps) {
  const reduced = useReducedMotion();
  const level = Math.min(Math.max(waterMl / FULL_ML, 0.06), 1);

  // Facts the user entered, plus the concentration they imply. Never a dose.
  const inscription = [
    `${formatLocaleNumber(vialMg, 2, locale)} mg`,
    `${formatLocaleNumber(waterMl, 2, locale)} mL`,
    waterMl > 0 ? `${formatLocaleNumber(vialMg / waterMl, 3, locale)} mg/mL` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const run = `${inscription} · `;

  // Callouts arrive one by one when the vial scrolls into view, never on mount.
  // `x: 0` on both sides of the reduced-motion branch: the flag resolves after
  // the first client render, and the callout must land at 0 either way.
  const calloutVariants = {
    hidden: reduced ? { opacity: 0, x: 0 } : { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: reduced ? FADE : SPRING },
  };

  return (
    <div className="flex w-full items-stretch gap-3 sm:gap-4">
      <div aria-hidden="true" className="relative aspect-[3/5] w-[124px] shrink-0 sm:w-[150px]">
        <VialGlassBack />

        <div className="absolute bottom-[2.5%] left-[15%] right-[15%] top-[43%] overflow-hidden rounded-b-lg">
          <motion.div
            animate={{ scaleY: level }}
            className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-gradient-to-b from-primary/25 via-primary/35 to-primary/50"
            initial={false}
            transition={reduced ? INSTANT : SPRING_SLOW}
          />
          <motion.div
            animate={{ opacity: Math.max(0.18, 1 - level), scaleY: Math.max(0.6, 1 - level * 0.5) }}
            className="absolute bottom-0 left-[8%] right-[8%] h-[17%] origin-bottom rounded-[45%_55%_35%_40%/65%_55%_45%_40%] bg-[#f0e7d3]"
            initial={false}
            transition={reduced ? INSTANT : SPRING_SLOW}
          />
        </div>

        {/* The label band: an opaque paper strip whose inscription scrolls. */}
        <div className="absolute left-[15%] right-[15%] top-[56%] h-[17%] overflow-hidden border-y border-base-300 bg-base-100">
          <motion.div
            animate={reduced ? undefined : { x: ["0%", "-50%"] }}
            className="flex h-full w-max items-center"
            transition={{ duration: MARQUEE_SECONDS, ease: "linear", repeat: Infinity }}
          >
            <span className="whitespace-nowrap px-1 text-[10px] font-semibold tracking-wide text-base-content">{run}</span>
            <span className="whitespace-nowrap px-1 text-[10px] font-semibold tracking-wide text-base-content">{run}</span>
          </motion.div>
        </div>

        <VialGlassFront />
      </div>

      <motion.ul
        className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1"
        initial="hidden"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        viewport={{ once: true, amount: 0.4 }}
        whileInView="visible"
      >
        {ANATOMY.map((part) => (
          <motion.li className="flex items-center gap-2" key={part} variants={calloutVariants}>
            <span aria-hidden="true" className="h-px w-4 shrink-0 bg-black/25 dark:bg-white/25 sm:w-8" />
            <span className="text-[11px] font-medium leading-snug text-base-content">{labels[part]}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
