"use client";

import { motion, useReducedMotion } from "framer-motion";

import { FADE, INSTANT, MARQUEE_SECONDS, SPRING, SPRING_SLOW } from "../../lib/motion";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { VIAL_PART_ANCHORS, VialGlassBack, VialGlassFront } from "./VialGlass";

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

/**
 * Leader-line geometry, in the overlay svg's own 0–100 × 0–100 space. `VIAL_PART_ANCHORS`
 * (VialGlass.tsx, 120×200 viewBox units) is the only source of truth for where a part sits; a
 * vial-unit x is rescaled by `VIAL_FRACTION` since the overlay also spans the flex gap and a
 * short run into the text (`OVERLAY_WIDTH`, matched by the `ul`'s `pl-*`). TEXT sits on an even
 * quarter of the row (12.5/37.5/62.5/87.5%) so wrapping translations never collide — the cap and
 * stopper are packed into the vial's top fifth, closer together than legible rows could be — so
 * the line elbows: a run out of the text, then a diagonal into the part's true anchor.
 */
const OVERLAY_WIDTH = { base: 152, sm: 186 }; // vial (124/150) + flex gap (12/16) + run into text (16/20)
const VIAL_FRACTION = 124 / OVERLAY_WIDTH.base; // ≈0.816; sm's 150/186≈0.806 is close enough to share one path
const TEXT_ROW_Y: Record<keyof VialLabels, number> = { cap: 12.5, stopper: 37.5, glass: 62.5, cake: 87.5 };
const ELBOW_X = 90;

const LEADER_PATHS = ANATOMY.reduce((paths, part) => {
  const anchor = VIAL_PART_ANCHORS[part];
  const touchX = ((anchor.x / 120) * 100 * VIAL_FRACTION).toFixed(1);
  const touchY = (anchor.y / 2).toFixed(1);
  const textY = TEXT_ROW_Y[part];
  paths[part] = `M 100 ${textY} L ${ELBOW_X} ${textY} L ${touchX} ${touchY}`;
  return paths;
}, {} as Record<keyof VialLabels, string>);

const LEADER_STROKE = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;

export function PeptideVial({ vialMg, waterMl, labels, locale }: PeptideVialProps) {
  const reduced = useReducedMotion();
  const level = Math.min(Math.max(waterMl / FULL_ML, 0.06), 1);
  // The cake callout exists only while there is cake to point at: it fades with the dissolve,
  // reaching 0 at the drawing's full mark. This never stops the cake itself from dissolving.
  const cakeVisible = 1 - level;
  const dissolveTransition = reduced ? FADE : SPRING_SLOW;

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
    <div className="relative flex w-full items-stretch gap-3 sm:gap-4">
      <div aria-hidden="true" className="relative aspect-[3/5] w-[124px] shrink-0 sm:w-[150px]">
        <VialGlassBack />

        <div className="absolute bottom-[2.5%] left-[15%] right-[15%] top-[35%] overflow-hidden rounded-b-lg">
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

        {/* The label band: an opaque paper strip whose inscription scrolls, masked at both edges
            so the text dissolves into the vial's curve instead of being cut at a hard line. */}
        <div
          className="absolute left-[15%] right-[15%] top-[56%] h-[17%] overflow-hidden border-y border-base-300 bg-base-100"
          style={{
            maskImage: "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
          }}
        >
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
        className="flex min-w-0 flex-1 flex-col gap-2 py-1 pl-4 sm:pl-5"
        initial="hidden"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        viewport={{ once: true, amount: 0.4 }}
        whileInView="visible"
      >
        {ANATOMY.map((part) => (
          <motion.li className="flex flex-1 items-center" key={part} variants={calloutVariants}>
            {part === "cake" ? (
              <motion.span
                animate={{ opacity: cakeVisible }}
                className="text-[11px] font-medium leading-snug text-base-content"
                transition={dissolveTransition}
              >
                {labels.cake}
              </motion.span>
            ) : (
              <span className="text-[11px] font-medium leading-snug text-base-content">{labels[part]}</span>
            )}
          </motion.li>
        ))}
      </motion.ul>

      {/* Leader lines: each one physically touches the edge of the part it names, per VIAL_PART_ANCHORS. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[152px] text-black/25 dark:text-white/25 sm:w-[186px]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {(["cap", "stopper", "glass"] as const).map((part) => (
          <path d={LEADER_PATHS[part]} key={part} {...LEADER_STROKE} />
        ))}
        <motion.path animate={{ opacity: cakeVisible }} d={LEADER_PATHS.cake} transition={dissolveTransition} {...LEADER_STROKE} />
      </svg>
    </div>
  );
}
