"use server";

import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

const getWorkoutSessionsSchema = z.object({
  userId: z.string().optional(),
});

export const getWorkoutSessionsAction = actionClient.schema(getWorkoutSessionsSchema).action(async ({ parsedInput }) => {
  try {
    const { userId } = parsedInput;

    if (!userId) {
      return { serverError: "User ID is required" };
    }

    const sessions = await prisma.workoutSession.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });
    return { sessions };
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    return { serverError: "Failed to fetch workout sessions" };
  }
});
