import React from "react";

import { getI18n } from "locales/server";
import { ExercisesBrowser } from "@/features/statistics/components/ExercisesBrowser";
import { PremiumGate } from "@/components/ui/premium-gate";

export default async function StatisticsPage() {
  const t = await getI18n();
  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-[#4F8EF7] via-[#8B5CF6] to-[#25CB78] bg-clip-text text-transparent">
          {t("statistics.title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{t("statistics.page_subtitle")}</p>

        {/* Stats hero social proof */}
        <PremiumGate
          fallback={
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#4F8EF7]">15.4K+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("statistics.active_daily_users")}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#25CB78]">89%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("statistics.success_rate")}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#8B5CF6]">4.8★</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("statistics.user_rating")}</p>
              </div>
            </div>
          }
          feature="Statistics"
        >
          {/* this is the premium content ↓ */}
          <div />
        </PremiumGate>
      </div>

      {/* Main Content */}
      <ExercisesBrowser />
    </div>
  );
}
