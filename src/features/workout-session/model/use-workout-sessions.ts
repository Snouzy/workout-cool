// src/features/workout-session/model/use-workout-sessions.ts
import { useCallback, useEffect, useState } from "react";

import {
  getLocalSessions,
  addLocalSession,
  updateLocalSession,
  deleteLocalSession,
  syncSessions,
  LocalWorkoutSession,
} from "@/shared/lib/storage/workout-session-storage";
import { useSession } from "@/features/auth/lib/auth-client";

import { useNetworkStatus } from "@/shared/lib/network/use";

export function useWorkoutSessions() {
  const [sessions, setSessions] = useState<LocalWorkoutSession[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline } = useNetworkStatus();
  const { data: authSession } = useSession(); // ou ton hook d'auth
  const userId = authSession?.user?.id;

  // Charge les séances locales au démarrage
  useEffect(() => {
    setSessions(getLocalSessions());
  }, []);

  // Sync auto quand online
  useEffect(() => {
    if (isOnline && userId) {
      setIsSyncing(true);
      syncSessions(userId)
        .then(setSessions)
        .finally(() => setIsSyncing(false));
    }
  }, [isOnline, userId]);

  // Ajout
  const addSession = useCallback((session) => {
    addLocalSession(session);
    setSessions(getLocalSessions());
  }, []);

  // Update
  const updateSession = useCallback((session) => {
    updateLocalSession(session);
    setSessions(getLocalSessions());
  }, []);

  // Delete
  const deleteSession = useCallback((sessionId) => {
    deleteLocalSession(sessionId);
    setSessions(getLocalSessions());
  }, []);

  // Sync manuel
  const manualSync = useCallback(() => {
    if (userId) {
      setIsSyncing(true);
      syncSessions(userId)
        .then(setSessions)
        .finally(() => setIsSyncing(false));
    }
  }, [userId]);

  return {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    isSyncing,
    manualSync,
  };
}
