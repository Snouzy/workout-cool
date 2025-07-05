"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const createFavoritedExerciseSchema = z.object({
  exerciseId: z.string(),
});

export const createFavoritedExercise = authenticatedActionClient
  .schema(createFavoritedExerciseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { exerciseId } = parsedInput;

    try {
      console.log("Checking if exercise exists:", exerciseId);

      // Check if exercise exists
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
      });

      if (!exercise) {
        throw new Error(`Exercise with id ${exerciseId} does not exist`);
      }

      console.log("Exercise found, creating favorite for user:", user.id);

      const created = await prisma.userFavoritedExercise.create({
        data: { userId: user.id, exerciseId },
      });

      console.log("Favorite created successfully:", created.id);
      return { success: true };
    } catch (error) {
      console.error("Error creating favorite exercise:", error);
      throw new Error(`Failed to add favorite: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
