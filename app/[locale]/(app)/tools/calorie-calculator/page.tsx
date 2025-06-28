import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";

import { CalorieCalculatorHub } from "./CalorieCalculatorHub";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n();

  return {
    title: t("tools.calorie-calculator-hub.meta.title"),
    description: t("tools.calorie-calculator-hub.meta.description"),
    keywords: t("tools.calorie-calculator-hub.meta.keywords"),
  };
}

export default async function CalorieCalculatorPage() {
  const t = await getI18n();

  return (
    <div className="min-h-screen light:bg-white dark:bg-base-200/20">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 max-w-4xl">
        <CalorieCalculatorHub />
      </div>
    </div>
  );
}
