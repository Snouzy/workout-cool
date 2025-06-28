/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import React from "react";

import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";
import { getLocalizedMetadata } from "@/shared/config/localized-metadata";

export interface StructuredDataProps {
  type: "WebSite" | "WebApplication" | "Organization" | "SoftwareApplication" | "Article" | "Course" | "VideoObject";
  locale?: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  // Course-specific fields
  courseData?: {
    id: string;
    level: string;
    category: string;
    durationWeeks: number;
    sessionsPerWeek: number;
    sessionDurationMin: number;
    equipment: string[];
    isPremium: boolean;
    participantCount: number;
    totalSessions: number;
    totalExercises: number;
    coaches: Array<{
      name: string;
      image: string;
    }>;
  };
  // Session/VideoObject-specific fields
  sessionData?: {
    duration: number;
    exercises: Array<{ name: string; sets: number }>;
    thumbnailUrl?: string;
    videoUrl?: string;
  };
}

export function generateStructuredData({
  type,
  locale = "en",
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  courseData,
  sessionData,
}: StructuredDataProps) {
  const baseUrl = getServerUrl();
  const localizedData = getLocalizedMetadata(locale);

  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    url: url || baseUrl,
    name: title || localizedData.title,
    description: description || localizedData.description,
    inLanguage:
      locale === "en"
        ? "en-US"
        : locale === "es"
          ? "es-ES"
          : locale === "pt"
            ? "pt-PT"
            : locale === "ru"
              ? "ru-RU"
              : locale === "zh-CN"
                ? "zh-CN"
                : "fr-FR",
    publisher: {
      "@type": "Organization",
      name: SiteConfig.company.name,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
    },
  };

  switch (type) {
    case "WebSite":
      return {
        ...baseStructuredData,
        "@type": "WebSite",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        sameAs: [SiteConfig.maker.twitter, `${baseUrl}`],
      };

    case "WebApplication":
      return {
        ...baseStructuredData,
        "@type": "WebApplication",
        applicationCategory: "HealthAndFitnessApplication",
        operatingSystem: "Web Browser",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.2.1",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList:
          locale === "en"
            ? [
                "Personalized workout builder",
                "Comprehensive exercise database",
                "Progress tracking",
                "Muscle group targeting",
                "Equipment-based filtering",
              ]
            : locale === "es"
              ? [
                  "Constructor de entrenamientos personalizado",
                  "Base de datos completa de ejercicios",
                  "Seguimiento de progreso",
                  "Orientación a grupos musculares",
                  "Filtrado basado en equipos",
                ]
              : locale === "pt"
                ? [
                    "Construtor de treinos personalizado",
                    "Base de dados abrangente de exercícios",
                    "Acompanhamento de progresso",
                    "Segmentação de grupos musculares",
                    "Filtragem baseada em equipamentos",
                  ]
                : locale === "ru"
                  ? [
                      "Персонализированный конструктор тренировок",
                      "Полная база данных упражнений",
                      "Отслеживание прогресса",
                      "Нацеливание на группы мышц",
                      "Фильтрация по оборудованию",
                    ]
                  : locale === "zh-CN"
                    ? ["个性化锻炼计划构建器", "全面的运动数据库", "进度跟踪", "肌肉群目标定位", "基于设备的筛选"]
                    : [
                        "Créateur d'entraînement personnalisé",
                        "Base de données d'exercices complète",
                        "Suivi des progrès",
                        "Ciblage des groupes musculaires",
                        "Filtrage par équipement",
                      ],
      };

    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SiteConfig.company.name,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
          width: 512,
          height: 512,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
          streetAddress: SiteConfig.company.address,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+33-1-00-00-00-00",
          contactType: "customer service",
          availableLanguage: ["French", "English", "Spanish", "Portuguese", "Russian", "Chinese"],
        },
        sameAs: [SiteConfig.maker.twitter],
        foundingDate: "2024",
        description: localizedData.description,
      };

    case "SoftwareApplication":
      return {
        ...baseStructuredData,
        "@type": "SoftwareApplication",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        downloadUrl: baseUrl,
        softwareVersion: "1.2.1",
        releaseNotes:
          locale === "en"
            ? "Latest update includes improved exercise database and better user experience"
            : locale === "es"
              ? "La última actualización incluye una base de datos de ejercicios mejorada y una mejor experiencia de usuario"
              : locale === "pt"
                ? "A atualização mais recente inclui base de dados de exercícios melhorada e melhor experiência do usuário"
                : locale === "ru"
                  ? "Последнее обновление включает улучшенную базу данных упражнений и лучший пользовательский опыт"
                  : locale === "zh-CN"
                    ? "最新更新包括改进的运动数据库和更好的用户体验"
                    : "La dernière mise à jour inclut une base de données d'exercices améliorée et une meilleure expérience utilisateur",
        screenshot: image || `${baseUrl}/images/default-og-image_${locale}.jpg`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "127",
        },
      };

    case "Article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        url: url,
        author: {
          "@type": "Person",
          name: author || SiteConfig.company.name,
        },
        publisher: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        datePublished: datePublished || new Date().toISOString(),
        dateModified: dateModified || new Date().toISOString(),
        image: image || `${baseUrl}/images/default-og-image_${locale}.jpg`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      };

    case "Course":
      if (!courseData) return baseStructuredData;

      const difficultyLevel =
        courseData.level === "BEGINNER" ? "Beginner" : courseData.level === "INTERMEDIATE" ? "Intermediate" : "Advanced";

      const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: title || baseStructuredData.name,
        description: description || baseStructuredData.description,
        url: url || baseUrl,
        image: image || `${baseUrl}/images/default-og-image_${locale === "zh-CN" ? "zh" : locale}.jpg`,
        provider: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          url: baseUrl,
        },
        educationalLevel: difficultyLevel,
        teaches:
          locale === "en"
            ? "Fitness and workout techniques"
            : locale === "es"
              ? "Técnicas de fitness y entrenamiento"
              : locale === "pt"
                ? "Técnicas de fitness e treino"
                : locale === "ru"
                  ? "Фитнес и техники тренировок"
                  : locale === "zh-CN"
                    ? "健身和锻炼技巧"
                    : "Techniques de fitness et d'entraînement",
        courseCode: courseData.id,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseSchedule: {
            "@type": "Schedule",
            duration: `P${courseData.durationWeeks}W`,
            repeatFrequency: "P1W",
            repeatCount: courseData.durationWeeks,
          },
          instructor: courseData.coaches.map((coach) => ({
            "@type": "Person",
            name: coach.name,
            image: coach.image,
          })),
        },
        totalTime: `PT${courseData.sessionDurationMin * courseData.totalSessions}M`,
        numberOfCredits: courseData.totalExercises,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.7",
          ratingCount: Math.max(courseData.participantCount, 10),
          bestRating: "5",
          worstRating: "1",
        },
        offers: {
          "@type": "Offer",
          price: courseData.isPremium ? "7.90" : "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          category: courseData.isPremium ? "Premium" : "Free",
        },
        keywords: [courseData.category, difficultyLevel, "fitness", "workout", "training", ...courseData.equipment].join(", "),
        inLanguage:
          locale === "en"
            ? "en-US"
            : locale === "es"
              ? "es-ES"
              : locale === "pt"
                ? "pt-PT"
                : locale === "ru"
                  ? "ru-RU"
                  : locale === "zh-CN"
                    ? "zh-CN"
                    : "fr-FR",
        isAccessibleForFree: !courseData.isPremium,
        syllabusSections: [
          {
            "@type": "Syllabus",
            name:
              locale === "en"
                ? `${courseData.totalSessions} workout sessions`
                : locale === "es"
                  ? `${courseData.totalSessions} sesiones de entrenamiento`
                  : locale === "pt"
                    ? `${courseData.totalSessions} sessões de treino`
                    : locale === "ru"
                      ? `${courseData.totalSessions} тренировочных сессий`
                      : locale === "zh-CN"
                        ? `${courseData.totalSessions} 训练课程`
                        : `${courseData.totalSessions} séances d'entraînement`,
            description:
              locale === "en"
                ? `Complete ${courseData.durationWeeks}-week program with ${courseData.sessionsPerWeek} sessions per week`
                : locale === "es"
                  ? `Programa completo de ${courseData.durationWeeks} semanas con ${courseData.sessionsPerWeek} sesiones por semana`
                  : locale === "pt"
                    ? `Programa completo de ${courseData.durationWeeks} semanas com ${courseData.sessionsPerWeek} sessões por semana`
                    : locale === "ru"
                      ? `Полная программа на ${courseData.durationWeeks} недель с ${courseData.sessionsPerWeek} сессиями в неделю`
                      : locale === "zh-CN"
                        ? `${courseData.durationWeeks}周完整计划，每周${courseData.sessionsPerWeek}次训练`
                        : `Programme complet de ${courseData.durationWeeks} semaines avec ${courseData.sessionsPerWeek} séances par semaine`,
          },
        ],
      };

      return courseSchema;

    case "VideoObject":
      if (!sessionData) return baseStructuredData;

      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title || baseStructuredData.name,
        description: description || baseStructuredData.description,
        thumbnailUrl: sessionData.thumbnailUrl || image || `${baseUrl}/images/default-workout.jpg`,
        contentUrl: sessionData.videoUrl,
        duration: `PT${sessionData.duration}M`,
        uploadDate: new Date().toISOString(),
        publisher: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        potentialAction: {
          "@type": "WatchAction",
          target: url || baseUrl,
        },
        genre: "Fitness",
        keywords: [
          locale === "en" ? "workout session" : 
          locale === "es" ? "sesión de entrenamiento" :
          locale === "pt" ? "sessão de treino" :
          locale === "ru" ? "тренировочная сессия" :
          locale === "zh-CN" ? "训练课程" : "séance d'entraînement",
          "fitness", "exercise", "training"
        ].join(", "),
        inLanguage: locale === "en" ? "en-US" : 
                   locale === "es" ? "es-ES" :
                   locale === "pt" ? "pt-PT" :
                   locale === "ru" ? "ru-RU" :
                   locale === "zh-CN" ? "zh-CN" : "fr-FR",
        embedUrl: url,
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: Math.floor(Math.random() * 1000) + 100,
        },
      };

    default:
      return baseStructuredData;
  }
}

export function StructuredDataScript({ data }: { data: object }) {
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  });
}
