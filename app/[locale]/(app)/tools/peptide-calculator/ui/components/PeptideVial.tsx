"use client";

import { motion, useReducedMotion } from "framer-motion";

import { INSTANT, SPRING_SLOW } from "../../lib/motion";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { VialGlassBack, VialGlassFront } from "./VialGlass";

import type { Locale } from "locales/types";

interface PeptideVialProps {
  vialMg: number;
  waterMl: number;
  locale: Locale;
}

/** Visual ceiling for the liquid level. A drawing scale, never a measurement. */
const FULL_ML = 5;

/**
 * The vial as an illustration: the liquid rises with the water the user added. The cake at
 * the base and the label's caption both stay put — only the liquid moves. The label carries
 * the vial quantity, a fact the user entered, never a dose.
 *
 * Decorative throughout. The article's own prose names these parts for readers and for
 * search engines, so the drawing stays out of the accessibility tree entirely.
 */
export function PeptideVial({ vialMg, waterMl, locale }: PeptideVialProps) {
  const reduced = useReducedMotion();
  const level = Math.min(Math.max(waterMl / FULL_ML, 0.06), 1);
  const transition = reduced ? INSTANT : SPRING_SLOW;

  return (
    <div aria-hidden="true" className="flex w-full justify-center">
      <div className="relative aspect-[3/5] w-[132px] sm:w-[152px]">
        <VialGlassBack />

        {/* Liquid and cake, clipped to the straight run of the body (x26–94, y66–196 of the
            120×200 viewBox) so nothing spills into the shoulder or past the rounded base. */}
        <div className="absolute bottom-[2%] left-[22%] right-[22%] top-[33%] overflow-hidden rounded-b-lg">
          <motion.div
            animate={{ scaleY: level }}
            className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-gradient-to-b from-primary/25 via-primary/35 to-primary/50"
            initial={false}
            transition={transition}
          />
          {/* The cake sits still: a faint constant base, independent of the water volume.
              Only the liquid above it moves. */}
          <div
            className="absolute bottom-0 left-[8%] right-[8%] h-[17%] origin-bottom scale-y-[0.6] rounded-[45%_55%_35%_40%/65%_55%_45%_40%] bg-[#f0e7d3] opacity-[0.18]"
          />
        </div>

        {/* The printed label: an opaque paper strip wrapped across the body. */}
        <div className="absolute left-[18%] right-[18%] top-[48%] flex h-[19%] flex-col items-center justify-center gap-[1px] overflow-hidden border-y border-base-300 bg-base-100 px-1">
          <span className="text-[7px] font-bold uppercase leading-none tracking-[0.12em] text-base-content/55">BAC WATER</span>
          <motion.span
            className="text-[11px] font-bold leading-none tabular-nums text-base-content"
            key={vialMg}
            {...(reduced ? {} : { animate: { opacity: 1 }, initial: { opacity: 0.4 } })}
            transition={{ duration: 0.2 }}
          >
            {formatLocaleNumber(vialMg, 2, locale)} mg
          </motion.span>
        </div>

        <VialGlassFront />
      </div>
    </div>
  );
}
