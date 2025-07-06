"use client";

import React from "react";

import { useI18n } from "locales/client";

export function SimpleEducationalContent() {
  const t = useI18n();

  const zones = [
    {
      emoji: "🚶",
      name: t("tools.heart-rate-zones.zones.warm_up.name"),
      intensity: "50-60%",
      color: "bg-blue-100 text-blue-700",
      benefits: "🧘 Échauffement parfait",
      example: "Marche tranquille",
    },
    {
      emoji: "🔥",
      name: t("tools.heart-rate-zones.zones.fat_burn.name"),
      intensity: "60-70%",
      color: "bg-green-100 text-green-700",
      benefits: "🔥 Brûle les graisses",
      example: "Jogging léger",
    },
    {
      emoji: "🏃",
      name: t("tools.heart-rate-zones.zones.aerobic.name"),
      intensity: "70-80%",
      color: "bg-yellow-100 text-yellow-700",
      benefits: "💪 Améliore l'endurance",
      example: "Course modérée",
    },
    {
      emoji: "💪",
      name: t("tools.heart-rate-zones.zones.anaerobic.name"),
      intensity: "80-90%",
      color: "bg-orange-100 text-orange-700",
      benefits: "⚡ Augmente la vitesse",
      example: "Sprint court",
    },
    {
      emoji: "🚀",
      name: t("tools.heart-rate-zones.zones.vo2_max.name"),
      intensity: "90-100%",
      color: "bg-red-100 text-red-700",
      benefits: "🏆 Performance max",
      example: "Sprint intense",
    },
  ];

  const tips = [
    {
      emoji: "🎯",
      title: "Trouvez votre zone",
      description: "Chaque zone a un objectif différent. Choisissez selon votre but !",
    },
    {
      emoji: "⏱️",
      title: "Durée recommandée",
      description: "Plus l'intensité est élevée, plus la durée doit être courte.",
    },
    {
      emoji: "📈",
      title: "Progression",
      description: "Commencez doucement et augmentez progressivement l'intensité.",
    },
    {
      emoji: "💓",
      title: "Écoutez votre corps",
      description: "Si vous vous sentez mal, ralentissez immédiatement.",
    },
  ];

  const quickFacts = [
    {
      emoji: "🧮",
      fact: "220 - votre âge = Fréquence cardiaque maximale approximative",
    },
    {
      emoji: "🛌",
      fact: "Mesurez votre pouls au réveil pour connaître votre fréquence au repos",
    },
    {
      emoji: "⌚",
      fact: "Une montre connectée peut suivre votre fréquence en temps réel",
    },
    {
      emoji: "🏃‍♀️",
      fact: "80% de votre entraînement devrait être en zones 1-3",
    },
  ];

  return (
    <div className="space-y-12 mt-16">
      {/* Visual Zone Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎨</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("tools.heart-rate-zones.educational.title")}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Visualisez facilement chaque zone d'entraînement</p>
        </div>

        <div className="grid gap-4">
          {zones.map((zone, index) => (
            <div
              className={`${zone.color} rounded-2xl p-6 transform transition-all hover:scale-105`}
              key={zone.name}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{zone.emoji}</div>
                  <div>
                    <h3 className="text-xl font-bold">{zone.name}</h3>
                    <p className="text-2xl font-bold mt-1">{zone.intensity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{zone.benefits}</p>
                  <p className="text-sm opacity-80 mt-1">Ex: {zone.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Tips Grid */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💡</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Conseils pratiques</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip) => (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow" key={tip.title}>
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{tip.emoji}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Facts */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤓</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Le saviez-vous ?</h2>
        </div>

        <div className="space-y-4">
          {quickFacts.map((item, index) => (
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
              key={index}
            >
              <div className="text-3xl">{item.emoji}</div>
              <p className="text-gray-700 dark:text-gray-300 flex-1">{item.fact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Weekly Plan */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Plan hebdomadaire type</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Un exemple de semaine d'entraînement équilibrée</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-blue-700 dark:text-blue-300">Lundi</p>
            <div className="text-3xl my-2">🚶</div>
            <p className="text-sm">Zone 1-2</p>
            <p className="text-xs opacity-75">30-45 min</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-green-700 dark:text-green-300">Mardi</p>
            <div className="text-3xl my-2">🔥</div>
            <p className="text-sm">Zone 2-3</p>
            <p className="text-xs opacity-75">45-60 min</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 text-center">
            <p className="font-bold text-gray-700 dark:text-gray-300">Mercredi</p>
            <div className="text-3xl my-2">😴</div>
            <p className="text-sm">Repos</p>
            <p className="text-xs opacity-75">Récupération</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-yellow-700 dark:text-yellow-300">Jeudi</p>
            <div className="text-3xl my-2">🏃</div>
            <p className="text-sm">Zone 3-4</p>
            <p className="text-xs opacity-75">30-40 min</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-blue-700 dark:text-blue-300">Vendredi</p>
            <div className="text-3xl my-2">🚶</div>
            <p className="text-sm">Zone 1-2</p>
            <p className="text-xs opacity-75">30 min</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-orange-700 dark:text-orange-300">Samedi</p>
            <div className="text-3xl my-2">💪</div>
            <p className="text-sm">Zone 4-5</p>
            <p className="text-xs opacity-75">20-30 min</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">💡 Adaptez ce plan selon votre niveau et vos objectifs !</p>
        </div>
      </div>

      {/* Simple CTA */}
      <div className="text-center">
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl font-bold py-6 px-12 rounded-full transform transition-all hover:scale-105 active:scale-95 shadow-xl"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ⬆️ Calculer mes zones maintenant
        </button>
      </div>
    </div>
  );
}
