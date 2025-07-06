"use client";

import { useState, useEffect } from "react";
import { createFavoritedExercise } from "@/features/exercises/actions/add-favorite-exercise.action";
import { deleteFavoritedExercise } from "@/features/exercises/actions/delete-favorite-exercise.action";
import { useSession } from "@/features/auth/lib/auth-client";
import { StarButton } from "@/components/ui/star-button";
import { brandedToast } from "@/components/ui/toast";
import { useI18n } from "locales/client";
import { useSyncFavoritedExercises, SyncStatus, LocalFavorite } from "@/features/exercises/hooks/use-sync-favorited-exercises";

interface FavoriteExerciseButtonProps {
  exerciseId: string;
  onToggleFavorite?: (exerciseId: string, isFavorited: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteExerciseButton({ exerciseId, onToggleFavorite, className, size = "md" }: FavoriteExerciseButtonProps) {
  const { getLocalFavorites, saveLocalFavorites } = useSyncFavoritedExercises();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: session } = useSession();
  const t = useI18n();

  // Load initial state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("favoritedExercises");
      if (!stored) {
        setIsFavorited(false);
        return;
      }

      const favorites: LocalFavorite[] = JSON.parse(stored);

      setIsFavorited(favorites.some((f) => f.exerciseId === exerciseId && f.status !== "deleteOnSync"));
    } catch {
      setIsFavorited(false);
    }
  }, [exerciseId]);

  const addToLocal = (exerciseId: string) => {
    const favorites = getLocalFavorites();
    const existing = favorites.find((f) => f.exerciseId === exerciseId);

    if (!existing) {
      // Add new favorite
      favorites.push({ exerciseId, status: "local" });
    } else if (existing.status === "deleteOnSync") {
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
        // If it was synced, mark as deleteOnSync so we can remove from server later
        existing.status = "deleteOnSync";
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
    // Update localStorage optimistically
    if (newFavoritedState) {
      addToLocal(exerciseId); // status: "local"
    } else {
      removeFromLocal(exerciseId);
    }

    try {
      // Only sync to server if user is logged in
      if (session) {
        if (newFavoritedState) {
          const result = await createFavoritedExercise({ exerciseId });
          if (result?.data?.success) {
            markSynced(exerciseId); // "local" → "synced"
            brandedToast({ variant: "success", title: t("commons.added_to_favorites") });
          }
        } else {
          const result = await deleteFavoritedExercise({ exerciseId });
          if (result?.data?.success) {
            removeFromLocal(exerciseId); // "deleted" → removed
          }
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

  return <StarButton isFavorited={isFavorited} isLoading={isLoading} onToggle={handleToggleFavorite} className={className} size={size} />;
}
