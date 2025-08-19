"use server";

import { headers } from "next/headers";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function copyWorkoutAction(workoutId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Get the original workout with all its data
    const originalWorkout = await prisma.workoutSession.findUnique({
      where: { id: workoutId },
      include: {
        user: {
          select: {
            isProfilePublic: true,
            id: true,
          },
        },
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    if (!originalWorkout) {
      return { error: "Workout not found" };
    }

    // Check if the workout is from a public profile or the user owns it
    if (!originalWorkout.user.isProfilePublic && originalWorkout.user.id !== session.user.id) {
      return { error: "Workout is private" };
    }

    // Create a new workout session for the current user
    const newWorkout = await prisma.workoutSession.create({
      data: {
        userId: session.user.id,
        startedAt: new Date(),
        muscles: originalWorkout.muscles,
        exercises: {
          create: originalWorkout.exercises.map((exercise, index) => ({
            exerciseId: exercise.exerciseId,
            order: index,
            sets: {
              create: exercise.sets.map((set, setIndex) => ({
                setIndex: setIndex,
                type: set.type,
                types: set.types,
                valuesInt: set.valuesInt,
                valuesSec: set.valuesSec,
                units: set.units,
                completed: false, // Reset completion status
              })),
            },
          })),
        },
      },
    });

    return { success: true, workoutId: newWorkout.id };
    
  } catch (error) {
    console.error("Copy workout error:", error);
    return { error: "Failed to copy workout" };
  }
}