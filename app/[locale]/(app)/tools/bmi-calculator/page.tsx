import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { BmiEducationalContent } from "app/[locale]/(app)/tools/bmi-calculator/shared/components/BmiEducationalContent";
import { BmiCalculatorClient } from "app/[locale]/(app)/tools/bmi-calculator/shared/BmiCalculatorClient";
import { getServerUrl } from "@/shared/lib/server-url";
import { env } from "@/env";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n();

  return generateSEOMetadata({
    title: t("tools.bmi-calculator-hub.meta.title"),
    description: t("tools.bmi-calculator-hub.meta.description"),
    keywords: [
      ...t("tools.bmi-calculator-hub.meta.keywords").split(", "),
      "BMI formula",
      "BMI prime",
      "ponderal index",
      "WHO BMI classification",
      "CDC BMI percentiles",
      "BMI health risks",
      "BMI limitations",
      "body mass index calculator",
      "BMI chart",
      "BMI table",
      "overweight risks",
      "underweight risks",
      "BMI for adults",
      "BMI for children",
      "BMI accuracy",
    ],
    locale,
    canonical: `${getServerUrl()}/${locale}/tools/bmi-calculator`,
    structuredData: {
      type: "Calculator",
      calculatorData: {
        calculatorType: "bmi",
        inputFields: ["height", "weight", "age", "gender"],
        outputFields: [
          "BMI",
          "BMI Prime",
          "Ponderal Index",
          "BMI category",
          "health risk assessment",
          "ideal weight range",
          "health recommendations",
        ],
        formula: "BMI = weight (kg) / height (m)²",
        accuracy: "Standard WHO classification with detailed health risk assessment",
        targetAudience: [
          "health conscious individuals",
          "fitness enthusiasts",
          "medical professionals",
          "general public",
          "parents",
          "athletes",
        ],
        relatedCalculators: ["standard-calculator", "adjusted-calculator", "pediatric-calculator", "bmi-comparison"],
      },
    },
  });
}

export default async function BmiCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getI18n();

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/bmi-calculator`}
        description={t("tools.bmi-calculator-hub.meta.description")}
        locale={locale}
        structuredData={{
          type: "Calculator",
          calculatorData: {
            calculatorType: "bmi",
            inputFields: ["height", "weight", "age", "gender"],
            outputFields: ["BMI", "BMI category", "health recommendations"],
            formula: "BMI = weight (kg) / height (m)²",
            accuracy: "Standard WHO classification",
            targetAudience: ["health conscious individuals", "fitness enthusiasts", "medical professionals", "general public"],
            relatedCalculators: ["standard-calculator", "adjusted-calculator", "pediatric-calculator", "bmi-comparison"],
          },
        }}
        title={t("tools.bmi-calculator-hub.meta.title")}
      />
      <div className="light:bg-white dark:bg-base-200/20">
        {env.NEXT_PUBLIC_TOP_BMI_BANNER_AD_SLOT && <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_BMI_BANNER_AD_SLOT} />}
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-base-content dark:text-base-content/90">
              {t("tools.bmi-calculator-hub.standard.page_title")}
            </h1>
            <p className="text-lg text-base-content/70 dark:text-base-content/60">
              {t("tools.bmi-calculator-hub.standard.page_description")}
            </p>
          </div>

          {/* Calculator */}
          <BmiCalculatorClient />

          {/* Educational Content */}
          <div className="mt-16">
            <BmiEducationalContent />
          </div>
        </div>
        {env.NEXT_PUBLIC_BOTTOM_BMI_BANNER_AD_SLOT && <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_BMI_BANNER_AD_SLOT} />}
      </div>
    </>
  );
}
