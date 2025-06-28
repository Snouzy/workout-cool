"use client";

import React from "react";
import { useI18n } from "locales/client";
import type { UnitSystem } from "../calorie-calculator.utils";

interface HeightInputProps {
  value: number;
  unit: UnitSystem;
  onChange: (height: number) => void;
}

export function HeightInput({ value, unit, onChange }: HeightInputProps) {
  const t = useI18n();

  // For imperial, we need to handle feet and inches
  if (unit === "imperial") {
    const totalInches = value;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;

    const handleFeetChange = (newFeet: number) => {
      onChange(newFeet * 12 + inches);
    };

    const handleInchesChange = (newInches: number) => {
      onChange(feet * 12 + newInches);
    };

    return (
      <div>
        <label className="text-sm font-medium text-base-content/70 uppercase tracking-wider">
          {t("tools.calorie-calculator.height")}
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              min="4"
              max="7"
              value={feet}
              onChange={(e) => handleFeetChange(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-base-content/15 dark:border-base-content/10 bg-base-100 dark:bg-base-200/30 text-base-content focus:border-primary focus:outline-none transition-all duration-300 hover:border-primary/30 text-center font-semibold"
            />
            <span className="text-xs text-base-content/60 dark:text-base-content/50 mt-1 block text-center font-medium">
              {t("tools.calorie-calculator.feet")}
            </span>
          </div>
          <div>
            <input
              type="number"
              min="0"
              max="11"
              value={inches}
              onChange={(e) => handleInchesChange(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-2 border-base-content/15 dark:border-base-content/10 bg-base-100 dark:bg-base-200/30 text-base-content focus:border-primary focus:outline-none transition-all duration-300 hover:border-primary/30 text-center font-semibold"
            />
            <span className="text-xs text-base-content/60 dark:text-base-content/50 mt-1 block text-center font-medium">
              {t("tools.calorie-calculator.inches")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Metric - simple cm input
  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("tools.calorie-calculator.height")}
      </label>
      <div className="mt-2">
        <div className="relative">
          <input
            type="number"
            min="100"
            max="250"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-base-content/15 dark:border-base-content/10 bg-base-100 dark:bg-base-200/30 text-base-content focus:border-primary focus:outline-none transition-all duration-300 hover:border-primary/30 font-semibold"
            placeholder={t("tools.calorie-calculator.height_placeholder")}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-base-content/60 dark:text-base-content/50 font-medium">
            {t("tools.calorie-calculator.cm")}
          </span>
        </div>
      </div>
    </div>
  );
}