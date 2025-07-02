"use client";

import React from "react";
import { UserIcon, UsersIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { Gender } from "app/[locale]/(app)/tools/calorie-calculator/calorie-calculator.utils";

interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
}

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const t = useI18n();

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("tools.calorie-calculator.gender")}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          className={`group flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-4 rounded-2xl border-2 transition-all duration-300 touch-manipulation ${
            value === "male"
              ? "border-[#4F8EF7] bg-gradient-to-br from-[#4F8EF7]/20 to-[#238BE6]/10 text-[#4F8EF7] dark:from-[#4F8EF7]/15 dark:to-[#238BE6]/5 scale-[1.02]"
              : "border-base-content/15 dark:border-base-content/10 hover:border-[#4F8EF7]/50 bg-base-100 dark:bg-base-200/30 hover:bg-base-200/50 active:bg-base-200/70"
          }`}
          onClick={() => onChange("male")}
        >
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              value === "male" ? "bg-[#4F8EF7]/20 dark:bg-[#4F8EF7]/15" : "bg-base-200 dark:bg-base-300/20 group-hover:bg-[#4F8EF7]/10"
            }`}
          >
            <UserIcon
              className={`w-5 h-5 transition-colors duration-300 ${
                value === "male" ? "text-[#4F8EF7]" : "text-base-content/60 group-hover:text-[#4F8EF7]/70"
              }`}
            />
          </div>
          <span
            className={`font-semibold transition-colors duration-300 ${
              value === "male" ? "text-[#4F8EF7]" : "text-base-content/70 dark:text-base-content/60"
            }`}
          >
            {t("tools.calorie-calculator.male")}
          </span>
        </button>

        <button
          className={`group flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-4 rounded-2xl border-2 transition-all duration-300 touch-manipulation ${
            value === "female"
              ? "border-[#FF5722] bg-gradient-to-br from-[#FF5722]/20 to-[#F44336]/10 text-[#FF5722] dark:from-[#FF5722]/15 dark:to-[#F44336]/5 scale-[1.02]"
              : "border-base-content/15 dark:border-base-content/10 hover:border-[#FF5722]/50 bg-base-100 dark:bg-base-200/30 hover:bg-base-200/50 active:bg-base-200/70"
          }`}
          onClick={() => onChange("female")}
        >
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              value === "female" ? "bg-[#FF5722]/20 dark:bg-[#FF5722]/15" : "bg-base-200 dark:bg-base-300/20 group-hover:bg-[#FF5722]/10"
            }`}
          >
            <UsersIcon
              className={`w-5 h-5 transition-colors duration-300 ${
                value === "female" ? "text-[#FF5722]" : "text-base-content/60 group-hover:text-[#FF5722]/70"
              }`}
            />
          </div>
          <span
            className={`font-semibold transition-colors duration-300 ${
              value === "female" ? "text-[#FF5722]" : "text-base-content/70 dark:text-base-content/60"
            }`}
          >
            {t("tools.calorie-calculator.female")}
          </span>
        </button>
      </div>
    </div>
  );
}
