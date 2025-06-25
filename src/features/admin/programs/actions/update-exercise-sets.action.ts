"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, WorkoutSetType, WorkoutSetUnit } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface SetData {
  id?: string;
  setIndex: number;
  types: WorkoutSetType[];
  valuesInt: number[];
  valuesSec: number[];
  units: WorkoutSetUnit[];
}

export async function updateExerciseSets(exerciseId: string, sets: SetData[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  try {
    // Utiliser une transaction pour s'assurer de la cohérence
    await prisma.$transaction(async (tx) => {
      // Supprimer tous les sets existants de cet exercice
      await tx.programSuggestedSet.deleteMany({
        where: {
          programSessionExerciseId: exerciseId,
        },
      });

      // Créer les nouveaux sets
      const setsToCreate = sets.map((set) => ({
        programSessionExerciseId: exerciseId,
        setIndex: set.setIndex,
        types: set.types,
        valuesInt: set.valuesInt,
        valuesSec: set.valuesSec,
        units: set.units,
      }));

      if (setsToCreate.length > 0) {
        await tx.programSuggestedSet.createMany({
          data: setsToCreate,
        });
      }
    });

    // Revalider les caches
    revalidatePath("/admin/programs");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating exercise sets:", error);
    throw new Error("Erreur lors de la mise à jour des séries");
  }
}