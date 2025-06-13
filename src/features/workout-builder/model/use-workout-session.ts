"use client";

import { useWorkoutSessionStore } from "@/features/workout-session/model/workout-session.store";

export function useWorkoutSession(sessionId?: string) {
  // Le paramètre sessionId n'est plus utilisé ici, la logique de persistance reste dans workoutSessionLocal
  // (si besoin, on peut l'utiliser pour charger une session spécifique dans le store)
  return useWorkoutSessionStore();
}
