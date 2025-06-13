// src/shared/lib/storage/workout-session-storage.ts
import { v4 as uuidv4 } from "uuid";

import { WorkoutSession } from "@/features/workout-session/types/workout-set";

import { fetchSessions, createSession, updateSession } from "@/features/workout-session/model/workout-session.actions";

const STORAGE_KEY = "workout-sessions-v2";

export type SyncStatus = "pending" | "synced" | "error";

export interface LocalWorkoutSession extends WorkoutSession {
  syncStatus?: SyncStatus;
  updatedAt: string; // ISO string
}

function getNow() {
  return new Date().toISOString();
}

// --- Local Storage ---
export function getLocalSessions(): LocalWorkoutSession[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalWorkoutSession[];
  } catch {
    return [];
  }
}

export function saveLocalSessions(sessions: LocalWorkoutSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function addLocalSession(session: WorkoutSession) {
  const sessions = getLocalSessions();
  const newSession: LocalWorkoutSession = {
    ...session,
    id: session.id || uuidv4(),
    syncStatus: "pending",
    updatedAt: getNow(),
  };
  saveLocalSessions([...sessions, newSession]);
}

export function updateLocalSession(session: LocalWorkoutSession) {
  const sessions = getLocalSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx !== -1) {
    sessions[idx] = { ...session, updatedAt: getNow(), syncStatus: "pending" };
    saveLocalSessions(sessions);
  }
}

export function deleteLocalSession(sessionId: string) {
  const sessions = getLocalSessions().filter((s) => s.id !== sessionId);
  saveLocalSessions(sessions);
}

// --- Synchronisation ---
export async function syncSessions(userId: string) {
  // 1. Récupère local et distant
  const local = getLocalSessions();
  const remote = await fetchSessions(userId);

  // 2. Fusionne (par id, updatedAt)
  const merged: LocalWorkoutSession[] = [];
  const allIds = Array.from(new Set([...local.map((s) => s.id), ...remote.map((s) => s.id)]));

  for (const id of allIds) {
    const localSession = local.find((s) => s.id === id);
    const remoteSession = remote.find((s) => s.id === id);

    if (localSession && remoteSession) {
      // Conflit : on garde la plus récente
      if (new Date(localSession.updatedAt) > new Date(remoteSession.updatedAt)) {
        // Update remote
        await updateSession(userId, localSession);
        merged.push({ ...localSession, syncStatus: "synced" });
      } else {
        // Update local
        merged.push({ ...remoteSession, syncStatus: "synced" });
      }
    } else if (localSession && !remoteSession) {
      // Nouvelle session locale à pousser
      await createSession(userId, localSession);
      merged.push({ ...localSession, syncStatus: "synced" });
    } else if (!localSession && remoteSession) {
      // Nouvelle session distante à rapatrier
      merged.push({ ...remoteSession, syncStatus: "synced" });
    }
  }

  saveLocalSessions(merged);
  return merged;
}
