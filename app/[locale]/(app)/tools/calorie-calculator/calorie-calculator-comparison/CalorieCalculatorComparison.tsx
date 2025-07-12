"use client";

import React, { useState } from "react";

import { useI18n } from "locales/client";
import { BodyFatInput } from "app/[locale]/(app)/tools/calorie-calculator/shared/components/BodyFatInput";
import {
  ActivityLevelSelector,
  AgeInput,
  GenderSelector,
  GoalSelector,
  HeightInput,
  UnitSelector,
  WeightInput,
} from "app/[locale]/(app)/tools/calorie-calculator/shared/components";
import {
  calculateCalories,
  CalorieCalculatorInputs,
  CalorieResults,
} from "app/[locale]/(app)/tools/calorie-calculator/shared/calorie-formulas.utils";
import { env } from "@/env";
import { HorizontalBottomBanner } from "@/components/ads";

interface FormulaResult {
  name: string;
  formula: "mifflin" | "harris" | "katch" | "cunningham" | "oxford";
  results: CalorieResults | null;
  error?: string;
  gradient: {
    from: string;
    to: string;
  };
}

export function CalorieCalculatorComparison() {
  const t = useI18n();

  const [inputs, setInputs] = useState<CalorieCalculatorInputs>({
    gender: "male",
    unit: "metric",
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: "moderate",
    goal: "maintain",
    bodyFatPercentage: 15,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [formulaResults, setFormulaResults] = useState<FormulaResult[]>([]);

  const formulas: FormulaResult[] = [
    {
      name: t("tools.calorie-calculator-hub.mifflin-st-jeor.title"),
      formula: "mifflin",
      results: null,
      gradient: { from: "from-[#4F8EF7]", to: "to-[#238BE6]" },
    },
    {
      name: t("tools.calorie-calculator-hub.harris-benedict.title"),
      formula: "harris",
      results: null,
      gradient: { from: "from-[#25CB78]", to: "to-[#22C55E]" },
    },
    {
      name: t("tools.calorie-calculator-hub.katch-mcardle.title"),
      formula: "katch",
      results: null,
      gradient: { from: "from-[#FF5722]", to: "to-[#EF4444]" },
    },
    {
      name: t("tools.calorie-calculator-hub.cunningham.title"),
      formula: "cunningham",
      results: null,
      gradient: { from: "from-[#8B5CF6]", to: "to-[#7C3AED]" },
    },
    {
      name: t("tools.calorie-calculator-hub.oxford.title"),
      formula: "oxford",
      results: null,
      gradient: { from: "from-[#F59E0B]", to: "to-[#EF4444]" },
    },
  ];

  const handleCalculate = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const results = formulas.map((formula) => {
        try {
          const calculatedResults = calculateCalories(inputs, formula.formula);
          return {
            ...formula,
            results: calculatedResults,
            error: undefined,
          };
        } catch (error) {
          return {
            ...formula,
            results: null,
            error: error instanceof Error ? error.message : "Calculation error",
          };
        }
      });

      setFormulaResults(results);
      setIsCalculating(false);
    }, 500);
  };

  const updateInput = <K extends keyof CalorieCalculatorInputs>(key: K, value: CalorieCalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const getResultDifference = (result: CalorieResults, baseline: CalorieResults) => {
    const diff = result.targetCalories - baseline.targetCalories;
    const percentage = (diff / baseline.targetCalories) * 100;
    return { diff, percentage };
  };

  const baseline = formulaResults.find((r) => r.formula === "mifflin")?.results;

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="light:bg-white dark:bg-base-200/20 backdrop-blur-sm rounded-2xl border border-base-content/10 dark:border-base-content/5 p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-base-content dark:text-base-content/90">
          {t("tools.calorie-calculator-comparison.input_details")}
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GenderSelector onChange={(gender) => updateInput("gender", gender)} value={inputs.gender} />
            <UnitSelector onChange={(unit) => updateInput("unit", unit)} value={inputs.unit} />
          </div>

          <AgeInput onChange={(age) => updateInput("age", age)} value={inputs.age} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <HeightInput onChange={(height) => updateInput("height", height)} unit={inputs.unit} value={inputs.height} />
            <WeightInput onChange={(weight) => updateInput("weight", weight)} unit={inputs.unit} value={inputs.weight} />
          </div>

          <BodyFatInput onChange={(bodyFat) => updateInput("bodyFatPercentage", bodyFat)} value={inputs.bodyFatPercentage || 15} />

          <ActivityLevelSelector onChange={(level) => updateInput("activityLevel", level)} value={inputs.activityLevel} />

          <GoalSelector onChange={(goal) => updateInput("goal", goal)} value={inputs.goal} />

          {env.NEXT_PUBLIC_BOTTOM_CALORIE_CALCULATOR_COMPARISON_AD_SLOT && (
            <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_CALORIE_CALCULATOR_COMPARISON_AD_SLOT} />
          )}
          {/* Calculate Button */}
          <button
            aria-label={t("tools.calorie-calculator.calculate")}
            className={
              "w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] touch-manipulation"
            }
            disabled={isCalculating}
            onClick={handleCalculate}
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                {t("tools.calorie-calculator.calculating")}
              </span>
            ) : (
              `${t("tools.calorie-calculator.calculate")} & ${t("tools.calorie-calculator-comparison.compare")}`
            )}
          </button>
        </div>
      </div>

      {/* Results Comparison */}
      {formulaResults.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-base-content dark:text-base-content/90">
            {t("tools.calorie-calculator-comparison.results_comparison")}
          </h2>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formulaResults.map((formula, index) => (
              <div
                className="relative bg-base-100 dark:bg-base-200/30 rounded-2xl border border-base-content/10 p-6 transition-all duration-300 hover:scale-[1.02]"
                key={formula.formula}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${formula.gradient.from} ${formula.gradient.to} opacity-5 rounded-2xl`}
                />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${formula.gradient.from} ${formula.gradient.to} text-white text-sm font-bold`}
                    >
                      #{index + 1}
                    </div>
                    <h3 className="font-bold text-base-content dark:text-base-content/90">{formula.name}</h3>
                  </div>

                  {formula.error ? (
                    <div className="text-red-500 text-sm">{formula.error}</div>
                  ) : formula.results ? (
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-base-content dark:text-base-content/90">
                          {formula.results.targetCalories} cal
                        </div>
                        <div className="text-sm text-base-content/70">{t("tools.calorie-calculator.results.target")}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-semibold text-base-content/90">{formula.results.bmr}</div>
                          <div className="text-base-content/70">BMR</div>
                        </div>
                        <div>
                          <div className="font-semibold text-base-content/90">{formula.results.tdee}</div>
                          <div className="text-base-content/70">TDEE</div>
                        </div>
                      </div>

                      {baseline && formula.formula !== "mifflin" && (
                        <div className="pt-3 border-t border-base-content/10">
                          <div className="text-xs text-base-content/60">{t("tools.calorie-calculator-comparison.vs_mifflin")}</div>
                          {(() => {
                            const { diff, percentage } = getResultDifference(formula.results, baseline);
                            return (
                              <div
                                className={`text-sm font-semibold ${diff > 0 ? "text-orange-600" : diff < 0 ? "text-blue-600" : "text-gray-600"}`}
                              >
                                {diff > 0 ? "+" : ""}
                                {diff} cal ({percentage > 0 ? "+" : ""}
                                {percentage.toFixed(1)}%)
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {baseline && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-6 border border-primary/20">
              <h3 className="text-lg font-bold mb-3 text-base-content dark:text-base-content/90">
                {t("tools.calorie-calculator-comparison.summary")}
              </h3>
              <div className="space-y-2 text-sm text-base-content/70 dark:text-base-content/60">
                <p>{t("tools.calorie-calculator-comparison.summary_explanation")}</p>
                <p className="font-medium text-base-content/80">{t("tools.calorie-calculator-comparison.recommendation")}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
