"use client";

import { motion, useReducedMotion } from "framer-motion";

import { INSTANT, SPRING_SLOW } from "../../lib/motion";
import { VialGlassBack, VialGlassFront } from "./VialGlass";

interface PeptideVialProps {
  waterMl: number;
}

/** Visual ceiling for the liquid level. A drawing scale, never a measurement. */
const FULL_ML = 5;

/**
 * The vial as an illustration: the liquid rises with the water the user added. Everything
 * else holds still — the printed label and the cake at the base are fixed.
 *
 * Decorative throughout. The article's own prose names these parts for readers and for
 * search engines, so the drawing stays out of the accessibility tree entirely.
 */
export function PeptideVial({ waterMl }: PeptideVialProps) {
  const reduced = useReducedMotion();
  const level = Math.min(Math.max(waterMl / FULL_ML, 0.06), 1);

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
            transition={reduced ? INSTANT : SPRING_SLOW}
          />
          {/* The cake sits still: a faint constant base, independent of the water volume. */}
          <div className="absolute bottom-0 left-[8%] right-[8%] h-[17%] origin-bottom scale-y-[0.6] rounded-[45%_55%_35%_40%/65%_55%_45%_40%] bg-[#f0e7d3] opacity-[0.18]" />
        </div>

        {/* The printed label: an opaque paper strip wrapped across the body. */}
        <div className="absolute left-[18%] right-[18%] top-[50%] flex h-[15%] items-center justify-center overflow-hidden border-y border-base-300 bg-base-100 px-1">
          <span className="text-[8px] font-bold uppercase leading-none tracking-[0.14em] text-base-content/70">BAC WATER</span>
        </div>

        <VialGlassFront />
      </div>
    </div>
  );
}
