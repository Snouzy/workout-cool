"use client";

import React from "react";
import { RulerIcon, GlobeIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { UnitSystem } from "app/[locale]/(app)/tools/calorie-calculator/calorie-calculator.utils";

interface UnitSelectorProps {
  value: UnitSystem;
  onChange: (unit: UnitSystem) => void;
}

export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  const t = useI18n();

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("tools.calorie-calculator.units")}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          className={`group flex items-center justify-center gap-3 py-4 px-4 rounded-2xl border-2 transition-all duration-300 ${
            value === "metric"
              ? "border-[#25CB78] bg-gradient-to-br from-[#25CB78]/20 to-[#22C55E]/10 text-[#25CB78] dark:from-[#25CB78]/15 dark:to-[#22C55E]/5 scale-[1.02]"
              : "border-base-content/15 dark:border-base-content/10 hover:border-[#25CB78]/50 bg-base-100 dark:bg-base-200/30 hover:bg-base-200/50"
          }`}
          onClick={() => onChange("metric")}
        >
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              value === "metric" ? "bg-[#25CB78]/20 dark:bg-[#25CB78]/15" : "bg-base-200 dark:bg-base-300/20 group-hover:bg-[#25CB78]/10"
            }`}
          >
            <GlobeIcon
              className={`w-5 h-5 transition-colors duration-300 ${
                value === "metric" ? "text-[#25CB78]" : "text-base-content/60 group-hover:text-[#25CB78]/70"
              }`}
            />
          </div>
          <span
            className={`font-semibold transition-colors duration-300 ${
              value === "metric" ? "text-[#25CB78]" : "text-base-content/70 dark:text-base-content/60"
            }`}
          >
            {t("tools.calorie-calculator.metric")}
          </span>
        </button>

        <button
          className={`group flex items-center justify-center gap-3 py-4 px-4 rounded-2xl border-2 transition-all duration-300 ${
            value === "imperial"
              ? "border-[#F59E0B] bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/10 text-[#F59E0B] dark:from-[#F59E0B]/15 dark:to-[#EF4444]/5 scale-[1.02]"
              : "border-base-content/15 dark:border-base-content/10 hover:border-[#F59E0B]/50 bg-base-100 dark:bg-base-200/30 hover:bg-base-200/50"
          }`}
          onClick={() => onChange("imperial")}
        >
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              value === "imperial" ? "bg-[#F59E0B]/20 dark:bg-[#F59E0B]/15" : "bg-base-200 dark:bg-base-300/20 group-hover:bg-[#F59E0B]/10"
            }`}
          >
            <RulerIcon
              className={`w-5 h-5 transition-colors duration-300 ${
                value === "imperial" ? "text-[#F59E0B]" : "text-base-content/60 group-hover:text-[#F59E0B]/70"
              }`}
            />
          </div>
          <span
            className={`font-semibold transition-colors duration-300 ${
              value === "imperial" ? "text-[#F59E0B]" : "text-base-content/70 dark:text-base-content/60"
            }`}
          >
            {t("tools.calorie-calculator.imperial")}
          </span>
        </button>
      </div>
    </div>
  );
}
