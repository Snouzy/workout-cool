"use client";

import React from "react";
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { BmiResult, BmiCategory, HealthRisk } from "app/[locale]/(app)/tools/bmi-calculator/bmi-calculator.utils";

interface BmiResultsDisplayProps {
  result: BmiResult;
}

export function BmiResultsDisplay({ result }: BmiResultsDisplayProps) {
  const t = useI18n();

  const getCategoryColor = (category: BmiCategory) => {
    switch (category) {
      case "underweight":
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
      case "underweight":
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

      {/* Category and Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
          <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">{t("bmi-calculator.bmi_category")}</h3>
          <div className={`text-xl font-bold ${getCategoryColor(result.category)}`}>
            {t(`bmi-calculator.category_${result.category}` as keyof typeof t)}
          </div>
        </div>

        <div className="bg-white dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
          <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">{t("bmi-calculator.health_risk")}</h3>
          <div className={`flex items-center gap-2 text-xl font-bold ${getRiskColor(result.healthRisk)}`}>
            {getRiskIcon(result.healthRisk)}
            {t(`bmi-calculator.risk_${result.healthRisk}` as keyof typeof t)}
          </div>
        </div>
      </div>

      {/* BMI Range Reference */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-3 text-base-content dark:text-base-content/90">{t("bmi-calculator.bmi_range")}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">{t("bmi-calculator.category_underweight")}</span>
            <span className="text-base-content/70">{"< 18.5"}</span>
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

      {/* Recommendations */}
      <div className="bg-white dark:bg-base-200/30 rounded-2xl p-6 border border-base-content/10">
        <h3 className="text-lg font-semibold mb-4 text-base-content dark:text-base-content/90">{t("bmi-calculator.recommendations")}</h3>
        <ul className="space-y-2">
          {result.recommendations.map((recommendation, index) => (
            <li className="flex items-start gap-3 text-sm text-base-content/70 dark:text-base-content/60" key={index}>
              <CheckCircleIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
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
