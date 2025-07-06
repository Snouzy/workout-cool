import React from "react";
import { Metadata } from "next";
import { HeartRateEducationalContent } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/HeartRateEducationalContent";

import { getI18n } from "locales/server";
import { SimpleHeartRateCalculator } from "app/[locale]/(app)/tools/heart-rate-zones/shared/SimpleHeartRateCalculator";
import { getServerUrl } from "@/shared/lib/server-url";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n();

  return generateSEOMetadata({
    title: t("tools.heart-rate-zones.meta.title"),
    description: t("tools.heart-rate-zones.meta.description"),
    keywords: [
      ...t("tools.heart-rate-zones.meta.keywords").split(", "),
      "heart rate zones calculator",
      "target heart rate calculator",
      "maximum heart rate calculator",
      "exercise heart rate zones",
      "training zones calculator",
      "VO2 max zone",
      "anaerobic zone",
      "aerobic zone",
      "fat burn zone",
      "warm up zone",
      "Karvonen formula",
      "heart rate reserve",
      "THR calculator",
      "MHR calculator",
      "fitness zones",
      "cardio zones",
      "heart rate training",
      "zone training",
      "heart rate intensity",
      "exercise intensity zones",
    ],
    locale,
    canonical: `${getServerUrl()}/${locale}/tools/heart-rate-zones`,
    structuredData: {
      type: "Calculator",
      calculatorData: {
        calculatorType: "heart-rate-zones",
        inputFields: ["age", "resting heart rate", "maximum heart rate", "calculation method"],
        outputFields: [
          "Maximum Heart Rate (MHR)",
          "Target Heart Rate (THR)",
          "VO2 Max Zone",
          "Anaerobic Zone",
          "Aerobic Zone",
          "Fat Burn Zone",
          "Warm Up Zone",
          "Heart Rate Reserve (HRR)",
        ],
        formula: "Basic: THR = MHR × %Intensity | Karvonen: THR = [(MHR - RHR) × %Intensity] + RHR",
        accuracy: "Scientifically validated formulas with personalized zone calculations",
        targetAudience: [
          "athletes",
          "fitness enthusiasts",
          "runners",
          "cyclists",
          "personal trainers",
          "health conscious individuals",
          "cardio training practitioners",
        ],
        relatedCalculators: ["bmi-calculator", "calorie-calculator", "macro-calculator"],
      },
    },
  });
}

export default async function HeartRateZonesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getI18n();

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/heart-rate-zones`}
        description={t("tools.heart-rate-zones.meta.description")}
        locale={locale}
        structuredData={{
          type: "Calculator",
          calculatorData: {
            calculatorType: "heart-rate-zones",
            inputFields: ["age", "resting heart rate", "calculation method"],
            outputFields: ["Maximum Heart Rate", "Target Heart Rate Zones", "Training Recommendations"],
            formula: "MHR = 220 - Age | THR = MHR × %Intensity",
            accuracy: "Standard formulas with personalized recommendations",
            targetAudience: ["athletes", "fitness enthusiasts", "health conscious individuals"],
            relatedCalculators: ["bmi-calculator", "calorie-calculator"],
          },
        }}
        title={t("tools.heart-rate-zones.meta.title")}
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Simple animated hearts background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-10 animate-bounce">❤️</div>
          <div className="absolute top-40 right-20 text-5xl opacity-10 animate-bounce" style={{ animationDelay: "0.5s" }}>
            💙
          </div>
          <div className="absolute bottom-20 left-1/3 text-7xl opacity-10 animate-bounce" style={{ animationDelay: "1s" }}>
            💚
          </div>
          <div className="absolute bottom-40 right-10 text-6xl opacity-10 animate-bounce" style={{ animationDelay: "1.5s" }}>
            💛
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
          {/* Ultra-simple header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.page_title")}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t("tools.heart-rate-zones.page_description")}</p>
          </div>

          {/* Calculator */}
          <SimpleHeartRateCalculator />

          {/* Educational Content */}
          <div className="mt-16">
            <HeartRateEducationalContent />
          </div>
        </div>
      </div>
    </>
  );
}
