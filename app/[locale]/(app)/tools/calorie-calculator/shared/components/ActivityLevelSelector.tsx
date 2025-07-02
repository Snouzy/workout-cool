"use client";

import React from "react";
import { ActivityIcon, BedIcon, BedDoubleIcon, BikeIcon, ZapIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { ActivityLevel } from "app/[locale]/(app)/tools/calorie-calculator/calorie-calculator.utils";

interface ActivityLevelSelectorProps {
  value: ActivityLevel;
  onChange: (level: ActivityLevel) => void;
}

const ACTIVITY_LEVELS: ActivityLevel[] = ["sedentary", "light", "moderate", "active", "very_active"];

export function ActivityLevelSelector({ value, onChange }: ActivityLevelSelectorProps) {
  const t = useI18n();

  const ACTIVITY_ICONS: Record<ActivityLevel, React.ReactNode> = {
    sedentary: <BedIcon className="w-5 h-5" />,
    light: <BedDoubleIcon className="w-5 h-5" />,
    moderate: <ActivityIcon className="w-5 h-5" />,
    active: <BikeIcon className="w-5 h-5" />,
    very_active: <ZapIcon className="w-5 h-5" />,
  };

  const ACTIVITY_COLORS: Record<ActivityLevel, { border: string; bg: string; text: string }> = {
    sedentary: { border: "border-gray-400", bg: "from-gray-400/20 to-gray-500/10", text: "text-gray-600" },
    light: { border: "border-blue-400", bg: "from-blue-400/20 to-blue-500/10", text: "text-blue-600" },
    moderate: { border: "border-green-500", bg: "from-green-500/20 to-green-600/10", text: "text-green-600" },
    active: { border: "border-orange-500", bg: "from-orange-500/20 to-orange-600/10", text: "text-orange-600" },
    very_active: { border: "border-red-500", bg: "from-red-500/20 to-red-600/10", text: "text-red-600" },
  };

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("tools.calorie-calculator.activity_level")}
      </label>
      <div className="space-y-3">
        {ACTIVITY_LEVELS.map((level) => {
          const colors = ACTIVITY_COLORS[level];
          const isSelected = value === level;

          return (
            <button
              className={`group w-full text-left p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 touch-manipulation ${
                isSelected
                  ? `${colors.border} bg-gradient-to-br ${colors.bg} scale-[1.02] dark:${colors.bg.replace("/20", "/15").replace("/10", "/5")}`
                  : "border-base-content/15 dark:border-base-content/10 hover:border-base-content/30 bg-base-100 dark:bg-base-200/30 hover:bg-base-200/50 active:bg-base-200/70 active:scale-[0.98]"
              }`}
              key={level}
              onClick={() => onChange(level)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? `${colors.bg} dark:${colors.bg.replace("/20", "/15")}`
                      : "bg-base-200 dark:bg-base-300/20 group-hover:bg-base-300/50"
                  }`}
                >
                  <div
                    className={`transition-colors duration-300 ${
                      isSelected ? colors.text : "text-base-content/60 group-hover:text-base-content/80"
                    }`}
                  >
                    {ACTIVITY_ICONS[level]}
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className={`font-semibold transition-colors duration-300 ${
                      isSelected ? colors.text : "text-base-content/80 dark:text-base-content/70"
                    }`}
                  >
                    {t(`tools.calorie-calculator.activity.${level}`)}
                  </div>
                  <div className="text-sm text-base-content/60 dark:text-base-content/50 mt-0.5">
                    {t(`tools.calorie-calculator.activity.${level}_desc`)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
