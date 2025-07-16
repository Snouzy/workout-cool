"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useI18n } from "locales/client";
import { StatisticsTimeframe } from "@/shared/types/statistics.types";
import { cn } from "@/shared/lib/utils";
import { PremiumGate } from "@/components/ui/premium-gate";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useWeightProgression, useOneRepMax, useVolumeData } from "../hooks/use-exercise-statistics";
import { WeightProgressionChart } from "./WeightProgressionChart";
import { VolumeChart } from "./VolumeChart";
import { OneRepMaxChart } from "./OneRepMaxChart";

interface ExerciseStatisticsTabProps {
  exerciseId: string;
  exerciseName: string;
  unit?: "kg" | "lbs";
  className?: string;
  timeframe: StatisticsTimeframe;
}

export function ExerciseCharts({ timeframe, exerciseId, exerciseName, unit = "kg", className }: ExerciseStatisticsTabProps) {
  const t = useI18n();

  // Fetch data for all charts
  const weightProgressionQuery = useWeightProgression(exerciseId, timeframe);
  const oneRepMaxQuery = useOneRepMax(exerciseId, timeframe);
  const volumeQuery = useVolumeData(exerciseId, timeframe);

  const handleRefresh = async () => {
    await Promise.all([weightProgressionQuery.refetch(), oneRepMaxQuery.refetch(), volumeQuery.refetch()]);
  };

  const isLoading = weightProgressionQuery.isLoading || oneRepMaxQuery.isLoading || volumeQuery.isLoading;
  const hasError = weightProgressionQuery.isError || oneRepMaxQuery.isError || volumeQuery.isError;

  return (
    <PremiumGate className={className} feature="exercise-statistics" upgradeMessage={t("statistics.premium_required")}>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button className="gap-2" disabled={isLoading} onClick={handleRefresh} size="small" variant="outline">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              {t("commons.refresh")}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {hasError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t("statistics.error_loading_data")}</AlertDescription>
          </Alert>
        )}

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weight Progression Chart */}
          <div className="lg:col-span-2">
            {weightProgressionQuery.isLoading ? (
              <div className="flex h-[300px] items-center justify-center rounded-lg bg-white shadow-sm">
                <Loader />
              </div>
            ) : weightProgressionQuery.isError ? (
              <Alert variant="destructive">
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
            date: new Date().toLocaleDateString(),
          })}
        </div>
      </div>
    </PremiumGate>
  );
}
