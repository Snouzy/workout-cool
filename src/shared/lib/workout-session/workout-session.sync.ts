import { brandedToast } from "@/components/ui/toast";

import { workoutSessionLocal } from "./workout-session.local";
import { workoutSessionApi } from "./workout-session.api";

export async function syncLocalWorkoutSessions() {
  const localSessions = workoutSessionLocal.getAll().filter((s) => s.status !== "synced");
  for (const session of localSessions) {
    try {
      const { id: serverId } = await workoutSessionApi.create(session);
      workoutSessionLocal.markSynced(session.id, serverId);
    } catch (e) {
      brandedToast({ title: "SYNC ERROR", variant: "error" });
    }
  }
  workoutSessionLocal.purgeSynced();
}
