"use server";

import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

export const getUserFavorites = authenticatedActionClient.action(async ({ ctx }) => {
  const { user } = ctx;

  try {
    const favorites = await prisma.userFavoritedExercise.findMany({
      where: { userId: user.id },
      select: { exerciseId: true },
    });

    return { 
      favorites: favorites.map(f => f.exerciseId),
      count: favorites.length 
    };
  } catch (error) {
    console.error("Error getting user favorites:", error);
    throw new Error(`Failed to get favorites: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});