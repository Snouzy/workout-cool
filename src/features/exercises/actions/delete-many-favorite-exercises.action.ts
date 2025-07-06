"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const deleteManyFavoriteExercisesSchema = z.object({
  exerciseIds: z.array(z.string()),
});

export const deleteManyFavoriteExercises = authenticatedActionClient
  .schema(deleteManyFavoriteExercisesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { exerciseIds } = parsedInput;

    try {
      await prisma.userFavoriteExercise.deleteMany({
        where: {
          userId: user.id,
          exerciseId: { in: exerciseIds },
        },
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting many favorite exercises:", error);
      throw new Error(`Failed to delete favorites: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });