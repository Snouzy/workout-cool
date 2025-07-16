"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Search, BarChart3, Loader2 } from "lucide-react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";

import { ExerciseForStatistics } from "@/shared/types/statistics.types";
import { ExerciseVideoModal } from "@/features/workout-builder/ui/exercise-video-modal";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExercisesBrowserProps {
  onExerciseSelect: (exercise: ExerciseForStatistics) => void;
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
  const [selectedExercise, setSelectedExercise] = useState<ExerciseForStatistics | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [page, setPage] = useState(1);

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

  const handleExerciseInfoClick = useCallback((exercise: ExerciseForStatistics) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  }, []);

  const handleStatisticsClick = useCallback(
    (exercise: ExerciseForStatistics) => {
      onExerciseSelect(exercise);
    },
    [onExerciseSelect],
  );

  const getPrimaryMuscle = (exercise: ExerciseForStatistics) => {
    return exercise.attributes.find((attr) => attr.attributeName.name === "PRIMARY_MUSCLE")?.attributeValue.value || "";
  };

  const getMuscleColor = (muscle: string) => {
    const muscleColors: Record<string, string> = {
      CHEST: "bg-green-500",
      BACK: "bg-blue-500",
      SHOULDERS: "bg-orange-500",
      BICEPS: "bg-purple-500",
      TRICEPS: "bg-pink-500",
      LEGS: "bg-yellow-500",
      ABDOMINALS: "bg-red-500",
      GLUTES: "bg-violet-500",
      CALVES: "bg-cyan-500",
      FOREARMS: "bg-lime-500",
    };
    return muscleColors[muscle] || "bg-gray-500";
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
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input className="pl-10" onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher un exercice..." />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && exercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{searchQuery ? "Aucun exercice trouvé" : "Aucun exercice disponible"}</p>
        </div>
      )}

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => {
          const primaryMuscle = getPrimaryMuscle(exercise);
          const muscleColor = getMuscleColor(primaryMuscle);

          return (
            <Card className="p-4 hover:shadow-lg transition-shadow" key={exercise.id}>
              <div className="space-y-3">
                {/* Exercise Image */}
                {exercise.fullVideoImageUrl && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-100">
                    <Image alt={exercise.name} className="object-cover" fill src={exercise.fullVideoImageUrl} />
                  </div>
                )}

                {/* Exercise Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{exercise.name}</h3>

                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${muscleColor}`} />
                    <Badge className="text-xs" variant="secondary">
                      {primaryMuscle}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleExerciseInfoClick(exercise)} size="sm" variant="outline">
                    Voir l&apos;exercice
                  </Button>
                  <Button className="flex-1" onClick={() => handleStatisticsClick(exercise)} size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistiques
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      {pagination?.hasNextPage && (
        <div className="flex justify-center">
          <Button disabled={isLoading} onClick={handleLoadMore} variant="outline">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Charger plus
          </Button>
        </div>
      )}

      {/* Video Modal */}
      {selectedExercise && <ExerciseVideoModal exercise={selectedExercise} onOpenChange={setShowVideoModal} open={showVideoModal} />}
    </div>
  );
};
