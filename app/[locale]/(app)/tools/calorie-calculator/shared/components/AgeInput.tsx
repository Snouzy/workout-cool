"use client";

import React from "react";

import { useI18n } from "locales/client";

interface AgeInputProps {
  value: number;
  onChange: (age: number) => void;
}

export function AgeInput({ value, onChange }: AgeInputProps) {
  const t = useI18n();

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("tools.calorie-calculator.age")}
      </label>
      <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl border-2 border-base-content/15 dark:border-base-content/10 p-4 transition-all duration-300 hover:border-primary/30">
        <div className="flex items-center gap-4">
          <input
            className="w-24 px-3 py-2 text-2xl font-bold text-center rounded-xl border-2 border-base-content/10 bg-base-200/50 dark:bg-base-300/20 text-base-content dark:text-base-content/90 focus:border-primary focus:outline-none transition-all duration-300"
            max="100"
            min="13"
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={t("tools.calorie-calculator.age_placeholder")}
            type="number"
            value={value}
          />
          <div className="flex-1">
            <input
              className="w-full h-2 bg-base-200 dark:bg-base-300/30 rounded-lg appearance-none cursor-pointer slider"
              max="100"
              min="13"
              onChange={(e) => onChange(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #4F8EF7 0%, #4F8EF7 ${((value - 13) / 87) * 100}%, rgb(229 231 235 / 0.3) ${((value - 13) / 87) * 100}%, rgb(229 231 235 / 0.3) 100%)`,
              }}
              type="range"
              value={value}
            />
            <div className="flex justify-between mt-1 text-xs text-base-content/50">
              <span>13</span>
              <span>100</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-base-content/60 dark:text-base-content/50">{t("tools.calorie-calculator.years")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}