import { WorkoutSessionExercise } from "@/features/workout-session/types/workout-set";

export const workoutSessionStatuses = ["active", "completed", "synced"] as const;
export type WorkoutSessionStatus = (typeof workoutSessionStatuses)[number];

export interface WorkoutSession {
  id: string; // local: "local-xxx", server: uuid
  userId: string;
  status?: WorkoutSessionStatus;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  exercises: WorkoutSessionExercise[];
  currentExerciseIndex?: number;
  isActive?: boolean;
  serverId?: string; // If synced
  muscles: string[];
}
