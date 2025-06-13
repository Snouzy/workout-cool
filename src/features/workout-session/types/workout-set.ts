import { ExerciseWithAttributes } from "@/features/workout-builder/types";

export type WorkoutSetType = "TIME" | "WEIGHT" | "REPS" | "BODYWEIGHT" | "NA";
export type WorkoutSetUnit = "kg" | "lbs";

export interface WorkoutSet {
  id: string;
  setIndex: number;
  types: WorkoutSetType[]; // Pour supporter plusieurs colonnes
  valueInt?: number; // reps, weight, minutes, etc.
  valuesInt?: number[]; // Pour supporter plusieurs colonnes
  valueSec?: number; // seconds (if TIME)
  valuesSec?: number[]; // Pour supporter plusieurs colonnes
  unit?: WorkoutSetUnit;
  units?: WorkoutSetUnit[]; // Pour supporter plusieurs colonnes
  completed: boolean;
}

export interface WorkoutSessionExercise extends ExerciseWithAttributes {
  id: string;
  order: number;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  exercises: WorkoutSessionExercise[];
  status?: "active" | "completed" | "synced";
  currentExerciseIndex?: number;
  isActive?: boolean;
}
