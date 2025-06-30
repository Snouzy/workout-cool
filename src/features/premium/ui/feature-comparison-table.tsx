"use client";

import { Check, X, Star, Target } from "lucide-react";

import { useI18n } from "locales/client";

interface Feature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

export function FeatureComparisonTable() {
  const t = useI18n();

  const categories: FeatureCategory[] = [
    {
      name: t("premium.comparison.categories.equipment"),
      features: [
        {
          name: t("premium.comparison.features.exercise_library"),
          free: t("premium.comparison.values.basic"),
          premium: t("premium.comparison.values.complete"),
        },
        {
          name: t("premium.comparison.features.custom_exercise"),
          free: false,
          premium: t("premium.comparison.values.unlimited"),
        },
      ],
    },
    {
      name: t("premium.comparison.categories.tracking"),
      features: [
        {
          name: t("premium.comparison.features.workout_history"),
          free: t("premium.comparison.values.six_months"),
          premium: t("premium.comparison.values.unlimited"),
        },
        {
          name: t("premium.comparison.features.progress_statistics"),
          free: false,
          premium: true,
        },
        {
          name: t("premium.comparison.features.personal_records"),
          free: false,
          premium: true,
        },
        {
          name: t("premium.comparison.features.volume_analytics"),
          free: false,
          premium: true,
        },
      ],
    },
    {
      name: t("premium.comparison.categories.programs"),
      features: [
        {
          name: t("premium.comparison.features.predesigned_programs"),
          free: t("premium.comparison.values.limited"),
          premium: t("premium.comparison.values.all_programs"),
        },
        {
          name: t("premium.comparison.features.personalized_recommendations"),
          free: false,
          premium: true,
        },
        {
          name: t("premium.comparison.features.pro_templates"),
          free: false,
          premium: t("premium.comparison.values.soon"),
        },
      ],
    },
    {
      name: t("premium.comparison.categories.community"),
      features: [
        {
          name: t("premium.comparison.features.community_access"),
          free: t("premium.comparison.values.public"),
          premium: t("premium.comparison.values.vip_access"),
        },
        {
          name: t("premium.comparison.features.private_chat"),
          free: false,
          premium: true,
        },
      ],
    },
    {
      name: t("premium.comparison.categories.support"),
      features: [
        {
          name: t("premium.comparison.features.community_support"),
          free: true,
          premium: true,
        },
        {
          name: t("premium.comparison.features.priority_support"),
          free: false,
          premium: true,
        },
        {
          name: t("premium.comparison.features.early_access"),
          free: false,
          premium: true,
        },
        {
          name: t("premium.comparison.features.beta_testing"),
          free: false,
          premium: true,
        },
      ],
    },
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-[#22C55E] mx-auto" />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-gray-400 mx-auto" />;
    }
    if (value === t("premium.comparison.values.unlimited")) {
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs font-medium text-[#00D4AA]">∞ {t("premium.comparison.values.unlimited")}</span>
        </div>
      );
    }
    if (typeof value === "string" && value.includes("templates")) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>
        </div>
      );
    }
    if (typeof value === "string" && (value.includes("Early") || value.includes("Beta"))) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Target className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-xs font-medium text-[#FF6B35]">{t("premium.comparison.values.early_access")}</span>
        </div>
      );
    }
    return <span className="text-center text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>;
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("premium.comparison.title")}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t("premium.comparison.subtitle")}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">{t("premium.comparison.features_label")}</div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">{t("premium.plans.free.name")}</div>
                  <div className="text-sm text-gray-500">{t("premium.plans.free.price_label")}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[#00D4AA]">{t("premium.plans.premium.name")}</div>
                  <div className="text-sm text-gray-500">{t("premium.plans.premium.price_label")}</div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category, categoryIndex) => (
                <div className="p-3 sm:p-6" key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">{category.name}</h3>

                  <div className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <div className="grid grid-cols-3 gap-4 items-center py-2" key={featureIndex}>
                        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{feature.name}</div>
                        <div className="text-center">{renderFeatureValue(feature.free)}</div>
                        <div className="text-center">{renderFeatureValue(feature.premium)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
