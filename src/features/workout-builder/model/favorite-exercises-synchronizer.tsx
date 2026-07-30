"use client";

import { useEffect } from "react";

import { useSyncFavoriteExercises } from "../hooks/use-sync-favorite-exercises";

import { useSession } from "@/features/auth/lib/auth-client";


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
