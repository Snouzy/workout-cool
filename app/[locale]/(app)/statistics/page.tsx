import React from "react";

import { getI18n } from "locales/server";
import { ExercisesBrowser } from "@/features/statistics/components/ExercisesBrowser";

export default async function StatisticsPage() {
  const t = await getI18n();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-7xl">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] bg-clip-text text-transparent">
        {t("statistics.title")}
      </h1>
      <ExercisesBrowser />
    </div>
  );
}
