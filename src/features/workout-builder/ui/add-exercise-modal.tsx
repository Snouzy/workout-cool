"use client";

import { useBoolean } from "usehooks-ts";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { useCurrentLocale, useI18n } from "locales/client";
import { FavoriteButton } from "@/features/workout-builder/ui/favorite-button";
import { useFavoritesModal } from "@/features/workout-builder/hooks/use-favorites-modal";

import { useWorkoutBuilderStore } from "../model/workout-builder.store";
import { getExercisesByMuscleAction } from "../actions/get-exercises-by-muscle.action";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEquipment: ExerciseAttributeValueEnum[];
}

interface ExerciseWithAttributes {
  id: string;
  name: string;
  nameEn: string;
  fullVideoImageUrl: string | null;
  attributes: Array<{
    attributeName: { name: string };
    attributeValue: { value: string };
  }>;
}

interface MuscleGroup {
  muscle: ExerciseAttributeValueEnum;
  exercises: ExerciseWithAttributes[];
}

export const AddExerciseModal = ({ isOpen, onClose, selectedEquipment }: AddExerciseModalProps) => {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [expandedMuscle, setExpandedMuscle] = useState<string | null>(null);
  const { value: isFavoritesExpanded, setTrue: openFavorites, setFalse: closeFavorites } = useBoolean(false);

  const { exercisesByMuscle, setExercisesByMuscle, setExercisesOrder, exercisesOrder } = useWorkoutBuilderStore();
  const { data: muscleGroups, isLoading } = useQuery({
    queryKey: ["exercises-by-muscle", selectedEquipment],
    queryFn: async () => {
      const result = await getExercisesByMuscleAction({ equipment: selectedEquipment });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data as MuscleGroup[];
    },
    enabled: isOpen && selectedEquipment.length > 0,
  });

  // Use the favorites hook
  const { favoriteExercises, isFavorite, handleToggleFavorite } = useFavoritesModal({
    isOpen,
    muscleGroups: muscleGroups || [],
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  const handleAddExercise = (exercise: ExerciseWithAttributes, muscle: ExerciseAttributeValueEnum) => {
    // If we're in the stepper, add to the workout builder store
    const muscleGroupIndex = exercisesByMuscle.findIndex((group) => group.muscle === muscle);

    if (muscleGroupIndex === -1) {
      const newExercisesByMuscle = [...exercisesByMuscle, { muscle, exercises: [exercise] }];
      setExercisesByMuscle(newExercisesByMuscle);
    } else {
      // Check if exercise already exists in this muscle group to avoid duplicates
      const existingExercises = exercisesByMuscle[muscleGroupIndex].exercises;
      const exerciseExists = existingExercises.some((ex: ExerciseWithAttributes) => ex.id === exercise.id);

      if (!exerciseExists) {
        const newExercisesByMuscle = [...exercisesByMuscle];
        newExercisesByMuscle[muscleGroupIndex] = {
          ...newExercisesByMuscle[muscleGroupIndex],
          exercises: [...newExercisesByMuscle[muscleGroupIndex].exercises, exercise],
        };
        setExercisesByMuscle(newExercisesByMuscle);
      }
    }

    // Only add to exercisesOrder if not already present to avoid duplicates
    const newExercisesOrder = exercisesOrder.includes(exercise.id) ? exercisesOrder : [...exercisesOrder, exercise.id];
    setExercisesOrder(newExercisesOrder);

    onClose();
  };

  const getMuscleLabel = (muscle: string) => {
    const muscleKey = muscle.toLowerCase();
    return t(("workout_builder.muscles." + muscleKey) as keyof typeof t);
  };

  if (!isOpen) return null;

  return (
    <div aria-labelledby="modal-title" aria-modal="true" className="modal modal-open" role="dialog">
      <div className="modal-box max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0 w-full bg-white dark:bg-gray-900">
        {/* Header moderne avec mascotte */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                alt="Workout Cool mascotte"
                className="rounded-full"
                height={40}
                src="/images/emojis/WorkoutCoolHappy.png"
                width={40}
              />
            </div>
            <h1 className="text-2xl font-bold text-white" id="modal-title">
              {t("workout_builder.addExercise")}
            </h1>
          </div>
          <button
            aria-label={t("commons.close")}
            className="btn btn-circle btn-sm bg-white/20 hover:bg-white/30 text-white border-0 transition-all duration-200 ease-in-out"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50 dark:bg-gray-800">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{t("commons.loading")}...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Favorites Section */}
              {favoriteExercises.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-yellow-200 dark:border-yellow-700 overflow-hidden">
                  {/* Favorites Header (Accordion Button) */}
                  <button
                    aria-controls="favorites-section"
                    aria-expanded={isFavoritesExpanded}
                    className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-800/40 dark:hover:to-orange-800/40 transition-all duration-200 ease-in-out flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    onClick={() => (isFavoritesExpanded ? closeFavorites() : openFavorites())}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{t("commons.favorites")}</span>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800/50 px-2 py-1 rounded-full">
                        {favoriteExercises.length}
                      </span>
                    </div>
                    {isFavoritesExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>

                  {/* Favorites Content */}
                  {isFavoritesExpanded && (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800" id="favorites-section">
                      {favoriteExercises.map((exercise) => (
                        <div
                          aria-label={`Ajouter ${locale === "en" ? exercise.nameEn || exercise.name : exercise.name}`}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer group"
                          key={exercise.id}
                          onClick={() => {
                            const { muscle, ...exerciseWithoutMuscle } = exercise;
                            handleAddExercise(exerciseWithoutMuscle as ExerciseWithAttributes, muscle);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              const { muscle, ...exerciseWithoutMuscle } = exercise;
                              handleAddExercise(exerciseWithoutMuscle as ExerciseWithAttributes, muscle);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex flex-col sm:flex-row">
                              {/* Image de l'exercice avec bordure colorée */}
                              <div className="relative">
                                {exercise.fullVideoImageUrl && (
                                  <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700 border-2 border-yellow-200 dark:border-yellow-600 group-hover:border-yellow-400 group-hover:shadow-lg transition-all duration-200">
                                    <Image
                                      alt={exercise.nameEn || ""}
                                      className="w-full h-full object-cover scale-[1.5]"
                                      height={64}
                                      loading="lazy"
                                      src={exercise.fullVideoImageUrl}
                                      width={64}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Favorite Button */}
                              <div className="flex items-center justify-center">
                                <FavoriteButton
                                  exerciseId={exercise.id}
                                  isFavorite={isFavorite(exercise.id)}
                                  onToggle={handleToggleFavorite}
                                />
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              {/* Nom de l'exercice */}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors leading-tight">
                                  {locale === "fr" ? exercise.name : exercise.nameEn || exercise.name}
                                </h3>
                              </div>

                              {/* Bouton d'ajout moderne */}
                              <button
                                aria-label={`Ajouter ${locale === "en" ? exercise.nameEn || exercise.name : exercise.name}`}
                                className="btn btn-sm sm:btn-md bg-green-500 hover:bg-green-600 text-white border-0 transition-all duration-200 ease-in-out group-hover:scale-105 shadow-sm hover:shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const { muscle, ...exerciseWithoutMuscle } = exercise;
                                  handleAddExercise(exerciseWithoutMuscle as ExerciseWithAttributes, muscle);
                                }}
                              >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="ml-1 font-medium">{t("commons.add")}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Muscle Groups */}
              {muscleGroups?.map((group) => (
                <div
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  key={group.muscle}
                >
                  {/* Bouton de groupe musculaire */}
                  <button
                    aria-controls={`muscle-${group.muscle}`}
                    aria-expanded={expandedMuscle === group.muscle}
                    className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/40 dark:hover:to-purple-800/40 transition-all duration-200 ease-in-out flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setExpandedMuscle(expandedMuscle === group.muscle ? null : group.muscle)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{getMuscleLabel(group.muscle)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded-full">
                        {group.exercises.length}
                      </span>
                      {expandedMuscle === group.muscle ? (
                        <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                  </button>

                  {/* Liste des exercices */}
                  {expandedMuscle === group.muscle && (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800" id={`muscle-${group.muscle}`}>
                      {group.exercises.map((exercise) => (
                        <div
                          aria-label={`Ajouter ${locale === "en" ? exercise.nameEn || exercise.name : exercise.name}`}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer group"
                          key={exercise.id}
                          onClick={() => handleAddExercise(exercise, group.muscle)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleAddExercise(exercise, group.muscle);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col sm:flex-row">
                              {/* Image de l'exercice avec bordure colorée */}
                              <div className="relative">
                                {exercise.fullVideoImageUrl && (
                                  <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 group-hover:border-green-400 group-hover:shadow-lg transition-all duration-200">
                                    <Image
                                      alt={exercise.nameEn}
                                      className="w-full h-full object-cover scale-[1.5]"
                                      height={64}
                                      loading="lazy"
                                      src={exercise.fullVideoImageUrl}
                                      width={64}
                                    />
                                  </div>
                                )}
                                {/* Badge de réussite */}
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <span className="text-xs font-bold text-yellow-900">B</span>
                                </div>
                              </div>

                              {/* Favorite Button */}
                              <div className="flex items-center justify-center">
                                <FavoriteButton
                                  exerciseId={exercise.id}
                                  isFavorite={isFavorite(exercise.id)}
                                  onToggle={handleToggleFavorite}
                                />
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              {/* Nom de l'exercice */}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight">
                                  {locale === "fr" ? exercise.name : exercise.nameEn || exercise.name}
                                </h3>
                              </div>

                              {/* Bouton d'ajout moderne */}
                              <button
                                aria-label={`Ajouter ${locale === "en" ? exercise.nameEn || exercise.name : exercise.name}`}
                                className="btn btn-sm sm:btn-md bg-green-500 hover:bg-green-600 text-white border-0 transition-all duration-200 ease-in-out group-hover:scale-105 shadow-sm hover:shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddExercise(exercise, group.muscle);
                                }}
                              >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="ml-1 font-medium">{t("commons.add")}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            aria-label={t("commons.close")}
            className="btn btn-md bg-red-500 hover:bg-red-600 w-full text-white border-0 transition-all duration-200 ease-in-out"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="ml-2 font-medium">{t("commons.close")}</span>
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
};
