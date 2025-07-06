"use client";

import React from "react";
import { Heart, Activity, Zap, Flame, TrendingUp } from "lucide-react";

import { useI18n } from "locales/client";

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

interface HeartRateZonesDisplayProps {
  results: HeartRateResults;
}

const zoneIcons = {
  0: Heart,
  1: Activity,
  2: TrendingUp,
  3: Zap,
  4: Flame,
};

export function HeartRateZonesDisplay({ results }: HeartRateZonesDisplayProps) {
  const t = useI18n();

  return (
    <div className="space-y-6">
      {/* Results Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">{t("tools.heart-rate-zones.results.title")}</h2>
          <p className="text-base-content/70">{results.formula}</p>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title text-sm">{t("tools.heart-rate-zones.results.max_heart_rate")}</div>
              <div className="stat-value text-2xl">{results.maxHeartRate} bpm</div>
            </div>
            {results.heartRateReserve && (
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">{t("tools.heart-rate-zones.results.heart_rate_reserve")}</div>
                <div className="stat-value text-2xl">{results.heartRateReserve} bpm</div>
              </div>
            )}
          </div>

          <div className="divider"></div>

          {/* Heart Rate Zones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("tools.heart-rate-zones.results.target_zones")}</h3>

            {results.zones.map((zone, index) => {
              const Icon = zoneIcons[index as keyof typeof zoneIcons] || Heart;
              const progressValue = ((zone.maxHR - zone.minHR) / results.maxHeartRate) * 100;

              return (
                <div className="card bg-base-200 shadow-sm" key={zone.name}>
                  <div className={`h-2 ${zone.color.replace("badge-", "bg-")}`} />
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`badge ${zone.color} badge-lg p-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{zone.name}</h4>
                          <p className="text-sm text-base-content/60">{zone.intensity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {zone.minHR} - {zone.maxHR}
                        </p>
                        <p className="text-sm text-base-content/60">bpm</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <progress className="progress progress-primary w-full" max="100" value={progressValue}></progress>
                      <p className="text-sm text-base-content/70">{zone.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium">{t("tools.heart-rate-zones.results.benefits")}</p>
                        <p className="text-sm text-base-content/60">{zone.benefits}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("tools.heart-rate-zones.results.duration")}</p>
                        <p className="text-sm text-base-content/60">{zone.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Abbreviations */}
          <div className="alert alert-info mt-6">
            <div className="text-xs space-y-1">
              <p>{t("tools.heart-rate-zones.abbreviations.thr")}</p>
              <p>{t("tools.heart-rate-zones.abbreviations.mhr")}</p>
              <p>{t("tools.heart-rate-zones.abbreviations.rhr")}</p>
              <p>{t("tools.heart-rate-zones.abbreviations.bpm")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Training Tips */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{t("tools.heart-rate-zones.tips.title")}</h2>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <span className="badge badge-primary badge-xs mt-1.5"></span>
              <span className="text-sm">{t("tools.heart-rate-zones.tips.tip1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="badge badge-primary badge-xs mt-1.5"></span>
              <span className="text-sm">{t("tools.heart-rate-zones.tips.tip2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="badge badge-primary badge-xs mt-1.5"></span>
              <span className="text-sm">{t("tools.heart-rate-zones.tips.tip3")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="badge badge-primary badge-xs mt-1.5"></span>
              <span className="text-sm">{t("tools.heart-rate-zones.tips.tip4")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
