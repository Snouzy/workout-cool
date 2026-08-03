"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function deleteExercise(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  // Check if exercise is used in any program or workout
  const usage = await prisma.exercise.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          ProgramSessionExercise: true,
          WorkoutSessionExercise: true,
        },
      },
    },
  });

  if (!usage) {
    throw new Error("Exercise not found");
  }

  if (usage._count.ProgramSessionExercise > 0 || usage._count.WorkoutSessionExercise > 0) {
    throw new Error("Cannot delete exercise: it is being used in programs or workouts");
  }

  try {
    // Delete exercise attributes first
    await prisma.exerciseAttribute.deleteMany({
      where: { exerciseId: id },
    });

    // Delete exercise
    await prisma.exercise.delete({
      where: { id },
    });

    revalidatePath("/admin/exercises");
    return { success: true };
  } catch (error) {
    console.error("Error deleting exercise:", error);
    throw new Error("Erreur lors de la suppression de l'exercice");
  }
}