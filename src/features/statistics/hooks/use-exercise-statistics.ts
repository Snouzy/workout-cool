"use client";

import { useQuery } from "@tanstack/react-query";

import { StatisticsTimeframe } from "@/shared/constants/statistics";

// Query keys
export const STATISTICS_QUERY_KEYS = {
  all: ["exercise-statistics"] as const,
  byExercise: (exerciseId: string) => [...STATISTICS_QUERY_KEYS.all, exerciseId] as const,
  weightProgression: (exerciseId: string, timeframe: StatisticsTimeframe) =>
    [...STATISTICS_QUERY_KEYS.byExercise(exerciseId), "weight-progression", timeframe] as const,
  oneRepMax: (exerciseId: string, timeframe: StatisticsTimeframe) =>
    [...STATISTICS_QUERY_KEYS.byExercise(exerciseId), "one-rep-max", timeframe] as const,
  volume: (exerciseId: string, timeframe: StatisticsTimeframe) =>
    [...STATISTICS_QUERY_KEYS.byExercise(exerciseId), "volume", timeframe] as const,
};

// Fetch functions
async function fetchWeightProgression(exerciseId: string, timeframe: StatisticsTimeframe) {
  const response = await fetch(`/api/exercises/${exerciseId}/statistics/weight-progression?timeframe=${timeframe}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch weight progression");
  }

  return response.json();
}

async function fetchOneRepMax(exerciseId: string, timeframe: StatisticsTimeframe) {
  const response = await fetch(`/api/exercises/${exerciseId}/statistics/one-rep-max?timeframe=${timeframe}`, { credentials: "include" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch one-rep max data");
  }

  return response.json();
}

async function fetchVolume(exerciseId: string, timeframe: StatisticsTimeframe) {
  const response = await fetch(`/api/exercises/${exerciseId}/statistics/volume?timeframe=${timeframe}`, { credentials: "include" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch volume data");
  }

  return response.json();
}

// Hook for weight progression data
export function useWeightProgression(exerciseId: string, timeframe: StatisticsTimeframe = "8weeks", enabled = true) {
  return useQuery({
    queryKey: STATISTICS_QUERY_KEYS.weightProgression(exerciseId, timeframe),
    queryFn: () => fetchWeightProgression(exerciseId, timeframe),
    enabled: enabled && !!exerciseId,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

// Hook for one-rep max data
export function useOneRepMax(exerciseId: string, timeframe: StatisticsTimeframe = "8weeks", enabled = true) {
  return useQuery({
    queryKey: STATISTICS_QUERY_KEYS.oneRepMax(exerciseId, timeframe),
    queryFn: () => fetchOneRepMax(exerciseId, timeframe),
    enabled: enabled && !!exerciseId,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

// Hook for volume data
export function useVolumeData(exerciseId: string, timeframe: StatisticsTimeframe = "8weeks", enabled = true) {
  return useQuery({
    queryKey: STATISTICS_QUERY_KEYS.volume(exerciseId, timeframe),
    queryFn: () => fetchVolume(exerciseId, timeframe),
    enabled: enabled && !!exerciseId,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}
