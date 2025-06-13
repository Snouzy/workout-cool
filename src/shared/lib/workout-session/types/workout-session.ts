import { WorkoutSessionExercise } from "@/features/workout-session/types/workout-set";

export interface WorkoutSession {
  id: string; // local: "local-xxx", serveur: uuid
  userId: string;
  status?: "active" | "completed" | "synced";
  startedAt: string;
  endedAt?: string;
  duration?: number;
  exercises: WorkoutSessionExercise[];
  currentExerciseIndex?: number;
  isActive?: boolean;
  serverId?: string; // Si synchronisé
}

export type WorkoutSessionStatus = WorkoutSession["status"];
