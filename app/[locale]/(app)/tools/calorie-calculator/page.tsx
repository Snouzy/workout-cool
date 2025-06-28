import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";

import { CalorieCalculatorClient } from "./CalorieCalculatorClient";
import "./styles.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n();

  return {
    title: t("tools.calorie-calculator.meta.title"),
    description: t("tools.calorie-calculator.meta.description"),
    keywords: t("tools.calorie-calculator.meta.keywords"),
  };
}

export default async function CalorieCalculatorPage() {
  const t = await getI18n();

  return (
    <div className="min-h-screen light:bg-white dark:bg-base-200/20">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F8EF7] to-[#238BE6] bg-clip-text text-transparent animate-fadeIn">
            {t("tools.calorie-calculator.title")}
          </h1>
          <p
            className="text-lg text-base-content/70 dark:text-base-content/60 max-w-2xl mx-auto animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            {t("tools.calorie-calculator.subtitle")}
          </p>
        </div>

        {/* Educational Section */}
        <div
          className="mb-8 bg-gradient-to-br from-[#4F8EF7]/5 to-[#238BE6]/5 dark:from-[#4F8EF7]/10 dark:to-[#238BE6]/10 rounded-2xl border border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30 p-6 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-xl font-bold mb-3 text-base-content dark:text-base-content/90">
            {t("tools.calorie-calculator.how_it_works")}
          </h2>
          <div className="space-y-2 text-base-content/70 dark:text-base-content/60">
            <p className="text-sm leading-relaxed">{t("tools.calorie-calculator.how_it_works_description")}</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>{t("tools.calorie-calculator.how_it_works_step1")}</li>
              <li>{t("tools.calorie-calculator.how_it_works_step2")}</li>
              <li>{t("tools.calorie-calculator.how_it_works_step3")}</li>
            </ul>
          </div>
        </div>

        <CalorieCalculatorClient />
      </div>
    </div>
  );
}
