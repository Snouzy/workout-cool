"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { ExerciseVideoModal } from "@/features/workout-builder/ui/exercise-video-modal";
import { ExerciseWithAttributes as WorkoutBuilderExerciseWithAttributes } from "@/features/workout-builder/types";
import { EQUIPMENT_CONFIG } from "@/features/workout-builder/model/equipment-config";
import { WeightProgressionChart } from "@/features/statistics/components/WeightProgressionChart";
import { VolumeChart } from "@/features/statistics/components/VolumeChart";
import { OneRepMaxChart } from "@/features/statistics/components/OneRepMaxChart";
import { ExerciseCharts } from "@/features/statistics/components/ExerciseStatisticsTab";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";
import { getPrimaryMuscle } from "@/entities/exercise/shared/muscles";

interface ExercisesBrowserProps {
  onExerciseSelect: (exercise: ExerciseWithAttributes) => void;
}

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

// Available muscle groups
const MUSCLE_GROUPS = [
  { value: "CHEST", label: "Chest" },
  { value: "BACK", label: "Back" },
  { value: "SHOULDERS", label: "Shoulders" },
  { value: "BICEPS", label: "Biceps" },
  { value: "TRICEPS", label: "Triceps" },
  { value: "LEGS", label: "Legs" },
  { value: "ABDOMINALS", label: "Abdominals" },
  { value: "GLUTES", label: "Glutes" },
  { value: "CALVES", label: "Calves" },
  { value: "FOREARMS", label: "Forearms" },
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

  const getExercisePrimaryMuscle = (exercise: ExerciseWithAttributes) => {
    const primaryMuscle = getPrimaryMuscle(exercise.attributes);
    return typeof primaryMuscle?.attributeValue === "string" ? primaryMuscle?.attributeValue : primaryMuscle?.attributeValue?.value || null;
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box mt-32 w-full max-w-2xl h-full max-h-screen flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Select Exercise</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-4">
          {/* Equipment Filter */}
          <div className="form-control">
            <select
              className="select select-bordered w-full"
              onChange={(e) => setSelectedEquipment(e.target.value)}
              value={selectedEquipment}
            >
              <option value="ALL">All Equipment</option>
              {EQUIPMENT_CONFIG.map((equipment) => (
                <option key={equipment.value} value={equipment.value}>
                  {equipment.label}
                </option>
              ))}
            </select>
          </div>

          {/* Muscle Filter */}
          <div className="form-control">
            <select className="select select-bordered w-full" onChange={(e) => setSelectedMuscle(e.target.value)} value={selectedMuscle}>
              <option value="ALL">All Muscles</option>
              {MUSCLE_GROUPS.map((muscle) => (
                <option key={muscle.value} value={muscle.value}>
                  {muscle.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              className="input input-bordered w-ful placeholder:text-gray-500 dark:placeholder:text-gray-600 w-full"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Exercises"
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
              <p className="text-error">Error loading exercises</p>
            </div>
          )}

          {!isLoading && exercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No exercises found</p>
            </div>
          )}

          <div className="space-y-2">
            {exercises.map((exercise: ExerciseWithAttributes) => {
              const primaryMuscle = getExercisePrimaryMuscle(exercise);
              const primaryMuscleLabel = primaryMuscle ? getAttributeValueLabel(primaryMuscle, t) : "";

              return (
                <div
                  className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-lg cursor-pointer"
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-400 dark:border-gray-600">
                    {exercise.fullVideoImageUrl && (
                      <Image
                        alt={exercise.name}
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

const TIMEFRAME_OPTIONS: { value: StatisticsTimeframe; label: string }[] = [
  { value: "4weeks", label: "4 Weeks" },
  { value: "8weeks", label: "8 Weeks" },
  { value: "12weeks", label: "12 Weeks" },
  { value: "1year", label: "1 Year" },
];

export const ExercisesBrowser: React.FC<ExercisesBrowserProps> = ({ onExerciseSelect }) => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<StatisticsTimeframe>("8weeks");
  const t = useI18n();

  const handleExerciseSelect = (exercise: ExerciseWithAttributes) => {
    setSelectedExercise(exercise);
    onExerciseSelect(exercise);
  };

  const openExerciseSelection = () => {
    setShowExerciseModal(true);
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const getExerciseEquipment = (exercise: ExerciseWithAttributes) => {
    const equipment = exercise.attributes?.filter((attr) => {
      const name = typeof attr.attributeName === "string" ? attr.attributeName : attr.attributeName.name;
      return name === "EQUIPMENT";
    });
    const value = equipment?.[0]?.attributeValue;
    return typeof value === "string" ? value : value?.value || null;
  };

  const getExercisePrimaryMuscle = (exercise: ExerciseWithAttributes) => {
    const primaryMuscle = getPrimaryMuscle(exercise.attributes);
    return typeof primaryMuscle?.attributeValue === "string" ? primaryMuscle?.attributeValue : primaryMuscle?.attributeValue?.value || null;
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
      description: exercise.description || null,
      descriptionEn: exercise.descriptionEn || null,
      fullVideoUrl: exercise.fullVideoUrl || null,
      fullVideoImageUrl: exercise.fullVideoImageUrl || null,
      introduction: null,
      introductionEn: null,
      order: 0,
      slug: null,
      slugEn: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      attributes: convertedAttributes,
    };
  };

  console.log("selectedExercise:", selectedExercise);

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-6">Exercise</h1>

            {/* Exercise Selection Button */}
            <button className="btn btn-primary w-full mb-6" onClick={openExerciseSelection}>
              Select Exercise
            </button>
          </div>

          {/* Selected Exercise Info */}
          {selectedExercise && (
            <div className="bg-base-100 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedExercise.name}</h2>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Equipment:</span>
                  <span className="text-sm">{getExerciseEquipment(selectedExercise) || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Primary Muscle:</span>
                  <span className="text-sm">
                    {getExercisePrimaryMuscle(selectedExercise)
                      ? getAttributeValueLabel(getExercisePrimaryMuscle(selectedExercise)!, t)
                      : "Unknown"}
                  </span>
                </div>
              </div>

              {/* Exercise Image */}
              <div className="bg-base-200 rounded-lg p-4 mb-4">
                <div className="max-h-48 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden aspect-video border border-gray-400 dark:border-gray-700 rounded-lg">
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
                      <p className="text-gray-500">No image available</p>
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
              <span className="hidden sm:block font-semibold">Statistics</span>
              <select
                className="select select-bordered select-sm"
                onChange={(e) => setSelectedTimeframe(e.target.value as StatisticsTimeframe)}
                value={selectedTimeframe}
              >
                {TIMEFRAME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats Charts */}
            <div className="space-y-4">
              {selectedExercise ? (
                <ExerciseCharts exerciseId={selectedExercise.id} timeframe={selectedTimeframe} />
              ) : (
                <>
                  <WeightProgressionChart data={[]} height={250} unit="kg" />
                  <OneRepMaxChart data={[]} formula="Lombardi" formulaDescription="Classic 1RM estimation formula" height={250} unit="kg" />
                  <VolumeChart data={[]} height={250} />
                </>
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
