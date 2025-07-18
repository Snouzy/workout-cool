"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Search, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ExerciseAttributeNameEnum } from "@prisma/client";

import { ExerciseVideoModal } from "@/features/workout-builder/ui/exercise-video-modal";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";
import { getExerciseAttributesValueOf, getPrimaryMuscle } from "@/entities/exercise/shared/muscles";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const exerciseService = {
  async getAllExercises(params: { page?: number; limit?: number; search?: string; muscle?: string }) {
    // This would be replaced with actual API call
    const response = await fetch(`/api/exercises/all?${new URLSearchParams(params as any)}`);
    return response.json();
  },
};

interface ExerciseSelectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectExercise: (exercise: ExerciseWithAttributes) => void;
}

const MUSCLES = ["CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS", "LEGS", "ABDOMINALS"];

export const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({ open, onOpenChange, onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["exercises", "all", searchQuery, selectedMuscle],
    queryFn: () =>
      exerciseService.getAllExercises({
        limit: 50,
        search: searchQuery || undefined,
        muscle: selectedMuscle,
      }),
    enabled: open,
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleMuscleSelect = useCallback(
    (muscle: string) => {
      setSelectedMuscle(muscle === selectedMuscle ? undefined : muscle);
    },
    [selectedMuscle],
  );

  const handleExercisePress = useCallback((exercise: ExerciseWithAttributes) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  }, []);

  const handleSelectForStats = useCallback(
    (exercise: ExerciseWithAttributes) => {
      onSelectExercise(exercise);
      onOpenChange(false);
    },
    [onSelectExercise, onOpenChange],
  );

  const renderExerciseItem = useCallback(
    (exercise: ExerciseWithAttributes) => {
      const primaryMuscle = getPrimaryMuscle(exercise.attributes);

      return (
        <div
          className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          key={exercise.id}
        >
          <div className="flex-1 flex items-center gap-4 cursor-pointer" onClick={() => handleExercisePress(exercise)}>
            {exercise.fullVideoImageUrl && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                <Image alt={exercise.name} className="object-cover" fill src={exercise.fullVideoImageUrl} />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">{exercise.name}</h3>
              {primaryMuscle && (
                <Badge className="text-xs" variant="success">
                  {getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.PRIMARY_MUSCLE)}
                </Badge>
              )}
            </div>
          </div>

          <Button className="shrink-0" onClick={() => handleSelectForStats(exercise)} size="small" variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Voir les stats
          </Button>
        </div>
      );
    },
    [handleExercisePress, handleSelectForStats],
  );

  const renderMuscleFilters = useCallback(
    () => (
      <div className="flex flex-wrap gap-2 mb-6">
        {MUSCLES.map((muscle) => (
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedMuscle === muscle
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
            key={muscle}
            onClick={() => handleMuscleSelect(muscle)}
          >
            {muscle}
          </button>
        ))}
      </div>
    ),
    [selectedMuscle, handleMuscleSelect],
  );

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="flex items-center gap-4" key={i}>
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Erreur lors du chargement des exercices</p>
        </div>
      );
    }

    if (!data?.data || data.data.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-500">Aucun exercice trouvé</p>
        </div>
      );
    }

    return <div className="space-y-4">{data.data.map(renderExerciseItem)}</div>;
  }, [isLoading, error, data, renderExerciseItem]);

  return (
    <>
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-bold">Sélectionner un exercice</DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher un exercice..."
                value={searchQuery}
              />
            </div>

            {renderMuscleFilters()}
          </div>

          <ScrollArea className="max-h-96 px-6 pb-6">{renderContent()}</ScrollArea>
        </DialogContent>
      </Dialog>

      {selectedExercise && <ExerciseVideoModal exercise={selectedExercise} onOpenChange={setShowVideoModal} open={showVideoModal} />}
    </>
  );
};
