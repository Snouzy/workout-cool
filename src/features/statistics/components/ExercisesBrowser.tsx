"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum } from "@prisma/client";

import { useI18n } from "locales/client";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { ExerciseVideoModal } from "@/features/workout-builder/ui/exercise-video-modal";
import { WorkoutBuilderExerciseWithAttributes } from "@/features/workout-builder/types";
import { EQUIPMENT_CONFIG } from "@/features/workout-builder/model/equipment-config";
import { WeightProgressionChart } from "@/features/statistics/components/WeightProgressionChart";
import { VolumeChart } from "@/features/statistics/components/VolumeChart";
import { TimeframeSelector } from "@/features/statistics/components/TimeframeSelector";
import { StatisticsPreviewOverlay } from "@/features/statistics/components/StatisticsPreviewOverlay";
import { OneRepMaxChart } from "@/features/statistics/components/OneRepMaxChart";
import { ExerciseCharts } from "@/features/statistics/components/ExerciseStatisticsTab";
import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";
import { getExerciseAttributesValueOf } from "@/entities/exercise/shared/muscles";
import { SimpleSelect, SelectOption } from "@/components/ui/simple-select";

// API service for fetching exercises
const fetchExercises = async (params: { page?: number; limit?: number; search?: string; muscle?: string; equipment?: string }) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.muscle && params.muscle !== "ALL") searchParams.append("muscle", params.muscle);
  if (params.equipment && params.equipment !== "ALL") searchParams.append("equipment", params.equipment);

  const response = await fetch(`/api/exercises/all?${searchParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch exercises");
  }
  return response.json();
};

// Available muscle groups - will be translated dynamically
const MUSCLE_GROUPS = [
  { value: "CHEST", labelKey: "workout_builder.muscles.chest" },
  { value: "BACK", labelKey: "workout_builder.muscles.back" },
  { value: "SHOULDERS", labelKey: "workout_builder.muscles.shoulders" },
  { value: "BICEPS", labelKey: "workout_builder.muscles.biceps" },
  { value: "TRICEPS", labelKey: "workout_builder.muscles.triceps" },
  { value: "QUADRICEPS", labelKey: "workout_builder.muscles.quadriceps" },
  { value: "HAMSTRINGS", labelKey: "workout_builder.muscles.hamstrings" },
  { value: "ABDOMINALS", labelKey: "workout_builder.muscles.abdominals" },
  { value: "OBLIQUES", labelKey: "workout_builder.muscles.obliques" },
  { value: "GLUTES", labelKey: "workout_builder.muscles.glutes" },
  { value: "CALVES", labelKey: "workout_builder.muscles.calves" },
  { value: "FOREARMS", labelKey: "workout_builder.muscles.forearms" },
  { value: "TRAPS", labelKey: "workout_builder.muscles.traps" },
  { value: "ADDUCTORS", labelKey: "workout_builder.muscles.adductors" },
  { value: "ABDUCTORS", labelKey: "workout_builder.muscles.abductors" },
];

// Exercise Selection Modal Component
const ExerciseSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseWithAttributes) => void;
}> = ({ isOpen, onClose, onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("ALL");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("ALL");
  const t = useI18n();

  // Prepare equipment options
  const equipmentOptions: SelectOption[] = [
    { value: "ALL", label: t("statistics.all_equipment") },
    ...EQUIPMENT_CONFIG.map((equipment) => ({
      value: equipment.value,
      label: getAttributeValueLabel(equipment.value as ExerciseAttributeValueEnum, t),
    })),
  ];

  // Prepare muscle options
  const muscleOptions: SelectOption[] = [
    { value: "ALL", label: t("statistics.all_muscles") },
    ...MUSCLE_GROUPS.map((muscle) => ({
      value: muscle.value,
      label: getAttributeValueLabel(muscle.value as ExerciseAttributeValueEnum, t),
    })),
  ];

  // Debounced search
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
    queryKey: ["exercises", searchQuery, selectedEquipment, selectedMuscle],
    queryFn: () =>
      fetchExercises({
        page: 1,
        limit: 50,
        search: searchQuery || undefined,
        muscle: selectedMuscle,
        equipment: selectedEquipment,
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

  const handleExerciseSelect = (exercise: ExerciseWithAttributes) => {
    onSelectExercise(exercise);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box mt-32 w-full max-w-2xl h-full max-h-screen flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("statistics.select_exercise")}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Filters */}
        <div className="space-y-4 mb-4">
          {/* Equipment Filter */}
          <SimpleSelect
            aria-label="Filter by equipment"
            className="w-full"
            onValueChange={setSelectedEquipment}
            options={equipmentOptions}
            value={selectedEquipment}
          />

          {/* Muscle Filter */}
          <SimpleSelect
            aria-label="Filter by muscle group"
            className="w-full"
            onValueChange={setSelectedMuscle}
            options={muscleOptions}
            value={selectedMuscle}
          />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              className="input input-bordered w-ful placeholder:text-gray-500 dark:placeholder:text-gray-600 w-full"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("statistics.search_exercises")}
            />
          </div>
        </div>

        {/* Exercise List */}
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
            {exercises.map((exercise: ExerciseWithAttributes) => {
              const primaryMuscles = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.PRIMARY_MUSCLE);
              const primaryMuscleLabel = primaryMuscles.map((muscle) => getAttributeValueLabel(muscle, t)).join(", ");

              return (
                <div
                  className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-lg cursor-pointer"
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-400 dark:border-gray-600">
                    {exercise.fullVideoImageUrl && (
                      <Image
                        alt={exercise.name || ""}
                        className="object-cover h-full w-full scale-150"
                        height={64}
                        src={exercise.fullVideoImageUrl}
                        width={64}
                      />
                    )}
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
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<StatisticsTimeframe>("8weeks");
  const { isPremium } = useUserSubscription();
  const t = useI18n();

  const handleExerciseSelect = (exercise: ExerciseWithAttributes) => {
    setSelectedExercise(exercise);
  };

  const openExerciseSelection = () => {
    setShowExerciseModal(true);
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const getExerciseEquipment = (exercise: ExerciseWithAttributes) => {
    const equipments = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.EQUIPMENT);
    return equipments.map((equipment) => getAttributeValueLabel(equipment, t));
  };

  const getExercisePrimaryMuscles = (exercise: ExerciseWithAttributes) => {
    const primaryMuscles = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.PRIMARY_MUSCLE);
    return primaryMuscles.map((muscle) => getAttributeValueLabel(muscle, t));
  };

  // Convert exercise to workout builder format
  const convertToWorkoutBuilderFormat = (exercise: ExerciseWithAttributes): WorkoutBuilderExerciseWithAttributes => {
    // Convert attributes to the expected format
    const convertedAttributes = exercise.attributes.map((attr) => ({
      id: attr.id || "",
      exerciseId: exercise.id,
      attributeNameId: "",
      attributeValueId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      attributeName: {
        id: "",
        name: typeof attr.attributeName === "string" ? attr.attributeName : attr.attributeName.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      attributeValue: {
        id: "",
        value: typeof attr.attributeValue === "string" ? attr.attributeValue : attr.attributeValue.value,
        createdAt: new Date(),
        updatedAt: new Date(),
        attributeNameId: "",
      },
    }));

    return {
      id: exercise.id,
      name: exercise.name,
      nameEn: exercise.nameEn || null,
      description: exercise.description,
      descriptionEn: exercise.descriptionEn || null,
      fullVideoUrl: exercise.fullVideoUrl || null,
      fullVideoImageUrl: exercise.fullVideoImageUrl || null,
      introduction: null,
      introductionEn: null,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      attributes: convertedAttributes,
    };
  };

  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/premium");
    console.log("Upgrade clicked");
  };

  return (
    <>
      {/* Conversion Banner */}

      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          {isPremium && (
            <div>
              <button className="btn btn-primary w-full mb-6" onClick={openExerciseSelection}>
                {t("statistics.select_exercise")}
              </button>
            </div>
          )}

          {/* Selected Exercise Info */}
          {selectedExercise && (
            <div className="bg-base-100 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedExercise.name}</h2>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{t("statistics.equipment_label")}</span>
                  <span className="text-sm">{getExerciseEquipment(selectedExercise).join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{t("statistics.primary_muscle_label")}</span>
                  <span className="text-sm">{getExercisePrimaryMuscles(selectedExercise).join(", ")}</span>
                </div>
              </div>

              {/* Exercise Image */}
              <div className="bg-base-200 rounded-lg p-4 mb-4">
                <div className="max-h-48 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden aspect-video border border-gray-400 dark:border-gray-700">
                  {selectedExercise.fullVideoImageUrl ? (
                    <Image
                      alt={selectedExercise.name}
                      className="object-cover cursor-pointer aspect-video scale-115 justify-center place-self-center"
                      height={200}
                      onClick={openVideoModal}
                      src={selectedExercise.fullVideoImageUrl}
                      width={300}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500">{t("statistics.no_image_available")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Statistics Section */}
          <div className="space-y-4">
            {/* Time period selector */}
            <div className="flex items-center justify-between bg-base-100 rounded-lg p-4">
              <span className="hidden sm:block font-semibold">{t("statistics.title")}</span>
              <TimeframeSelector className="bg-white" onSelect={setSelectedTimeframe} selected={selectedTimeframe} />
            </div>

            {/* Stats Charts */}
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

      {/* Modals - Outside the main container */}
      <ExerciseSelectionModal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onSelectExercise={handleExerciseSelect}
      />

      {selectedExercise && (
        <ExerciseVideoModal
          exercise={convertToWorkoutBuilderFormat(selectedExercise)}
          onOpenChange={setShowVideoModal}
          open={showVideoModal}
        />
      )}
    </>
  );
};
