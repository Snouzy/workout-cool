"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useSyncFavoritedExercises } from "../hooks/use-sync-favorited-exercises";

export const FavoritedExercisesSynchronizer = () => {
  const { syncFavoritedExercises } = useSyncFavoritedExercises();
  const searchParams = useSearchParams();
  const isSigninParam = searchParams.get("signin") === "true";

  useEffect(() => {
    if (isSigninParam) {
      syncFavoritedExercises();
    }
  }, [isSigninParam]);

  return null;
};
