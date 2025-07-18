import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

export type WorkoutSetType = "TIME" | "WEIGHT" | "REPS" | "BODYWEIGHT" | "NA";
export type WorkoutSetUnit = "kg" | "lbs";

export interface WorkoutSet {
  id: string;
  setIndex: number;
  types: WorkoutSetType[]; // To support multiple columns
  valuesInt?: number[]; // To support multiple columns
  valuesSec?: number[]; // To support multiple columns
  units?: WorkoutSetUnit[]; // Pour supporter plusieurs colonnes
  completed: boolean;
}

export interface WorkoutSessionExercise extends ExerciseWithAttributes {
  id: string;
  order: number;
  sets: WorkoutSet[];
}
