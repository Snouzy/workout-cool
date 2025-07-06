"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const createFavoriteExerciseSchema = z.object({
  exerciseId: z.string(),
});

export const createFavoriteExercise = authenticatedActionClient
  .schema(createFavoriteExerciseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { exerciseId } = parsedInput;

    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
      });
      if (!exercise) {
        throw new Error(`Exercise with id ${exerciseId} does not exist`);
      }
      await prisma.userFavoriteExercise.create({
        data: { userId: user.id, exerciseId },
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating favorite exercise:", error);
      throw new Error(`Failed to add favorite: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
