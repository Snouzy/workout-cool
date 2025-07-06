"use server";

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const deleteFavoriteExerciseSchema = z.object({
  exerciseId: z.string(),
});

export const deleteFavoriteExercise = authenticatedActionClient
  .schema(deleteFavoriteExerciseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { exerciseId } = parsedInput;
    const deleted = await prisma.userFavoriteExercise.deleteMany({
      where: {
        userId: user.id,
        exerciseId,
      },
    });
    return { success: deleted.count > 0 };
  });
