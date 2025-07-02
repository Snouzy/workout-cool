"use client";

import React, { useState, useEffect } from "react";

import { useI18n } from "locales/client";
import {
  BmiData,
  BmiResult,
  UnitSystem,
  calculateBmi,
  convertHeight,
  convertWeight,
} from "app/[locale]/(app)/tools/bmi-calculator/bmi-calculator.utils";

import { BmiWeightInput } from "./components/BmiWeightInput";
import { BmiUnitSelector } from "./components/BmiUnitSelector";
import { BmiResultsDisplay } from "./components/BmiResultsDisplay";
import { BmiHeightInput } from "./components/BmiHeightInput";

export function BmiCalculatorClient() {
  const t = useI18n();
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [height, setHeight] = useState<number>(170); // cm for metric, inches for imperial
  const [weight, setWeight] = useState<number>(70); // kg for metric, lbs for imperial
  const [result, setResult] = useState<BmiResult | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Convert values when unit system changes (but not on first render)
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    if (unit === "imperial") {
      // Convert from metric to imperial
      setHeight(Math.round(convertHeight(height, "metric", "imperial")));
      setWeight(Math.round(convertWeight(weight, "metric", "imperial") * 10) / 10);
    } else {
      // Convert from imperial to metric
      setHeight(Math.round(convertHeight(height, "imperial", "metric")));
      setWeight(Math.round(convertWeight(weight, "imperial", "metric") * 10) / 10);
    }
  }, [unit]);

  // Calculate BMI whenever inputs change
  useEffect(() => {
    if (height > 0 && weight > 0) {
      const bmiData: BmiData = { height, weight, unit };
      const bmiResult = calculateBmi(bmiData, t);
      setResult(bmiResult);
    } else {
      setResult(null);
    }
  }, [height, weight, unit]);

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-4 sm:p-8 border border-base-content/10">
        <div className="space-y-6">
          {/* Unit Selector */}
          <BmiUnitSelector onChange={setUnit} value={unit} />

          {/* Height and Weight Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BmiHeightInput onChange={setHeight} unit={unit} value={height} />
            <BmiWeightInput onChange={setWeight} unit={unit} value={weight} />
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-4 sm:p-8 border border-base-content/10">
          <BmiResultsDisplay result={result} />
        </div>
      )}
    </div>
  );
}
