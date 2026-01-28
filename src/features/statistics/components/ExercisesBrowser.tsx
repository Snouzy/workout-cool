"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { ExerciseVideoModal } from "@/features/workout-session/ui/exercise-video-modal";
import { WeightProgressionChart } from "@/features/statistics/components/WeightProgressionChart";
import { VolumeChart } from "@/features/statistics/components/VolumeChart";
import { TimeframeSelector } from "@/features/statistics/components/TimeframeSelector";
import { StatisticsPreviewOverlay } from "@/features/statistics/components/StatisticsPreviewOverlay";
import { OneRepMaxChart } from "@/features/statistics/components/OneRepMaxChart";
import { ExerciseCharts } from "@/features/statistics/components/ExerciseStatisticsTab";
import { BaseExercise } from "@/entities/exercise/types/exercise.types";
import { SimpleSelect, SelectOption } from "@/components/ui/simple-select";

// API service for fetching exercises
const fetchExercises = async (params: { page?: number; limit?: number; search?: string; muscle?: string; category?: string }) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.muscle && params.muscle !== "ALL") searchParams.append("muscle", params.muscle);
  if (params.category && params.category !== "ALL") searchParams.append("category", params.category);

  const response = await fetch(`/api/exercises/all?${searchParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch exercises");
  }
  return response.json();
};

// Available muscle groups
const MUSCLE_GROUPS = [
  { value: "chest", labelKey: "workout_builder.muscles.chest" },
  { value: "latissimus_dorsi", labelKey: "workout_builder.muscles.back" },
  { value: "anterior_deltoid", labelKey: "workout_builder.muscles.shoulders" },
  { value: "biceps", labelKey: "workout_builder.muscles.biceps" },
  { value: "triceps", labelKey: "workout_builder.muscles.triceps" },
  { value: "quadriceps", labelKey: "workout_builder.muscles.quadriceps" },
  { value: "hamstrings", labelKey: "workout_builder.muscles.hamstrings" },
  { value: "rectus_abdominis", labelKey: "workout_builder.muscles.abdominals" },
  { value: "obliques", labelKey: "workout_builder.muscles.obliques" },
  { value: "glutes", labelKey: "workout_builder.muscles.glutes" },
  { value: "calves", labelKey: "workout_builder.muscles.calves" },
  { value: "forearms", labelKey: "workout_builder.muscles.forearms" },
];

const CATEGORIES = [
  { value: "push_horizontal", label: "Push Horizontal" },
  { value: "push_vertical", label: "Push Vertical" },
  { value: "pull_horizontal", label: "Pull Horizontal" },
  { value: "pull_vertical", label: "Pull Vertical" },
  { value: "core_anterior", label: "Core Anterior" },
  { value: "core_posterior", label: "Core Posterior" },
  { value: "legs", label: "Legs" },
  { value: "skills", label: "Skills" },
  { value: "mobility", label: "Mobility" },
];

// Exercise Selection Modal Component
const ExerciseSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: BaseExercise) => void;
}> = ({ isOpen, onClose, onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("ALL");
  const t = useI18n();

  const categoryOptions: SelectOption[] = [
    { value: "ALL", label: t("statistics.all_equipment") },
    ...CATEGORIES.map((cat) => ({
      value: cat.value,
      label: cat.label,
    })),
  ];

  const muscleOptions: SelectOption[] = [
    { value: "ALL", label: t("statistics.all_muscles") },
    ...MUSCLE_GROUPS.map((muscle) => ({
      value: muscle.value,
      label: getAttributeValueLabel(muscle.value, t),
    })),
  ];

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 300),
    [],
  );

  const {
    data: exercisesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exercises", searchQuery, selectedCategory, selectedMuscle],
    queryFn: () =>
      fetchExercises({
        page: 1,
        limit: 50,
        search: searchQuery || undefined,
        muscle: selectedMuscle,
        category: selectedCategory,
      }),
    enabled: isOpen,
  });

  const exercises = exercisesData?.data || [];

  const handleSearch = useCallback(
    (query: string) => {
      debouncedSearch(query);
    },
    [debouncedSearch],
  );

  const handleExerciseSelect = (exercise: BaseExercise) => {
    onSelectExercise(exercise);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box mt-32 w-full max-w-2xl h-full max-h-screen flex flex-col p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("statistics.select_exercise")}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 mb-4">
          <SimpleSelect
            aria-label="Filter by category"
            className="w-full"
            onValueChange={setSelectedCategory}
            options={categoryOptions}
            value={selectedCategory}
          />
          <SimpleSelect
            aria-label="Filter by muscle group"
            className="w-full"
            onValueChange={setSelectedMuscle}
            options={muscleOptions}
            value={selectedMuscle}
          />
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              className="input input-bordered w-ful placeholder:text-gray-500 dark:placeholder:text-gray-600 w-full"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("statistics.search_exercises")}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-error">{t("statistics.error_loading_exercises")}</p>
            </div>
          )}
          {!isLoading && exercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("statistics.no_exercises_found")}</p>
            </div>
          )}
          <div className="space-y-2">
            {exercises.map((exercise: BaseExercise) => {
              const primaryMuscleLabel = (exercise.primaryMuscles || []).map((muscle: string) => getAttributeValueLabel(muscle, t)).join(", ");
              return (
                <div
                  className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-lg cursor-pointer"
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-400 dark:border-gray-600">
                    <span className="text-xs text-gray-500">{exercise.category}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <p className="text-sm text-gray-500">{primaryMuscleLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export const ExercisesBrowser = () => {
  const [selectedExercise, setSelectedExercise] = useState<BaseExercise | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<StatisticsTimeframe>("8weeks");
  const isPremium = false;
  const t = useI18n();

  const handleExerciseSelect = (exercise: BaseExercise) => {
    setSelectedExercise(exercise);
  };

  const openExerciseSelection = () => {
    setShowExerciseModal(true);
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/premium");
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          {isPremium && (
            <div>
              <button className="btn btn-primary w-full mb-6" onClick={openExerciseSelection}>
                {t("statistics.select_exercise")}
              </button>
            </div>
          )}

          {selectedExercise && (
            <div className="bg-base-100 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedExercise.name}</h2>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{t("statistics.primary_muscle_label")}</span>
                  <span className="text-sm">{(selectedExercise.primaryMuscles || []).map((m: string) => getAttributeValueLabel(m, t)).join(", ")}</span>
                </div>
              </div>
              <div className="bg-base-200 rounded-lg p-4 mb-4">
                <div className="max-h-48 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden aspect-video border border-gray-400 dark:border-gray-700 cursor-pointer" onClick={openVideoModal}>
                  <p className="text-gray-500">{selectedExercise.category}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-base-100 rounded-lg p-4">
              <span className="hidden sm:block font-semibold">{t("statistics.title")}</span>
              <TimeframeSelector className="bg-white" onSelect={setSelectedTimeframe} selected={selectedTimeframe} />
            </div>
            <div className="space-y-4">
              {selectedExercise ? (
                <ExerciseCharts exerciseId={selectedExercise.id} timeframe={selectedTimeframe} />
              ) : (
                <div className="relative gap-y-4 flex flex-col">
                  <WeightProgressionChart data={[]} height={250} unit="kg" />
                  <OneRepMaxChart data={[]} formula="Lombardi" formulaDescription="Classic 1RM estimation formula" height={250} unit="kg" />
                  <VolumeChart data={[]} height={250} />
                  <StatisticsPreviewOverlay isVisible={!isPremium} onUpgrade={handleUpgrade} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ExerciseSelectionModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onSelectExercise={handleExerciseSelect}
      />

      {selectedExercise && (
        <ExerciseVideoModal
          exercise={selectedExercise}
          onOpenChange={setShowVideoModal}
          open={showVideoModal}
        />
      )}
    </>
  );
};
