"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "locales/client";
import { HeartRateZonesDisplay } from "app/[locale]/(app)/tools/heart-rate-zones/shared/components/HeartRateZonesDisplay";

const heartRateSchema = z.object({
  method: z.enum(["basic", "karvonen_age", "karvonen_custom"]),
  age: z.coerce.number().min(1).max(120),
  restingHeartRate: z.coerce.number().min(30).max(120).optional(),
  maxHeartRate: z.coerce.number().min(100).max(220).optional(),
});

type HeartRateFormData = z.infer<typeof heartRateSchema>;

interface HeartRateZone {
  name: string;
  intensity: string;
  minHR: number;
  maxHR: number;
  benefits: string;
  duration: string;
  description: string;
  color: string;
}

interface HeartRateResults {
  maxHeartRate: number;
  heartRateReserve?: number;
  zones: HeartRateZone[];
  formula: string;
}

export function HeartRateZonesCalculatorClient() {
  const t = useI18n();
  const [results, setResults] = useState<HeartRateResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HeartRateFormData>({
    resolver: zodResolver(heartRateSchema),
    defaultValues: {
      method: "basic",
      age: 30,
    },
  });

  const method = watch("method");

  const calculateZones = (data: HeartRateFormData) => {
    setIsCalculating(true);

    // Calculate MHR
    let maxHeartRate: number;
    if (data.method === "karvonen_custom" && data.maxHeartRate) {
      maxHeartRate = data.maxHeartRate;
    } else {
      maxHeartRate = 220 - data.age;
    }

    // Calculate zones based on method
    const zones: HeartRateZone[] = [];
    const zoneDefinitions = [
      {
        key: "warm_up",
        minIntensity: 0.5,
        maxIntensity: 0.6,
        color: "badge-neutral",
      },
      {
        key: "fat_burn",
        minIntensity: 0.6,
        maxIntensity: 0.7,
        color: "badge-info",
      },
      {
        key: "aerobic",
        minIntensity: 0.7,
        maxIntensity: 0.8,
        color: "badge-success",
      },
      {
        key: "anaerobic",
        minIntensity: 0.8,
        maxIntensity: 0.9,
        color: "badge-warning",
      },
      {
        key: "vo2_max",
        minIntensity: 0.9,
        maxIntensity: 1.0,
        color: "badge-error",
      },
    ];

    let heartRateReserve: number | undefined;
    let formula: string;

    if (data.method === "basic") {
      // Basic formula: THR = MHR × %Intensity
      formula = t("tools.heart-rate-zones.formulas.basic_explanation");

      zoneDefinitions.forEach((zone) => {
        const minHR = Math.round(maxHeartRate * zone.minIntensity);
        const maxHR = Math.round(maxHeartRate * zone.maxIntensity);

        zones.push({
          name: t(`tools.heart-rate-zones.zones.${zone.key}.name` as keyof typeof t),
          intensity: t(`tools.heart-rate-zones.zones.${zone.key}.intensity` as keyof typeof t),
          minHR,
          maxHR,
          benefits: t(`tools.heart-rate-zones.zones.${zone.key}.benefits` as keyof typeof t),
          duration: t(`tools.heart-rate-zones.zones.${zone.key}.duration` as keyof typeof t),
          description: t(`tools.heart-rate-zones.zones.${zone.key}.description` as keyof typeof t),
          color: zone.color,
        });
      });
    } else {
      // Karvonen formula: THR = [(MHR - RHR) × %Intensity] + RHR
      formula = t("tools.heart-rate-zones.formulas.karvonen_explanation");
      const restingHeartRate = data.restingHeartRate || 70; // Default RHR if not provided
      heartRateReserve = maxHeartRate - restingHeartRate;

      zoneDefinitions.forEach((zone) => {
        const minHR = Math.round(heartRateReserve! * zone.minIntensity + restingHeartRate);
        const maxHR = Math.round(heartRateReserve! * zone.maxIntensity + restingHeartRate);

        zones.push({
          name: t(`tools.heart-rate-zones.zones.${zone.key}.name` as keyof typeof t),
          intensity: t(`tools.heart-rate-zones.zones.${zone.key}.intensity` as keyof typeof t),
          minHR,
          maxHR,
          benefits: t(`tools.heart-rate-zones.zones.${zone.key}.benefits` as keyof typeof t),
          duration: t(`tools.heart-rate-zones.zones.${zone.key}.duration` as keyof typeof t),
          description: t(`tools.heart-rate-zones.zones.${zone.key}.description` as keyof typeof t),
          color: zone.color,
        });
      });
    }

    setResults({
      maxHeartRate,
      heartRateReserve,
      zones,
      formula,
    });

    setTimeout(() => {
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">{t("tools.heart-rate-zones.title")}</h2>
          <p className="text-base-content/70">{t("tools.heart-rate-zones.description")}</p>

          <form className="space-y-6 mt-6" onSubmit={handleSubmit(calculateZones)}>
            {/* Method Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  {t("tools.heart-rate-zones.method")}
                  <div className="tooltip tooltip-right" data-tip={t("tools.heart-rate-zones.method_info")}>
                    <Info className="h-4 w-4 text-base-content/60" />
                  </div>
                </span>
              </label>
              <select className="select select-bordered w-full" {...register("method")}>
                <option value="basic">{t("tools.heart-rate-zones.methods.basic")}</option>
                <option value="karvonen_age">{t("tools.heart-rate-zones.methods.karvonen_age")}</option>
                <option value="karvonen_custom">{t("tools.heart-rate-zones.methods.karvonen_custom")}</option>
              </select>
              <label className="label">
                <span className="label-text-alt">
                  {method === "basic" && t("tools.heart-rate-zones.methods.basic_desc")}
                  {method === "karvonen_age" && t("tools.heart-rate-zones.methods.karvonen_age_desc")}
                  {method === "karvonen_custom" && t("tools.heart-rate-zones.methods.karvonen_custom_desc")}
                </span>
              </label>
              {errors.method && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.method.message}</span>
                </label>
              )}
            </div>

            {/* Age Input */}
            {method !== "karvonen_custom" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t("tools.heart-rate-zones.age")}</span>
                </label>
                <input
                  className={`input input-bordered w-full ${errors.age ? "input-error" : ""}`}
                  placeholder={t("tools.heart-rate-zones.age_placeholder")}
                  type="number"
                  {...register("age")}
                />
                {errors.age && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.age.message}</span>
                  </label>
                )}
              </div>
            )}

            {/* Resting Heart Rate Input */}
            {(method === "karvonen_age" || method === "karvonen_custom") && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    {t("tools.heart-rate-zones.resting_heart_rate")}
                    <div className="tooltip tooltip-right" data-tip={t("tools.heart-rate-zones.resting_heart_rate_info")}>
                      <Info className="h-4 w-4 text-base-content/60" />
                    </div>
                  </span>
                </label>
                <input
                  className={`input input-bordered w-full ${errors.restingHeartRate ? "input-error" : ""}`}
                  placeholder={t("tools.heart-rate-zones.resting_heart_rate_placeholder")}
                  type="number"
                  {...register("restingHeartRate")}
                />
                {errors.restingHeartRate && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.restingHeartRate.message}</span>
                  </label>
                )}
              </div>
            )}

            {/* Max Heart Rate Input */}
            {method === "karvonen_custom" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    {t("tools.heart-rate-zones.max_heart_rate")}
                    <div className="tooltip tooltip-right" data-tip={t("tools.heart-rate-zones.max_heart_rate_info")}>
                      <Info className="h-4 w-4 text-base-content/60" />
                    </div>
                  </span>
                </label>
                <input
                  className={`input input-bordered w-full ${errors.maxHeartRate ? "input-error" : ""}`}
                  placeholder={t("tools.heart-rate-zones.max_heart_rate_placeholder")}
                  type="number"
                  {...register("maxHeartRate")}
                />
                {errors.maxHeartRate && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.maxHeartRate.message}</span>
                  </label>
                )}
              </div>
            )}

            <button className={`btn btn-primary w-full ${isCalculating ? "loading" : ""}`} disabled={isCalculating} type="submit">
              {isCalculating ? t("tools.heart-rate-zones.calculating") : t("tools.heart-rate-zones.calculate")}
            </button>
          </form>
        </div>
      </div>

      {results && <HeartRateZonesDisplay results={results} />}
    </div>
  );
}
