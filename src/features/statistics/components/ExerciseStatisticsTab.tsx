"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

import { useI18n, useCurrentLocale } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/date";
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { PremiumGate } from "@/components/ui/premium-gate";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useWeightProgression, useOneRepMax, useVolumeData } from "../hooks/use-exercise-statistics";
import { WeightProgressionChart } from "./WeightProgressionChart";
import { VolumeChart } from "./VolumeChart";
import { OneRepMaxChart } from "./OneRepMaxChart";

interface ExerciseStatisticsTabProps {
  exerciseId: string;
  unit?: "kg" | "lbs";
  className?: string;
  timeframe: StatisticsTimeframe;
}

export function ExerciseCharts({ timeframe, exerciseId, unit = "kg", className }: ExerciseStatisticsTabProps) {
  const t = useI18n();
  const locale = useCurrentLocale();

  // Fetch data for all charts
  const weightProgressionQuery = useWeightProgression(exerciseId, timeframe);
  const oneRepMaxQuery = useOneRepMax(exerciseId, timeframe);
  const volumeQuery = useVolumeData(exerciseId, timeframe);

  const hasError = weightProgressionQuery.isError || oneRepMaxQuery.isError || volumeQuery.isError;

  return (
    <PremiumGate className={className} feature="exercise-statistics" upgradeMessage={t("statistics.premium_required")}>
      <div className={cn("space-y-6", className)}>
        {/* Error State */}
        {hasError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t("statistics.error_loading_data")}</AlertDescription>
          </Alert>
        )}

        {/* Charts Grid */}
        <div className="grid gap-6">
          {/* Weight Progression Chart */}
          <div className="">
            {weightProgressionQuery.isLoading ? (
              <div className="flex h-[300px] items-center justify-center rounded-lg bg-white shadow-sm">
                <Loader />
              </div>
            ) : weightProgressionQuery.isError ? (
              <Alert variant="error">
                <AlertDescription>{t("statistics.error_loading_weight_progression")}</AlertDescription>
              </Alert>
            ) : (
              <WeightProgressionChart data={weightProgressionQuery.data?.data || []} height={300} unit={unit} width={800} />
            )}
          </div>

          {/* One Rep Max Chart */}
          <div>
            {oneRepMaxQuery.isLoading ? (
              <div className="flex h-[300px] items-center justify-center rounded-lg bg-white shadow-sm">
                <Loader />
              </div>
            ) : oneRepMaxQuery.isError ? (
              <Alert variant="error">
                <AlertDescription>{t("statistics.error_loading_1rm")}</AlertDescription>
              </Alert>
            ) : (
              <OneRepMaxChart
                data={oneRepMaxQuery.data?.data || []}
                formula={oneRepMaxQuery.data?.formula || "Lombardi"}
                formulaDescription={oneRepMaxQuery.data?.formulaDescription || ""}
                height={300}
                unit={unit}
                width={400}
              />
            )}
          </div>

          {/* Volume Chart */}
          <div>
            {volumeQuery.isLoading ? (
              <div className="flex h-[300px] items-center justify-center rounded-lg bg-white shadow-sm">
                <Loader />
              </div>
            ) : volumeQuery.isError ? (
              <Alert variant="error">
                <AlertDescription>{t("statistics.error_loading_volume")}</AlertDescription>
              </Alert>
            ) : (
              <VolumeChart data={volumeQuery.data?.data || []} height={300} width={400} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          {t("statistics.last_updated", {
            date: formatDate(new Date(), locale),
          })}
        </div>
      </div>
    </PremiumGate>
  );
}
