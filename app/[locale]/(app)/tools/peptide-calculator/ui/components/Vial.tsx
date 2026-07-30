"use client";

import { motion, useReducedMotion } from "framer-motion";

import { INSTANT, SPRING_SLOW } from "../../lib/motion";
import { VialGlassBack, VialGlassFront } from "./VialGlass";

/** Visual ceiling for the liquid level. A drawing scale, never a measurement. */
const FULL_ML = 10;

export type VialVariant = "powder" | "water" | "mixed";

interface VialProps {
  /** `powder` is the peptide as it ships, `water` the bacteriostatic diluent, `mixed` the reconstituted vial. */
  variant: VialVariant;
  /** Drives the liquid level on `water` and `mixed`. Ignored by `powder`. */
  waterMl?: number;
  /** Printed paper band. Unreadable under ~60px, so the inline step vignettes leave it off. */
  label?: string;
  className?: string;
}

/**
 * The vial as an illustration: same glass for the three roles the page needs, with the
 * liquid rising with the water the user says they added.
 *
 * Decorative throughout. Every part it depicts is named in the surrounding text, so the
 * drawing stays out of the accessibility tree entirely.
 */
export function Vial({ variant, waterMl = 0, label, className }: VialProps) {
  const reduced = useReducedMotion();
  const hasLiquid = variant !== "powder";
  const hasCake = variant !== "water";
  const level = hasLiquid ? Math.min(Math.max(waterMl / FULL_ML, 0.06), 1) : 0;

  return (
    <div aria-hidden="true" className={`relative aspect-[3/5] ${className ?? ""}`}>
      <VialGlassBack />

      {/* Liquid and cake, clipped to the straight run of the body (x26–94, y66–196 of the
          120×200 viewBox) so nothing spills into the shoulder or past the rounded base. */}
      <div className="absolute bottom-[2%] left-[22%] right-[22%] top-[33%] overflow-hidden rounded-b-lg">
        {hasLiquid && (
          <motion.div
            animate={{ scaleY: level }}
            className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-gradient-to-b from-primary/25 via-primary/35 to-primary/50"
            initial={false}
            transition={reduced ? INSTANT : SPRING_SLOW}
          />
        )}
        {/* The cake sits still: a faint constant base, independent of the water volume. */}
        {/* The cake sits still: dry powder reads as a solid bed, and what is left of it once the
            water is in is barely a haze. */}
        {hasCake && (
          <div
            className={`absolute bottom-0 left-[8%] right-[8%] h-[17%] origin-bottom scale-y-[0.6] rounded-[45%_55%_35%_40%/65%_55%_45%_40%] ${
              variant === "mixed" ? "bg-[#f0e7d3] opacity-[0.18]" : "bg-[#e3d2ad] opacity-90"
            }`}
          />
        )}
      </div>

      {/* The printed label: an opaque paper strip wrapped across the body. */}
      {label && (
        <div className="absolute left-[18%] right-[18%] top-[50%] flex h-[15%] items-center justify-center overflow-hidden border-y border-base-300 bg-base-100 px-1">
          <span className="text-[8px] font-bold uppercase leading-none tracking-[0.14em] text-gray-700">{label}</span>
        </div>
      )}

      <VialGlassFront />
    </div>
  );
}
