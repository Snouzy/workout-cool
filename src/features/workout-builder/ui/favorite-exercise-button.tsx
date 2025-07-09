"use client";

import { useState, useEffect } from "react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import {
  FAVORITE_EXERICSES_STORAGE_KEY,
  favoriteExercisesLocal,
  LocalFavoriteExercise,
} from "@/features/workout-builder/model/favorite-exercises.local";
import { brandedToast } from "@/components/ui/toast";
import { StarButton } from "@/components/ui/star-button";

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
  const text = isFavorite ? t("commons.remove_from_favorites") : t("commons.add_to_favorites");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITE_EXERICSES_STORAGE_KEY);
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

  return (
    <StarButton className={cn("mb-2", className)} isActive={isFavorite} isLoading={isLoading} onClick={handleToggleFavorite}>
      <span className="text-sm text-slate-500 dark:text-slate-400">{text}</span>
    </StarButton>
  );
}
