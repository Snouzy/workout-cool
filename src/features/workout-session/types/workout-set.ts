export type WorkoutSetType = "TIME" | "WEIGHT" | "REPS" | "BODYWEIGHT" | "NA";
export type WorkoutSetUnit = "kg" | "lbs";

export interface WorkoutSet {
  id: string;
  setIndex: number;
  type: WorkoutSetType;
  valueInt?: number; // reps, weight, minutes, etc.
  valueSec?: number; // seconds (if TIME)
  unit?: WorkoutSetUnit;
  completed: boolean;
}

export interface WorkoutSessionExercise {
  id: string;
  exerciseId: string;
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
}
