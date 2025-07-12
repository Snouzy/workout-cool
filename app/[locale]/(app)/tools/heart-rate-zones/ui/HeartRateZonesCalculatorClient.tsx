"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "locales/client";
import "./styles.css";
import { env } from "@/env";
import { InArticle } from "@/components/ads";

const simpleHeartRateSchema = z.object({
  age: z.coerce.number().min(1).max(120),
});

type SimpleHeartRateFormData = z.infer<typeof simpleHeartRateSchema>;

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

interface SEOFriendlyHeartRateCalculatorProps {
  defaultAge?: number;
  defaultResults?: HeartRateResults;
}

export function HeartRateZonesCalculatorClient({ defaultAge = 30, defaultResults }: SEOFriendlyHeartRateCalculatorProps) {
  const t = useI18n();
  const [results, setResults] = useState<HeartRateResults | null>(defaultResults || null);

  const { watch, setValue } = useForm<SimpleHeartRateFormData>({
    resolver: zodResolver(simpleHeartRateSchema),
    defaultValues: {
      age: defaultAge,
    },
  });

  const age = watch("age");

  const calculateZones = (currentAge: number) => {
    // Calculate MHR
    const maxHeartRate = 220 - currentAge;

    // Simple zones with emojis and colors
    const zones: HeartRateZone[] = [
      {
        name: t("tools.heart-rate-zones.zones.warm_up.name"),
        minHR: Math.round(maxHeartRate * 0.5),
        maxHR: Math.round(maxHeartRate * 0.6),
        emoji: "🚶",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description: t("tools.heart-rate-zones.zones.warm_up.description"),
      },
      {
        name: t("tools.heart-rate-zones.zones.fat_burn.name"),
        minHR: Math.round(maxHeartRate * 0.6),
        maxHR: Math.round(maxHeartRate * 0.7),
        emoji: "🔥",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: t("tools.heart-rate-zones.zones.fat_burn.description"),
      },
      {
        name: t("tools.heart-rate-zones.zones.aerobic.name"),
        minHR: Math.round(maxHeartRate * 0.7),
        maxHR: Math.round(maxHeartRate * 0.8),
        emoji: "🏃",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description: t("tools.heart-rate-zones.zones.aerobic.description"),
      },
      {
        name: t("tools.heart-rate-zones.zones.anaerobic.name"),
        minHR: Math.round(maxHeartRate * 0.8),
        maxHR: Math.round(maxHeartRate * 0.9),
        emoji: "💪",
        color: "text-orange-500",
        bgColor: "bg-orange-100",
        description: t("tools.heart-rate-zones.zones.anaerobic.description"),
      },
      {
        name: t("tools.heart-rate-zones.zones.vo2_max.name"),
        minHR: Math.round(maxHeartRate * 0.9),
        maxHR: maxHeartRate,
        emoji: "🚀",
        color: "text-red-600",
        bgColor: "bg-red-100",
        description: t("tools.heart-rate-zones.zones.vo2_max.description"),
      },
    ];

    setResults({
      maxHeartRate,
      zones,
    });
  };

  // Calculate on age change
  useEffect(() => {
    if (age && age >= 1 && age <= 120) {
      calculateZones(age);
    }
  }, [age]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Age input section - always visible */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-3 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-heartbeat">🎂</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.age")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("tools.heart-rate-zones.age_placeholder")}</p>
        </div>

        {/* Age slider */}
        <div className="mb-4">
          <div className="text-6xl font-bold text-blue-600 mb-4 text-center">{age}</div>
          <input
            className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            max="120"
            min="1"
            onChange={(e) => setValue("age", parseInt(e.target.value))}
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(age / 120) * 100}%, #E5E7EB ${(age / 120) * 100}%, #E5E7EB 100%)`,
            }}
            type="range"
            value={age}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>1</span>
            <span>120</span>
          </div>
        </div>
      </div>

      {/* Results section - always visible */}
      {results && (
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

            {/* Global zones visualization */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("tools.heart-rate-zones.results.overview")}
              </div>
              <div className="relative h-8 bg-white dark:bg-gray-600 rounded-full overflow-hidden">
                {results.zones.map((zone) => (
                  <div
                    className={`absolute h-full ${zone.color.replace("text-", "bg-")} opacity-80`}
                    key={zone.name}
                    style={{
                      left: `${(zone.minHR / results.maxHeartRate) * 100}%`,
                      width: `${((zone.maxHR - zone.minHR) / results.maxHeartRate) * 100}%`,
                    }}
                    title={`${zone.name}: ${zone.minHR}-${zone.maxHR} bpm`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{Math.round(results.maxHeartRate * 0.5)}</span>
                <span>{Math.round(results.maxHeartRate * 0.75)}</span>
                <span>{results.maxHeartRate} bpm</span>
              </div>
            </div>

            <div className="space-y-4">
              {results.zones.map((zone) => (
                <div
                  className={`${zone.bgColor} rounded-2xl p-6 transform transition-all hover:scale-105 cursor-pointer card-hover`}
                  key={zone.name}
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
                    <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${zone.color.replace("text-", "bg-")} transition-all`}
                        style={{
                          width: `${(zone.maxHR / results.maxHeartRate) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {Math.round((zone.maxHR / results.maxHeartRate) * 100)}% de FCM
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {env.NEXT_PUBLIC_IN_ARTICLE_HEART_ZONES_AD_SLOT_3 && <InArticle adSlot={env.NEXT_PUBLIC_IN_ARTICLE_HEART_ZONES_AD_SLOT_3} />}
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
      )}
    </div>
  );
}
