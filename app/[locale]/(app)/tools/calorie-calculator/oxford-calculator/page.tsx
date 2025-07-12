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
    title: t("tools.oxford.meta.title"),
    description: t("tools.oxford.meta.description"),
    keywords: t("tools.oxford.meta.keywords").split(", "),
    locale,
    canonical: `${getServerUrl()}/${locale}/tools/oxford-calculator`,
    structuredData: {
      type: "Calculator",
      calculatorData: {
        calculatorType: "calorie",
        inputFields: ["gender", "age", "height", "weight", "physical activity", "goal"],
        outputFields: ["BMR (Oxford)", "TDEE", "target calories", "recommended macros"],
        formula: "Oxford Equation (2005) - Physical Activity Based",
        accuracy: "Modern accuracy incorporating physical activity (±8-12% error rate)",
        targetAudience: ["modern populations", "diverse ethnicities", "health professionals", "Cal the Chef users"],
        relatedCalculators: [
          "calorie-calculator",
          "mifflin-st-jeor-calculator",
          "harris-benedict-calculator",
          "katch-mcardle-calculator",
          "calorie-calculator-comparison",
        ],
      },
    },
  });
}

export default async function OxfordCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getI18n();

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/oxford-calculator`}
        description={t("tools.oxford.meta.description")}
        locale={locale}
        structuredData={{
          type: "Calculator",
          calculatorData: {
            calculatorType: "calorie",
            inputFields: ["gender", "age", "height", "weight", "physical activity", "goal"],
            outputFields: ["BMR (Oxford)", "TDEE", "target calories", "recommended macros"],
            formula: "Oxford Equation (2005) - Physical Activity Based",
            accuracy: "Modern accuracy incorporating physical activity (±8-12% error rate)",
            targetAudience: ["modern populations", "diverse ethnicities", "health professionals", "Cal the Chef users"],
            relatedCalculators: [
              "calorie-calculator",
              "mifflin-st-jeor-calculator",
              "harris-benedict-calculator",
              "katch-mcardle-calculator",
              "calorie-calculator-comparison",
            ],
          },
        }}
        title={t("tools.oxford.meta.title")}
      />
      <div className="light:bg-white dark:bg-base-200/20">
        {env.NEXT_PUBLIC_TOP_OXFORD_CALCULATOR_AD_SLOT && <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_OXFORD_CALCULATOR_AD_SLOT} />}
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#25CB78] to-[#22C55E] bg-clip-text text-transparent animate-fadeIn">
              {t("tools.oxford.title")}
            </h1>
            <p
              className="text-lg text-base-content/70 dark:text-base-content/60 max-w-2xl mx-auto animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              {t("tools.oxford.subtitle")}
            </p>
          </div>

          {/* Educational Section */}
          <div
            className="mb-8 bg-gradient-to-br from-[#25CB78]/5 to-[#22C55E]/5 dark:from-[#25CB78]/10 dark:to-[#22C55E]/10 rounded-2xl border border-[#25CB78]/20 dark:border-[#25CB78]/30 p-6 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-xl font-bold mb-3 text-base-content dark:text-base-content/90">{t("tools.oxford.how_it_works")}</h2>
            <div className="space-y-2 text-base-content/70 dark:text-base-content/60">
              <p className="text-sm leading-relaxed">{t("tools.oxford.how_it_works_description")}</p>
              <div className="mt-4 p-3 bg-base-100/50 dark:bg-base-100/20 rounded-lg">
                <p className="text-xs font-mono text-base-content/70">
                  <strong>Men:</strong> BMR = 662 - (9.53 × age) + PA × (15.91 × weight + 539.6 × height)
                  <br />
                  <strong>Women:</strong> BMR = 354 - (6.91 × age) + PA × (9.36 × weight + 726 × height)
                </p>
              </div>
            </div>
          </div>

          <CalorieCalculatorClient config={calculatorConfigs.oxford} />
        </div>
      </div>
    </>
  );
}
