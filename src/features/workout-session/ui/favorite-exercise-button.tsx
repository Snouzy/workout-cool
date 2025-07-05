"use client";

import { useState, useEffect } from "react";
import { createFavoritedExercise } from "@/features/exercises/actions/add-favorite-exercise.action";
import { deleteFavoritedExercise } from "@/features/exercises/actions/delete-favorite-exercise.action";
import { useSession } from "@/features/auth/lib/auth-client";
import { StarButton } from "@/components/ui/star-button";

type SyncStatus = "local" | "synced" | "deleted";

interface LocalFavorite {
  exerciseId: string;
  status: SyncStatus;
}

interface FavoriteExerciseButtonProps {
  exerciseId: string;
  onToggleFavorite?: (exerciseId: string, isFavorited: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteExerciseButton({ exerciseId, onToggleFavorite, className, size = "md" }: FavoriteExerciseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: session } = useSession();

  // Load initial state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("favoriteExercises");
      if (!stored) {
        setIsFavorited(false);
        return;
      }

      const parsed = JSON.parse(stored);

      // Handle migration from old string[] format
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
        const migrated: LocalFavorite[] = parsed.map((id) => ({ exerciseId: id, status: "local" }));
        localStorage.setItem("favoriteExercises", JSON.stringify(migrated));
        setIsFavorited(migrated.some((f) => f.exerciseId === exerciseId));
        return;
      }

      // New format
      const favorites: LocalFavorite[] = parsed;
      setIsFavorited(favorites.some((f) => f.exerciseId === exerciseId && f.status !== "deleted"));
    } catch {
      setIsFavorited(false);
    }
  }, [exerciseId]);

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

  const addToLocal = (exerciseId: string) => {
    const favorites = getLocalFavorites();
    const existing = favorites.find((f) => f.exerciseId === exerciseId);

    if (!existing) {
      // Add new favorite
      favorites.push({ exerciseId, status: "local" });
    } else if (existing.status === "deleted") {
      // Re-add a previously deleted favorite
      existing.status = "local";
    }
    // If already exists and not deleted, do nothing
    
    saveLocalFavorites(favorites);
    setIsFavorited(true);
  };

  const removeFromLocal = (exerciseId: string) => {
    const favorites = getLocalFavorites();
    const existing = favorites.find((f) => f.exerciseId === exerciseId);
    
    if (existing) {
      if (existing.status === "local") {
        // If it was never synced, just remove it completely
        const filtered = favorites.filter((f) => f.exerciseId !== exerciseId);
        saveLocalFavorites(filtered);
      } else {
        // If it was synced, mark as deleted so we can remove from server later
        existing.status = "deleted";
        saveLocalFavorites(favorites);
      }
    }
    
    setIsFavorited(false);
  };

  const markSynced = (exerciseId: string) => {
    const status: SyncStatus = "synced";
    const favorites = getLocalFavorites().map((f) => (f.exerciseId === exerciseId ? { ...f, status } : f));
    saveLocalFavorites(favorites);
  };

  const handleToggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newFavoritedState = !isFavorited;
    // Always update localStorage first (optimistic)
    if (newFavoritedState) {
      addToLocal(exerciseId); // status: "local"
    } else {
      removeFromLocal(exerciseId);
    }

    try {
      // Only sync to server if user is logged in
      console.log(session);
      if (session) {
        if (newFavoritedState) {
          console.log("Creating favorite for exerciseId:", exerciseId);
          const result = await createFavoritedExercise({ exerciseId });
          console.log(result);
          if (result?.data?.success) {
            markSynced(exerciseId); // "local" → "synced"
          }
        } else {
          await deleteFavoritedExercise({ exerciseId });
        }
      }

      onToggleFavorite?.(exerciseId, newFavoritedState);
    } catch (error) {
      // Rollback on error
      if (newFavoritedState) {
        removeFromLocal(exerciseId);
      } else {
        addToLocal(exerciseId);
      }
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StarButton
      isFavorited={isFavorited}
      isLoading={isLoading}
      onToggle={handleToggleFavorite}
      className={className}
      size={size}
    />
  );
}
