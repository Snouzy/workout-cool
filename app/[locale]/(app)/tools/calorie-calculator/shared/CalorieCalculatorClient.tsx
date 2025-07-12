"use client";

import React, { useState } from "react";
import { Calculator } from "lucide-react";

import { useI18n } from "locales/client";
import { env } from "@/env";
import { HorizontalBottomBanner } from "@/components/ads";

import { BodyFatInput } from "./components/BodyFatInput";
import {
  GenderSelector,
  WeightInput,
  HeightInput,
  AgeInput,
  UnitSelector,
  ActivityLevelSelector,
  GoalSelector,
  ResultsDisplay,
} from "./components";
import { calculateCalories, type CalorieCalculatorInputs, type CalorieResults } from "./calorie-formulas.utils";

import type { CalculatorConfig } from "./types";

interface CalorieCalculatorClientProps {
  config: CalculatorConfig;
}

export function CalorieCalculatorClient({ config }: CalorieCalculatorClientProps) {
  const t = useI18n();

  // Form state
  const [gender, setGender] = useState<CalorieCalculatorInputs["gender"]>("male");
  const [unit, setUnit] = useState<CalorieCalculatorInputs["unit"]>("metric");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(unit === "metric" ? 175 : 69);
  const [weight, setWeight] = useState(unit === "metric" ? 70 : 154);
  const [activityLevel, setActivityLevel] = useState<CalorieCalculatorInputs["activityLevel"]>("moderate");
  const [goal, setGoal] = useState<CalorieCalculatorInputs["goal"]>("maintain");
  const [bodyFatPercentage, setBodyFatPercentage] = useState(20);

  // Results state
  const [results, setResults] = useState<CalorieResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Handle unit change
  const handleUnitChange = (newUnit: CalorieCalculatorInputs["unit"]) => {
    setUnit(newUnit);
    // Convert values
    if (newUnit === "imperial" && unit === "metric") {
      setWeight(Math.round(weight * 2.20462));
      setHeight(Math.round(height / 2.54));
    } else if (newUnit === "metric" && unit === "imperial") {
      setWeight(Math.round(weight / 2.20462));
      setHeight(Math.round(height * 2.54));
    }
  };

  // Calculate calories
  const handleCalculate = () => {
    setIsCalculating(true);

    const inputs: CalorieCalculatorInputs = {
      gender,
      unit,
      age,
      height,
      weight,
      activityLevel,
      goal,
      ...(config.requiresBodyFat && { bodyFatPercentage }),
    };

    try {
      const calculatedResults = calculateCalories(inputs, config.formula);
      setResults(calculatedResults);
    } catch (error) {
      console.error("Error calculating calories:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid gap-6">
        {/* Input Section */}
        <div className="bg-base-100/50 dark:bg-base-200/20 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-base-content/5">
          <div className="space-y-6">
            <div className="space-y-6">
              <GenderSelector onChange={setGender} value={gender} />
              <UnitSelector onChange={handleUnitChange} value={unit} />
              <AgeInput onChange={setAge} value={age} />
              <HeightInput onChange={setHeight} unit={unit} value={height} />
              <WeightInput onChange={setWeight} unit={unit} value={weight} />
              {config.requiresBodyFat && <BodyFatInput onChange={setBodyFatPercentage} value={bodyFatPercentage} />}
              <ActivityLevelSelector onChange={setActivityLevel} value={activityLevel} />
              <GoalSelector onChange={setGoal} value={goal} />
            </div>

            {env.NEXT_PUBLIC_BOTTOM_CALORIE_CALCULATOR_AD_SLOT && (
              <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_CALORIE_CALCULATOR_AD_SLOT} />
            )}

            <button
              className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 ${
                isCalculating ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isCalculating}
              onClick={handleCalculate}
              style={{
                background: `linear-gradient(135deg, ${config.buttonGradient.from} 0%, ${config.buttonGradient.to} 100%)`,
              }}
            >
              <Calculator className="w-6 h-6" />

              <span className="text-lg">
                {isCalculating ? t("tools.calorie-calculator.calculating") : t("tools.calorie-calculator.calculate")}
              </span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && <ResultsDisplay results={results} />}
      </div>
    </div>
  );
}
