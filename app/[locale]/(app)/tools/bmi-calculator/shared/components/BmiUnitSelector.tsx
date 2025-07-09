"use client";

import React from "react";

import { useI18n } from "locales/client";
import { UnitSystem } from "app/[locale]/(app)/tools/bmi-calculator/bmi-calculator.utils";

interface BmiUnitSelectorProps {
  value: UnitSystem;
  onChange: (unit: UnitSystem) => void;
}

export function BmiUnitSelector({ value, onChange }: BmiUnitSelectorProps) {
  const t = useI18n();

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("bmi-calculator.units")}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          className={`group flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-4 rounded-2xl border-2 transition-all duration-300 touch-manipulation ${
            value === "metric"
              ? "border-[#4F8EF7] bg-gradient-to-br from-[#4F8EF7]/20 to-[#238BE6]/10 text-[#4F8EF7] dark:from-[#4F8EF7]/15 dark:to-[#238BE6]/5 scale-[1.02]"
              : "border-base-content/15 dark:border-base-content/10 hover:border-[#4F8EF7]/50 light:bg-white dark:bg-base-200/30 hover:bg-base-200/50 active:bg-base-200/70"
          }`}
          onClick={() => onChange("metric")}
        >
          <span className="text-sm font-semibold">{t("bmi-calculator.metric")}</span>
        </button>
        <button
          className={`group flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-4 rounded-2xl border-2 transition-all duration-300 touch-manipulation ${
            value === "imperial"
              ? "border-[#4F8EF7] bg-gradient-to-br from-[#4F8EF7]/20 to-[#238BE6]/10 text-[#4F8EF7] dark:from-[#4F8EF7]/15 dark:to-[#238BE6]/5 scale-[1.02]"
              : "border-base-content/15 dark:border-base-content/10 hover:border-[#4F8EF7]/50 light:bg-white dark:bg-base-200/30 hover:bg-base-200/50 active:bg-base-200/70"
          }`}
          onClick={() => onChange("imperial")}
        >
          <span className="text-sm font-semibold">{t("bmi-calculator.imperial")}</span>
        </button>
      </div>
    </div>
  );
}
