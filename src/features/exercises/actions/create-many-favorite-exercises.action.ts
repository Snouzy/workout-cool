"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const createManyFavoriteExercisesSchema = z.object({
  exerciseIds: z.array(z.string()),
});

export const createManyFavoriteExercises = authenticatedActionClient
  .schema(createManyFavoriteExercisesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { exerciseIds } = parsedInput;

    try {
      await prisma.userFavoriteExercise.createMany({
        data: exerciseIds.map(exerciseId => ({
          userId: user.id,
          exerciseId,
        })),
        skipDuplicates: true,
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error creating many favorite exercises:", error);
      throw new Error(`Failed to add favorites: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });