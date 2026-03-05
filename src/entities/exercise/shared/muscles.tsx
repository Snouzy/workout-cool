import { BaseExercise } from "@/entities/exercise/types/exercise.types";

export const getPrimaryMuscles = (exercise: BaseExercise): string[] => {
  return exercise.primaryMuscles || [];
};

export const getSecondaryMuscles = (exercise: BaseExercise): string[] => {
  return exercise.secondaryMuscles || [];
};
