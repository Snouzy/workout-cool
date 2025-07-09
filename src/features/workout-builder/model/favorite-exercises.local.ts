export type SyncStatus = "local" | "synced" | "deleteOnSync";

export interface LocalFavoriteExercise {
  exerciseId: string;
  status: SyncStatus;
  updatedAt: string; // ISO date string
}
export const FAVORITE_EXERICSES_STORAGE_KEY = "favoriteExercises";

function getAll(): LocalFavoriteExercise[] {
  try {
    const stored = localStorage.getItem(FAVORITE_EXERICSES_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveAll(favorites: LocalFavoriteExercise[]) {
  try {
    localStorage.setItem(FAVORITE_EXERICSES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

function removeById(exerciseId: string) {
  const favorites = favoriteExercisesLocal.getAll();
  const existing = favorites.find((f) => f.exerciseId === exerciseId);

  if (existing) {
    if (existing.status === "local") {
      // If it was never synced, just remove it completely
      const filtered = favorites.filter((f) => f.exerciseId !== exerciseId);
      favoriteExercisesLocal.saveAll(filtered);
    } else {
      // If it was synced, mark as deleteOnSync so we can remove from server later
      existing.status = "deleteOnSync";
      existing.updatedAt = new Date().toISOString();
      favoriteExercisesLocal.saveAll(favorites);
    }
  }
}

function add(exerciseId: string) {
  const favorites = getAll();
  const existing = favorites.find((f) => f.exerciseId === exerciseId);
  const now = new Date().toISOString();

  if (!existing) {
    // Add new favorite
    favorites.push({ exerciseId, status: "local", updatedAt: now });
  } else if (existing.status === "deleteOnSync") {
    // Re-add a previously deleted favorite
    existing.status = "local";
    existing.updatedAt = now;
  }

  saveAll(favorites);
}

export const favoriteExercisesLocal = {
  getAll,
  saveAll,
  removeById,
  add,
};
