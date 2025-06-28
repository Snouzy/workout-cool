import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeftIcon } from "lucide-react";

import { getI18n } from "locales/server";

import { CalorieCalculatorComparison } from "./CalorieCalculatorComparison";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n();

  return {
    title: t("tools.calorie-calculator-comparison.meta.title"),
    description: t("tools.calorie-calculator-comparison.meta.description"),
    keywords: t("tools.calorie-calculator-comparison.meta.keywords"),
  };
}

export default async function CalorieCalculatorComparisonPage() {
  const t = await getI18n();

  return (
    <div className="min-h-screen light:bg-white dark:bg-base-200/20">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 max-w-6xl">
        {/* Back to hub */}
        <Link
          className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors mb-6"
          href="/tools/calorie-calculator"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          {t("tools.back_to_calculators")}
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] bg-clip-text text-transparent animate-fadeIn">
            {t("tools.calorie-calculator-comparison.title")}
          </h1>
          <p
            className="text-lg text-base-content/70 dark:text-base-content/60 max-w-3xl mx-auto animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            {t("tools.calorie-calculator-comparison.subtitle")}
          </p>
        </div>

        {/* Educational Section */}
        <div
          className="mb-8 bg-gradient-to-br from-[#06B6D4]/5 to-[#3B82F6]/5 dark:from-[#06B6D4]/10 dark:to-[#3B82F6]/10 rounded-2xl border border-[#06B6D4]/20 dark:border-[#06B6D4]/30 p-6 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-xl font-bold mb-3 text-base-content dark:text-base-content/90">
            {t("tools.calorie-calculator-comparison.how_it_works")}
          </h2>
          <div className="space-y-2 text-base-content/70 dark:text-base-content/60">
            <p className="text-sm leading-relaxed">{t("tools.calorie-calculator-comparison.how_it_works_description")}</p>
          </div>
        </div>

        <CalorieCalculatorComparison />
      </div>
    </div>
  );
}
