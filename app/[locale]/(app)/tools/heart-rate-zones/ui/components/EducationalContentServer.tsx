import React from "react";

import { getI18n } from "locales/server";
import { ScrollToTopButton } from "app/[locale]/(app)/tools/heart-rate-zones/ui/components/ScrollToTopButton";

export async function EducationalContentServer() {
  const t = await getI18n();

  const zones = [
    {
      emoji: "🚶",
      name: t("tools.heart-rate-zones.zones.warm_up.name"),
      intensity: "50-60%",
      color: "bg-blue-100 text-blue-700",
      benefits: t("tools.heart-rate-zones.zones.warm_up.benefits"),
      example: t("tools.heart-rate-zones.zones.warm_up.example"),
    },
    {
      emoji: "🔥",
      name: t("tools.heart-rate-zones.zones.fat_burn.name"),
      intensity: "60-70%",
      color: "bg-green-100 text-green-700",
      benefits: t("tools.heart-rate-zones.zones.fat_burn.benefits"),
      example: t("tools.heart-rate-zones.zones.fat_burn.example"),
    },
    {
      emoji: "🏃",
      name: t("tools.heart-rate-zones.zones.aerobic.name"),
      intensity: "70-80%",
      color: "bg-yellow-100 text-yellow-700",
      benefits: t("tools.heart-rate-zones.zones.aerobic.benefits"),
      example: t("tools.heart-rate-zones.zones.aerobic.example"),
    },
    {
      emoji: "💪",
      name: t("tools.heart-rate-zones.zones.anaerobic.name"),
      intensity: "80-90%",
      color: "bg-orange-100 text-orange-700",
      benefits: t("tools.heart-rate-zones.zones.anaerobic.benefits"),
      example: t("tools.heart-rate-zones.zones.anaerobic.example"),
    },
    {
      emoji: "🚀",
      name: t("tools.heart-rate-zones.zones.vo2_max.name"),
      intensity: "90-100%",
      color: "bg-red-100 text-red-700",
      benefits: t("tools.heart-rate-zones.zones.vo2_max.benefits"),
      example: t("tools.heart-rate-zones.zones.vo2_max.example"),
    },
  ];

  const tips = [
    {
      emoji: "🎯",
      title: t("tools.heart-rate-zones.training_tips_2.title"),
      description: t("tools.heart-rate-zones.training_tips_2.description1"),
    },
    {
      emoji: "⏱️",
      title: t("tools.heart-rate-zones.training_tips_2.title2"),
      description: t("tools.heart-rate-zones.training_tips_2.description2"),
    },
    {
      emoji: "📈",
      title: t("tools.heart-rate-zones.training_tips_2.title3"),
      description: t("tools.heart-rate-zones.training_tips_2.description3"),
    },
    {
      emoji: "💓",
      title: t("tools.heart-rate-zones.training_tips_2.title4"),
      description: t("tools.heart-rate-zones.training_tips_2.description4"),
    },
  ];

  const quickFacts = [
    {
      emoji: "🧮",
      fact: t("tools.heart-rate-zones.quick_facts.fact1"),
    },
    {
      emoji: "🛌",
      fact: t("tools.heart-rate-zones.quick_facts.fact2"),
    },
    {
      emoji: "⌚",
      fact: t("tools.heart-rate-zones.quick_facts.fact3"),
    },
    {
      emoji: "🏃‍♀️",
      fact: t("tools.heart-rate-zones.quick_facts.fact4"),
    },
  ];

  return (
    <div className="space-y-12 mt-16">
      {/* Visual Zone Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-3 sm:p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎨</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("tools.heart-rate-zones.educational.title")}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t("tools.heart-rate-zones.educational.description")}</p>
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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-3 sm:p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💡</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("tools.heart-rate-zones.training_tips_2.title")}</h2>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("tools.heart-rate-zones.quick_facts.title")}</h2>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("tools.heart-rate-zones.weekly_plan.title")}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t("tools.heart-rate-zones.weekly_plan.description")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-blue-700 dark:text-blue-300">{t("commons.monday")}</p>
            <div className="text-3xl my-2">🚶</div>
            <p className="text-sm">{t("tools.heart-rate-zones.weekly_plan.monday.title")}</p>
            <p className="text-xs opacity-75">{t("tools.heart-rate-zones.weekly_plan.monday.description")}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-green-700 dark:text-green-300">{t("commons.tuesday")}</p>
            <div className="text-3xl my-2">🔥</div>
            <p className="text-sm">{t("tools.heart-rate-zones.weekly_plan.tuesday.title")}</p>
            <p className="text-xs opacity-75">{t("tools.heart-rate-zones.weekly_plan.tuesday.description")}</p>
          </div>
          <div className="bg-gray-300 dark:bg-gray-800 rounded-2xl p-4 text-center">
            <p className="font-bold text-gray-700 dark:text-gray-300">{t("commons.wednesday")}</p>
            <div className="text-3xl my-2">😴</div>
            <p className="text-sm">{t("tools.heart-rate-zones.weekly_plan.wednesday.title")}</p>
            <p className="text-xs opacity-75">{t("tools.heart-rate-zones.weekly_plan.wednesday.description")}</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-yellow-700 dark:text-yellow-300">{t("commons.thursday")}</p>
            <div className="text-3xl my-2">🏃</div>
            <p className="text-sm">{t("tools.heart-rate-zones.weekly_plan.thursday.title")}</p>
            <p className="text-xs opacity-75">{t("tools.heart-rate-zones.weekly_plan.thursday.description")}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-blue-700 dark:text-blue-300">{t("commons.friday")}</p>
            <div className="text-3xl my-2">🚶</div>
            <p className="text-sm">{t("tools.heart-rate-zones.weekly_plan.friday.title")}</p>
            <p className="text-xs opacity-75">{t("tools.heart-rate-zones.weekly_plan.friday.description")}</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-2xl p-4 text-center">
            <p className="font-bold text-orange-700 dark:text-orange-300">{t("commons.saturday")}</p>
            <div className="text-3xl my-2">💪</div>
            <p className="text-sm">{t("tools.heart-rate-zones.weekly_plan.saturday.title")}</p>
            <p className="text-xs opacity-75">{t("tools.heart-rate-zones.weekly_plan.saturday.description")}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t("tools.heart-rate-zones.weekly_plan.tips")}</p>
        </div>
      </div>

      {/* Simple CTA */}
      <div className="text-center">
        <ScrollToTopButton text={t("tools.heart-rate-zones.weekly_plan.cta")} />
      </div>
    </div>
  );
}
