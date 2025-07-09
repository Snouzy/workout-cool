import { Locale } from "locales/types";

interface PageContent {
  heroSubtitle: string;
}

// Page content separate from SEO metadata
export const HEART_RATE_ZONES_CONTENT: Record<Locale, PageContent> = {
  en: {
    heroSubtitle: "Discover your personalized training zones to optimize performance, burn more fat, and improve cardiovascular fitness",
  },
  es: {
    heroSubtitle:
      "Descubre tus zonas de entrenamiento personalizadas para optimizar el rendimiento, quemar más grasa y mejorar tu condición cardiovascular",
  },
  fr: {
    heroSubtitle:
      "Découvrez vos zones d'entraînement personnalisées pour optimiser vos performances, brûler plus de graisses et améliorer votre condition cardiovasculaire",
  },
  pt: {
    heroSubtitle:
      "Descubra suas zonas de treino personalizadas para otimizar o desempenho, queimar mais gordura e melhorar sua condição cardiovascular",
  },
  ru: {
    heroSubtitle:
      "Откройте персональные тренировочные зоны для оптимизации результатов, сжигания жира и улучшения сердечно-сосудистой системы",
  },
  "zh-CN": {
    heroSubtitle: "发现您的个性化训练区间，优化运动表现，燃烧更多脂肪，改善心血管健康",
  },
};
