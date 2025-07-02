"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BeefIcon, WheatIcon, DropletIcon, FlameIcon, ActivityIcon } from "lucide-react";

import { useI18n } from "locales/client";
import { CalorieResults } from "app/[locale]/(app)/tools/calorie-calculator/calorie-calculator.utils";

import { InfoModal } from "./InfoModal";
import { InfoButton } from "./InfoButton";

interface ResultsDisplayProps {
  results: CalorieResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const t = useI18n();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="bg-gradient-to-br from-[#4F8EF7]/10 to-[#238BE6]/10 dark:from-[#4F8EF7]/5 dark:to-[#238BE6]/5 rounded-2xl border-2 border-[#4F8EF7]/30 dark:border-[#4F8EF7]/20 p-6 sm:p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4F8EF7] to-[#238BE6] bg-clip-text text-transparent">
          {t("tools.calorie-calculator.results.title")}
        </h2>
        <Image alt="Happy" className="opacity-90 animate-bounce" height={48} src="/images/emojis/WorkoutCoolHappy.png" width={48} />
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="group bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-4 text-center border border-base-content/10 transition-all duration-300 hover:scale-105 relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FlameIcon className="w-4 h-4 text-orange-500" />
            <div className="text-sm text-base-content/60 dark:text-base-content/50 font-medium">
              {t("tools.calorie-calculator.results.bmr")}
            </div>
            <InfoButton
              onClick={() => setActiveModal("bmr")}
              tooltip={
                <p className="text-xs text-base-content/80 dark:text-base-content/70 text-left">
                  {t("tools.calorie-calculator.results.bmr_explanation")}
                </p>
              }
            />
          </div>
          <div className="text-2xl font-bold text-base-content dark:text-base-content/90">{results.bmr.toLocaleString()}</div>
          <div className="text-sm text-base-content/60 dark:text-base-content/50 font-medium">kcal</div>
        </div>

        <div className="group bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-4 text-center border border-base-content/10 transition-all duration-300 hover:scale-105 relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ActivityIcon className="w-4 h-4 text-green-500" />
            <div className="text-sm text-base-content/60 dark:text-base-content/50 font-medium">
              {t("tools.calorie-calculator.results.tdee")}
            </div>
            <InfoButton
              onClick={() => setActiveModal("tdee")}
              tooltip={
                <p className="text-xs text-base-content/80 dark:text-base-content/70 text-left">
                  {t("tools.calorie-calculator.results.tdee_explanation")}
                </p>
              }
            />
          </div>
          <div className="text-2xl font-bold text-base-content dark:text-base-content/90">{results.tdee.toLocaleString()}</div>
          <div className="text-sm text-base-content/60 dark:text-base-content/50 font-medium">kcal</div>
        </div>

        <div className="bg-gradient-to-br from-[#4F8EF7]/30 to-[#238BE6]/20 dark:from-[#4F8EF7]/20 dark:to-[#238BE6]/10 rounded-xl p-4 text-center border-2 border-[#4F8EF7]/40 dark:border-[#4F8EF7]/30 transition-all duration-300 hover:scale-105">
          <div className="text-sm text-[#4F8EF7] dark:text-[#4F8EF7]/90 mb-1 font-bold uppercase tracking-wider">
            {t("tools.calorie-calculator.results.target")}
          </div>
          <div className="text-3xl font-black text-[#4F8EF7] dark:text-[#4F8EF7]/90">{results.targetCalories.toLocaleString()}</div>
          <div className="text-sm text-[#4F8EF7] dark:text-[#4F8EF7]/90 font-bold">kcal</div>
        </div>
      </div>

      {/* Macros */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-base-content dark:text-base-content/90">{t("tools.calorie-calculator.results.macros")}</h3>
          <InfoButton
            onClick={() => setActiveModal("macros")}
            tooltip={
              <p className="text-xs text-base-content/80 dark:text-base-content/70">
                {t("tools.calorie-calculator.results.macros_explanation")}
              </p>
            }
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="group bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-base-content/10 transition-all duration-300 hover:scale-105 hover:border-red-500/30 active:scale-[0.98] relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 dark:from-red-500/15 dark:to-red-600/5">
                <BeefIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
              <div className="text-sm text-base-content/70 dark:text-base-content/60 font-medium">
                {t("tools.calorie-calculator.results.protein")}
              </div>
            </div>
            <div className="text-xl font-bold text-base-content dark:text-base-content/90">{results.proteinGrams}g</div>
            <div className="text-xs text-base-content/60 dark:text-base-content/50 mt-1">{results.proteinGrams * 4} kcal</div>
            <div className="absolute -top-1 -right-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-medium">30%</div>
            </div>
          </div>

          <div className="group bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-base-content/10 transition-all duration-300 hover:scale-105 hover:border-yellow-500/30 active:scale-[0.98] relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 dark:from-yellow-500/15 dark:to-yellow-600/5">
                <WheatIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div className="text-sm text-base-content/70 dark:text-base-content/60 font-medium">
                {t("tools.calorie-calculator.results.carbs")}
              </div>
            </div>
            <div className="text-xl font-bold text-base-content dark:text-base-content/90">{results.carbsGrams}g</div>
            <div className="text-xs text-base-content/60 dark:text-base-content/50 mt-1">{results.carbsGrams * 4} kcal</div>
            <div className="absolute -top-1 -right-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-lg font-medium">40%</div>
            </div>
          </div>

          <div className="group bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-base-content/10 transition-all duration-300 hover:scale-105 hover:border-blue-500/30 active:scale-[0.98] relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/15 dark:to-blue-600/5">
                <DropletIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="text-sm text-base-content/70 dark:text-base-content/60 font-medium">
                {t("tools.calorie-calculator.results.fat")}
              </div>
            </div>
            <div className="text-xl font-bold text-base-content dark:text-base-content/90">{results.fatGrams}g</div>
            <div className="text-xs text-base-content/60 dark:text-base-content/50 mt-1">{results.fatGrams * 9} kcal</div>
            <div className="absolute -top-1 -right-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg font-medium">30%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#4F8EF7]/5 to-[#238BE6]/5 dark:from-[#4F8EF7]/10 dark:to-[#238BE6]/10 rounded-xl border border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30">
        <p className="text-sm text-base-content/70 dark:text-base-content/60 text-center">
          {t("tools.calorie-calculator.results.disclaimer")}
        </p>
      </div>

      {/* Mobile Modals */}
      <InfoModal
        content={t("tools.calorie-calculator.results.bmr_explanation")}
        isOpen={activeModal === "bmr"}
        onClose={() => setActiveModal(null)}
        title={t("tools.calorie-calculator.results.bmr")}
      />
      <InfoModal
        content={t("tools.calorie-calculator.results.tdee_explanation")}
        isOpen={activeModal === "tdee"}
        onClose={() => setActiveModal(null)}
        title={t("tools.calorie-calculator.results.tdee")}
      />
      <InfoModal
        content={t("tools.calorie-calculator.results.macros_explanation")}
        isOpen={activeModal === "macros"}
        onClose={() => setActiveModal(null)}
        title={t("tools.calorie-calculator.results.macros")}
      />
    </div>
  );
}
