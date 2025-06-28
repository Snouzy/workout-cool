/* eslint-disable max-len */
"use client";

import React, { useState } from "react";

import { useI18n } from "locales/client";

import { WeightInput } from "./components/WeightInput";
import { UnitSelector } from "./components/UnitSelector";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { HeightInput } from "./components/HeightInput";
import { GoalSelector } from "./components/GoalSelector";
import { GenderSelector } from "./components/GenderSelector";
import { FAQSection } from "./components/FAQSection";
import { AgeInput } from "./components/AgeInput";
import { ActivityLevelSelector } from "./components/ActivityLevelSelector";
import { calculateCalories, type CalorieCalculatorInputs, type CalorieResults } from "../shared/calorie-formulas.utils";

export function CalorieCalculatorClient() {
  const t = useI18n();

  // Form state with default values
  const [inputs, setInputs] = useState<CalorieCalculatorInputs>({
    gender: "male",
    unit: "metric",
    age: 25,
    height: 170, // cm
    weight: 70, // kg
    activityLevel: "moderate",
    goal: "maintain",
  });

  const [results, setResults] = useState<CalorieResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Add a small delay for animation effect
    setTimeout(() => {
      const calculatedResults = calculateCalories(inputs, "harris");
      setResults(calculatedResults);
      setIsCalculating(false);
    }, 500);
  };

  const updateInput = <K extends keyof CalorieCalculatorInputs>(key: K, value: CalorieCalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="light:bg-white dark:bg-base-200/20 backdrop-blur-sm rounded-2xl border border-base-content/10 dark:border-base-content/5 p-2 sm:p-8 transition-all duration-300">
        <div className="space-y-6">
          {/* Gender Selection */}
          <GenderSelector onChange={(gender) => updateInput("gender", gender)} value={inputs.gender} />

          {/* Unit System Selection */}
          <UnitSelector onChange={(unit) => updateInput("unit", unit)} value={inputs.unit} />

          {/* Age Input */}
          <AgeInput onChange={(age) => updateInput("age", age)} value={inputs.age} />

          {/* Height and Weight Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <HeightInput onChange={(height) => updateInput("height", height)} unit={inputs.unit} value={inputs.height} />
            <WeightInput onChange={(weight) => updateInput("weight", weight)} unit={inputs.unit} value={inputs.weight} />
          </div>

          {/* Activity Level */}
          <ActivityLevelSelector onChange={(level) => updateInput("activityLevel", level)} value={inputs.activityLevel} />

          {/* Goal Selection */}
          <GoalSelector onChange={(goal) => updateInput("goal", goal)} value={inputs.goal} />

          {/* Calculate Button */}
          <button
            aria-label={t("tools.calorie-calculator.calculate")}
            className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#25CB78] to-[#22C55E] text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] touch-manipulation ${
              isCalculating ? "animate-pulse" : ""
            }`}
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
              t("tools.calorie-calculator.calculate")
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          <ResultsDisplay results={results} />
          {/* Mobile hint */}
          <div className="sm:hidden text-center text-xs text-base-content/50 dark:text-base-content/40 mt-2">
            {t("tools.calorie-calculator.tap_info_icons")}
          </div>
        </>
      )}

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
