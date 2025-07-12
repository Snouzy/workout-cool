"use client";

import React from "react";
import Link from "next/link";
import { TrendingUpIcon, AwardIcon, TargetIcon, BrainIcon, GlobeIcon, ChartBarIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { env } from "@/env";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

interface CalculatorFormula {
  id: string;
  href: string;
  icon: React.ReactNode;
  year: string;
  popularity: number; // 1-5
  accuracy: "high" | "medium" | "good";
  bestFor: string;
  gradient: {
    from: string;
    to: string;
  };
}

const calculatorFormulas: CalculatorFormula[] = [
  {
    id: "mifflin-st-jeor",
    href: "/tools/calorie-calculator/mifflin-st-jeor-calculator",
    icon: <AwardIcon className="w-6 h-6" />,
    year: "1990",
    popularity: 5,
    accuracy: "high",
    bestFor: "general",
    gradient: {
      from: "from-[#4F8EF7]",
      to: "to-[#238BE6]",
    },
  },
  {
    id: "harris-benedict",
    href: "/tools/calorie-calculator/harris-benedict-calculator",
    icon: <TrendingUpIcon className="w-6 h-6" />,
    year: "1984",
    popularity: 5,
    accuracy: "good",
    bestFor: "traditional",
    gradient: {
      from: "from-[#25CB78]",
      to: "to-[#22C55E]",
    },
  },
  {
    id: "katch-mcardle",
    href: "/tools/calorie-calculator/katch-mcardle-calculator",
    icon: <TargetIcon className="w-6 h-6" />,
    year: "1996",
    popularity: 3,
    accuracy: "high",
    bestFor: "athletes",
    gradient: {
      from: "from-[#FF5722]",
      to: "to-[#EF4444]",
    },
  },
  {
    id: "cunningham",
    href: "/tools/calorie-calculator/cunningham-calculator",
    icon: <BrainIcon className="w-6 h-6" />,
    year: "1980",
    popularity: 2,
    accuracy: "high",
    bestFor: "bodybuilders",
    gradient: {
      from: "from-[#8B5CF6]",
      to: "to-[#7C3AED]",
    },
  },
  {
    id: "oxford",
    href: "/tools/calorie-calculator/oxford-calculator",
    icon: <GlobeIcon className="w-6 h-6" />,
    year: "2005",
    popularity: 3,
    accuracy: "good",
    bestFor: "european",
    gradient: {
      from: "from-[#F59E0B]",
      to: "to-[#EF4444]",
    },
  },
  {
    id: "comparison",
    href: "/tools/calorie-calculator/calorie-calculator-comparison",
    icon: <ChartBarIcon className="w-6 h-6" />,
    year: "all",
    popularity: 4,
    accuracy: "high",
    bestFor: "comparison",
    gradient: {
      from: "from-[#06B6D4]",
      to: "to-[#3B82F6]",
    },
  },
];

export function CalorieCalculatorHub() {
  const t = useI18n();

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span className={i < count ? "text-yellow-500" : "text-base-content/20"} key={i}>
        ★
      </span>
    ));
  };

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case "high":
        return "text-green-600 dark:text-green-400";
      case "good":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-orange-600 dark:text-orange-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      {env.NEXT_PUBLIC_TOP_CALCULATOR_HUB_BANNER_AD_SLOT && (
        <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_CALCULATOR_HUB_BANNER_AD_SLOT} />
      )}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-base-content dark:text-base-content/90">
          {t("tools.calorie-calculator-hub.title")}
        </h1>
        <p className="text-lg text-base-content/70 dark:text-base-content/60">{t("tools.calorie-calculator-hub.subtitle")}</p>
      </div>

      {/* Calculator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculatorFormulas.map((formula) => (
          <Link
            className="group relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 dark:bg-base-200/30 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
            href={formula.href}
            key={formula.id}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${formula.gradient.from} ${formula.gradient.to} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
            />

            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${formula.gradient.from} ${formula.gradient.to} text-white`}>
                  {formula.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2 text-base-content dark:text-base-content/90">
                {t(`tools.calorie-calculator-hub.${formula.id}.title` as keyof typeof t)}
              </h3>

              {/* Year Badge */}
              <div className="inline-flex items-center gap-2 text-xs mb-3">
                <span className="px-2 py-1 rounded-full bg-base-200 dark:bg-base-300/50 text-base-content/60">
                  {formula.year === "all"
                    ? t("tools.calorie-calculator-hub.all_formulas")
                    : `${t("tools.calorie-calculator-hub.since")} ${formula.year}`}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-base-content/70 dark:text-base-content/60 mb-4">
                {t(`tools.calorie-calculator-hub.${formula.id}.description` as keyof typeof t)}
              </p>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/60">{t("tools.calorie-calculator-hub.popularity")}</span>
                  <span>{renderStars(formula.popularity)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/60">{t("tools.calorie-calculator-hub.accuracy")}</span>
                  <span className={`font-medium ${getAccuracyColor(formula.accuracy)}`}>
                    {t(`tools.calorie-calculator-hub.accuracy_${formula.accuracy}`)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/60">{t("tools.calorie-calculator-hub.best_for")}</span>
                  <span className="text-xs font-medium text-primary">
                    {t(`tools.calorie-calculator-hub.best_for_${formula.bestFor}` as keyof typeof t)}
                  </span>
                </div>
              </div>

              {/* Best For Badge */}
            </div>
          </Link>
        ))}
      </div>

      {env.NEXT_PUBLIC_BOTTOM_CALCULATOR_HUB_BANNER_AD_SLOT && (
        <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_CALCULATOR_HUB_BANNER_AD_SLOT} />
      )}

      {/* Info Section */}
      <div className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20">
        <h2 className="text-2xl font-bold mb-4 text-base-content dark:text-base-content/90">
          {t("tools.calorie-calculator-hub.which_formula")}
        </h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-base-content/70 dark:text-base-content/60">{t("tools.calorie-calculator-hub.formula_explanation")}</p>
          <ul className="mt-4 space-y-2 text-base-content/70 dark:text-base-content/60">
            <li>
              <strong className="text-base-content dark:text-base-content/90">
                {t("tools.calorie-calculator-hub.mifflin-st-jeor.title")}:
              </strong>{" "}
              {t("tools.calorie-calculator-hub.recommendation_general")}
            </li>
            <li>
              <strong className="text-base-content dark:text-base-content/90">
                {t("tools.calorie-calculator-hub.harris-benedict.title")}:
              </strong>{" "}
              {t("tools.calorie-calculator-hub.recommendation_traditional")}
            </li>
            <li>
              <strong className="text-base-content dark:text-base-content/90">
                {t("tools.calorie-calculator-hub.katch-mcardle.title")}:
              </strong>{" "}
              {t("tools.calorie-calculator-hub.recommendation_bodyfat")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
