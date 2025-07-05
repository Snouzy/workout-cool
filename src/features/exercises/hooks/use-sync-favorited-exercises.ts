"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/features/auth/lib/auth-client";
import { createFavoritedExercise } from "@/features/exercises/actions/add-favorite-exercise.action";
import { deleteFavoritedExercise } from "@/features/exercises/actions/delete-favorite-exercise.action";

type LocalFavorite = {
  exerciseId: string;
  status: "local" | "synced" | "deleted";
};

interface SyncState {
  isSyncing: boolean;
  error: Error | null;
}

export function useSyncFavoritedExercises() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    error: null,
  });

  const syncFavoritedExercises = async () => {
    if (!session?.user || syncState.isSyncing) return;

    setSyncState((prev) => ({ ...prev, isSyncing: true, error: null }));

    try {
      const localFavorites = getLocalFavorites();
      const localToSync = localFavorites.filter((f) => f.status === "local");
      for (const fav of localToSync) {
        try {
          const result = await createFavoritedExercise({ exerciseId: fav.exerciseId });

          if (result && result.serverError) {
            console.log("result:", result);
            throw new Error(result.serverError);
          }
        } catch (error) {
          console.error(`Failed to sync favorite ${fav.exerciseId}:`, error);
        }
      }

      const deletedToSync = localFavorites.filter((f) => f.status === "deleted");
      for (const fav of deletedToSync) {
        try {
          const result = await deleteFavoritedExercise({ exerciseId: fav.exerciseId });
          if (result && result.serverError) {
            console.log("result:", result);
            throw new Error(result.serverError);
          }
        } catch (error) {
          console.error(`Failed to remove favorite ${fav.exerciseId}:`, error);
        }
      }

      const updatedFavorites = localFavorites.filter((f) => f.status !== "deleted").map((f) => ({ ...f, status: "synced" as const }));
      saveLocalFavorites(updatedFavorites);
    } catch (error) {
      console.error("Failed to sync favorites:", error);
    } finally {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  };

  const getLocalFavorites = (): LocalFavorite[] => {
    try {
      const stored = localStorage.getItem("favoriteExercises");
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      // Handle migration from old string[] format
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
        const migrated: LocalFavorite[] = parsed.map((id) => ({ exerciseId: id, status: "local" }));
        localStorage.setItem("favoriteExercises", JSON.stringify(migrated));
        return migrated;
      }

      return parsed;
    } catch {
      return [];
    }
  };

  const saveLocalFavorites = (favorites: LocalFavorite[]) => {
    try {
      localStorage.setItem("favoriteExercises", JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && session?.user) {
      syncFavoritedExercises();
    }
  }, [session, isSessionLoading]);

  return {
    syncState,
    syncFavoritedExercises,
  };
}
