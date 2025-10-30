"use server";

import { z } from "zod";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

const updateWorkoutSessionSchema = z.object({
  id: z.string(),
  data: z.object({
    endedAt: z.string().optional(),
    duration: z.number().optional(),
    muscles: z.array(z.nativeEnum(ExerciseAttributeValueEnum)).optional(),
    rating: z.number().min(1).max(5).optional(),
    ratingComment: z.string().optional(),
    exercises: z.array(z.object({
      exerciseId: z.string(),
      order: z.number(),
      sets: z.array(z.object({
        setIndex: z.number(),
        type: z.string(),
        types: z.array(z.string()).optional(),
        valuesInt: z.array(z.number()).optional(),
        valuesSec: z.array(z.number()).optional(),
        units: z.array(z.string()).optional(),
        completed: z.boolean().optional(),
      })).optional(),
    })).optional(),
  }),
});

export const updateWorkoutSessionAction = actionClient
  .schema(updateWorkoutSessionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id, data } = parsedInput;

      // First, check if the session exists and belongs to the user
      const existingSession = await prisma.workoutSession.findFirst({
        where: { id },
        include: { user: true },
      });

      if (!existingSession) {
        return { serverError: "Session not found" };
      }

      // Prepare the update data
      const updateData: any = {};

      if (data.endedAt) {
        updateData.endedAt = new Date(data.endedAt);
      }

      if (data.duration !== undefined) {
        updateData.duration = data.duration;
      }

      if (data.muscles) {
        updateData.muscles = data.muscles;
      }

      if (data.rating !== undefined) {
        updateData.rating = data.rating;
      }

      if (data.ratingComment !== undefined) {
        updateData.ratingComment = data.ratingComment;
      }

      // Handle exercises update if provided
      if (data.exercises) {
        // Delete existing exercises and recreate them
        await prisma.workoutSessionExercise.deleteMany({
          where: { workoutSessionId: id },
        });

        updateData.exercises = {
          create: data.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            order: exercise.order,
            sets: exercise.sets ? {
              create: exercise.sets.map((set) => ({
                setIndex: set.setIndex,
                type: set.type as any, // Will be validated by Prisma
                types: set.types || [],
                valuesInt: set.valuesInt || [],
                valuesSec: set.valuesSec || [],
                units: set.units || [],
                completed: set.completed || false,
              })),
            } : undefined,
          })),
        };
      }

      // Update the workout session
      const updatedSession = await prisma.workoutSession.update({
        where: { id },
        data: updateData,
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

      return { data: updatedSession };
    } catch (error) {
      console.error("Error updating workout session:", error);
      return { serverError: "Failed to update workout session" };
    }
  });
