import { useCallback, useEffect, useState } from "react";

import { syncLocalWorkoutSessions } from "@/shared/lib/workout-session/workout-session.sync";
import { workoutSessionService } from "@/shared/lib/workout-session/workout-session.service";
import { useNetworkStatus } from "@/shared/lib/network/use-network-status";
import { useCurrentSession } from "@/entities/user/model/useCurrentSession";

import type { WorkoutSession } from "@/shared/lib/workout-session/types/workout-session";

export function useWorkoutSessions() {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline } = useNetworkStatus();
  const session = useCurrentSession();
  const userId = session?.user?.id;

  // Charge les séances au démarrage
  useEffect(() => {
    workoutSessionService.getAll().then(setWorkoutSessions);
  }, []);

  // Sync auto quand online et connecté
  useEffect(() => {
    if (isOnline && userId) {
      setIsSyncing(true);
      syncLocalWorkoutSessions()
        .then(() => workoutSessionService.getAll().then(setWorkoutSessions))
        .finally(() => setIsSyncing(false));
    }
  }, [isOnline, userId]);

  // Ajout
  const addWorkoutSession = useCallback((session: WorkoutSession) => {
    workoutSessionService.add(session).then(() => workoutSessionService.getAll().then(setWorkoutSessions));
  }, []);

  // Update
  const updateWorkoutSession = useCallback((id: string, data: Partial<WorkoutSession>) => {
    workoutSessionService.update(id, data).then(() => workoutSessionService.getAll().then(setWorkoutSessions));
  }, []);

  // Delete (local only for now)
  const deleteWorkoutSession = useCallback((id: string) => {
    // TODO: gérer suppression côté API si besoin
    import("@/shared/lib/workout-session/workout-session.local").then(({ workoutSessionLocal }) => {
      workoutSessionLocal.remove(id);
      workoutSessionService.getAll().then(setWorkoutSessions);
    });
  }, []);

  // Sync manuel
  const manualSync = useCallback(() => {
    if (userId) {
      setIsSyncing(true);
      syncLocalWorkoutSessions()
        .then(() => workoutSessionService.getAll().then(setWorkoutSessions))
        .finally(() => setIsSyncing(false));
    }
  }, [userId]);

  return {
    workoutSessions,
    addWorkoutSession,
    updateWorkoutSession,
    deleteWorkoutSession,
    isSyncing,
    manualSync,
  };
}
