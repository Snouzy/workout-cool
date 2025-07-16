"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Search, X, Plus } from "lucide-react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";
import { getPrimaryMuscle } from "@/entities/exercise/shared/muscles";
import { EQUIPMENT_CONFIG } from "@/features/workout-builder/model/equipment-config";
import { ExerciseVideoModal } from "@/features/workout-builder/ui/exercise-video-modal";
import { ExerciseWithAttributes as WorkoutBuilderExerciseWithAttributes } from "@/features/workout-builder/types";

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

// API service for fetching exercise statistics
const fetchExerciseStatistics = async (exerciseId: string, timeframe: string) => {
  const searchParams = new URLSearchParams();
  searchParams.append("timeframe", timeframe);

  const response = await fetch(`/api/exercises/${exerciseId}/statistics?${searchParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch exercise statistics");
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
    queryFn: () => fetchExercises({ 
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
    return typeof primaryMuscle?.attributeValue === "string" 
      ? primaryMuscle?.attributeValue 
      : primaryMuscle?.attributeValue?.value || null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-base-100 w-full max-w-2xl h-full max-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold">Select Exercise</h2>
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost btn-sm text-primary">
              <Plus className="h-4 w-4 mr-2" />
              Custom Exercise
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-4">
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
            <select 
              className="select select-bordered w-full"
              onChange={(e) => setSelectedMuscle(e.target.value)}
              value={selectedMuscle}
            >
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
              className="input input-bordered w-full pl-10"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Exercises"
            />
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4">
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
            <h3 className="text-lg font-semibold text-gray-500 mb-4">Popular Exercises</h3>
            {exercises.map((exercise: ExerciseWithAttributes) => {
              const primaryMuscle = getExercisePrimaryMuscle(exercise);
              const primaryMuscleLabel = primaryMuscle ? getAttributeValueLabel(primaryMuscle, t) : "";

              return (
                <div
                  className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-lg cursor-pointer"
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center overflow-hidden">
                    {exercise.fullVideoImageUrl && (
                      <Image
                        alt={exercise.name}
                        className="object-cover"
                        height={48}
                        src={exercise.fullVideoImageUrl}
                        width={48}
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
    </div>
  );
};

// Stats Chart Component with real data handling
const StatsChart: React.FC<{ title: string; data: any[]; isLoading?: boolean; error?: any }> = ({ 
  title, 
  data: _data, 
  isLoading = false, 
  error = null 
}) => (
  <div className="bg-base-100 rounded-lg p-4">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="h-48 bg-base-200 rounded-lg flex items-center justify-center">
      {isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : error ? (
        <div className="text-center">
          <p className="font-medium text-lg text-error">Error loading data</p>
          <p className="text-sm text-gray-500 mt-1">
            {error.message || "Failed to load statistics"}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-medium text-lg">Data not available</p>
          <p className="text-sm text-gray-500 mt-1">
            There is no data available for the selected timeframe.
          </p>
        </div>
      )}
    </div>
  </div>
);

export const ExercisesBrowser: React.FC<ExercisesBrowserProps> = ({ onExerciseSelect }) => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("TWELVE_WEEKS");
  const t = useI18n();

  // Fetch statistics when exercise is selected
  const {
    data: statisticsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ["exercise-statistics", selectedExercise?.id, selectedTimeframe],
    queryFn: () => fetchExerciseStatistics(selectedExercise!.id, selectedTimeframe),
    enabled: !!selectedExercise,
  });

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
    return typeof primaryMuscle?.attributeValue === "string" 
      ? primaryMuscle?.attributeValue 
      : primaryMuscle?.attributeValue?.value || null;
  };

  // Convert exercise to workout builder format
  const convertToWorkoutBuilderFormat = (exercise: ExerciseWithAttributes): WorkoutBuilderExerciseWithAttributes => {
    // Convert attributes to the expected format
    const convertedAttributes = exercise.attributes.map(attr => ({
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

  return (
    <div className="min-h-screen bg-base-300 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-6">Exercise</h1>
          
          {/* Exercise Selection Button */}
          <button 
            className="btn btn-primary w-full mb-6"
            onClick={openExerciseSelection}
          >
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
                <span className="text-sm text-gray-500">Primary Muscle Group:</span>
                <span className="text-sm">
                  {getExercisePrimaryMuscle(selectedExercise) 
                    ? getAttributeValueLabel(getExercisePrimaryMuscle(selectedExercise)!, t)
                    : "Unknown"}
                </span>
              </div>
            </div>

            {/* Exercise Image */}
            <div className="bg-base-200 rounded-lg p-4 mb-4">
              <div className="h-48 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden">
                {selectedExercise.fullVideoImageUrl ? (
                  <Image
                    alt={selectedExercise.name}
                    className="object-cover cursor-pointer"
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
            <span className="font-semibold">Statistics</span>
            <select 
              className="select select-bordered select-sm"
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              value={selectedTimeframe}
            >
              <option value="FOUR_WEEKS">Last 4 weeks</option>
              <option value="EIGHT_WEEKS">Last 8 weeks</option>
              <option value="TWELVE_WEEKS">Last 12 weeks</option>
              <option value="ONE_YEAR">Last year</option>
            </select>
          </div>

          {/* Stats Charts */}
          <div className="space-y-4">
            <StatsChart 
              data={statisticsData?.statistics?.weightProgression || []} 
              error={statsError}
              isLoading={isLoadingStats}
              title="Weight" 
            />
            <StatsChart 
              data={statisticsData?.statistics?.estimatedOneRepMax || []} 
              error={statsError}
              isLoading={isLoadingStats}
              title="One Rep Max" 
            />
            <StatsChart 
              data={statisticsData?.statistics?.volume || []} 
              error={statsError}
              isLoading={isLoadingStats}
              title="Set Volume" 
            />
          </div>
        </div>

        {/* Exercise Selection Modal */}
        <ExerciseSelectionModal
          isOpen={showExerciseModal}
          onClose={() => setShowExerciseModal(false)}
          onSelectExercise={handleExerciseSelect}
        />

        {/* Video Modal */}
        {selectedExercise && (
          <ExerciseVideoModal
            exercise={convertToWorkoutBuilderFormat(selectedExercise)}
            onOpenChange={setShowVideoModal}
            open={showVideoModal}
          />
        )}
      </div>
    </div>
  );
};