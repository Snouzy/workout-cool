"use client";

import React from "react";

import { useI18n } from "locales/client";

interface BodyFatInputProps {
  value: number;
  onChange: (bodyFat: number) => void;
}

export function BodyFatInput({ value, onChange }: BodyFatInputProps) {
  const t = useI18n();

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 flex items-center gap-2">
        {t("tools.body_fat_percentage")}
      </label>
      <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl border-2 border-base-content/15 dark:border-base-content/10 p-4 transition-all duration-300 hover:border-primary/30">
        <div className="flex items-center gap-4">
          <input
            className="w-24 px-3 py-2 text-2xl font-bold text-center rounded-xl border-2 border-base-content/10 bg-base-200/50 dark:bg-base-300/20 text-base-content dark:text-base-content/90 focus:border-primary focus:outline-none transition-all duration-300"
            max="50"
            min="5"
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="15"
            step="0.5"
            type="number"
            value={value}
          />
          <div className="flex-1">
            <input
              className="w-full h-2 bg-base-200 dark:bg-base-300/30 rounded-lg appearance-none cursor-pointer slider"
              max="50"
              min="5"
              onChange={(e) => onChange(Number(e.target.value))}
              step="0.5"
              style={{
                background: `linear-gradient(to right, #FF5722 0%, #FF5722 ${((value - 5) / 45) * 100}%, rgb(229 231 235 / 0.3) ${((value - 5) / 45) * 100}%, rgb(229 231 235 / 0.3) 100%)`,
              }}
              type="range"
              value={value}
            />
            <div className="flex justify-between mt-1 text-xs text-base-content/50">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm text-base-content/60 dark:text-base-content/50">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
