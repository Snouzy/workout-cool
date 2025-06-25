"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, WorkoutSetType, WorkoutSetUnit } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

import { ExerciseWithAttributes } from "../types/program.types";

interface SuggestedSetData {
  setIndex: number;
  types: WorkoutSetType[];
  valuesInt?: number[];
  valuesSec?: number[];
  units?: WorkoutSetUnit[];
}

interface AddExerciseData {
  sessionId: string;
  exerciseId: string;
  order: number;
  instructions: string;
  instructionsEn: string;
  suggestedSets: SuggestedSetData[];
}

export async function addExerciseToSession(data: AddExerciseData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Check if exercise already exists in this session at this order
  const existingExercise = await prisma.programSessionExercise.findUnique({
    where: {
      sessionId_order: {
        sessionId: data.sessionId,
        order: data.order,
      },
    },
  });

  if (existingExercise) {
    throw new Error(`Un exercice existe déjà à la position ${data.order}`);
  }

  const programSessionExercise = await prisma.programSessionExercise.create({
    data: {
      sessionId: data.sessionId,
      exerciseId: data.exerciseId,
      order: data.order,
      instructions: data.instructions,
      instructionsEn: data.instructionsEn,
      instructionsEs: data.instructionsEn, // Default fallback
      instructionsPt: data.instructionsEn,
      instructionsRu: data.instructionsEn,
      instructionsZhCn: data.instructionsEn,
      suggestedSets: {
        create: data.suggestedSets.map((set) => ({
          setIndex: set.setIndex,
          types: set.types,
          valuesInt: set.valuesInt || [],
          valuesSec: set.valuesSec || [],
          units: set.units || [],
        })),
      },
    },
    include: {
      exercise: true,
      suggestedSets: {
        orderBy: { setIndex: "asc" },
      },
    },
  });

  revalidatePath("/admin/programs");

  return programSessionExercise;
}

export async function getExercises(search?: string): Promise<ExerciseWithAttributes[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: middleware or layout
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
    },
    orderBy: { name: "asc" },
    take: 50,
  });

  return exercises;
}
