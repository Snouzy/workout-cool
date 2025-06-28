import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

import { getI18n } from "locales/server";

import { CalorieCalculatorClient } from "./CalorieCalculatorClient";
import "./styles.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n();

  return {
    title: t("tools.mifflin-st-jeor.meta.title"),
    description: t("tools.mifflin-st-jeor.meta.description"),
    keywords: t("tools.mifflin-st-jeor.meta.keywords"),
  };
}

export default async function MifflinStJeorCalculatorPage() {
  const t = await getI18n();

  return (
    <div className="min-h-screen light:bg-white dark:bg-base-200/20">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 max-w-4xl">
        {/* Back to hub */}
        <Link 
          href="/tools/calorie-calculator" 
          className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors mb-6"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          {t("tools.back_to_calculators")}
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F8EF7] to-[#238BE6] bg-clip-text text-transparent animate-fadeIn">
            {t("tools.mifflin-st-jeor.title")}
          </h1>
          <p
            className="text-lg text-base-content/70 dark:text-base-content/60 max-w-2xl mx-auto animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            {t("tools.mifflin-st-jeor.subtitle")}
          </p>
        </div>

        {/* Educational Section */}
        <div
          className="mb-8 bg-gradient-to-br from-[#4F8EF7]/5 to-[#238BE6]/5 dark:from-[#4F8EF7]/10 dark:to-[#238BE6]/10 rounded-2xl border border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30 p-6 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-xl font-bold mb-3 text-base-content dark:text-base-content/90">
            {t("tools.mifflin-st-jeor.how_it_works")}
          </h2>
          <div className="space-y-2 text-base-content/70 dark:text-base-content/60">
            <p className="text-sm leading-relaxed">{t("tools.mifflin-st-jeor.how_it_works_description")}</p>
            <div className="mt-4 p-3 bg-base-100/50 dark:bg-base-100/20 rounded-lg">
              <p className="text-xs font-mono text-base-content/70">
                <strong>Men:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5<br/>
                <strong>Women:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
              </p>
            </div>
          </div>
        </div>

        <CalorieCalculatorClient />
      </div>
    </div>
  );
}