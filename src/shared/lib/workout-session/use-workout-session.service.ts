import { nullToUndefined } from "@/shared/lib/format";
import { syncWorkoutSessionAction } from "@/features/workout-session/actions/sync-workout-sessions.action";
import { getWorkoutSessionsAction } from "@/features/workout-session/actions/get-workout-sessions.action";
import { deleteWorkoutSessionAction } from "@/features/workout-session/actions/delete-workout-session.action";
import { useSession } from "@/features/auth/lib/auth-client";

import { workoutSessionLocal } from "./workout-session.local";
import { workoutSessionApi } from "./workout-session.api";

import type { WorkoutSession } from "./types/workout-session";

// This is an abstraction layer to handle the local storage and/or the API calls.
// He's the orchestrator.

export const useWorkoutSessionService = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const getAll = async (): Promise<WorkoutSession[]> => {
    if (userId) {
      try {
        // Use our new API function instead of server action
        const serverSessions = await workoutSessionApi.getAll();
        const localSessions = workoutSessionLocal.getAll().filter((s) => s.status !== "synced");

        return [...localSessions, ...serverSessions].sort(
          (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
        );
      } catch (error) {
        console.error("Failed to fetch workout sessions from API, falling back to server action:", error);
        
        // Fallback to server action if API fails
        const result = await getWorkoutSessionsAction({ userId });
        if (result?.serverError) throw new Error(result.serverError);

        const serverSessions = (result?.data?.sessions || []).map((session) => ({
          ...session,
          startedAt: session.startedAt instanceof Date ? session.startedAt.toISOString() : session.startedAt,
          endedAt:
            session.endedAt instanceof Date
              ? session.endedAt.toISOString()
              : typeof session.endedAt === "string"
                ? session.endedAt
                : undefined,
          duration: nullToUndefined(session.duration),
          exercises: session.exercises.map(({ exercise, order, sets }) => ({
            ...exercise,
            order,
            sets: sets.map((set) => {
              return {
                ...set,
                units: nullToUndefined(set.units),
              };
            }),
          })),
        }));
        const localSessions = workoutSessionLocal.getAll().filter((s) => s.status !== "synced");

        return [...localSessions, ...(serverSessions as any)].sort(
          (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
        );
      }
    }

    return workoutSessionLocal.getAll().sort((a, b) => {
      const dateA = typeof a.startedAt === "string" ? new Date(a.startedAt) : a.startedAt;
      const dateB = typeof b.startedAt === "string" ? new Date(b.startedAt) : b.startedAt;
      return dateB.getTime() - dateA.getTime();
    });
  };

  const add = async (session: WorkoutSession) => {
    if (userId) {
      try {
        // Use our new API function to create the session
        const result = await workoutSessionApi.create({
          ...session,
          userId,
        });

        if (result?.id) {
          workoutSessionLocal.markSynced(session.id, result.id);
        }
      } catch (error) {
        console.error("Failed to create workout session via API, falling back to sync action:", error);
        
        // Fallback to sync action if API fails
        const result = await syncWorkoutSessionAction({
          session: {
            ...session,
            userId,
            status: "synced",
          },
        });

        if (result?.serverError) throw new Error(result.serverError);

        if (result?.data?.data) {
          workoutSessionLocal.markSynced(session.id, result.data.data.id);
        }
      }
    }

    return workoutSessionLocal.add(session);
  };

  const update = async (id: string, data: Partial<WorkoutSession>) => {
    if (userId) {
      try {
        // Use our new API function to update the session
        await workoutSessionApi.update(id, data);
      } catch (error) {
        console.error("Failed to update workout session via API:", error);
        // Still update locally even if API fails
      }
    }
    return workoutSessionLocal.update(id, data);
  };

  const complete = async (id: string, data?: { endedAt?: string; duration?: number; rating?: number; ratingComment?: string }) => {
    const completeData = {
      status: "completed" as const,
      endedAt: new Date().toISOString(),
      ...data,
    };
    
    if (userId) {
      try {
        // Use our new API function to complete the session
        await workoutSessionApi.complete(id, completeData);
      } catch (error) {
        console.error("Failed to complete workout session via API:", error);
        // Still update locally even if API fails
      }
    }
    return workoutSessionLocal.update(id, completeData);
  };

  const remove = async (id: string) => {
    if (userId) {
      const result = await deleteWorkoutSessionAction({ id });
      if (result?.serverError) throw new Error(result.serverError);
    }

    workoutSessionLocal.remove(id);
  };

  return { getAll, add, update, complete, remove };
};
