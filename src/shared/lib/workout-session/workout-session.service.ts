import { workoutSessionLocal } from "./workout-session.local";
import { workoutSessionApi } from "./workout-session.api";

import type { WorkoutSession } from "./types/workout-session";

// À remplacer par ton vrai hook/contexte d'auth
function isUserLoggedIn(): boolean {
  return !!localStorage.getItem("userToken");
}

export const workoutSessionService = {
  getAll: async (): Promise<WorkoutSession[]> => {
    if (isUserLoggedIn()) return workoutSessionApi.getAll();
    return workoutSessionLocal.getAll();
  },
  add: async (session: WorkoutSession) => {
    if (isUserLoggedIn()) return workoutSessionApi.create(session);
    return workoutSessionLocal.add(session);
  },
  update: async (id: string, data: Partial<WorkoutSession>) => {
    if (isUserLoggedIn()) return workoutSessionApi.update(id, data);
    return workoutSessionLocal.update(id, data);
  },
  complete: async (id: string) => {
    if (isUserLoggedIn()) return workoutSessionApi.complete(id);
    return workoutSessionLocal.update(id, { status: "completed", endedAt: new Date().toISOString() });
  },
};
