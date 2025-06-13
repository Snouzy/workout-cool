import type { WorkoutSession } from "./types/workout-session";

const STORAGE_KEY = "workoutSessions";
const MAX_SESSIONS = 10;
const CURRENT_SESSION_KEY = "currentWorkoutSessionId";

function getAll(): WorkoutSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(sessions: WorkoutSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(-MAX_SESSIONS)));
}

function getById(id: string): WorkoutSession | undefined {
  return getAll().find((s) => s.id === id);
}

function setCurrent(id: string) {
  localStorage.setItem(CURRENT_SESSION_KEY, id);
}

function getCurrent(): string | null {
  return localStorage.getItem(CURRENT_SESSION_KEY);
}

export const workoutSessionLocal = {
  getAll,
  getActive: () => getAll().find((s) => s.status === "active"),
  add: (session: WorkoutSession) => {
    const sessions = getAll();
    sessions.push(session);
    saveAll(sessions);
  },
  update: (id: string, data: Partial<WorkoutSession>) => {
    const sessions = getAll().map((s) => (s.id === id ? { ...s, ...data } : s));
    saveAll(sessions);
  },
  remove: (id: string) => {
    const sessions = getAll().filter((s) => s.id !== id);
    saveAll(sessions);
  },
  markSynced: (id: string, serverId: string) => {
    const sessions = getAll().map((s) => (s.id === id ? { ...s, status: "synced" as const, serverId } : s));
    saveAll(sessions);
  },
  purgeSynced: () => {
    const sessions = getAll().filter((s) => s.status !== "synced");
    saveAll(sessions);
  },
  getById,
  setCurrent,
  getCurrent,
};
