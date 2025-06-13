export interface WorkoutSession {
  id: string; // local: "local-xxx", serveur: uuid
  userId: string;
  status?: "active" | "completed" | "synced";
  startedAt: string;
  endedAt?: string;
  duration?: number;
  exercises: import("@/features/workout-session/types/workout-set").WorkoutSessionExercise[];
  currentExerciseIndex?: number;
  isActive?: boolean;
  serverId?: string; // Si synchronisé
  // ...autres champs
}

export type WorkoutSessionStatus = WorkoutSession["status"];
