"use server";

import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const syncFavoriteExercisesSchema = z.object({
  exerciseIds: z.array(z.string()),
});

export const syncFavoriteExercisesAction = authenticatedActionClient
  .schema(syncFavoriteExercisesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { exerciseIds } = parsedInput;

    try {
      await prisma.$transaction(async (tx) => {
        // Delete all current favorites
        await tx.userFavoriteExercise.deleteMany({
          where: { userId: user.id },
        });

        // Create new favorites
        if (exerciseIds.length > 0) {
          await tx.userFavoriteExercise.createMany({
            data: exerciseIds.map((exerciseId) => ({
              userId: user.id,
              exerciseId,
            })),
          });
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error syncing favorite exercises:", error);
      throw new Error(`Failed to sync favorites: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
