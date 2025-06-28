"use client";

import React from "react";
import Image from "next/image";
import { BeefIcon, WheatIcon, DropletIcon } from "lucide-react";

import { useI18n } from "locales/client";

import type { CalorieResults } from "../calorie-calculator.utils";

interface ResultsDisplayProps {
  results: CalorieResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const t = useI18n();

  return (
    <div className="bg-gradient-to-br from-[#4F8EF7]/10 to-[#238BE6]/10 dark:from-[#4F8EF7]/5 dark:to-[#238BE6]/5 rounded-2xl border-2 border-[#4F8EF7]/30 dark:border-[#4F8EF7]/20 p-6 sm:p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4F8EF7] to-[#238BE6] bg-clip-text text-transparent">
          {t("tools.calorie-calculator.results.title")}
        </h2>
        <Image 
          alt="Happy" 
          className="opacity-90 animate-bounce" 
          height={48} 
          src="/images/emojis/WorkoutCoolHappy.png" 
          width={48} 
        />
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-4 text-center border border-base-content/10 transition-all duration-300 hover:scale-105">
          <div className="text-sm text-base-content/60 dark:text-base-content/50 mb-1 font-medium">
            {t("tools.calorie-calculator.results.bmr")}
          </div>
          <div className="text-2xl font-bold text-base-content dark:text-base-content/90">
            {results.bmr.toLocaleString()}
          </div>
          <div className="text-sm text-base-content/60 dark:text-base-content/50 font-medium">kcal</div>
        </div>

        <div className="bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-4 text-center border border-base-content/10 transition-all duration-300 hover:scale-105">
          <div className="text-sm text-base-content/60 dark:text-base-content/50 mb-1 font-medium">
            {t("tools.calorie-calculator.results.tdee")}
          </div>
          <div className="text-2xl font-bold text-base-content dark:text-base-content/90">
            {results.tdee.toLocaleString()}
          </div>
          <div className="text-sm text-base-content/60 dark:text-base-content/50 font-medium">kcal</div>
        </div>

        <div className="bg-gradient-to-br from-[#4F8EF7]/30 to-[#238BE6]/20 dark:from-[#4F8EF7]/20 dark:to-[#238BE6]/10 rounded-xl p-4 text-center border-2 border-[#4F8EF7]/40 dark:border-[#4F8EF7]/30 transition-all duration-300 hover:scale-105 animate-pulse">
          <div className="text-sm text-[#4F8EF7] dark:text-[#4F8EF7]/90 mb-1 font-bold uppercase tracking-wider">
            {t("tools.calorie-calculator.results.target")}
          </div>
          <div className="text-3xl font-black text-[#4F8EF7] dark:text-[#4F8EF7]/90">
            {results.targetCalories.toLocaleString()}
          </div>
          <div className="text-sm text-[#4F8EF7] dark:text-[#4F8EF7]/90 font-bold">kcal</div>
        </div>
      </div>

      {/* Macros */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-base-content dark:text-base-content/90">
          {t("tools.calorie-calculator.results.macros")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-4 border border-base-content/10 transition-all duration-300 hover:scale-105 hover:border-red-500/30">
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
          </div>

          <div className="bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-4 border border-base-content/10 transition-all duration-300 hover:scale-105 hover:border-yellow-500/30">
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
          </div>

          <div className="bg-base-100/70 dark:bg-base-100/30 backdrop-blur-sm rounded-xl p-4 border border-base-content/10 transition-all duration-300 hover:scale-105 hover:border-blue-500/30">
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
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#4F8EF7]/5 to-[#238BE6]/5 dark:from-[#4F8EF7]/10 dark:to-[#238BE6]/10 rounded-xl border border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30">
        <p className="text-sm text-base-content/70 dark:text-base-content/60 text-center">
          {t("tools.calorie-calculator.results.disclaimer")}
        </p>
      </div>
    </div>
  );
}
