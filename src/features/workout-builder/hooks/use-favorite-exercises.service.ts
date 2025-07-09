import { useSession } from "@/features/auth/lib/auth-client";

import { favoriteExercisesLocal } from "../model/favorite-exercises.local";
import { syncFavoriteExercisesAction } from "../actions/sync-favorite-exercises.action";
import { getFavoriteExercises } from "../actions/get-favorite-exercises.action";

export const useFavoriteExercisesService = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Optimized: Only read local storage, no API calls for immediate operations
  const getAll = (): string[] => {
    return favoriteExercisesLocal
      .getAll()
      .filter((f) => f.status !== "deleteOnSync")
      .map((f) => f.exerciseId);
  };

  const isFavorite = (exerciseId: string): boolean => {
    const favorites = getAll();
    return favorites.includes(exerciseId);
  };

  const add = (exerciseId: string): void => {
    favoriteExercisesLocal.add(exerciseId);

    // Background sync - don't await to avoid blocking
    if (userId) {
      syncInBackground();
    }
  };

  const remove = (exerciseId: string): void => {
    favoriteExercisesLocal.removeById(exerciseId);

    // Background sync - don't await to avoid blocking
    if (userId) {
      syncInBackground();
    }
  };

  const toggle = (exerciseId: string): void => {
    const isCurrentlyFavorite = isFavorite(exerciseId);

    if (isCurrentlyFavorite) {
      remove(exerciseId);
    } else {
      add(exerciseId);
    }
  };

  // Background sync function that doesn't block UI
  const syncInBackground = async (): Promise<void> => {
    try {
      const favorites = getAll();
      const result = await syncFavoriteExercisesAction({ exerciseIds: favorites });
      if (result?.serverError) {
        console.error("Background sync failed:", result.serverError);
      }
    } catch (error) {
      console.error("Background sync error:", error);
    }
  };

  const fetchServerFavorites = async (): Promise<string[]> => {
    if (!userId) return [];

    try {
      const result = await getFavoriteExercises();
      if (result?.serverError) throw new Error(result.serverError);
      return (result?.data?.favorites || []).map((f) => f.exerciseId);
    } catch (error) {
      console.error("Failed to fetch server favorites:", error);
      return [];
    }
  };

  return {
    getAll,
    isFavorite,
    add,
    remove,
    toggle,
    fetchServerFavorites,
    syncInBackground,
  };
};
