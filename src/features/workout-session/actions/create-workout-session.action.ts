"use server";

import { z } from "zod";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { actionClient } from "@/shared/api/safe-actions";

const createWorkoutSessionSchema = z.object({
  userId: z.string(),
  startedAt: z.date(),
  endedAt: z.date().optional(),
  duration: z.number().optional(),
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
  muscles: z.array(z.nativeEnum(ExerciseAttributeValueEnum)).optional(),
  rating: z.number().min(1).max(5).optional(),
  ratingComment: z.string().optional(),
});

export const createWorkoutSessionAction = actionClient
  .schema(createWorkoutSessionSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { userId, startedAt, endedAt, duration, exercises, muscles, rating, ratingComment } = parsedInput;

      // Create the workout session with exercises and sets
      const workoutSession = await prisma.workoutSession.create({
        data: {
          userId,
          startedAt,
          endedAt,
          duration,
          muscles: muscles || [],
          rating,
          ratingComment,
          exercises: exercises ? {
            create: exercises.map((exercise) => ({
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
          } : undefined,
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

      return { data: workoutSession };
    } catch (error) {
      console.error("Error creating workout session:", error);
      return { serverError: "Failed to create workout session" };
    }
  });
