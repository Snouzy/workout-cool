/* eslint-disable @typescript-eslint/no-unused-vars */
import type { WorkoutSession } from "./types/workout-session";

export const workoutSessionApi = {
  getAll: async (): Promise<WorkoutSession[]> => {
    const response = await fetch("/api/workout-sessions");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch workout sessions: ${response.status} ${response.statusText}`);
    }
    
    const sessions = await response.json();
    return sessions;
  },
  create: async (session: WorkoutSession): Promise<{ id: string }> => {
    const response = await fetch("/api/workout-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(session),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create workout session: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return { id: result.data.id };
  },
  update: async (id: string, data: Partial<WorkoutSession>) => {
    const response = await fetch(`/api/workout-sessions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update workout session: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  },
  complete: async (id: string, data?: { endedAt?: string; duration?: number; rating?: number; ratingComment?: string }) => {
    const response = await fetch(`/api/workout-sessions/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to complete workout session: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  },
};
