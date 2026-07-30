"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

import { SPRING } from "../../lib/motion";
import { formatLocaleNumber } from "../../lib/formatNumber";
import { RulerTicks } from "./RulerTicks";

import type { Locale } from "locales/types";

interface SyringeRulerProps {
  units: number;
  capacity: number;
  unitsLabel: string;
  locale: Locale;
}

export function SyringeRuler({ units, capacity, unitsLabel, locale }: SyringeRulerProps) {
  const reduced = useReducedMotion();

  // The bar saturates, the badge below tells the truth. This clamp must not change.
  const clamped = Math.min(Math.max(units, 0), capacity);
  const fraction = clamped / capacity;

  const target = useMotionValue(fraction);
  const spring = useSpring(target, SPRING);
  // Reduced motion reads the target directly: correctly positioned, never animated.
  const fill = reduced ? target : spring;

  useEffect(() => {
    target.set(fraction);
  }, [fraction, target]);

  // Percentages of each element's own width, so every position stays a transform.
  const edgeX = useTransform(fill, (value) => `${(value - 1) * 100}%`);
  const badgeX = useTransform(fill, (value) => `${(1 - value) * 100}%`);

  return (
    <div className="mt-6">
      <div className="mb-1 flex justify-between text-xs text-base-content/50">
        <span>{formatLocaleNumber(0, 0, locale)}</span>
        <span>
          {formatLocaleNumber(capacity, 0, locale)} {unitsLabel}
        </span>
      </div>

      <div className="relative h-16 overflow-hidden rounded-lg border border-base-300 bg-base-100">
        <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-primary/70 to-primary" style={{ scaleX: fill }} />

        <RulerTicks capacity={capacity} fill={fill} locale={locale} />

        <motion.div className="absolute inset-y-0 left-0 w-full border-r-2 border-base-content" style={{ x: edgeX }} />
      </div>

      <div className="relative h-6">
        <motion.div className="absolute inset-x-0 top-0" style={{ x: edgeX }}>
          <motion.span
            className="absolute right-0 top-0 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-primary-content"
            style={{ x: badgeX }}
          >
            {formatLocaleNumber(units, 2, locale)} {unitsLabel}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
