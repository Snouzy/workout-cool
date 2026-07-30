"use client";

import { useState } from "react";

import { DOSE_MCG_OPTIONS, DOSE_MG_OPTIONS, STEP_DOSE_MCG, STEP_DOSE_MG } from "../../lib/presets";
import { DOSE_UNIT_SWITCH_MCG, formatLocaleNumber } from "../../lib/formatNumber";
import { ValueChips } from "./ValueChips";
import { SegmentedControl } from "./SegmentedControl";

import type { Locale } from "locales/types";

const EPSILON = 1e-9;

type DoseUnit = "mcg" | "mg";

interface DoseFieldProps {
  legend: string;
  doseMcg: number;
  onChange: (doseMcg: number) => void;
  unitLabel: string;
  otherLabel: string;
  locale: Locale;
}

const presetsFor = (unit: DoseUnit) => (unit === "mg" ? DOSE_MG_OPTIONS : DOSE_MCG_OPTIONS);
const displayed = (doseMcg: number, unit: DoseUnit) => (unit === "mg" ? doseMcg / 1000 : doseMcg);

/**
 * The dose step: presets in whichever unit the user thinks in, micrograms underneath.
 *
 * The switch is display-only — the dose is stored in mcg throughout — with one exception
 * that earns its keep: typing past 1000 mcg flips the display to mg, because nobody reading
 * their own vial label thinks in "8000 mcg".
 */
export function DoseField({ legend, doseMcg, onChange, unitLabel, otherLabel, locale }: DoseFieldProps) {
  const [unit, setUnit] = useState<DoseUnit>(doseMcg >= DOSE_UNIT_SWITCH_MCG ? "mg" : "mcg");
  const [custom, setCustom] = useState(() => !presetsFor(unit).some((option) => Math.abs(option - displayed(doseMcg, unit)) < EPSILON));

  const shown = displayed(doseMcg, unit);

  const switchUnit = (next: DoseUnit) => {
    setUnit(next);
    setCustom(!presetsFor(next).some((option) => Math.abs(option - displayed(doseMcg, next)) < EPSILON));
  };

  const commit = (value: number) => {
    const asMcg = unit === "mg" ? value * 1000 : value;

    if (unit === "mcg" && asMcg >= DOSE_UNIT_SWITCH_MCG) setUnit("mg");
    onChange(Math.max(0, asMcg));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-base-content/60">{unitLabel}</span>
        <SegmentedControl
          id="dose-unit"
          legend={unitLabel}
          onChange={switchUnit}
          options={[
            { value: "mcg", label: "mcg" },
            { value: "mg", label: "mg" },
          ]}
          size="sm"
          value={unit}
        />
      </div>

      <ValueChips
        conversion={
          unit === "mg"
            ? `= ${formatLocaleNumber(doseMcg, 0, locale)} mcg`
            : `= ${formatLocaleNumber(doseMcg / 1000, 3, locale)} mg`
        }
        custom={custom}
        legend={legend}
        locale={locale}
        onChange={commit}
        onCustomChange={setCustom}
        options={presetsFor(unit)}
        otherLabel={otherLabel}
        step={unit === "mg" ? STEP_DOSE_MG : STEP_DOSE_MCG}
        unit={unit}
        value={shown}
      />
    </div>
  );
}
