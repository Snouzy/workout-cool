"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useSyncFavoriteExercises } from "../hooks/use-sync-favorite-exercises";

export function FavoriteExercisesSynchronizer() {
  const { syncFavoriteExercises } = useSyncFavoriteExercises();
  const searchParams = useSearchParams();
  const isSigninParam = searchParams.get("signin") === "true";

  useEffect(() => {
    if (isSigninParam) {
      syncFavoriteExercises();
    }
  }, [isSigninParam]);

  return null;
}
