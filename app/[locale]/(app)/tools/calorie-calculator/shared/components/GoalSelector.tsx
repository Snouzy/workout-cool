"use client";

import React from "react";
import { TrendingDownIcon, TrendingUpIcon, ScaleIcon, RocketIcon, ZapOffIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { Goal } from "app/[locale]/(app)/tools/calorie-calculator/calorie-calculator.utils";

interface GoalSelectorProps {
  value: Goal;
  onChange: (goal: Goal) => void;
}

const GOALS: Goal[] = ["lose_fast", "lose_slow", "maintain", "gain_slow", "gain_fast"];

export function GoalSelector({ value, onChange }: GoalSelectorProps) {
  const t = useI18n();

  const GOAL_ICONS: Record<Goal, React.ReactNode> = {
    lose_fast: <ZapOffIcon className="w-5 h-5" />,
    lose_slow: <TrendingDownIcon className="w-5 h-5" />,
    maintain: <ScaleIcon className="w-5 h-5" />,
    gain_slow: <TrendingUpIcon className="w-5 h-5" />,
    gain_fast: <RocketIcon className="w-5 h-5" />,
  };

  const GOAL_COLORS: Record<Goal, { border: string; bg: string; text: string }> = {
    lose_fast: { border: "border-red-500", bg: "from-red-500/20 to-red-600/10", text: "text-red-600" },
    lose_slow: { border: "border-orange-500", bg: "from-orange-500/20 to-orange-600/10", text: "text-orange-600" },
    maintain: { border: "border-blue-500", bg: "from-blue-500/20 to-blue-600/10", text: "text-blue-600" },
    gain_slow: { border: "border-green-500", bg: "from-green-500/20 to-green-600/10", text: "text-green-600" },
    gain_fast: { border: "border-purple-500", bg: "from-purple-500/20 to-purple-600/10", text: "text-purple-600" },
  };

  return (
    <div>
      <label className="text-sm font-bold text-base-content/80 dark:text-base-content/70 uppercase tracking-wider mb-3 block">
        {t("tools.calorie-calculator.goal")}
      </label>
      <div className="space-y-3">
        {GOALS.map((goal) => {
          const colors = GOAL_COLORS[goal];
          const isSelected = value === goal;

          return (
            <button
              className={`group w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? `${colors.border} bg-gradient-to-br ${colors.bg} scale-[1.02] dark:${colors.bg.replace("/20", "/15").replace("/10", "/5")}`
                  : "border-base-content/15 dark:border-base-content/10 hover:border-base-content/30 bg-base-100 dark:bg-base-200/30 hover:bg-base-200/50"
              }`}
              key={goal}
              onClick={() => onChange(goal)}
            >
              <div className="flex items-start gap-4">
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
                    {GOAL_ICONS[goal]}
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className={`font-semibold transition-colors duration-300 ${
                      isSelected ? colors.text : "text-base-content/80 dark:text-base-content/70"
                    }`}
                  >
                    {t(`tools.calorie-calculator.goals.${goal}`)}
                  </div>
                  <div className="text-sm text-base-content/60 dark:text-base-content/50 mt-0.5">
                    {t(`tools.calorie-calculator.goals.${goal}_desc`)}
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
