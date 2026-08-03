"use server";

import { headers } from "next/headers";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

import { ExerciseWithStats } from "../types/exercise.types";

export async function getExercises(search?: string): Promise<ExerciseWithStats[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  const where = search
    ? {
        OR: [{ name: { contains: search, mode: "insensitive" as const } }, { nameEn: { contains: search, mode: "insensitive" as const } }],
      }
    : {};

  const exercises = await prisma.exercise.findMany({
    where,
    include: {
      attributes: {
        include: {
          attributeName: true,
          attributeValue: true,
        },
      },
      _count: {
        select: {
          ProgramSessionExercise: true,
          WorkoutSessionExercise: true,
          favoritesByUsers: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return exercises.map((exercise) => ({
    ...exercise,
    totalProgramUsage: exercise._count.ProgramSessionExercise,
    totalWorkoutUsage: exercise._count.WorkoutSessionExercise,
    totalFavorites: exercise._count.favoritesByUsers,
  }));
}

export async function getExerciseById(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      attributes: {
        include: {
          attributeName: true,
          attributeValue: true,
        },
      },
      _count: {
        select: {
          ProgramSessionExercise: true,
          WorkoutSessionExercise: true,
          favoritesByUsers: true,
        },
      },
    },
  });

  if (!exercise) {
    throw new Error("Exercise not found");
  }

  return {
    ...exercise,
    totalProgramUsage: exercise._count.ProgramSessionExercise,
    totalWorkoutUsage: exercise._count.WorkoutSessionExercise,
    totalFavorites: exercise._count.favoritesByUsers,
  };
}

export async function getExerciseAttributeNames() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  return await prisma.exerciseAttributeName.findMany({
    include: {
      values: true,
    },
    orderBy: { name: "asc" },
  });
}
