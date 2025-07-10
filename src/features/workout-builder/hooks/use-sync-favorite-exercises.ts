"use client";

import { useEffect, useState } from "react";

import { favoriteExercisesLocal } from "@/features/workout-builder/model/favorite-exercises.local";
import { syncFavoriteExercisesAction } from "@/features/workout-builder/actions/sync-favorite-exercises.action";
import { getFavoriteExercises } from "@/features/workout-builder/actions/get-favorite-exercises.action";
import { useSession } from "@/features/auth/lib/auth-client";

interface SyncState {
  isSyncing: boolean;
  error: Error | null;
}

export function useSyncFavoriteExercises() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    error: null,
  });

  useEffect(() => {
    if (!isSessionLoading && session?.user) {
      syncFavoriteExercises();
    }
  }, [session, isSessionLoading]);

  const syncFavoriteExercises = async () => {
    if (!session?.user || syncState.isSyncing) return;
    setSyncState((prev) => ({ ...prev, isSyncing: true, error: null }));

    try {
      const res = await getFavoriteExercises();
      if (res?.serverError) {
        throw new Error(res?.serverError);
      }
      const serverFavorites = res?.data?.favorites ?? [];
      const localFavorites = favoriteExercisesLocal.getAll();
      let updatedLocalFavorites = localFavorites.map((f) => f.exerciseId);

      const unsyncedDeletes = localFavorites.filter((l) => l.status === "deleteOnSync");
      for (const unsyncedDelete of unsyncedDeletes) {
        const serverMatch = serverFavorites.find((s) => s.exerciseId === unsyncedDelete.exerciseId);
        if (!serverMatch || unsyncedDelete.updatedAt > serverMatch.updatedAt) {
          updatedLocalFavorites = updatedLocalFavorites.filter((favorite) => favorite !== unsyncedDelete.exerciseId);
        }
      }

      // Has a synced status but not persisted anymore
      const syncedStatus = localFavorites.filter(({ status }) => status === "synced");
      for (const l of syncedStatus) {
        const serverMatch = serverFavorites.find((s) => s.exerciseId === l.exerciseId);
        if (!serverMatch) {
          updatedLocalFavorites = updatedLocalFavorites.filter((favorite) => favorite !== l.exerciseId);
        }
      }

      // Add server favorites that don't exist locally
      for (const s of serverFavorites) {
        const localMatch = localFavorites.find((l) => l.exerciseId === s.exerciseId);
        if (!localMatch) {
          updatedLocalFavorites = [...updatedLocalFavorites, s.exerciseId];
        }
      }

      // Remove duplicates
      updatedLocalFavorites = [...new Set(updatedLocalFavorites)];

      favoriteExercisesLocal.saveAll(
        updatedLocalFavorites.map((id) => {
          return { exerciseId: id, updatedAt: new Date().toISOString(), status: "synced" };
        }),
      );

      const syncResult = await syncFavoriteExercisesAction({ exerciseIds: updatedLocalFavorites });
      if (syncResult?.serverError) {
        throw new Error(syncResult?.serverError);
      }
    } catch (error) {
      console.error("Failed to sync favorites:", error);
      setSyncState((prev) => ({ ...prev, error: error as Error }));
    } finally {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  };

  return {
    syncState,
    syncFavoriteExercises,
  };
}
