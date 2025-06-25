import { WorkoutSetType, WorkoutSetUnit } from "@prisma/client";

export interface CreateSuggestedSetData {
  setIndex: number;
  types: WorkoutSetType[];
  valuesInt?: number[];
  valuesSec?: number[];
  units?: WorkoutSetUnit[];
}

export function createSuggestedSetsForExercise(
  programSessionExerciseId: string,
  sets: CreateSuggestedSetData[]
) {
  return sets.map(set => ({
    programSessionExerciseId,
    setIndex: set.setIndex,
    types: set.types,
    valuesInt: set.valuesInt || [],
    valuesSec: set.valuesSec || [],
    units: set.units || [],
  }));
}

// Helper pour créer des sets typiques
export const SUGGESTED_SET_TEMPLATES = {
  // 3 séries de 10-12 reps avec poids
  strengthTraining: (weight: number = 20): CreateSuggestedSetData[] => [
    { setIndex: 0, types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS], valuesInt: [weight, 10], units: [WorkoutSetUnit.kg] },
    { setIndex: 1, types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS], valuesInt: [weight, 12], units: [WorkoutSetUnit.kg] },
    { setIndex: 2, types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS], valuesInt: [weight, 12], units: [WorkoutSetUnit.kg] },
  ],
  
  // 3 séries au poids du corps
  bodyweight: (reps: number = 10): CreateSuggestedSetData[] => [
    { setIndex: 0, types: [WorkoutSetType.BODYWEIGHT, WorkoutSetType.REPS], valuesInt: [0, reps] },
    { setIndex: 1, types: [WorkoutSetType.BODYWEIGHT, WorkoutSetType.REPS], valuesInt: [0, reps] },
    { setIndex: 2, types: [WorkoutSetType.BODYWEIGHT, WorkoutSetType.REPS], valuesInt: [0, reps] },
  ],
  
  // Exercices chronométrés (HIIT)
  timed: (seconds: number = 30): CreateSuggestedSetData[] => [
    { setIndex: 0, types: [WorkoutSetType.TIME], valuesSec: [seconds] },
    { setIndex: 1, types: [WorkoutSetType.TIME], valuesSec: [seconds] },
    { setIndex: 2, types: [WorkoutSetType.TIME], valuesSec: [seconds] },
  ],
};