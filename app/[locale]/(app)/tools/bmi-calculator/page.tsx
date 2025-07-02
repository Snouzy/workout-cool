import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { BmiCalculatorClient } from "app/[locale]/(app)/tools/bmi-calculator/shared/BmiCalculatorClient";
import { getServerUrl } from "@/shared/lib/server-url";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n();

  return generateSEOMetadata({
    title: t("tools.bmi-calculator-hub.meta.title"),
    description: t("tools.bmi-calculator-hub.meta.description"),
    keywords: t("tools.bmi-calculator-hub.meta.keywords").split(", "),
    locale,
    canonical: `${getServerUrl()}/${locale}/tools/bmi-calculator`,
    structuredData: {
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
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-base-content dark:text-base-content/90">Standard BMI Calculator</h1>
            <p className="text-lg text-base-content/70 dark:text-base-content/60">
              Calculate your Body Mass Index using the standard WHO formula. Get instant results with health category and personalized
              recommendations.
            </p>
          </div>

          {/* Calculator */}
          <BmiCalculatorClient />

          {/* Information Section */}
          <div className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-base-content dark:text-base-content/90">About BMI</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-base-content/70 dark:text-base-content/60 mb-4">
                Body Mass Index (BMI) is a screening tool used to assess whether you&apos;re at a healthy weight for your height. It&apos;s
                calculated by dividing your weight in kilograms by your height in meters squared.
              </p>
              <p className="text-base-content/70 dark:text-base-content/60 mb-4">
                While BMI is a useful screening tool, it has limitations. It doesn&apos;t distinguish between muscle and fat mass, so very
                muscular individuals may have a high BMI despite being healthy. Always consult with healthcare professionals for
                personalized health advice.
              </p>
              <h3 className="text-lg font-semibold mb-2 text-base-content dark:text-base-content/90">
                BMI Categories (WHO Classification)
              </h3>
              <ul className="space-y-1 text-base-content/70 dark:text-base-content/60">
                <li>
                  <strong>Underweight:</strong> BMI less than 18.5
                </li>
                <li>
                  <strong>Normal weight:</strong> BMI 18.5-24.9
                </li>
                <li>
                  <strong>Overweight:</strong> BMI 25.0-29.9
                </li>
                <li>
                  <strong>Obesity Class I:</strong> BMI 30.0-34.9
                </li>
                <li>
                  <strong>Obesity Class II:</strong> BMI 35.0-39.9
                </li>
                <li>
                  <strong>Obesity Class III:</strong> BMI 40.0 and above
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
