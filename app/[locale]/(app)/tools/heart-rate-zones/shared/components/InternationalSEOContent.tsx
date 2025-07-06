"use client";

import React from "react";

import { useCurrentLocale } from "locales/client";

export function InternationalSEOContent() {
  const locale = useCurrentLocale();

  // Localized content based on locale
  const getLocalizedContent = () => {
    switch (locale) {
      case "en":
        return {
          heroTitle: "Heart Rate Zones Calculator",
          heroSubtitle:
            "Discover your personalized training zones to optimize performance, burn more fat, and improve cardiovascular fitness",
          ctaButton: "Calculate My Zones Now",
          benefitTitle1: "Science-Based Training",
          benefitDesc1: "Use proven formulas (Basic & Karvonen) to calculate your exact heart rate zones",
          benefitTitle2: "Personalized Results",
          benefitDesc2: "Get customized zones based on your age, resting heart rate, and fitness level",
          benefitTitle3: "Complete Training Guide",
          benefitDesc3: "Learn how to use each zone effectively with our comprehensive training guide",
        };
      case "es":
        return {
          heroTitle: "Calculadora de Zonas de Frecuencia Cardíaca",
          heroSubtitle:
            "Descubre tus zonas de entrenamiento personalizadas para optimizar el rendimiento, quemar más grasa y mejorar tu condición cardiovascular",
          ctaButton: "Calcular Mis Zonas Ahora",
          benefitTitle1: "Entrenamiento Basado en Ciencia",
          benefitDesc1: "Usa fórmulas probadas (Basic y Karvonen) para calcular tus zonas exactas de frecuencia cardíaca",
          benefitTitle2: "Resultados Personalizados",
          benefitDesc2: "Obtén zonas personalizadas según tu edad, frecuencia cardíaca en reposo y nivel de fitness",
          benefitTitle3: "Guía Completa de Entrenamiento",
          benefitDesc3: "Aprende a usar cada zona efectivamente con nuestra guía completa de entrenamiento",
        };
      case "fr":
        return {
          heroTitle: "Calculateur de Zones de Fréquence Cardiaque",
          heroSubtitle:
            "Découvrez vos zones d'entraînement personnalisées pour optimiser vos performances, brûler plus de graisses et améliorer votre condition cardiovasculaire",
          ctaButton: "Calculer Mes Zones Maintenant",
          benefitTitle1: "Entraînement Basé sur la Science",
          benefitDesc1: "Utilisez des formules éprouvées (Basic et Karvonen) pour calculer vos zones exactes de fréquence cardiaque",
          benefitTitle2: "Résultats Personnalisés",
          benefitDesc2: "Obtenez des zones personnalisées selon votre âge, fréquence cardiaque au repos et niveau de forme",
          benefitTitle3: "Guide Complet d'Entraînement",
          benefitDesc3: "Apprenez à utiliser chaque zone efficacement avec notre guide complet d'entraînement",
        };
      case "pt":
        return {
          heroTitle: "Calculadora de Zonas de Frequência Cardíaca",
          heroSubtitle:
            "Descubra suas zonas de treino personalizadas para otimizar o desempenho, queimar mais gordura e melhorar sua condição cardiovascular",
          ctaButton: "Calcular Minhas Zonas Agora",
          benefitTitle1: "Treino Baseado em Ciência",
          benefitDesc1: "Use fórmulas comprovadas (Basic e Karvonen) para calcular suas zonas exatas de frequência cardíaca",
          benefitTitle2: "Resultados Personalizados",
          benefitDesc2: "Obtenha zonas personalizadas com base na sua idade, frequência cardíaca em repouso e nível de condicionamento",
          benefitTitle3: "Guia Completo de Treino",
          benefitDesc3: "Aprenda a usar cada zona efetivamente com nosso guia completo de treino",
        };
      case "ru":
        return {
          heroTitle: "Калькулятор Зон Пульса",
          heroSubtitle:
            "Откройте персональные тренировочные зоны для оптимизации результатов, сжигания жира и улучшения сердечно-сосудистой системы",
          ctaButton: "Рассчитать Мои Зоны",
          benefitTitle1: "Научный Подход к Тренировкам",
          benefitDesc1: "Используйте проверенные формулы (Basic и Карвонена) для расчета точных зон пульса",
          benefitTitle2: "Персональные Результаты",
          benefitDesc2: "Получите индивидуальные зоны на основе возраста, пульса покоя и уровня подготовки",
          benefitTitle3: "Полное Руководство по Тренировкам",
          benefitDesc3: "Узнайте, как эффективно использовать каждую зону с нашим подробным руководством",
        };
      case "zh-CN":
        return {
          heroTitle: "心率区间计算器",
          heroSubtitle: "发现您的个性化训练区间，优化运动表现，燃烧更多脂肪，改善心血管健康",
          ctaButton: "立即计算我的区间",
          benefitTitle1: "科学训练方法",
          benefitDesc1: "使用经过验证的公式（Basic和Karvonen）计算您的精确心率区间",
          benefitTitle2: "个性化结果",
          benefitDesc2: "根据您的年龄、静息心率和健身水平获得定制化区间",
          benefitTitle3: "完整训练指南",
          benefitDesc3: "通过我们的综合训练指南学习如何有效使用每个区间",
        };
      default:
        return {
          heroTitle: "Heart Rate Zones Calculator",
          heroSubtitle: "Discover your personalized training zones",
          ctaButton: "Calculate Now",
          benefitTitle1: "Science-Based",
          benefitDesc1: "Proven formulas for accurate zones",
          benefitTitle2: "Personalized",
          benefitDesc2: "Customized to your fitness level",
          benefitTitle3: "Complete Guide",
          benefitDesc3: "Learn how to train effectively",
        };
    }
  };

  const content = getLocalizedContent();

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">{content.heroTitle}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">{content.heroSubtitle}</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-full transform transition-all hover:scale-105 active:scale-95 shadow-xl"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {content.ctaButton}
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-5xl mb-4">🔬</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{content.benefitTitle1}</h3>
            <p className="text-gray-600 dark:text-gray-300">{content.benefitDesc1}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{content.benefitTitle2}</h3>
            <p className="text-gray-600 dark:text-gray-300">{content.benefitDesc2}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{content.benefitTitle3}</h3>
            <p className="text-gray-600 dark:text-gray-300">{content.benefitDesc3}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
