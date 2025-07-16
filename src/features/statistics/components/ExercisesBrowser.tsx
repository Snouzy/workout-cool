"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Search, Loader2, Play, TrendingUp, Filter, Sparkles } from "lucide-react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { ExerciseVideoModal } from "@/features/workout-builder/ui/exercise-video-modal";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";
import { getPrimaryMuscle, getSecondaryMuscles } from "@/entities/exercise/shared/muscles";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExercisesBrowserProps {
  onExerciseSelect: (exercise: ExerciseWithAttributes) => void;
}

// Mock service - replace with actual API call
const fetchExercises = async (params: { page?: number; limit?: number; search?: string }) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);

  const response = await fetch(`/api/exercises/all?${searchParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch exercises");
  }
  return response.json();
};

export const ExercisesBrowser: React.FC<ExercisesBrowserProps> = ({ onExerciseSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [page, setPage] = useState(1);
  const t = useI18n();

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
        setPage(1);
      }, 300),
    [],
  );

  const {
    data: exercisesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exercises", searchQuery, page],
    queryFn: () => fetchExercises({ page, limit: 20, search: searchQuery || undefined }),
    enabled: true,
  });

  const exercises = exercisesData?.data || [];
  const pagination = exercisesData?.pagination;

  const handleSearch = useCallback(
    (query: string) => {
      debouncedSearch(query);
    },
    [debouncedSearch],
  );

  const handleExerciseInfoClick = useCallback((exercise: ExerciseWithAttributes) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  }, []);

  const handleStatisticsClick = useCallback(
    (exercise: ExerciseWithAttributes) => {
      onExerciseSelect(exercise);
    },
    [onExerciseSelect],
  );

  const getMuscleEmoji = (muscle: string) => {
    const muscleEmojis: Record<string, string> = {
      CHEST: "WorkoutCoolBiceps.png",
      BACK: "WorkoutCoolSwag.png",
      SHOULDERS: "WorkoutCoolHappy.png",
      BICEPS: "WorkoutCoolLove.png",
      TRICEPS: "WorkoutCoolTeeths.png",
      LEGS: "WorkoutCoolWooow.png",
      ABDOMINALS: "WorkoutCoolYeahOk.png",
      GLUTES: "WorkoutCoolRich.png",
      CALVES: "WorkoutCoolHuuuu.png",
      FOREARMS: "WorkoutCoolShoked.png",
    };
    return muscleEmojis[muscle] || "WorkoutCoolHappy.png";
  };

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des exercices</p>
          <Button onClick={() => refetch()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Image
              alt="Workout Cool Mascot"
              className="hover:scale-105 transition-transform duration-150"
              height={64}
              src="/images/emojis/WorkoutCoolHappy.png"
              width={64}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Tes Exercices
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">Découvre et analyse tes performances 💪</p>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <Input
            className="w-full pl-14 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#4F8EF7] focus:border-[#4F8EF7] transition-colors duration-200 shadow-sm text-center font-medium"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher un exercice..."
          />
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#4F8EF7]" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Chargement des exercices...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && exercises.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <Image alt="No exercises found" className="mx-auto" height={64} src="/images/emojis/WorkoutCoolDisapointed.png" width={64} />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {searchQuery ? "Aucun exercice trouvé" : "Aucun exercice disponible"}
              </p>
              {searchQuery && <p className="text-gray-500 dark:text-gray-400">Essayez avec d&apos;autres mots-clés 🔍</p>}
            </div>
          </div>
        )}

        {/* Modern Exercise Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {exercises.map((exercise: ExerciseWithAttributes) => {
            const primaryMuscle = getPrimaryMuscle(exercise.attributes);
            const secondaryMuscles = getSecondaryMuscles(exercise.attributes);
            const primaryMuscleValue =
              typeof primaryMuscle?.attributeValue === "string" ? primaryMuscle?.attributeValue : primaryMuscle?.attributeValue.value;

            const secondaryMusclesValues = secondaryMuscles.map((muscle) =>
              typeof muscle.attributeValue === "string" ? muscle.attributeValue : muscle.attributeValue.value,
            );

            let primaryMuscleLabel = "";
            if (primaryMuscleValue) {
              primaryMuscleLabel = getAttributeValueLabel(primaryMuscleValue, t);
            }

            let secondaryMusclesLabels: string[] = [];

            if (secondaryMusclesValues.length > 0) {
              secondaryMusclesLabels = secondaryMusclesValues.map((value) => getAttributeValueLabel(value, t));
            }

            return (
              <Card
                className="group relative overflow-hidden rounded-2xl border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#4F8EF7] dark:hover:border-[#4F8EF7] transition-colors duration-150 cursor-pointer shadow-sm hover:shadow-md"
                key={exercise.id}
              >
                <div className="p-6 space-y-4">
                  {/* Exercise Image with Gradient Overlay */}
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                    {exercise.fullVideoImageUrl && (
                      <>
                        <Image
                          alt={exercise.name}
                          className="object-cover scale-105 dark:border-gray-700 transition-transform duration-500 group-hover:scale-110"
                          fill
                          src={exercise.fullVideoImageUrl}
                        />
                        <div
                          className={"absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300"}
                        />
                      </>
                    )}
                  </div>

                  {/* Exercise Info */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-[#4F8EF7] transition-colors duration-200">
                      {exercise.name}
                    </h3>

                    {/* Primary Muscle */}
                    <div className="flex items-center gap-1.5">
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-200">{primaryMuscleLabel}</span>
                      </div>
                    </div>

                    {/* Secondary Muscles */}
                    {secondaryMusclesLabels.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-wrap gap-1">
                          {secondaryMusclesLabels.map((label, index) => (
                            <div
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                              key={index}
                            >
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-0 font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                      onClick={() => handleExerciseInfoClick(exercise)}
                      size="small"
                      variant="outline"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button
                      className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#3D7CE6] hover:from-[#3D7CE6] hover:to-[#2A6FD4] text-white border-0 font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                      onClick={() => handleStatisticsClick(exercise)}
                      size="small"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Stats
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Load More Button */}
        {pagination?.hasNextPage && (
          <div className="flex justify-center pt-8">
            <Button
              className="group relative overflow-hidden rounded-full px-8 py-4 bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] hover:from-[#3D7CE6] hover:to-[#1FAB68] text-white border-0 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              disabled={isLoading}
              onClick={handleLoadMore}
              variant="outline"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-3" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Image
                      alt="Plus"
                      className="mr-3 transition-transform duration-300 group-hover:scale-110"
                      height={24}
                      src="/images/emojis/WorkoutCoolHappy.png"
                      width={24}
                    />
                    Charger plus d&apos;exercices
                    <Sparkles className="h-4 w-4 ml-3 opacity-80" />
                  </>
                )}
              </div>
            </Button>
          </div>
        )}

        {/* Video Modal */}
        {selectedExercise && <ExerciseVideoModal exercise={selectedExercise} onOpenChange={setShowVideoModal} open={showVideoModal} />}
      </div>
    </div>
  );
};
