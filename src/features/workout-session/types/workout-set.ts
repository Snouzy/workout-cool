import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

// Calisthenics-focused workout set types
export type FormQuality = "poor" | "acceptable" | "good" | "excellent";
export type BandLevel = "none" | "light" | "medium" | "heavy" | "extra_heavy";

export interface WorkoutSet {
  id: string;
  setIndex: number;
  reps?: number;
  holdTimeSeconds?: number;
  formQuality?: FormQuality;
  bandUsed?: BandLevel;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

export interface WorkoutSessionExercise extends ExerciseWithAttributes {
  id: string;
  order: number;
  sets: WorkoutSet[];
}
