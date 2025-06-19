"use server";

import { z } from "zod";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { workoutSessionStatuses } from "@/shared/lib/workout-session/types/workout-session";
import { prisma } from "@/shared/lib/prisma";
import { ALL_WORKOUT_SET_TYPES, WORKOUT_SET_UNITS_TUPLE } from "@/shared/constants/workout-set-types";
import { actionClient } from "@/shared/api/safe-actions";
import { serverAuth } from "@/entities/user/model/get-server-session-user";

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
  }),
});

export const syncWorkoutSessionAction = actionClient.schema(syncWorkoutSessionSchema).action(async ({ parsedInput }) => {
  try {
    const { session } = parsedInput;
    const user = await serverAuth();

    if (!user) {
      console.error("❌ User not authenticated");
      return { serverError: "NOT_AUTHENTICATED" };
    }

    const { status: _s, ...sessionData } = session;

    const result = await prisma.workoutSession.upsert({
      where: { id: session.id },
      create: {
        ...sessionData,
        muscles: session.muscles,
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
