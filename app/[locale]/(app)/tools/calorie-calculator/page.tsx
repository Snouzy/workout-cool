import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { getServerUrl } from "@/shared/lib/server-url";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";

import { CalorieCalculatorHub } from "./CalorieCalculatorHub";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n();

  return generateSEOMetadata({
    title: t("tools.calorie-calculator-hub.meta.title"),
    description: t("tools.calorie-calculator-hub.meta.description"),
    keywords: t("tools.calorie-calculator-hub.meta.keywords").split(", "),
    locale,
    canonical: `${getServerUrl()}/${locale}/tools/calorie-calculator`,
    structuredData: {
      type: "Calculator",
      calculatorData: {
        calculatorType: "calorie",
        inputFields: ["gender", "age", "height", "weight", "activity level", "goal"],
        outputFields: ["BMR", "TDEE", "target calories", "recommended macros"],
        formula: "Mifflin-St Jeor Equation",
        accuracy: "±100-200 calories (scientifically validated)",
        targetAudience: ["fitness enthusiasts", "athletes", "weight loss seekers", "health conscious individuals"],
        relatedCalculators: [
          "mifflin-st-jeor-calculator",
          "harris-benedict-calculator",
          "katch-mcardle-calculator",
          "cunningham-calculator",
          "oxford-calculator",
        ],
      },
    },
  });
}

export default async function CalorieCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getI18n();

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/calorie-calculator`}
        description={t("tools.calorie-calculator-hub.meta.description")}
        locale={locale}
        structuredData={{
          type: "Calculator",
          calculatorData: {
            calculatorType: "calorie",
            inputFields: ["gender", "age", "height", "weight", "activity level", "goal"],
            outputFields: ["BMR", "TDEE", "target calories", "recommended macros"],
            formula: "Mifflin-St Jeor Equation",
            accuracy: "±100-200 calories (scientifically validated)",
            targetAudience: ["fitness enthusiasts", "athletes", "weight loss seekers", "health conscious individuals"],
            relatedCalculators: [
              "mifflin-st-jeor-calculator",
              "harris-benedict-calculator",
              "katch-mcardle-calculator",
              "cunningham-calculator",
              "oxford-calculator",
            ],
          },
        }}
        title={t("tools.calorie-calculator-hub.meta.title")}
      />
      <div className="light:bg-white dark:bg-base-200/20">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
          <CalorieCalculatorHub />
        </div>
      </div>
    </>
  );
}
