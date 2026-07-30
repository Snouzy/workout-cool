"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

import { formatLocaleNumber } from "../../lib/formatNumber";

import type { Locale } from "locales/types";

const LABEL_EVERY = 5;

/**
 * Where the dark → light cross-fade happens, in graduations past the tick.
 * Deliberately biased late: a graduation the fill edge has only just reached
 * stays dark, so it never turns white while half of it still sits on the white
 * part of the barrel.
 */
const CROSSFADE_FROM_UNITS = 0.2;
const CROSSFADE_TO_UNITS = 1.4;

interface TickProps {
  capacity: number;
  /** Fill level as a 0–1 motion value; drives which colour each graduation wears. */
  fill: MotionValue<number>;
  locale: Locale;
  tick: number;
}

/**
 * NB on colours: this project's DaisyUI palette ships a fixed set of utilities
 * and no alpha variants — `bg-base-content/40` compiles to nothing at all,
 * which is why the previous graduations were invisible rather than merely
 * faint. The ink here therefore comes from the Tailwind palette (`black` /
 * `white`, with a `dark:` counterpart) so it actually paints in both themes.
 */
function TickBody({ isMajor, label, tone }: { isMajor: boolean; label: string | null; tone: "dark" | "light" }) {
  const dark = tone === "dark";

  return (
    <>
      {label !== null && (
        <span className={`mb-1 block text-center text-[10px] font-semibold tabular-nums ${dark ? "text-base-content" : "text-primary-content"}`}>
          {label}
        </span>
      )}
      <div
        className={
          isMajor
            ? `mx-auto h-7 w-[1.5px] ${dark ? "bg-black/75 dark:bg-white/75" : "bg-white"}`
            : `mx-auto h-3 w-px ${dark ? "bg-black/40 dark:bg-white/40" : "bg-white/75"}`
        }
      />
    </>
  );
}

/**
 * One graduation, drawn twice: a dark copy for the empty barrel and a light
 * copy for the filled part. Only opacity cross-fades between them — no
 * `mix-blend-mode` (it disagrees with itself across the light and dark themes)
 * and no clip animation (opacity composites, and stays crisp).
 */
function Tick({ capacity, fill, locale, tick }: TickProps) {
  const position = tick / capacity;
  const onFill = useTransform(
    fill,
    [position + CROSSFADE_FROM_UNITS / capacity, position + CROSSFADE_TO_UNITS / capacity],
    [0, 1],
    { clamp: true },
  );
  const offFill = useTransform(onFill, (value) => 1 - value);

  const isMajor = tick % LABEL_EVERY === 0;
  const label = isMajor && tick > 0 && tick < capacity ? formatLocaleNumber(tick, 0, locale) : null;

  return (
    <div className={`absolute bottom-0 -translate-x-1/2 ${isMajor ? "" : "hidden sm:block"}`} style={{ left: `${position * 100}%` }}>
      <motion.div style={{ opacity: offFill }}>
        <TickBody isMajor={isMajor} label={label} tone="dark" />
      </motion.div>
      <motion.div className="absolute bottom-0 left-0 right-0" style={{ opacity: onFill }}>
        <TickBody isMajor={isMajor} label={label} tone="light" />
      </motion.div>
    </div>
  );
}

export function RulerTicks({ capacity, fill, locale }: { capacity: number; fill: MotionValue<number>; locale: Locale }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {Array.from({ length: capacity + 1 }, (_, index) => (
        <Tick capacity={capacity} fill={fill} key={index} locale={locale} tick={index} />
      ))}
    </div>
  );
}
