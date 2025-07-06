import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { HeartRateZonesCalculatorClient } from "app/[locale]/(app)/tools/heart-rate-zones/shared/HeartRateZonesCalculatorClient";
import { HeartRateEducationalContent } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/HeartRateEducationalContent";
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
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 dark:from-base-300 dark:via-base-200 dark:to-base-300">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl relative z-10">
          {/* Gamified Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <span className="text-2xl">❤️</span>
              <span className="font-semibold">Calculateur Interactif</span>
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("tools.heart-rate-zones.page_title")}
            </h1>
            <p className="text-lg text-base-content/70 dark:text-base-content/60">
              {t("tools.heart-rate-zones.page_description")}
            </p>
          </div>

          {/* Calculator */}
          <HeartRateZonesCalculatorClient />

          {/* Educational Content */}
          <div className="mt-16">
            <HeartRateEducationalContent />
          </div>
        </div>
      </div>
    </>
  );
}