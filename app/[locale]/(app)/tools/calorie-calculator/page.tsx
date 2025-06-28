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
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F8EF7] to-[#238BE6] bg-clip-text text-transparent animate-fadeIn">
            {t("tools.calorie-calculator.title")}
          </h1>
          <p className="text-lg text-base-content/70 dark:text-base-content/60 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            {t("tools.calorie-calculator.subtitle")}
          </p>
        </div>

        <CalorieCalculatorClient />
      </div>
    </div>
  );
}