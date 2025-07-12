import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeftIcon } from "lucide-react";

import { getI18n } from "locales/server";
import { CalorieCalculatorClient } from "app/[locale]/(app)/tools/calorie-calculator/shared/CalorieCalculatorClient";
import { calculatorConfigs } from "app/[locale]/(app)/tools/calorie-calculator/shared/calculator-configs";
import { getServerUrl } from "@/shared/lib/server-url";
import { env } from "@/env";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";
import { HorizontalTopBanner } from "@/components/ads";

import "../styles.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n();

  return generateSEOMetadata({
    title: t("tools.mifflin-st-jeor.meta.title"),
    description: t("tools.mifflin-st-jeor.meta.description"),
    keywords: t("tools.mifflin-st-jeor.meta.keywords").split(", "),
    locale,
    canonical: `${getServerUrl()}/${locale}/tools/mifflin-st-jeor-calculator`,
    structuredData: {
      type: "Calculator",
      calculatorData: {
        calculatorType: "calorie",
        inputFields: ["gender", "age", "height", "weight", "activity level", "goal"],
        outputFields: ["BMR (Mifflin-St Jeor)", "TDEE", "target calories", "recommended macros"],
        formula: "Mifflin-St Jeor Equation (1990) - Gold Standard",
        accuracy: "Most accurate for general population (±5-10% error rate)",
        targetAudience: ["general population", "fitness beginners", "health conscious individuals", "Cal the Chef users"],
        relatedCalculators: [
          "calorie-calculator",
          "harris-benedict-calculator",
          "katch-mcardle-calculator",
          "calorie-calculator-comparison",
        ],
      },
    },
  });
}

export default async function MifflinStJeorCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getI18n();

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/mifflin-st-jeor-calculator`}
        description={t("tools.mifflin-st-jeor.meta.description")}
        locale={locale}
        structuredData={{
          type: "Calculator",
          calculatorData: {
            calculatorType: "calorie",
            inputFields: ["gender", "age", "height", "weight", "activity level", "goal"],
            outputFields: ["BMR (Mifflin-St Jeor)", "TDEE", "target calories", "recommended macros"],
            formula: "Mifflin-St Jeor Equation (1990) - Gold Standard",
            accuracy: "Most accurate for general population (±5-10% error rate)",
            targetAudience: ["general population", "fitness beginners", "health conscious individuals", "Cal the Chef users"],
            relatedCalculators: [
              "calorie-calculator",
              "harris-benedict-calculator",
              "katch-mcardle-calculator",
              "calorie-calculator-comparison",
            ],
          },
        }}
        title={t("tools.mifflin-st-jeor.meta.title")}
      />
      <div className="light:bg-white dark:bg-base-200/20">
        {env.NEXT_PUBLIC_TOP_MIFFLIN_ST_JEOR_CALCULATOR_AD_SLOT && (
          <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_MIFFLIN_ST_JEOR_CALCULATOR_AD_SLOT} />
        )}
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
          {/* Back to hub */}
          <Link
            className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors mb-6"
            href="/tools/calorie-calculator"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            {t("tools.back_to_calculators")}
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F8EF7] to-[#238BE6] bg-clip-text text-transparent animate-fadeIn">
              {t("tools.mifflin-st-jeor.title")}
            </h1>
            <p
              className="text-lg text-base-content/70 dark:text-base-content/60 max-w-2xl mx-auto animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              {t("tools.mifflin-st-jeor.subtitle")}
            </p>
          </div>

          {/* Educational Section */}
          <div
            className="mb-8 bg-gradient-to-br from-[#4F8EF7]/5 to-[#238BE6]/5 dark:from-[#4F8EF7]/10 dark:to-[#238BE6]/10 rounded-2xl border border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30 p-6 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-xl font-bold mb-3 text-base-content dark:text-base-content/90">
              {t("tools.mifflin-st-jeor.how_it_works")}
            </h2>
            <div className="space-y-2 text-base-content/70 dark:text-base-content/60">
              <p className="text-sm leading-relaxed">{t("tools.mifflin-st-jeor.how_it_works_description")}</p>
              <div className="mt-4 p-3 bg-base-100/50 dark:bg-base-100/20 rounded-lg">
                <p className="text-xs font-mono text-base-content/70">
                  <strong>Men:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5<br />
                  <strong>Women:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
                </p>
              </div>
            </div>
          </div>

          <CalorieCalculatorClient config={calculatorConfigs["mifflin-st-jeor"]} />
        </div>
      </div>
    </>
  );
}
