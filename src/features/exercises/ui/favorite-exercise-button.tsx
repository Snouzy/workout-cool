"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/features/auth/lib/auth-client";
import { StarButton } from "@/components/ui/star-button";
import { brandedToast } from "@/components/ui/toast";
import { useI18n } from "locales/client";
import { favoriteExercisesLocal, LocalFavoriteExercise } from "@/features/exercises/lib/favorite-exercises.local";
import { useSyncFavoriteExercises } from "../hooks/use-sync-favorite-exercises";

interface FavoriteExerciseButtonProps {
  exerciseId: string;
  className?: string;
}

export function FavoriteExerciseButton({ exerciseId, className }: FavoriteExerciseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { syncFavoriteExercises } = useSyncFavoriteExercises();
  const t = useI18n();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("favoriteExercises");
      if (!stored) {
        setIsFavorite(false);
        return;
      }

      const favorites: LocalFavoriteExercise[] = JSON.parse(stored);
      setIsFavorite(favorites.some((f) => f.exerciseId === exerciseId && f.status !== "deleteOnSync"));
    } catch {
      setIsFavorite(false);
    }
  }, [exerciseId]);

  function handleToggleFavorite() {
    if (isLoading) return;

    setIsLoading(true);
    const newFavoriteState = !isFavorite;
    // Update localStorage first
    if (newFavoriteState) {
      favoriteExercisesLocal.add(exerciseId); // status: "local"
      setIsFavorite(true);
      brandedToast({ title: t("commons.added_to_favorites"), variant: "success" });
    } else {
      favoriteExercisesLocal.removeById(exerciseId);
      setIsFavorite(false);
    }
    try {
      syncFavoriteExercises();
    } catch (error) {
      console.error("Failed to favorite exercise:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return <StarButton isActive={isFavorite} isLoading={isLoading} onClick={handleToggleFavorite} className={className} />;
}
