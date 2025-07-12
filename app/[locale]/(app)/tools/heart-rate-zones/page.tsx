import React from "react";
import { Metadata } from "next";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { HeartRateZonesCalculatorClient } from "app/[locale]/(app)/tools/heart-rate-zones/ui/HeartRateZonesCalculatorClient";
import { SEOOptimizedContentServer } from "app/[locale]/(app)/tools/heart-rate-zones/ui/components/SEOOptimizedContentServer";
import { EducationalContentServer } from "app/[locale]/(app)/tools/heart-rate-zones/ui/components/EducationalContentServer";
import { HEART_RATE_ZONES_CONTENT } from "app/[locale]/(app)/tools/heart-rate-zones/seo/page-content";
import { HEART_RATE_ZONES_SEO } from "app/[locale]/(app)/tools/heart-rate-zones/seo/config";
import { calculateHeartRateZones } from "app/[locale]/(app)/tools/heart-rate-zones/lib/utils";
import { getServerUrl } from "@/shared/lib/server-url";
import { env } from "@/env";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  // Use centralized SEO config
  const metadata = HEART_RATE_ZONES_SEO[locale] || HEART_RATE_ZONES_SEO.en;

  return generateSEOMetadata({
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
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
        accuracy: "Scientifically validated formulas with personalized calculations",
        targetAudience: ["athletes", "runners", "cyclists", "fitness enthusiasts", "personal trainers"],
        relatedCalculators: ["bmi-calculator", "calorie-calculator", "macro-calculator"],
      },
    },
  });
}

const DEFAULT_AGE = 30;
export default async function HeartRateZonesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getI18n();

  const defaultResults = calculateHeartRateZones(DEFAULT_AGE, t);

  // Use centralized configs
  const seoContent = HEART_RATE_ZONES_SEO[locale] || HEART_RATE_ZONES_SEO.en;
  const pageContent = HEART_RATE_ZONES_CONTENT[locale] || HEART_RATE_ZONES_CONTENT.en;

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/heart-rate-zones`}
        description={seoContent.description}
        hreflangPath="/tools/heart-rate-zones"
        locale={locale}
        ogImage={`${getServerUrl()}/images/screenshots/heart-rate-zones/og.jpg`}
        structuredData={{
          type: "Calculator",
          calculatorData: {
            calculatorType: "heart-rate-zones",
            inputFields: ["age", "resting heart rate", "maximum heart rate", "calculation method"],
            outputFields: [
              "Maximum Heart Rate (MHR)",
              "Zone 1: Warm Up (50-60%)",
              "Zone 2: Fat Burn (60-70%)",
              "Zone 3: Aerobic (70-80%)",
              "Zone 4: Anaerobic (80-90%)",
              "Zone 5: VO2 Max (90-100%)",
            ],
            formula: "Basic: THR = MHR × %Intensity | Karvonen: THR = [(MHR - RHR) × %Intensity] + RHR",
            accuracy: "Scientifically validated formulas with personalized calculations",
            targetAudience: ["athletes", "runners", "cyclists", "fitness enthusiasts", "personal trainers"],
            relatedCalculators: ["bmi-calculator", "calorie-calculator", "macro-calculator"],
          },
        }}
        title={seoContent.title}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: seoContent.title,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: locale === "ru" ? "RUB" : locale === "zh-CN" ? "CNY" : locale === "en" ? "USD" : "EUR",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "13",
              bestRating: "5",
              worstRating: "3",
            },
            author: {
              "@type": "Organization",
              name: "WorkoutCool",
            },
            datePublished: "2024-01-01",
            dateModified: new Date().toISOString().split("T")[0],
            description: seoContent.description,
            screenshot: `${getServerUrl()}/images/screenshots/heart-rate-zones/${locale}.jpg`,
            featureList: [
              "Heart rate zones calculation",
              "5 personalized training zones",
              "Basic & Karvonen formulas",
              "Age-based reference chart",
              "Complete training guide",
              "User-friendly interface",
            ],
          }),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: seoContent.title,
            description: seoContent.description,
            image: {
              "@type": "ImageObject",
              url: `${getServerUrl()}/images/screenshots/heart-rate-zones/og.jpg`,
              width: 1200,
              height: 630,
            },
            datePublished: "2024-01-01",
            dateModified: new Date().toISOString(),
            author: {
              "@type": "Organization",
              name: "WorkoutCool",
              url: getServerUrl(),
            },
            publisher: {
              "@type": "Organization",
              name: "WorkoutCool",
              logo: {
                "@type": "ImageObject",
                url: `${getServerUrl()}/logo.png`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${getServerUrl()}/${locale}/tools/heart-rate-zones`,
            },
            articleSection: "Health & Fitness",
            keywords: seoContent.keywords,
            about: {
              "@type": "Thing",
              name: "Heart Rate Training Zones",
              description: "Scientific method for optimizing cardiovascular training through personalized heart rate zones",
            },
            educationalLevel: "Beginner to Advanced",
            learningResourceType: "Calculator and Guide",
            isAccessibleForFree: true,
            inLanguage: locale,
          }),
        }}
        type="application/ld+json"
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        {env.NEXT_PUBLIC_TOP_HEART_ZONES_BANNER_AD_SLOT && <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_HEART_ZONES_BANNER_AD_SLOT} />}
        <div className="container mx-auto px-2 sm:px-4 py-6 max-w-4xl relative z-10">
          {/* SEO-optimized header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{seoContent.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{pageContent.heroSubtitle}</p>
          </div>

          {/* Calculator */}
          <HeartRateZonesCalculatorClient defaultAge={DEFAULT_AGE} defaultResults={defaultResults} />
          {/* Educational Content */}
          <div className="mt-16">
            <EducationalContentServer />
            <SEOOptimizedContentServer />
          </div>
        </div>
        {env.NEXT_PUBLIC_BOTTOM_HEART_ZONES_BANNER_AD_SLOT && (
          <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_HEART_ZONES_BANNER_AD_SLOT} />
        )}
      </div>
    </>
  );
}
