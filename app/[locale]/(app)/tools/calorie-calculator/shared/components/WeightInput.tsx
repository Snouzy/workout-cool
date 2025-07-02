"use client";

import React from "react";

import { useI18n } from "locales/client";
import { UnitSystem } from "app/[locale]/(app)/tools/calorie-calculator/calorie-calculator.utils";

interface WeightInputProps {
  value: number;
  unit: UnitSystem;
  onChange: (weight: number) => void;
}

export function WeightInput({ value, unit, onChange }: WeightInputProps) {
  const t = useI18n();
  const unitLabel = unit === "metric" ? t("tools.calorie-calculator.kg") : t("tools.calorie-calculator.lbs");
  const min = unit === "metric" ? 30 : 66;
  const max = unit === "metric" ? 300 : 660;

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("tools.calorie-calculator.weight")}
      </label>
      <div className="relative">
        <input
          className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-base-content/15 dark:border-base-content/10 bg-base-100 dark:bg-base-200/30 text-base-content focus:border-primary focus:outline-none transition-all duration-300 hover:border-primary/30 font-semibold"
          max={max}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={t("tools.calorie-calculator.weight_placeholder")}
          step="0.1"
          type="number"
          value={value}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-base-content/60 dark:text-base-content/50 font-medium">
          {unitLabel}
        </span>
      </div>
    </div>
  );
}
