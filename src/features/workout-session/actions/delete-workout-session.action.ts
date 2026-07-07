"use server";

import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const deleteWorkoutSessionSchema = z.object({
  id: z.string(),
});

export const deleteWorkoutSessionAction = authenticatedActionClient.schema(deleteWorkoutSessionSchema).action(async ({ parsedInput, ctx }) => {
  try {
    const { id } = parsedInput;

    const session = await prisma.workoutSession.findUnique({
      where: { id },
      select: { userId: true },
    });

    // Return the same error for missing and non-owned sessions so the endpoint
    // cannot be used to disclose which session ids exist.
    if (!session || session.userId !== ctx.user.id) {
      console.error("❌ Session not found:", id);
      return { serverError: "Session not found" };
    }

    // Supprimer la session (cascade supprimera automatiquement les exercices et sets)
    await prisma.workoutSession.delete({
      where: { id },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Workout session deleted successfully:", id);
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting workout session:", error);
    return { serverError: "Failed to delete workout session" };
  }
});
