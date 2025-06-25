"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Loader2 } from "lucide-react";
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
    const muscleGroupIndex = exercisesByMuscle.findIndex(group => group.muscle === muscle);
    
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
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <h3 className="font-bold text-lg mb-4">{t("workout_builder.addExercise")}</h3>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2">
              {muscleGroups?.map((group) => (
                <div className="collapse collapse-arrow bg-base-200" key={group.muscle}>
                  <input
                    checked={expandedMuscle === group.muscle}
                    name="muscle-accordion"
                    onChange={() => setExpandedMuscle(expandedMuscle === group.muscle ? null : group.muscle)}
                    type="radio"
                  />
                  <div className="collapse-title text-base font-medium flex items-center justify-between">
                    <span>{getMuscleLabel(group.muscle)}</span>
                    <span className="text-sm text-base-content/60">
                      {group.exercises.length} {t("workout_builder.exercises")}
                    </span>
                  </div>
                  <div className="collapse-content">
                    <div className="space-y-2 pt-2">
                      {group.exercises.map((exercise) => (
                        <div
                          className="flex items-center gap-3 p-3 bg-base-100 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
                          key={exercise.id}
                          onClick={() => handleAddExercise(exercise, group.muscle)}
                        >
                          {exercise.fullVideoImageUrl && (
                            <Image
                              alt={exercise.nameEn}
                              className="object-cover rounded"
                              height={64}
                              src={exercise.fullVideoImageUrl}
                              width={64}
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">
                              {locale === "en" ? exercise.nameEn : exercise.name}
                            </p>
                          </div>
                          <button className="btn btn-sm btn-primary">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            {t("commons.close")}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};