"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { useCurrentLocale, useI18n } from "locales/client";

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
    const muscleGroupIndex = exercisesByMuscle.findIndex((group) => group.muscle === muscle);

    if (muscleGroupIndex === -1) {
      setExercisesByMuscle([...exercisesByMuscle, { muscle, exercises: [exercise] }]);
    } else {
      const newExercisesByMuscle = [...exercisesByMuscle];
      newExercisesByMuscle[muscleGroupIndex] = {
        ...newExercisesByMuscle[muscleGroupIndex],
        exercises: [...newExercisesByMuscle[muscleGroupIndex].exercises, exercise],
      };
      setExercisesByMuscle(newExercisesByMuscle);
    }

    setExercisesOrder([...exercisesOrder, exercise.id]);

    onClose();
  };

  const getMuscleLabel = (muscle: string) => {
    const muscleKey = muscle.toLowerCase();
    return t(("workout_builder.muscles." + muscleKey) as keyof typeof t);
  };

  if (!isOpen) return null;

  return (
    <div aria-labelledby="modal-title" aria-modal="true" className="modal modal-open" role="dialog">
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 w-full">
        {/* Header ultra-simple avec action claire */}
        <div className="bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900" id="modal-title">
            {t("workout_builder.addExercise")}
          </h1>
          <button
            aria-label={t("commons.close")}
            className="btn btn-circle btn-lg bg-red-500 hover:bg-red-600 text-white border-0 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu principal - focus sur une seule tâche */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-xl text-gray-600 font-medium">{t("commons.loading")}...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {muscleGroups?.map((group) => (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" key={group.muscle}>
                  {/* Bouton de groupe musculaire - très visible */}
                  <button
                    aria-controls={`muscle-${group.muscle}`}
                    aria-expanded={expandedMuscle === group.muscle}
                    className="w-full p-6 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() => setExpandedMuscle(expandedMuscle === group.muscle ? null : group.muscle)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xl font-bold text-gray-900">{getMuscleLabel(group.muscle)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{group.exercises.length}</span>
                      {expandedMuscle === group.muscle ? (
                        <ChevronUp className="h-6 w-6 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                  </button>

                  {/* Liste des exercices - ultra-claire */}
                  {expandedMuscle === group.muscle && (
                    <div className="divide-y divide-gray-100" id={`muscle-${group.muscle}`}>
                      {group.exercises.map((exercise) => (
                        <div
                          aria-label={`Ajouter ${locale === "en" ? exercise.nameEn : exercise.name}`}
                          className="p-2 sm:p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
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
                          <div className="flex items-center gap-6">
                            {/* Image de l'exercice - plus grande */}
                            {exercise.fullVideoImageUrl && (
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 border-2 border-gray-400 group-hover:border-green-300 transition-colors">
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
                            <div className="flex-1 flex flex-col md:flex-row">
                              {/* Nom de l'exercice - très lisible */}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight mb-2 sm:mb-0">
                                  {locale === "en" ? exercise.nameEn : exercise.name}
                                </h3>
                              </div>

                              {/* Bouton d'ajout - action principale ultra-claire */}
                              <button
                                aria-label={`Ajouter ${locale === "en" ? exercise.nameEn : exercise.name}`}
                                className="btn sm:btn-lg bg-green-500 hover:bg-green-600 text-white border-0 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddExercise(exercise, group.muscle);
                                }}
                              >
                                <Plus className="h-6 w-6" />
                                <span className="ml-2 font-bold">{t("commons.add")}</span>
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

        {/* Footer avec action de fermeture claire */}
        <div className="bg-white border-t-2 border-gray-200 p-6">
          <div className="flex justify-center">
            <button
              aria-label={t("commons.close")}
              className="btn btn-lg bg-red-500 hover:bg-red-600 text-white border-0 transition-all duration-200 shadow-lg hover:shadow-xl px-8"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="ml-3 text-lg font-bold">{t("commons.close")}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </div>
  );
};
