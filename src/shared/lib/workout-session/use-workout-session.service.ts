import { nullToUndefined } from "@/shared/lib/format";
import { syncWorkoutSessionAction } from "@/features/workout-session/actions/sync-workout-sessions.action";
import { getWorkoutSessionsAction } from "@/features/workout-session/actions/get-workout-sessions.action";
import { deleteWorkoutSessionAction } from "@/features/workout-session/actions/delete-workout-session.action";
import { useSession } from "@/features/auth/lib/auth-client";

import { workoutSessionLocal } from "./workout-session.local";

import type { WorkoutSession } from "./types/workout-session";

// This is an abstraction layer to handle the local storage and/or the API calls.
// He's the orchestrator.

export const useWorkoutSessionService = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const getAll = async (): Promise<WorkoutSession[]> => {
    if (userId) {
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

    return workoutSessionLocal.getAll().sort((a, b) => {
      const dateA = typeof a.startedAt === "string" ? new Date(a.startedAt) : a.startedAt;
      const dateB = typeof b.startedAt === "string" ? new Date(b.startedAt) : b.startedAt;
      return dateB.getTime() - dateA.getTime();
    });
  };

  const add = async (session: WorkoutSession) => {
    if (userId) {
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

    return workoutSessionLocal.add(session);
  };

  const update = async (_id: string, _data: Partial<WorkoutSession>) => {
    // if (userId) {
    //   // TODO: create updateWorkoutSessionAction
    //   const result = await updateWorkoutSessionAction({ id, data });
    //   if (result.serverError) throw new Error(result.serverError);
    // }
    // return workoutSessionLocal.update(id, data);
  };

  const complete = async (_id: string) => {
    // const data = {
    //   status: "completed" as const,
    //   endedAt: new Date().toISOString(),
    // };
    // if (isUserLoggedIn()) {
    //   const result = await completeWorkoutSessionAction({ id });
    //   if (result.serverError) throw new Error(result.serverError);
    // }
    // return workoutSessionLocal.update(id, data);
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
