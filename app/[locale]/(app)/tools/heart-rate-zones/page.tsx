import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { calculateHeartRateZones } from "app/[locale]/(app)/tools/heart-rate-zones/shared/server-calculations";
import { SEOFriendlyHeartRateCalculator } from "app/[locale]/(app)/tools/heart-rate-zones/shared/SEOFriendlyHeartRateCalculator";
import { SimpleEducationalContent } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/SimpleEducationalContent";
import { SEOOptimizedContent } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/SEOOptimizedContent";
import { getServerUrl } from "@/shared/lib/server-url";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: "Calculateur de Zones de Fréquence Cardiaque - FCM & Zones d'Entraînement",
    description:
      "Calculez vos zones de fréquence cardiaque personnalisées avec notre calculateur gratuit. Formules Basic & Karvonen, tableau par âge, guide complet pour optimiser vos entraînements cardio.",
    keywords: [
      "calculateur zones fréquence cardiaque",
      "calcul FCM",
      "zones cardiaques entraînement",
      "fréquence cardiaque maximale",
      "formule Karvonen",
      "zone combustion graisses",
      "zone aérobie",
      "zone anaérobie",
      "VO2 max zone",
      "calculateur THR",
      "target heart rate",
      "zones cardio training",
      "fréquence cardiaque repos",
      "heart rate zones calculator",
      "entraînement par zones",
      "cardio zones personnalisées",
      "FCM par âge",
      "intensité exercice",
      "zones effort cardiaque",
      "calculateur fitness gratuit",
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
          "VO2 Max Zone (90-100%)",
          "Anaerobic Zone (80-90%)",
          "Aerobic Zone (70-80%)",
          "Fat Burn Zone (60-70%)",
          "Warm Up Zone (50-60%)",
          "Heart Rate Reserve (HRR)",
        ],
        formula: "Basic: THR = MHR × %Intensity | Karvonen: THR = [(MHR - RHR) × %Intensity] + RHR",
        accuracy: "Formules scientifiquement validées avec calculs personnalisés selon l'âge et la FCR",
        targetAudience: [
          "sportifs",
          "coureurs",
          "cyclistes",
          "pratiquants fitness",
          "coachs sportifs",
          "débutants en cardio",
          "athlètes d'endurance",
          "personnes en perte de poids",
        ],
        relatedCalculators: ["bmi-calculator", "calorie-calculator", "macro-calculator"],
      },
    },
  });
}

export default async function HeartRateZonesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getI18n();

  // Calculate default results for SSR (age 30)
  const defaultAge = 30;
  const defaultResults = calculateHeartRateZones(defaultAge, t);

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/heart-rate-zones`}
        description="Calculez vos zones de fréquence cardiaque personnalisées avec notre calculateur gratuit. Formules Basic & Karvonen, tableau par âge, guide complet pour optimiser vos entraînements cardio."
        locale={locale}
        structuredData={{
          type: "Calculator",
          calculatorData: {
            calculatorType: "heart-rate-zones",
            inputFields: ["age", "resting heart rate", "maximum heart rate", "calculation method"],
            outputFields: [
              "Maximum Heart Rate (FCM)",
              "Zone 1: Échauffement (50-60%)",
              "Zone 2: Combustion des graisses (60-70%)",
              "Zone 3: Aérobie (70-80%)",
              "Zone 4: Anaérobie (80-90%)",
              "Zone 5: VO2 Max (90-100%)",
            ],
            formula: "Basic: THR = MHR × %Intensity | Karvonen: THR = [(MHR - RHR) × %Intensity] + RHR",
            accuracy: "Formules scientifiquement validées avec personnalisation selon l'âge et la FCR",
            targetAudience: ["sportifs", "coureurs", "cyclistes", "pratiquants fitness", "coachs sportifs"],
            relatedCalculators: ["bmi-calculator", "calorie-calculator", "macro-calculator"],
          },
        }}
        title="Calculateur de Zones de Fréquence Cardiaque - FCM & Zones d'Entraînement"
      />

      {/* Additional structured data for better SEO */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Calculateur de Zones de Fréquence Cardiaque",
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "13",
              bestRating: "5",
              worstRating: "1",
            },
            author: {
              "@type": "Organization",
              name: "WorkoutCool",
            },
            datePublished: "2024-01-01",
            dateModified: new Date().toISOString().split("T")[0],
            description:
              "Calculateur gratuit de zones de fréquence cardiaque avec formules Basic et Karvonen. Optimisez vos entraînements cardio.",
            screenshot: `${getServerUrl()}/images/heart-rate-zones-calculator-screenshot.jpg`,
            featureList: [
              "Calcul de la fréquence cardiaque maximale (FCM)",
              "5 zones d'entraînement personnalisées",
              "Formules Basic et Karvonen",
              "Tableau de référence par âge",
              "Guide complet d'entraînement",
              "Interface ludique et intuitive",
            ],
          }),
        }}
        type="application/ld+json"
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
          {/* SEO-optimized header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Calculateur de Zones de Fréquence Cardiaque
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Découvrez vos zones d'entraînement personnalisées pour optimiser vos performances, brûler plus de graisses et améliorer votre
              condition cardiovasculaire
            </p>
          </div>

          {/* Calculator */}
          <SEOFriendlyHeartRateCalculator defaultAge={defaultAge} defaultResults={defaultResults} />

          {/* Educational Content */}
          <div className="mt-16">
            <SimpleEducationalContent />
            <SEOOptimizedContent />
          </div>
        </div>
      </div>
    </>
  );
}
