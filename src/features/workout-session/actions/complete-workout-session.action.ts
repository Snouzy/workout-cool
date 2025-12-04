"use server";

import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

const completeWorkoutSessionSchema = z.object({
  id: z.string(),
  endedAt: z.date(),
  duration: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  ratingComment: z.string().optional(),
});

export const completeWorkoutSessionAction = actionClient
  .schema(completeWorkoutSessionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, endedAt, duration, rating, ratingComment } = parsedInput;

      // First, check if the session exists
      const existingSession = await prisma.workoutSession.findFirst({
        where: { id },
      });

      if (!existingSession) {
        return { serverError: "Session not found" };
      }

      // Calculate duration if not provided
      let calculatedDuration = duration;
      if (!calculatedDuration && existingSession.startedAt) {
        calculatedDuration = Math.floor((endedAt.getTime() - existingSession.startedAt.getTime()) / 1000);
      }

      // Update the workout session to mark it as completed
      const completedSession = await prisma.workoutSession.update({
        where: { id },
        data: {
          endedAt,
          duration: calculatedDuration,
          rating,
          ratingComment,
        },
        include: {
          exercises: {
            include: {
              exercise: {
                include: {
                  attributes: {
                    include: {
                      attributeName: true,
                      attributeValue: true,
                    },
                  },
                },
              },
              sets: true,
            },
          },
        },
      });

      return { data: completedSession };
    } catch (error) {
      console.error("Error completing workout session:", error);
      return { serverError: "Failed to complete workout session" };
    }
  });
