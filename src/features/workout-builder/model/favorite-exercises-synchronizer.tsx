"use client";

import { useEffect } from "react";

import { useSession } from "@/features/auth/lib/auth-client";

import { useSyncFavoriteExercises } from "../hooks/use-sync-favorite-exercises";

export function FavoriteExercisesSynchronizer() {
  const { syncFavoriteExercises } = useSyncFavoriteExercises();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      syncFavoriteExercises();
    }
  }, [session?.user]);

  return null;
}
