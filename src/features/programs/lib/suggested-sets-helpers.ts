import { WorkoutSetType, WorkoutSetUnit } from "@prisma/client";

export interface CreateSuggestedSetData {
  setIndex: number;
  types: WorkoutSetType[];
  valuesInt?: number[];
  valuesSec?: number[];
  units?: WorkoutSetUnit[];
}

// helpers to create suggested sets
export const SUGGESTED_SET_TEMPLATES = {
  // 3 sets of 10-12 reps with weight
  strengthTraining: (weight: number = 20): CreateSuggestedSetData[] => [
    { setIndex: 0, types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS], valuesInt: [weight, 10], units: [WorkoutSetUnit.kg] },
    { setIndex: 1, types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS], valuesInt: [weight, 12], units: [WorkoutSetUnit.kg] },
    { setIndex: 2, types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS], valuesInt: [weight, 12], units: [WorkoutSetUnit.kg] },
  ],

  // 3 sets of bodyweight
  bodyweight: (reps: number = 10): CreateSuggestedSetData[] => [
    { setIndex: 0, types: [WorkoutSetType.BODYWEIGHT, WorkoutSetType.REPS], valuesInt: [0, reps] },
    { setIndex: 1, types: [WorkoutSetType.BODYWEIGHT, WorkoutSetType.REPS], valuesInt: [0, reps] },
    { setIndex: 2, types: [WorkoutSetType.BODYWEIGHT, WorkoutSetType.REPS], valuesInt: [0, reps] },
  ],

  // timed exercises
  timed: (seconds: number = 30): CreateSuggestedSetData[] => [
    { setIndex: 0, types: [WorkoutSetType.TIME], valuesSec: [seconds] },
    { setIndex: 1, types: [WorkoutSetType.TIME], valuesSec: [seconds] },
    { setIndex: 2, types: [WorkoutSetType.TIME], valuesSec: [seconds] },
  ],
};
