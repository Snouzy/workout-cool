"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "locales/client";

import { SimpleHeartRateResults } from "./components/SimpleHeartRateResults";
import "./styles.css";

const simpleHeartRateSchema = z.object({
  age: z.coerce.number().min(1).max(120),
  restingHeartRate: z.coerce.number().min(30).max(120).optional(),
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

export function SimpleHeartRateCalculator() {
  const t = useI18n();
  const [results, setResults] = useState<HeartRateResults | null>(null);
  const [currentStep, setCurrentStep] = useState<"age" | "resting" | "results">("age");
  const [isCalculating, setIsCalculating] = useState(false);

  const { watch, setValue } = useForm<SimpleHeartRateFormData>({
    resolver: zodResolver(simpleHeartRateSchema),
    defaultValues: {
      age: 30,
    },
  });

  const age = watch("age");

  const calculateZones = (data: SimpleHeartRateFormData) => {
    setIsCalculating(true);

    // Calculate MHR
    const maxHeartRate = 220 - data.age;

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
        color: "text-orange-600",
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

    setTimeout(() => {
      setIsCalculating(false);
      setCurrentStep("results");
    }, 800);
  };

  const handleAgeSubmit = () => {
    if (age && age >= 1 && age <= 120) {
      calculateZones({ age });
    }
  };

  const handleReset = () => {
    setCurrentStep("age");
    setResults(null);
    setValue("age", 30);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
              currentStep === "age" ? "bg-blue-500 scale-110" : "bg-gray-300"
            }`}
          >
            1️⃣
          </div>
          <div className={`w-16 h-1 transition-all ${currentStep !== "age" ? "bg-blue-500" : "bg-gray-300"}`} />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
              currentStep === "results" ? "bg-green-500 scale-110" : "bg-gray-300"
            }`}
          >
            ✅
          </div>
        </div>
      </div>

      {currentStep === "age" && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center animate-fade-in-up">
          <div className="text-6xl mb-6 animate-heartbeat">🎂</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.age")}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t("tools.heart-rate-zones.age_placeholder")}</p>

          {/* Age slider */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">{age}</div>
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

          {/* Big action button */}
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-6 px-12 rounded-full transform transition-all hover:scale-105 active:scale-95 shadow-lg button-press"
            onClick={handleAgeSubmit}
          >
            {t("tools.heart-rate-zones.calculate")} 🎯
          </button>
        </div>
      )}

      {currentStep === "results" && results && !isCalculating && (
        <>
          <SimpleHeartRateResults results={results} />

          {/* Reset button */}
          <div className="text-center mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold py-4 px-8 rounded-full transform transition-all hover:scale-105 active:scale-95 shadow-lg button-press"
              onClick={handleReset}
            >
              🔄 {t("tools.heart-rate-zones.calculate")}
            </button>
          </div>
        </>
      )}

      {/* Loading animation */}
      {isCalculating && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
          <div className="text-8xl mb-6 animate-pulse">❤️</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t("tools.heart-rate-zones.calculating")}...</h3>
        </div>
      )}
    </div>
  );
}
