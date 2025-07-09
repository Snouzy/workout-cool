"use server";

import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

export const getFavoriteExercises = authenticatedActionClient.action(async ({ ctx }) => {
  const { user } = ctx;

  try {
    const favorites = await prisma.userFavoriteExercise.findMany({
      where: {
        userId: user.id,
      },
      select: {
        exerciseId: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      success: true,
      favorites: favorites.map((f) => ({
        exerciseId: f.exerciseId,
        updatedAt: f.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error getting favorite exercises:", error);
    throw new Error(`Failed to get favorites: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});
