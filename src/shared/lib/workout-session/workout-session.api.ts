/* eslint-disable @typescript-eslint/no-unused-vars */
import type { WorkoutSession } from "./types/workout-session";

export const workoutSessionApi = {
  getAll: async (): Promise<WorkoutSession[]> => {
    // TODO: fetch("/api/workout-sessions")
    return [];
  },
  create: async (session: WorkoutSession): Promise<{ id: string }> => {
    // TODO: POST /api/workout-sessions
    return { id: "server-uuid" };
  },
  update: async (id: string, data: Partial<WorkoutSession>) => {
    // TODO: PATCH /api/workout-sessions/:id
  },
  complete: async (id: string) => {
    // TODO: PATCH /api/workout-sessions/:id/complete
  },
};
