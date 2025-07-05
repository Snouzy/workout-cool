"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const deleteFavoritedExerciseSchema = z.object({
  exerciseId: z.string(),
});

export const deleteFavoritedExercise = authenticatedActionClient
  .schema(deleteFavoritedExerciseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { exerciseId } = parsedInput;

    const deleted = await prisma.userFavoritedExercise.deleteMany({
      where: {
        userId: user.id,
        exerciseId,
      },
    });

    return { success: deleted.count > 0 };
  });
