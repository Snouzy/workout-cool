"use client";

import { useWorkoutSessionStore } from "./workout-session.store";

export function useWorkoutSession() {
  return useWorkoutSessionStore();
}
