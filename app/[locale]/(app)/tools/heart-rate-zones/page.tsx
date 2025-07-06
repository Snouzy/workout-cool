import React from "react";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { calculateHeartRateZones } from "app/[locale]/(app)/tools/heart-rate-zones/shared/server-calculations";
import { SEOFriendlyHeartRateCalculator } from "app/[locale]/(app)/tools/heart-rate-zones/shared/SEOFriendlyHeartRateCalculator";
import { SimpleEducationalContent } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/SimpleEducationalContent";
import { SEOOptimizedContent } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/SEOOptimizedContent";
import { InternationalSEOContent } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/InternationalSEOContent";
import { getServerUrl } from "@/shared/lib/server-url";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  // Localized metadata based on locale
  const getLocalizedMetadata = () => {
    switch (locale) {
      case "en":
        return {
          title: "Heart Rate Zones Calculator - Target Heart Rate & Training Zones",
          description:
            "Calculate your personalized heart rate training zones with our free calculator. Basic & Karvonen formulas, age-based chart, complete guide to optimize your cardio workouts.",
          keywords: [
            "heart rate zones calculator",
            "target heart rate calculator",
            "maximum heart rate",
            "training zones",
            "VO2 max zone",
            "anaerobic zone",
            "aerobic zone",
            "fat burn zone",
            "Karvonen formula",
            "heart rate training",
            "THR calculator",
            "MHR calculator",
            "cardio zones",
            "fitness calculator",
            "heart rate by age",
            "exercise intensity zones",
            "cardio training zones",
            "heart rate reserve",
            "personalized heart rate zones",
            "free fitness calculator",
          ],
          targetAudience: [
            "athletes",
            "runners",
            "cyclists",
            "fitness enthusiasts",
            "personal trainers",
            "cardio beginners",
            "endurance athletes",
            "weight loss seekers",
          ],
        };
      case "es":
        return {
          title: "Calculadora de Zonas de Frecuencia Cardíaca - FC Máxima y Zonas de Entrenamiento",
          description:
            "Calcula tus zonas de frecuencia cardíaca personalizadas con nuestra calculadora gratuita. Fórmulas Basic y Karvonen, tabla por edad, guía completa para optimizar tu cardio.",
          keywords: [
            "calculadora zonas frecuencia cardiaca",
            "frecuencia cardiaca objetivo",
            "frecuencia cardiaca máxima",
            "zonas entrenamiento",
            "zona VO2 max",
            "zona anaeróbica",
            "zona aeróbica",
            "zona quema grasa",
            "fórmula Karvonen",
            "entrenamiento frecuencia cardiaca",
            "calculadora FCM",
            "zonas cardio",
            "calculadora fitness",
            "frecuencia cardiaca por edad",
            "zonas intensidad ejercicio",
            "zonas entrenamiento cardio",
            "reserva frecuencia cardiaca",
            "zonas personalizadas",
            "calculadora fitness gratis",
          ],
          targetAudience: [
            "deportistas",
            "corredores",
            "ciclistas",
            "entusiastas fitness",
            "entrenadores personales",
            "principiantes cardio",
            "atletas resistencia",
            "personas perdiendo peso",
          ],
        };
      case "fr":
        return {
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
        };
      case "pt":
        return {
          title: "Calculadora de Zonas de Frequência Cardíaca - FC Máxima e Zonas de Treino",
          description:
            "Calcule suas zonas de frequência cardíaca personalizadas com nossa calculadora gratuita. Fórmulas Basic e Karvonen, tabela por idade, guia completo para otimizar seu treino cardio.",
          keywords: [
            "calculadora zonas frequência cardíaca",
            "frequência cardíaca alvo",
            "frequência cardíaca máxima",
            "zonas treino",
            "zona VO2 max",
            "zona anaeróbica",
            "zona aeróbica",
            "zona queima gordura",
            "fórmula Karvonen",
            "treino frequência cardíaca",
            "calculadora FCM",
            "zonas cardio",
            "calculadora fitness",
            "frequência cardíaca por idade",
            "zonas intensidade exercício",
            "zonas treino cardio",
            "reserva frequência cardíaca",
            "zonas personalizadas",
            "calculadora fitness grátis",
          ],
          targetAudience: [
            "atletas",
            "corredores",
            "ciclistas",
            "entusiastas fitness",
            "personal trainers",
            "iniciantes cardio",
            "atletas resistência",
            "pessoas emagrecendo",
          ],
        };
      case "ru":
        return {
          title: "Калькулятор Зон Пульса - Целевой Пульс и Тренировочные Зоны",
          description:
            "Рассчитайте персональные зоны пульса с помощью нашего бесплатного калькулятора. Формулы Basic и Карвонена, таблица по возрасту, полное руководство для оптимизации кардио тренировок.",
          keywords: [
            "калькулятор зон пульса",
            "целевой пульс",
            "максимальный пульс",
            "тренировочные зоны",
            "зона VO2 max",
            "анаэробная зона",
            "аэробная зона",
            "зона жиросжигания",
            "формула Карвонена",
            "тренировка по пульсу",
            "калькулятор ЧСС",
            "кардио зоны",
            "фитнес калькулятор",
            "пульс по возрасту",
            "зоны интенсивности",
            "зоны кардио тренировок",
            "резерв ЧСС",
            "персональные зоны",
            "бесплатный калькулятор",
          ],
          targetAudience: [
            "спортсмены",
            "бегуны",
            "велосипедисты",
            "любители фитнеса",
            "персональные тренеры",
            "новички в кардио",
            "атлеты на выносливость",
            "худеющие",
          ],
        };
      case "zh-CN":
        return {
          title: "心率区间计算器 - 目标心率和训练区间",
          description: "使用我们的免费计算器计算您的个性化心率训练区间。Basic和Karvonen公式，按年龄分类表，优化有氧运动的完整指南。",
          keywords: [
            "心率区间计算器",
            "目标心率",
            "最大心率",
            "训练区间",
            "VO2最大值区间",
            "无氧区间",
            "有氧区间",
            "燃脂区间",
            "Karvonen公式",
            "心率训练",
            "心率计算器",
            "有氧区间",
            "健身计算器",
            "年龄心率",
            "运动强度区间",
            "有氧训练区间",
            "心率储备",
            "个性化区间",
            "免费健身计算器",
          ],
          targetAudience: ["运动员", "跑步者", "骑行者", "健身爱好者", "私人教练", "有氧运动初学者", "耐力运动员", "减肥人群"],
        };
      default:
        return {
          title: "Heart Rate Zones Calculator",
          description: "Calculate your personalized heart rate training zones",
          keywords: ["heart rate zones", "calculator", "fitness"],
          targetAudience: ["athletes", "fitness enthusiasts"],
        };
    }
  };

  const metadata = getLocalizedMetadata();

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
        accuracy:
          locale === "fr"
            ? "Formules scientifiquement validées avec calculs personnalisés selon l'âge et la FCR"
            : "Scientifically validated formulas with personalized calculations",
        targetAudience: metadata.targetAudience,
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

  // Get localized content
  const getLocalizedContent = () => {
    switch (locale) {
      case "en":
        return {
          title: "Heart Rate Zones Calculator",
          subtitle: "Discover your personalized training zones to optimize performance, burn more fat, and improve cardiovascular fitness",
          description:
            "Calculate your personalized heart rate training zones with our free calculator. Basic & Karvonen formulas, age-based chart, complete guide to optimize your cardio workouts.",
        };
      case "es":
        return {
          title: "Calculadora de Zonas de Frecuencia Cardíaca",
          subtitle:
            "Descubre tus zonas de entrenamiento personalizadas para optimizar el rendimiento, quemar más grasa y mejorar tu condición cardiovascular",
          description:
            "Calcula tus zonas de frecuencia cardíaca personalizadas con nuestra calculadora gratuita. Fórmulas Basic y Karvonen, tabla por edad, guía completa para optimizar tu cardio.",
        };
      case "fr":
        return {
          title: "Calculateur de Zones de Fréquence Cardiaque",
          subtitle:
            "Découvrez vos zones d'entraînement personnalisées pour optimiser vos performances, brûler plus de graisses et améliorer votre condition cardiovasculaire",
          description:
            "Calculez vos zones de fréquence cardiaque personnalisées avec notre calculateur gratuit. Formules Basic & Karvonen, tableau par âge, guide complet pour optimiser vos entraînements cardio.",
        };
      case "pt":
        return {
          title: "Calculadora de Zonas de Frequência Cardíaca",
          subtitle:
            "Descubra suas zonas de treino personalizadas para otimizar o desempenho, queimar mais gordura e melhorar sua condição cardiovascular",
          description:
            "Calcule suas zonas de frequência cardíaca personalizadas com nossa calculadora gratuita. Fórmulas Basic e Karvonen, tabela por idade, guia completo para otimizar seu treino cardio.",
        };
      case "ru":
        return {
          title: "Калькулятор Зон Пульса",
          subtitle:
            "Откройте персональные тренировочные зоны для оптимизации результатов, сжигания жира и улучшения сердечно-сосудистой системы",
          description:
            "Рассчитайте персональные зоны пульса с помощью нашего бесплатного калькулятора. Формулы Basic и Карвонена, таблица по возрасту, полное руководство для оптимизации кардио тренировок.",
        };
      case "zh-CN":
        return {
          title: "心率区间计算器",
          subtitle: "发现您的个性化训练区间，优化运动表现，燃烧更多脂肪，改善心血管健康",
          description: "使用我们的免费计算器计算您的个性化心率训练区间。Basic和Karvonen公式，按年龄分类表，优化有氧运动的完整指南。",
        };
      default:
        return {
          title: "Heart Rate Zones Calculator",
          subtitle: "Discover your personalized training zones",
          description: "Calculate your personalized heart rate training zones",
        };
    }
  };

  const content = getLocalizedContent();

  return (
    <>
      <SEOScripts
        canonical={`${getServerUrl()}/${locale}/tools/heart-rate-zones`}
        description={content.description}
        locale={locale}
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
        title={content.title}
      />

      {/* Hreflang tags for international SEO */}
      <link href={`${getServerUrl()}/en/tools/heart-rate-zones`} hrefLang="en" rel="alternate" />
      <link href={`${getServerUrl()}/es/tools/heart-rate-zones`} hrefLang="es" rel="alternate" />
      <link href={`${getServerUrl()}/fr/tools/heart-rate-zones`} hrefLang="fr" rel="alternate" />
      <link href={`${getServerUrl()}/pt/tools/heart-rate-zones`} hrefLang="pt" rel="alternate" />
      <link href={`${getServerUrl()}/ru/tools/heart-rate-zones`} hrefLang="ru" rel="alternate" />
      <link href={`${getServerUrl()}/zh-CN/tools/heart-rate-zones`} hrefLang="zh-CN" rel="alternate" />
      <link href={`${getServerUrl()}/en/tools/heart-rate-zones`} hrefLang="x-default" rel="alternate" />

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
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{content.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{content.subtitle}</p>
          </div>

          {/* Calculator */}
          <SEOFriendlyHeartRateCalculator defaultAge={defaultAge} defaultResults={defaultResults} />

          {/* Educational Content */}
          <div className="mt-16">
            <InternationalSEOContent />
            <SimpleEducationalContent />
            <SEOOptimizedContent />
          </div>
        </div>
      </div>
    </>
  );
}
