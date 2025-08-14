"use server";

import { z } from "zod";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { workoutSessionStatuses } from "@/shared/lib/workout-session/types/workout-session";
import { prisma } from "@/shared/lib/prisma";
import { ALL_WORKOUT_SET_TYPES, WORKOUT_SET_UNITS_TUPLE } from "@/shared/constants/workout-set-types";
import { ERROR_MESSAGES } from "@/shared/constants/errors";
import { actionClient } from "@/shared/api/safe-actions";

const workoutSetSchema = z.object({
  id: z.string(),
  setIndex: z.number(),
  types: z.array(z.enum(ALL_WORKOUT_SET_TYPES)),
  valuesInt: z.array(z.number()).optional(),
  valuesSec: z.array(z.number()).optional(),
  units: z.array(z.enum(WORKOUT_SET_UNITS_TUPLE)).optional(),
  completed: z.boolean(),
});

const workoutSessionExerciseSchema = z.object({
  id: z.string(),
  order: z.number(),
  sets: z.array(workoutSetSchema),
});

const syncWorkoutSessionSchema = z.object({
  session: z.object({
    id: z.string(),
    userId: z.string(),
    startedAt: z.string(),
    endedAt: z.string().optional(),
    exercises: z.array(workoutSessionExerciseSchema),
    status: z.enum(workoutSessionStatuses),
    muscles: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
    rating: z.number().min(1).max(5).nullable().optional(),
    ratingComment: z.string().nullable().optional(),
  }),
});

export const syncWorkoutSessionAction = actionClient.schema(syncWorkoutSessionSchema).action(async ({ parsedInput }) => {
  try {
    const { session } = parsedInput;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!userExists) {
      console.error(`User with ID ${session.userId} does not exist`);
      return { serverError: ERROR_MESSAGES.USER_NOT_FOUND };
    }

    // Check if all exercises exist
    const exerciseIds = session.exercises.map((e) => e.id);
    const existingExercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
      select: { id: true },
    });

    const existingExerciseIds = new Set(existingExercises.map((e) => e.id));
    const missingExercises = exerciseIds.filter((id) => !existingExerciseIds.has(id));

    if (missingExercises.length > 0) {
      console.error("Missing exercises:", missingExercises);
      return { serverError: `Exercises not found: ${missingExercises.join(", ")}` };
    }

    const { status: _s, ...sessionData } = session;

    const result = await prisma.workoutSession.upsert({
      where: { id: session.id },
      create: {
        ...sessionData,
        muscles: session.muscles,
        rating: session.rating,
        ratingComment: session.ratingComment,
        exercises: {
          create: session.exercises.map((exercise) => ({
            order: exercise.order,
            exercise: { connect: { id: exercise.id } },
            sets: {
              create: exercise.sets.map((set) => ({
                setIndex: set.setIndex,
                types: set.types,
                valuesInt: set.valuesInt,
                valuesSec: set.valuesSec,
                units: set.units,
                completed: set.completed,
                type: set.types && set.types.length > 0 ? set.types[0] : "NA",
              })),
            },
          })),
        },
      },
      update: {
        muscles: session.muscles,
        rating: session.rating,
        ratingComment: session.ratingComment,
        exercises: {
          deleteMany: {},
          create: session.exercises.map((exercise) => ({
            order: exercise.order,
            exercise: { connect: { id: exercise.id } },
            sets: {
              create: exercise.sets.map((set) => ({
                ...set,
                type: set.types && set.types.length > 0 ? set.types[0] : "NA",
              })),
            },
          })),
        },
      },
    });

    console.log("✅ Workout session synced successfully:", result.id);

    return { data: result };
  } catch (error) {
    console.error("❌ Error syncing workout session:", error);
    return { serverError: "Failed to sync workout session" };
  }
});
