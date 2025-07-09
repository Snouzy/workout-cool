"use client";

import React from "react";
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon, InfoIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { BmiResult, BmiCategory, HealthRisk } from "app/[locale]/(app)/tools/bmi-calculator/bmi-calculator.utils";

interface BmiResultsDisplayProps {
  result: BmiResult;
}

export function BmiResultsDisplay({ result }: BmiResultsDisplayProps) {
  const t = useI18n();

  const getCategoryColor = (category: BmiCategory) => {
    switch (category) {
      case "severe_thinness":
        return "text-red-700 dark:text-red-500";
      case "moderate_thinness":
        return "text-red-600 dark:text-red-400";
      case "mild_thinness":
        return "text-blue-600 dark:text-blue-400";
      case "normal":
        return "text-green-600 dark:text-green-400";
      case "overweight":
        return "text-yellow-600 dark:text-yellow-400";
      case "obese_class_1":
        return "text-orange-600 dark:text-orange-400";
      case "obese_class_2":
        return "text-red-600 dark:text-red-400";
      case "obese_class_3":
        return "text-red-700 dark:text-red-500";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getRiskColor = (risk: HealthRisk) => {
    switch (risk) {
      case "low":
      case "normal":
        return "text-green-600 dark:text-green-400";
      case "increased":
        return "text-yellow-600 dark:text-yellow-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "very_high":
        return "text-red-600 dark:text-red-400";
      case "extremely_high":
        return "text-red-700 dark:text-red-500";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getRiskIcon = (risk: HealthRisk) => {
    switch (risk) {
      case "low":
      case "normal":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "increased":
      case "high":
        return <AlertTriangleIcon className="w-5 h-5" />;
      case "very_high":
      case "extremely_high":
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  const getBmiGradient = (category: BmiCategory) => {
    switch (category) {
      case "severe_thinness":
        return "from-red-600 to-red-700";
      case "moderate_thinness":
        return "from-red-500 to-red-600";
      case "mild_thinness":
        return "from-blue-500 to-blue-600";
      case "normal":
        return "from-green-500 to-green-600";
      case "overweight":
        return "from-yellow-500 to-yellow-600";
      case "obese_class_1":
        return "from-orange-500 to-orange-600";
      case "obese_class_2":
        return "from-red-500 to-red-600";
      case "obese_class_3":
        return "from-red-600 to-red-700";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BMI Value */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getBmiGradient(result.category)} text-white shadow-lg`}
          >
            <div className="text-center">
              <div className="text-3xl font-bold">{result.bmi}</div>
              <div className="text-sm opacity-90">{t("bmi-calculator.your_bmi")}</div>
            </div>
          </div>
        </div>

        {/* BMI Prime */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold">{result.bmiPrime}</div>
              <div className="text-sm opacity-90">{t("bmi-calculator.bmi_prime")}</div>
            </div>
          </div>
        </div>

        {/* Ponderal Index */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold">{result.ponderalIndex}</div>
              <div className="text-sm opacity-90">{t("bmi-calculator.ponderal_index")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category and Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
          <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">{t("bmi-calculator.bmi_category")}</h3>
          <div className={`text-xl font-bold ${getCategoryColor(result.category)}`}>
            {t(`bmi-calculator.category_${result.category}` as keyof typeof t)}
          </div>
          <div className="text-sm text-base-content/60 mt-2">
            BMI: {result.detailedInfo.bmiRange.min} - {result.detailedInfo.bmiRange.max}
          </div>
        </div>

        <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
          <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">{t("bmi-calculator.health_risk")}</h3>
          <div className={`flex items-center gap-2 text-xl font-bold ${getRiskColor(result.healthRisk)}`}>
            {getRiskIcon(result.healthRisk)}
            {t(`bmi-calculator.risk_${result.healthRisk}` as keyof typeof t)}
          </div>
        </div>
      </div>

      {/* Ideal Weight and Weight Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
          <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">{t("bmi-calculator.ideal_weight")}</h3>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {result.detailedInfo.idealWeight.min} - {result.detailedInfo.idealWeight.max} kg
          </div>
          <div className="text-sm text-base-content/60 mt-1">{t("bmi-calculator.normal_range")}</div>
        </div>

        {(result.detailedInfo.weightToLose || result.detailedInfo.weightToGain) && (
          <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
            <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">
              {result.detailedInfo.weightToLose ? t("bmi-calculator.weight_to_lose") : t("bmi-calculator.weight_to_gain")}
            </h3>
            <div
              className={`flex items-center gap-2 text-lg font-bold ${result.detailedInfo.weightToLose ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}
            >
              {result.detailedInfo.weightToLose ? <TrendingDownIcon className="w-5 h-5" /> : <TrendingUpIcon className="w-5 h-5" />}
              {result.detailedInfo.weightToLose || result.detailedInfo.weightToGain} kg
            </div>
          </div>
        )}
      </div>

      {/* Detailed BMI Range Reference */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">
          {t("bmi-calculator.bmi_range")} (WHO Classification)
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-red-700 dark:text-red-500">{t("bmi-calculator.category_severe_thinness")}</span>
            <span className="text-base-content/70">{"< 16"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600 dark:text-red-400">{t("bmi-calculator.category_moderate_thinness")}</span>
            <span className="text-base-content/70">16.0 - 16.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">{t("bmi-calculator.category_mild_thinness")}</span>
            <span className="text-base-content/70">17.0 - 18.4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600 dark:text-green-400">{t("bmi-calculator.category_normal")}</span>
            <span className="text-base-content/70">18.5 - 24.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-600 dark:text-yellow-400">{t("bmi-calculator.category_overweight")}</span>
            <span className="text-base-content/70">25.0 - 29.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-600 dark:text-orange-400">{t("bmi-calculator.category_obese_class_1")}</span>
            <span className="text-base-content/70">30.0 - 34.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600 dark:text-red-400">{t("bmi-calculator.category_obese_class_2")}</span>
            <span className="text-base-content/70">35.0 - 39.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-700 dark:text-red-500">{t("bmi-calculator.category_obese_class_3")}</span>
            <span className="text-base-content/70">{"≥ 40.0"}</span>
          </div>
        </div>
      </div>

      {/* BMI Prime Information */}
      <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
        <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">{t("bmi-calculator.about_bmi_prime")}</h3>
        <p className="text-sm text-base-content/70 dark:text-base-content/60 mb-3">{t("bmi-calculator.bmi_prime_explanation")}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="text-center p-2 bg-base-200 dark:bg-base-300/20 rounded">
            <div className="font-semibold">{"< 0.74"}</div>
            <div className="text-blue-600">{t("bmi-calculator.underweight")}</div>
          </div>
          <div className="text-center p-2 bg-base-200 dark:bg-base-300/20 rounded">
            <div className="font-semibold">0.74 - 1.0</div>
            <div className="text-green-600">{t("bmi-calculator.normal")}</div>
          </div>
          <div className="text-center p-2 bg-base-200 dark:bg-base-300/20 rounded">
            <div className="font-semibold">1.0 - 1.2</div>
            <div className="text-yellow-600">{t("bmi-calculator.overweight")}</div>
          </div>
          <div className="text-center p-2 bg-base-200 dark:bg-base-300/20 rounded">
            <div className="font-semibold">{"> 1.2"}</div>
            <div className="text-red-600">{t("bmi-calculator.obese")}</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-base-100 dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
        <h3 className="text-lg font-semibold mb-4 text-base-content dark:text-base-content/90">
          {t("bmi-calculator.recommendations_label")}
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((recommendation, index) => (
            <li className="flex items-start gap-3 text-sm text-base-content/70 dark:text-base-content/60" key={index}>
              <CheckCircleIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* BMI Limitations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{t("bmi-calculator.limitations_title")}</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">{t("bmi-calculator.limitations_text")}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">{t("bmi-calculator.disclaimer")}</p>
        </div>
      </div>
    </div>
  );
}
