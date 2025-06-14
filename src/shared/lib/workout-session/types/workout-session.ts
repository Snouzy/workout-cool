import { WorkoutSessionExercise } from "@/features/workout-session/types/workout-set";

export interface WorkoutSession {
  id: string; // local: "local-xxx", server: uuid
  userId: string;
  status?: "active" | "completed" | "synced";
  startedAt: string;
  endedAt?: string;
  duration?: number;
  exercises: WorkoutSessionExercise[];
  currentExerciseIndex?: number;
  isActive?: boolean;
  serverId?: string; // If synced
}

export type WorkoutSessionStatus = WorkoutSession["status"];
