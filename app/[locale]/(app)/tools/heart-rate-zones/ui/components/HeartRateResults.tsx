"use client";

import React from "react";

import { useI18n } from "locales/client";
import "../styles.css";

interface HeartRateZone {
  name: string;
  minHR: number;
  maxHR: number;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
}

interface HeartRateResults {
  maxHeartRate: number;
  zones: HeartRateZone[];
}

interface HeartRateResultsProps {
  results: HeartRateResults;
}

export function HeartRateResults({ results }: HeartRateResultsProps) {
  const t = useI18n();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Max heart rate display */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-3 sm:p-8 text-center">
        <div className="text-5xl mb-4 animate-heartbeat">💓</div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          {t("tools.heart-rate-zones.results.max_heart_rate")}
        </h3>
        <div className="text-6xl font-bold text-red-500">{results.maxHeartRate}</div>
        <div className="text-2xl text-gray-500">bpm</div>
      </div>

      {/* Heart rate zones */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-3 sm:p-8">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          {t("tools.heart-rate-zones.results.target_zones")} 🎯
        </h3>

        <div className="space-y-4">
          {results.zones.map((zone, index) => (
            <div
              className={`${zone.bgColor} rounded-2xl p-6 transform transition-all hover:scale-105 cursor-pointer card-hover animate-slide-in`}
              key={zone.name}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{zone.emoji}</div>
                  <div>
                    <h4 className={`text-xl font-bold ${zone.color}`}>{zone.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{zone.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${zone.color}`}>
                    {zone.minHR}-{zone.maxHR}
                  </div>
                  <div className="text-gray-500 text-sm">bpm</div>
                </div>
              </div>

              {/* Visual progress bar */}
              <div className="mt-4">
                <div className="bg-white/50 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${zone.color.replace("text-", "bg-")} transition-all`}
                    style={{
                      width: `${((zone.maxHR - zone.minHR) / results.maxHeartRate) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-3 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">💡</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t("tools.heart-rate-zones.tips.title")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <p className="text-gray-700 dark:text-gray-300">{t("tools.heart-rate-zones.tips.tip1")}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">⏱️</span>
            <p className="text-gray-700 dark:text-gray-300">{t("tools.heart-rate-zones.tips.tip2")}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">📈</span>
            <p className="text-gray-700 dark:text-gray-300">{t("tools.heart-rate-zones.tips.tip3")}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🏥</span>
            <p className="text-gray-700 dark:text-gray-300">{t("tools.heart-rate-zones.tips.tip4")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
