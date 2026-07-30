import { Readout, CalculatorMode } from "../../lib/readout";
import { ResultLabels } from "../../lib/labels";
import { formatDose, formatLocaleNumber } from "../../lib/formatNumber";
import { MONO, MUTED } from "../../lib/classes";
import { AnimatedNumber } from "./AnimatedNumber";

import type { Locale } from "locales/types";

interface ResultHeadlineProps {
  readout: Readout;
  mode: CalculatorMode;
  labels: ResultLabels;
  locale: Locale;
  /** `lg` is the desktop hero, `md` the mobile sheet. */
  size: "md" | "lg";
}

/**
 * The answer itself: eyebrow, one big number, and the line that shows where it came from.
 *
 * The unit carries the colour rather than the digits — the digits change on every keystroke,
 * and a number that recolours as it moves is harder to read than one that simply moves.
 */
export function ResultHeadline({ readout, mode, labels, locale, size }: ResultHeadlineProps) {
  const dose = formatDose(readout.doseMcg, locale);
  const forward = mode === "forward";
  const value = forward ? formatLocaleNumber(readout.units, 2, locale) : dose.value;
  const unit = forward ? labels.units : dose.unit;

  return (
    <div>
      <p className={`text-[11px] uppercase tracking-[0.08em] ${MUTED}`}>{forward ? labels.eyebrowForward : labels.eyebrowReverse}</p>

      <p
        className={`font-bold leading-[1.1] tracking-[-0.02em] text-base-content ${size === "lg" ? "text-[36px]" : "text-[26px]"}`}
      >
        <AnimatedNumber value={value} /> <span className={readout.over ? "text-danger" : "text-primary"}>{unit}</span>
      </p>

      <p className={`text-[11px] ${MUTED}`}>
        <span className={MONO}>
          {dose.value} {dose.unit}
        </span>{" "}
        = <span className={MONO}>{formatLocaleNumber(readout.volumeMl, 3, locale)} mL</span> ·{" "}
        <span className={MONO}>{formatLocaleNumber(readout.concentrationMgPerMl, 2, locale)} mg/mL</span>
      </p>
    </div>
  );
}
